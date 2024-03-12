const GRANT_NAME = `Cypress Admin E2E Test Grant ID:${Cypress.env(
  'firstUserId',
)}`;

const TASKS = {
  UPDATE_SPOTLIGHT_SUBMISSION_STATUS: 'updateSpotlightSubmissionStatus',
  ADD_SPOTLIGHT_BATCH: 'addSpotlightBatch',
  ADD_SUBMISSION_TO_MOST_RECENT_BATCH: 'addSubmissionToMostRecentBatch',
  CLEANUP_TEST_SPOTLIGHT_SUBMISSIONS: 'cleanupTestSpotlightSubmissions',
  REMOVE_ADVERT_BY_NAME: 'removeAdvertByName',
};

const SPOTLIGHT_SUBMISSION_STATUS = {
  SENT: 'SENT',
  SEND_ERROR: 'SEND_ERROR',
  GGIS_ERROR: 'GGIS_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
};

export { GRANT_NAME, TASKS, SPOTLIGHT_SUBMISSION_STATUS };
