import { runSQLFromJs } from "../database";
import {
  deleteAdmins,
  deleteAdverts,
  deleteApplicantOrgProfiles,
  deleteApplicants,
  deleteApplications,
  deleteFundingOrgs,
  deleteSchemes,
  deleteSpotlightBatchRow,
  deleteSpotlightSubmissionRow,
  deleteSubmissions,
  deleteUsers,
} from "../ts/deleteApplyData";
import {
  addSpotlightBatchRow,
  insertAdmins,
  insertAdverts,
  insertApplicants,
  insertApplications,
  insertFundingOrgs,
  insertGrantApplicantOrgProfiles,
  insertSchemes,
  insertUsers,
} from "../ts/insertApplyData";
import {
  addSubmissionToMostRecentBatch,
  readdQueuedSpotlightSubmissions,
  removeQueuedSpotlightSubmissions,
  updateSpotlightSubmissionStatus,
} from "../ts/updateApplyData";
import {
  V2_INTERNAL_SCHEME_ID,
  SPOTLIGHT_BATCH_ID,
  SPOTLIGHT_SUBMISSION_ID,
  applyDatabaseUrl,
  applyServiceDbName,
  applySubstitutions,
} from "./constants";

const createApplyData = async (): Promise<void> => {
  await runSQLFromJs(
    [
      insertApplicants,
      insertUsers,
      insertFundingOrgs,
      insertAdmins,
      insertGrantApplicantOrgProfiles,
      insertSchemes,
      insertApplications,
      insertAdverts,
    ],
    applySubstitutions,
    applyServiceDbName,
    applyDatabaseUrl,
  );
  console.log("Successfully added data to Apply database");
};

const deleteApplyData = async (): Promise<void> => {
  await runSQLFromJs(
    [
      deleteAdverts,
      deleteSubmissions,
      deleteApplications,
      deleteSchemes,
      deleteAdmins,
      deleteApplicants,
      deleteUsers,
      deleteFundingOrgs,
      deleteApplicantOrgProfiles,
    ],
    applySubstitutions,
    applyServiceDbName,
    applyDatabaseUrl,
  );
  console.log("Successfully removed data from Apply database");
};

const cleanupTestSpotlightSubmissions = async () => {
  await runSQLFromJs(
    [readdQueuedSpotlightSubmissions],
    null,
    applyServiceDbName,
    applyDatabaseUrl,
  );
};

const updateSpotlightSubmission = async (status: string) => {
  await runSQLFromJs(
    [removeQueuedSpotlightSubmissions],
    null,
    applyServiceDbName,
    applyDatabaseUrl,
  );

  const row = await runSQLFromJs(
    [updateSpotlightSubmissionStatus],
    {
      [updateSpotlightSubmissionStatus]: [
        status,
        SPOTLIGHT_SUBMISSION_ID,
        V2_INTERNAL_SCHEME_ID,
      ],
    },
    applyServiceDbName,
    applyDatabaseUrl,
  );

  return row;
};

const addToRecentBatch = async () => {
  const row = await runSQLFromJs(
    [addSubmissionToMostRecentBatch],
    {
      [addSubmissionToMostRecentBatch]: [
        SPOTLIGHT_SUBMISSION_ID,
        SPOTLIGHT_BATCH_ID,
      ],
    },
    applyServiceDbName,
    applyDatabaseUrl,
  );

  return row;
};

const deleteSpotlightBatch = async () => {
  const row = await runSQLFromJs(
    [deleteSpotlightBatchRow],
    {
      [deleteSpotlightBatchRow]: [SPOTLIGHT_BATCH_ID],
    },
    applyServiceDbName,
    applyDatabaseUrl,
  );

  return row;
};

const deleteSpotlightSubmission = async () => {
  await runSQLFromJs(
    [deleteSpotlightSubmissionRow],
    {
      [deleteSpotlightSubmissionRow]: [V2_INTERNAL_SCHEME_ID],
    },
    applyServiceDbName,
    applyDatabaseUrl,
  );
};

const addSpotlightBatch = async () => {
  const row = await runSQLFromJs(
    [addSpotlightBatchRow],
    {
      [addSpotlightBatchRow]: [SPOTLIGHT_BATCH_ID],
    },
    applyServiceDbName,
    applyDatabaseUrl,
  );

  return row;
};

export {
  createApplyData,
  deleteApplyData,
  cleanupTestSpotlightSubmissions,
  updateSpotlightSubmission,
  addToRecentBatch,
  deleteSpotlightBatch,
  deleteSpotlightSubmission,
  addSpotlightBatch,
};
