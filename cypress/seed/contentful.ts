// @ts-ignore
import * as contentful from "contentful-management";
import "dotenv/config";

const ADVERT = {
  fields: {
    grantName: {
      "en-US": "test grant advert",
    },
    grantMaximumAwardDisplay: {
      "en-US": "£10,000",
    },
    grantWebpageUrl: {
      "en-US":
        "https://sandbox-gap.service.cabinetoffice.gov.uk/apply/applicant/applications/-1",
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
      "en-US": "test-scheme-1",
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
      "en-US": "no",
    },
    grantFunder: {
      "en-US": "The Department of Business",
    },
  },
};

export const publishGrantAdverts = () => {
  console.log("publishing");
  const client = contentful.createClient({
    // This is the access token for this space. Normally you get the token in the Contentful web app
    accessToken: process.env["contentful.accessToken"],
  });
  // This API call will request a space with the specified ID
  client.getSpace(process.env["contentful.spaceId"]).then((space) => {
    // This API call will request an environment with the specified ID
    space
      .getEnvironment(process.env["contentful.environmentId"])
      .then((environment) => {
        // Now that we have an environment, we can get entries from that space
        // environment.getEntries().then((entries) => {
        //   console.log(entries.items);
        // });

        //environment.deleteEntry('');

        environment.createEntry("grantDetails", ADVERT).then((entry) => {
          console.log(entry);
          //environment.publishRelease({ releaseId: '1', version: 1 });
        });
      });
  });
};

export const deleteGrantAdverts = () => {};

publishGrantAdverts();
