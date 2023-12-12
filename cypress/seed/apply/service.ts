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
  postLoginBaseUrl,
} from "./constants";
import { getExportedSubmission } from "../ts/selectApplyData";

const runSqlForApply = async (scripts: string[], substitutions: any) =>
  await runSQLFromJs(
    scripts,
    substitutions,
    applyServiceDbName,
    applyDatabaseUrl,
  );

const createApplyData = async (): Promise<void> => {
  await runSqlForApply(
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
  );
  console.log("Successfully added data to Apply database");
};

const deleteApplyData = async (): Promise<void> => {
  await runSqlForApply(
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
  );
  console.log("Successfully removed data from Apply database");
};

const cleanupTestSpotlightSubmissions = async () => {
  await runSqlForApply([readdQueuedSpotlightSubmissions], null);
};

const updateSpotlightSubmission = async (status: string) => {
  await runSqlForApply([removeQueuedSpotlightSubmissions], null);

  const row = await runSqlForApply([updateSpotlightSubmissionStatus], {
    [updateSpotlightSubmissionStatus]: [
      status,
      SPOTLIGHT_SUBMISSION_ID,
      V2_INTERNAL_SCHEME_ID,
    ],
  });

  return row;
};

const addToRecentBatch = async () => {
  const row = await runSqlForApply([addSubmissionToMostRecentBatch], {
    [addSubmissionToMostRecentBatch]: [
      SPOTLIGHT_SUBMISSION_ID,
      SPOTLIGHT_BATCH_ID,
    ],
  });

  return row;
};

const deleteSpotlightBatch = async () => {
  const row = await runSqlForApply([deleteSpotlightBatchRow], {
    [deleteSpotlightBatchRow]: [SPOTLIGHT_BATCH_ID],
  });

  return row;
};

const deleteSpotlightSubmission = async () => {
  await runSqlForApply([deleteSpotlightSubmissionRow], {
    [deleteSpotlightSubmissionRow]: [V2_INTERNAL_SCHEME_ID],
  });
};

const addSpotlightBatch = async () => {
  const row = await runSqlForApply([addSpotlightBatchRow], {
    [addSpotlightBatchRow]: [SPOTLIGHT_BATCH_ID],
  });

  return row;
};

const getExportedSubmissionUrlAndLocation = async (schemeId: string) => {
  const row = await runSqlForApply([getExportedSubmission], applySubstitutions);
  console.log(schemeId, row[0][0]);
  return {
    url: `${postLoginBaseUrl}/apply/admin/scheme/${schemeId}/${row[0][0].export_batch_id}`,
    location: row[0][0].location.split("/")[1],
  };
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
  getExportedSubmissionUrlAndLocation,
};
