import * as contentful from 'contentful-management';
import 'dotenv/config';
import {
  TEST_V1_INTERNAL_GRANT,
  TEST_V1_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
  TEST_V2_EXTERNAL_GRANT,
} from '../common/constants';
import { retry } from './helper';
import {
  SQSClient,
  SendMessageBatchCommand,
  SendMessageCommand,
  type SendMessageBatchCommandInput,
  type SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import { randomUUID } from 'crypto';
import { getAdvertIdFromName } from './apply/service';

type Entries = Awaited<ReturnType<typeof getContentfulEntries>>;

const ADVERTS = [
  TEST_V1_INTERNAL_GRANT,
  TEST_V1_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
  TEST_V2_EXTERNAL_GRANT,
];

const createAndPublish = async (advertIds: string[]) => {
  const sqsClient = new SQSClient({ region: 'eu-west-2' });

  const params: SendMessageBatchCommandInput = {
    QueueUrl: process.env.PUBLISH_UNPUBLISH_AD_SCHEDULED_QUEUE,
    Entries: advertIds.map((advertId) => {
      const id = randomUUID();
      return {
        Id: id,
        MessageBody: id,
        MessageGroupId: id,
        MessageDeduplicationId: id,
        MessageAttributes: {
          action: {
            DataType: 'String',
            StringValue: 'PUBLISH',
          },
          grantAdvertId: {
            DataType: 'String',
            StringValue: advertId,
          },
        },
      };
    }),
  };

  await sqsClient.send(new SendMessageBatchCommand(params));
};

const unpublishAdvert = async (advertId: string) => {
  const sqsClient = new SQSClient({ region: 'eu-west-2' });
  const id = randomUUID();

  const params: SendMessageCommandInput = {
    QueueUrl: process.env.PUBLISH_UNPUBLISH_AD_SCHEDULED_QUEUE,
    MessageBody: id,
    MessageGroupId: id,
    MessageDeduplicationId: id,
    MessageAttributes: {
      action: {
        DataType: 'String',
        StringValue: 'UNPUBLISH',
      },
      grantAdvertId: {
        DataType: 'String',
        StringValue: advertId as unknown as string,
      },
    },
  };

  await sqsClient.send(new SendMessageCommand(params));
};

export const unpublishAdvertByName = async (advertName: string) => {
  const advertId = await getAdvertIdFromName(advertName);

  await unpublishAdvert(advertId);

  const environment = await setupContentful();
  await retry(
    async () => await getContentfulEntries(environment, advertName),
    (res) => areAllAdvertsDraft(res, 1),
    20,
    5000,
  );
};

const unpublishAndDelete = async (entries: Entries) => {
  let deletionExecuted = false;
  for (const entry of entries.items) {
    if (entry.isPublished()) {
      await entry.unpublish();
      console.log(
        `Unpublished grant advert entry ${entry.sys.id} - ${entry.fields?.grantName?.['en-US']}`,
      );
    } else {
      console.log(
        `Grant advert not published, skipping ${entry.sys.id} - ${entry.fields?.grantName?.['en-US']}`,
      );
    }

    await entry.delete();
    await deleteFromOpenSearch(entry.sys.id);

    console.log(
      `Deleted grant advert entry ${entry.sys.id} - ${entry.fields?.grantName?.['en-US']}`,
    );
    deletionExecuted = true;
  }

  return deletionExecuted;
};

const deleteFromOpenSearch = async (entryId: string) => {
  const response = await fetch(
    `${process.env.OPEN_SEARCH_URL}/${process.env.OPEN_SEARCH_DOMAIN}/_doc/${entryId}`,
    {
      method: 'DELETE',
      headers: new Headers({
        Authorization:
          'Basic ' +
          btoa(
            `${process.env.OPEN_SEARCH_USERNAME}:${process.env.OPEN_SEARCH_PASSWORD}`,
          ),
      }),
    },
  );
  console.log(
    `Deleted elastic search entry ${entryId} with status ${response.status}`,
  );
};

const setupContentful = async () => {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  return await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID);
};

const getContentfulEntries = async (
  environment: contentful.Environment,
  grantName?: string,
) =>
  await environment.getEntries({
    content_type: 'grantDetails',
    'fields.grantName[in]':
      grantName || ADVERTS.map((advert) => advert.advertName).join(','),
  });

const areAllAdvertsPublished = (entries: Entries, expectedLength: number) =>
  entries.total === expectedLength &&
  entries.items.every((entry) => entry.isPublished());

const areAllAdvertsDraft = (entries: Entries, expectedLength: number) =>
  entries.total === expectedLength &&
  entries.items.every((entry) => entry.isDraft());

export const publishGrantAdverts = async () => {
  console.log('Connecting to Contentful to manage grant adverts');
  const environment = await setupContentful();

  console.log('Getting all adverts from Contentful');
  const entries = await getContentfulEntries(environment);

  console.log('Initiating deletion of grant advert entries');
  const deletionExecuted = await unpublishAndDelete(entries);

  if (!deletionExecuted) console.log('No grant adverts to be deleted');

  console.log('Initiating publication of grant advert');
  await createAndPublish(ADVERTS.map((advert) => advert.advertId));

  console.log('Validating that adverts are published before continuing');
  await retry(
    async () => await getContentfulEntries(environment),
    (res) => areAllAdvertsPublished(res, ADVERTS.length),
    20,
    5000,
  );
};

export const removeAdvertByName = async (advertName: string) => {
  const environment = await setupContentful();
  const entries = await getContentfulEntries(environment, advertName);
  await unpublishAndDelete(entries);
};

export const waitForAdvertToPublish = async (advertName: string) => {
  const environment = await setupContentful();
  await retry(
    async () => await getContentfulEntries(environment, advertName),
    (res) => areAllAdvertsPublished(res, 1),
    100,
    1000,
  );
};
