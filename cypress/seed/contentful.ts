import * as contentful from 'contentful-management';
import 'dotenv/config';
import {
  ADMIN_TEST_GRANT_NAME,
  TEST_V1_EXTERNAL_GRANT,
  TEST_V1_INTERNAL_GRANT,
  TEST_V2_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
} from '../common/constants';
import { retry } from './helper';
import {
  SQSClient,
  SendMessageCommand,
  type SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import { getUUID } from './apply/helper';

const ADVERTS = [
  TEST_V1_INTERNAL_GRANT,
  TEST_V1_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
  TEST_V2_EXTERNAL_GRANT,
];
const SLUGS = [
  ...ADVERTS.map((advert) => advert.advertName),
  ADMIN_TEST_GRANT_NAME,
];

const advertIsPartOfSetup = (entry: contentful.Entry, advertName?: string) => {
  const contentfulAdvertName = entry.fields?.grantName?.['en-US'];
  if (advertName) return contentfulAdvertName === advertName;
  return SLUGS.includes(contentfulAdvertName);
};

const unpublishAndDelete = async (advertId: string) => {
  const sqsClient = new SQSClient({ region: 'eu-west-2' });

  const params: SendMessageCommandInput = {
    MessageBody: getUUID(),
    MessageGroupId: getUUID(),
    MessageDeduplicationId: getUUID(),
    MessageAttributes: {
      action: {
        DataType: 'String',
        StringValue: 'UNPUBLISH',
      },
      grantAdvertId: {
        DataType: 'String',
        StringValue: advertId,
      },
    },
    QueueUrl: process.env.PUBLISH_UNPUBLISH_AD_SCHEDULED_QUEUE,
  };

  await sqsClient.send(new SendMessageCommand(params));
};

const createAndPublish = async (advertId: string) => {
  const sqsClient = new SQSClient({ region: 'eu-west-2' });

  const params: SendMessageCommandInput = {
    MessageBody: getUUID(),
    MessageGroupId: getUUID(),
    MessageDeduplicationId: getUUID(),
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
    QueueUrl: process.env.PUBLISH_UNPUBLISH_AD_SCHEDULED_QUEUE,
  };

  await sqsClient.send(new SendMessageCommand(params));
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

const isRequiredAndDraft = (entry: contentful.Entry) =>
  advertIsPartOfSetup(entry) && entry.isDraft();

const areAllAdvertsDraft = (entries: { items: any[] }) => {
  const publishedAdverts = entries.items.filter(isRequiredAndDraft);
  return publishedAdverts.length === ADVERTS.length;
};

export const publishGrantAdverts = async () => {
  console.log('Connecting to Contentful to manage grant adverts');
  const environment = await setupContentful();

  console.log('Initiating deletion of grant advert entries');
  await Promise.all(
    ADVERTS.map(async (advert) => await unpublishAndDelete(advert.advertId)),
  );

  await retry(
    async () => await getContentfulEntries(environment),
    areAllAdvertsDraft,
    10,
    1000,
  );

  console.log('Initiating publication of grant advert');
  await Promise.all(
    ADVERTS.map(async (advert) => await createAndPublish(advert.advertId)),
  );

  await retry(
    async () => await getContentfulEntries(environment),
    areAllAdvertsPublished,
    10,
    1000,
  );
};
