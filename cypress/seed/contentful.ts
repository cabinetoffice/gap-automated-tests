// @ts-ignore
import * as contentful from "contentful-management";
import "dotenv/config";

const ADVERT = {
  sys: {
    id: "cypress_test_contentful_id",
  },
  fields: {
    grantName: {
      "en-US": "Cypress - Automated E2E Test Grant",
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
      "en-US": "cypress_test_advert_contentful_slug",
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

export const publishGrantAdverts = async () => {
  console.log("Connecting to Contentful to manage grant adverts");
  const client = contentful.createClient({
    // This is the access token for this space. Normally you get the token in the Contentful web app
    accessToken: process.env["contentful.accessToken"],
  });
  // This API call will request a space with the specified ID
  await client
    .getSpace(process.env["contentful.spaceId"])
    .then(async (space) => {
      // This API call will request an environment with the specified ID
      await space
        .getEnvironment(process.env["contentful.environmentId"])
        .then(async (environment) => {
          await environment
            .getEntries({ limit: 1000 })
            .then(async (entries) => {
              let deletionExecuted = false;
              console.log("Initiating deletion of grant advert entries");
              for (const entry of entries.items) {
                if (
                  entry.fields?.label?.["en-US"] ===
                  "cypress_test_advert_contentful_slug"
                ) {
                  if (entry.isPublished())
                    await entry
                      .unpublish()
                      .then(() =>
                        console.log(
                          "Successfully unpublished grant advert entry",
                          entry.sys.id,
                        ),
                      );
                  else
                    console.log(
                      "Grant advert not published, skipping",
                      entry.sys.id,
                    );

                  await entry.delete().then(() => {
                    console.log(
                      "Successfully deleted grant advert entry",
                      entry.sys.id,
                    );
                    deletionExecuted = true;
                  });
                }
              }
              if (!deletionExecuted)
                console.log("No grant adverts to be deleted");

              console.log("Initiating publication of grant advert");
              await environment
                .createEntry("grantDetails", ADVERT)
                .then(async (entry) => {
                  console.log(
                    "Successfully created grant advert entry",
                    entry.sys.id,
                  );
                  await entry
                    .publish()
                    .then(() =>
                      console.log(
                        "Successfully published grant advert entry",
                        entry.sys.id,
                      ),
                    );
                });
            });
        });
    });
};

export const deleteGrantAdverts = async () => {
  // console.log('Initiating deletion of existing grants advert');
  // const client = contentful.createClient({
  //   accessToken: process.env["contentful.accessToken"],
  // });
  // await client.getSpace(process.env["contentful.spaceId"]).then(async space => {
  //   await space
  //     .getEnvironment(process.env["contentful.environmentId"])
  //     .then(async environment => {
  //       await environment.getEntries({ limit: 1000 }).then(async entries => {
  //         let deletionSuccess = false;
  //         for (const entry of entries.items) {
  //           if (entry.fields?.label?.["en-US"] === 'cypress_test_advert_contentful_slug') {
  //             console.log(entry);
  //             if (entry.isPublished()) {
  //               await entry.unpublish().then(() => {
  //                 console.log('Successfully unpublished grant advert entry');
  //               });
  //             } else {
  //               console.log('Grant advert not published, skipping');
  //             }
  //             await entry.delete().then(() => {
  //               console.log('Successfully deleted grant advert entry');
  //               deletionSuccess = true;
  //             });
  //           }
  //         }
  //         if (!deletionSuccess) console.log('No grant adverts to be deleted');
  //       });
  //     });
  // });
};
