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
  type SendMessageBatchCommandInput,
} from '@aws-sdk/client-sqs';

const ADVERTS = [
  TEST_V1_INTERNAL_GRANT,
  TEST_V1_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
  TEST_V2_EXTERNAL_GRANT,
];

const SLUGS = ADVERTS.map((advert) => advert.advertName);

const sqsClient = new SQSClient({ region: 'eu-west-2' });

const createAndPublish = async (advertIds: string[]) => {
  const params: SendMessageBatchCommandInput = {
    QueueUrl: process.env.PUBLISH_UNPUBLISH_AD_SCHEDULED_QUEUE,
    Entries: advertIds.map((advertId, index) => {
      const id = crypto.randomUUID();
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

  console.log('Sending message to SQS: ', params.Entries[0].MessageAttributes);

  await sqsClient.send(new SendMessageBatchCommand(params));
};

const advertIsPartOfSetup = (entry: contentful.Entry, advertName?: string) => {
  const contentfulAdvertName = entry.fields?.grantName?.['en-US'];
  if (advertName) return contentfulAdvertName === advertName;
  return SLUGS.includes(contentfulAdvertName);
};

const unpublishAndDelete = async (
  entries: contentful.Collection<
    contentful.Entry,
    contentful.EntryProps<contentful.KeyValueMap>
  >,
  advertName?: string,
) => {
  let deletionExecuted = false;
  for (const entry of entries.items) {
    if (advertIsPartOfSetup(entry, advertName)) {
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
      await fetch(
        `${process.env.OPEN_SEARCH_URL}/${process.env.OPEN_SEARCH_DOMAIN}/_doc/${entry.sys.id}`,
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
        `Deleted grant advert entry ${entry.sys.id} - ${entry.fields?.grantName?.['en-US']}`,
      );
      deletionExecuted = true;
    }
  }
  return deletionExecuted;
};

const setupContentful = async () => {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  return await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID);
};

const getContentfulEntries = async (environment: contentful.Environment) => {
  const entries = await environment.getEntries({ limit: 1000 });
  return entries;
};

const isRequiredAndPublished = (entry: contentful.Entry) =>
  advertIsPartOfSetup(entry) && entry.isPublished();

const areAllAdvertsPublished = (entries: { items: any[] }) => {
  const publishedAdverts = entries.items.filter(isRequiredAndPublished);
  return publishedAdverts.length === ADVERTS.length;
};

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
    areAllAdvertsPublished,
    60,
    1000,
  );
};

export const removeAdvertByName = async (advertName: string) => {
  const environment = await setupContentful();
  const entries = await getContentfulEntries(environment);
  await unpublishAndDelete(entries, advertName);
};
