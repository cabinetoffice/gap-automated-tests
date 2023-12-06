const GRANT_NAME = `Cypress Admin E2E Test Grant ID:${Cypress.env(
  "firstUserId",
)}`;

const MQ_DETAILS = {
  name: "MyOrg",
  address: ["addressLine1", "addressLine2", "city", "county", "postcod"],
  orgType: "Limited company",
  companiesHouse: "12345",
  charitiesCommission: "67890",
  howMuchFunding: "100",
  fundingLocation: [
    "North East (England)",
    "North West (England)",
    "Yorkshire and the Humber",
    "East Midlands (England)",
    "West Midlands (England)",
    "London",
    "South East (England)",
    "South West (England)",
    "Scotland",
    "Wales",
    "Northern Ireland",
    "Outside of the UK",
  ],
};

const TASKS = {
  UPDATE_SPOTLIGHT_SUBMISSION_STATUS: "updateSpotlightSubmissionStatus",
  ADD_SPOTLIGHT_BATCH: "addSpotlightBatch",
  ADD_SUBMISSION_TO_MOST_RECENT_BATCH: "addSubmissionToMostRecentBatch",
  CLEANUP_TEST_SPOTLIGHT_SUBMISSIONS: "cleanupTestSpotlightSubmissions",
};

const SPOTLIGHT_SUBMISSION_STATUS = {
  SENT: "SENT",
  SEND_ERROR: "SEND_ERROR",
  GGIS_ERROR: "GGIS_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
};

export { GRANT_NAME, MQ_DETAILS, TASKS, SPOTLIGHT_SUBMISSION_STATUS };
