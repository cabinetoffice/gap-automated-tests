import * as contentful from "contentful-management";
import "dotenv/config";
import {
  TEST_V1_INTERNAL_GRANT,
  TEST_V1_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
  TEST_V2_EXTERNAL_GRANT,
  ADMIN_TEST_GRANT_NAME,
} from "../common/constants";

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

const shouldUnpublishAdvert = (entry, advertName?) => {
  const contentfulAdvertName = entry.fields?.grantName?.["en-US"];
  if (advertName) return contentfulAdvertName === advertName;

  return SLUGS.includes(contentfulAdvertName);
};

const unpublishAndDelete = async (entries, advertName?) => {
  let deletionExecuted = false;
  for (const entry of entries.items) {
    if (shouldUnpublishAdvert(entry, advertName)) {
      if (entry.isPublished())
        await entry.unpublish().then(() => {
          console.log(
            `Successfully unpublished grant advert entry ${entry.sys.id}`,
          );
        });
      else console.log(`Grant advert not published, skipping ${entry.sys.id}`);

      await entry.delete().then(() => {
        console.log(`Successfully deleted grant advert entry ${entry.sys.id}`);
        deletionExecuted = true;
      });
    }
  }
  return deletionExecuted;
};

const createAndPublish = (environment, advert) => {
  environment.createEntry("grantDetails", advert).then(async (entry) => {
    console.log(`Successfully created grant advert entry ${entry.sys.id}`);
    await entry.publish().then(() => {
      console.log(`Successfully published grant advert entry ${entry.sys.id}`);
    });
  });
};

const getContentfulEntries = async () => {
  console.log("Connecting to Contentful to manage grant adverts");
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  });

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);

  const environment = await space.getEnvironment(
    process.env.CONTENTFUL_ENVIRONMENT_ID,
  );

  const entries = await environment.getEntries({ limit: 1000 });

  return { environment, entries };
};

export const publishGrantAdverts = async () => {
  const { entries, environment } = await getContentfulEntries();

  console.log("Initiating deletion of grant advert entries");
  const deletionExecuted = await unpublishAndDelete(entries);

  if (!deletionExecuted) console.log("No grant adverts to be deleted");

  console.log("Initiating publication of grant advert");
  await Promise.all(
    ADVERTS.map((advert) => createAndPublish(environment, advert)),
  );
};

export const removeAdvertByName = async (advertName: string) => {
  const { entries } = await getContentfulEntries();

  await unpublishAndDelete(entries, advertName);
};
