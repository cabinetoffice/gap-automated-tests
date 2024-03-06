import * as contentful from "contentful-management";
import "dotenv/config";
import {
  TEST_V1_INTERNAL_GRANT,
  TEST_V1_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
  TEST_V2_EXTERNAL_GRANT,
  ADMIN_TEST_GRANT_NAME,
} from "../common/constants";
import { retry } from "./helper";

const ADVERTS = [
  {
    fields: {
      grantName: {
        "en-US": TEST_V1_INTERNAL_GRANT.advertName,
      },
      grantMaximumAwardDisplay: {
        "en-US": "£10,000",
      },
      grantWebpageUrl: {
        "en-US": TEST_V1_INTERNAL_GRANT.applicationUrl,
      },
      grantMinimumAwardDisplay: {
        "en-US": "£1",
      },
      grantSummaryTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantDatesTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantLocation: {
        "en-US": ["National"],
      },
      grantApplicantType: {
        "en-US": ["Personal / Individual"],
      },
      label: {
        "en-US": TEST_V1_INTERNAL_GRANT.contentfulSlug,
      },
      grantMaximumAward: {
        "en-US": 10000,
      },
      grantTotalAwardAmount: {
        "en-US": 1000000,
      },
      grantApplicationCloseDate: {
        "en-US": "2040-10-24T23:59",
      },
      grantObjectivesTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantSupportingInfoTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantMinimumAward: {
        "en-US": 1,
      },
      grantApplyTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantApplicationOpenDate: {
        "en-US": "2023-08-24T00:01",
      },
      grantEligibilityTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantTotalAwardDisplay: {
        "en-US": "£1 million",
      },
      grantShortDescription: {
        "en-US": "This is a short description",
      },
      grantFunder: {
        "en-US": "The Department of Business",
      },
    },
  },
  {
    fields: {
      grantName: {
        "en-US": TEST_V1_EXTERNAL_GRANT.advertName,
      },
      grantMaximumAwardDisplay: {
        "en-US": "£10,000",
      },
      grantWebpageUrl: {
        "en-US": TEST_V1_EXTERNAL_GRANT.applicationUrl,
      },
      grantMinimumAwardDisplay: {
        "en-US": "£1",
      },
      grantSummaryTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantDatesTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantLocation: {
        "en-US": ["National"],
      },
      grantApplicantType: {
        "en-US": ["Personal / Individual"],
      },
      label: {
        "en-US": TEST_V1_EXTERNAL_GRANT.contentfulSlug,
      },
      grantMaximumAward: {
        "en-US": 10000,
      },
      grantTotalAwardAmount: {
        "en-US": 1000000,
      },
      grantApplicationCloseDate: {
        "en-US": "2040-10-24T23:59",
      },
      grantObjectivesTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantSupportingInfoTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantMinimumAward: {
        "en-US": 1,
      },
      grantApplyTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantApplicationOpenDate: {
        "en-US": "2023-08-24T00:01",
      },
      grantEligibilityTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantTotalAwardDisplay: {
        "en-US": "£1 million",
      },
      grantShortDescription: {
        "en-US": "This is a short description",
      },
      grantFunder: {
        "en-US": "The Department of Business",
      },
    },
  },
  {
    fields: {
      grantName: {
        "en-US": TEST_V2_INTERNAL_GRANT.advertName,
      },
      grantMaximumAwardDisplay: {
        "en-US": "£500,000",
      },
      grantWebpageUrl: {
        "en-US": TEST_V2_INTERNAL_GRANT.applicationUrl,
      },
      grantMinimumAwardDisplay: {
        "en-US": "£1",
      },
      grantSummaryTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantDatesTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantLocation: {
        "en-US": ["National"],
      },
      grantApplicantType: {
        "en-US": ["Personal / Individual"],
      },
      label: {
        "en-US": TEST_V2_INTERNAL_GRANT.contentfulSlug,
      },
      grantMaximumAward: {
        "en-US": 500000,
      },
      grantTotalAwardAmount: {
        "en-US": 1000000,
      },
      grantApplicationCloseDate: {
        "en-US": "2035-10-24T23:59",
      },
      grantObjectivesTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantSupportingInfoTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantMinimumAward: {
        "en-US": 1,
      },
      grantApplyTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantApplicationOpenDate: {
        "en-US": "2013-08-24T00:01",
      },
      grantEligibilityTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantTotalAwardDisplay: {
        "en-US": "£1 million",
      },
      grantShortDescription: {
        "en-US": "no",
      },
      grantFunder: {
        "en-US": "The Department of Business",
      },
    },
  },
  {
    fields: {
      grantName: {
        "en-US": TEST_V2_EXTERNAL_GRANT.advertName,
      },
      grantMaximumAwardDisplay: {
        "en-US": "£2",
      },
      grantWebpageUrl: {
        "en-US": TEST_V2_EXTERNAL_GRANT.applicationUrl,
      },
      grantMinimumAwardDisplay: {
        "en-US": "£1",
      },
      grantSummaryTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantDatesTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantLocation: {
        "en-US": ["National"],
      },
      grantApplicantType: {
        "en-US": ["Personal / Individual"],
      },
      label: {
        "en-US": TEST_V2_EXTERNAL_GRANT.contentfulSlug,
      },
      grantMaximumAward: {
        "en-US": 10000,
      },
      grantTotalAwardAmount: {
        "en-US": 100000,
      },
      grantApplicationCloseDate: {
        "en-US": "2050-10-24T23:59",
      },
      grantObjectivesTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantSupportingInfoTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantMinimumAward: {
        "en-US": 1,
      },
      grantApplyTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantApplicationOpenDate: {
        "en-US": "2023-08-24T00:01",
      },
      grantEligibilityTab: {
        "en-US": {
          nodeType: "document",
          content: [],
          data: {},
        },
      },
      grantTotalAwardDisplay: {
        "en-US": "£1 million",
      },
      grantShortDescription: {
        "en-US": "no",
      },
      grantFunder: {
        "en-US": "The Department of Business",
      },
    },
  },
];
const SLUGS = [
  ...ADVERTS.map((advert) => advert.fields.grantName["en-US"]),
  ADMIN_TEST_GRANT_NAME,
];

const advertIsPartOfSetup = (entry: contentful.Entry, advertName?: string) => {
  const contentfulAdvertName = entry.fields?.grantName?.["en-US"];
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
      if (entry.isPublished())
        await entry.unpublish().then(() => {
          console.log(
            `Unpublished grant advert entry ${entry.sys.id} - ${entry.fields?.grantName?.["en-US"]}`,
          );
        });
      else
        console.log(
          `Grant advert not published, skipping ${entry.sys.id} - ${entry.fields?.grantName?.["en-US"]}`,
        );

      await entry.delete().then(() => {
        console.log(
          `    Deleted grant advert entry ${entry.sys.id} - ${entry.fields?.grantName?.["en-US"]}`,
        );
        deletionExecuted = true;
      });
    }
  }
  return deletionExecuted;
};

const createAndPublish = async (
  environment: contentful.Environment,
  advert: contentful.Entry,
) => {
  let entry = await environment.createEntry("grantDetails", advert);
  console.log(
    `Created grant advert entry ${entry.sys.id} - ${entry.fields?.grantName?.["en-US"]}`,
  );

  entry = await entry.publish();
  console.log(
    `Published grant advert entry ${entry.sys.id} - ${entry.fields?.grantName?.["en-US"]}`,
  );

  let counter = 0;
  entry = await environment.getEntry(entry.sys.id);
  while (entry.sys.publishedVersion === 0) {
    // Retrying due to a bug in contentful

    entry = await entry.unpublish();
    console.log(
      `Attempt ${counter + 1}: Unpublished grant advert entry ${
        entry.sys.id
      } - ${entry.fields?.grantName?.["en-US"]}`,
    );

    cy.wait(1000);

    entry = await entry.publish();
    console.log(
      `Attempt ${counter + 1}: Published grant advert entry ${
        entry.sys.id
      } - ${entry.fields?.grantName?.["en-US"]}`,
    );

    entry = await environment.getEntry(entry.sys.id);
    if (counter++ > 5) break;
  }
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
  console.log("Connecting to Contentful to manage grant adverts");
  const environment = await setupContentful();

  console.log("Getting all adverts from Contentful");
  const entries = await getContentfulEntries(environment);

  console.log("Initiating deletion of grant advert entries");
  const deletionExecuted = await unpublishAndDelete(entries);

  if (!deletionExecuted) console.log("No grant adverts to be deleted");

  console.log("Initiating publication of grant advert");
  await Promise.all(
    ADVERTS.map(async (advert) => await createAndPublish(environment, advert)),
  );

  console.log("Validating that adverts are published before continuing");
  await retry(
    async () => await getContentfulEntries(environment),
    areAllAdvertsPublished,
    10,
    1000,
  );
};

export const removeAdvertByName = async (advertName: string) => {
  const environment = await setupContentful();
  const entries = await getContentfulEntries(environment);
  await unpublishAndDelete(entries, advertName);
};
