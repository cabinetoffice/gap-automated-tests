import { runSQLFromJs } from "../database";
import { type UsagePlanKey } from "@aws-sdk/client-api-gateway";
import {
  deleteAdmins,
  deleteAdverts,
  deleteApiKeys,
  deleteApiKeysFundingOrganisations,
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
  addSubmissionToMostRecentBatch,
  insertMandatoryQuestions,
  insertSpotlightSubmission,
  insertSubmissions,
  createApiKeysFundingOrganisations,
  createApiKey,
  updateApiKeysFundingOrganisations,
} from "../ts/insertApplyData";
import {
  readdQueuedSpotlightSubmissions,
  removeQueuedSpotlightSubmissions,
  updateSpotlightSubmissionStatus,
} from "../ts/updateApplyData";
import {
  V2_INTERNAL_SCHEME_ID,
  applyDatabaseUrl,
  applyServiceDbName,
  spotlightSubstitutions,
  applyInsertSubstitutions,
  applyDeleteSubstitutions,
  applyUpdateSubstitutions,
  V2_INTERNAL_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
  V2_INTERNAL_NON_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
  postLoginBaseUrl,
  SUPER_ADMIN_ID,
  deleteApiKeysSubstitutions,
  createApiKeySubstitutions,
} from "./constants";
import { getExportedSubmission } from "../ts/selectApplyData";
import {
  createKeyInAwsApiGatewayUsagePlan,
  getKeysFromAwsApiGatewayUsagePlan,
  removeKeysFromAwsApiGatewayUsagePlan,
} from "../apiGateway";

const runSqlForApply = async (
  scripts: string[],
  substitutions: Record<string, any[]>,
) =>
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
    applyInsertSubstitutions,
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
    applyDeleteSubstitutions,
  );
  console.log("Successfully removed data from Apply database");
};

const createApiKeysData = async (): Promise<void> => {
  await runSqlForApply(
    [createApiKeysFundingOrganisations, updateApiKeysFundingOrganisations],
    {
      createApiKeysSubstitutions: [SUPER_ADMIN_ID + 1],
      updateApiKeysFundingOrganisations: [SUPER_ADMIN_ID],
    },
  );

  await createApiKeysInApiGatewayUsagePlan(SUPER_ADMIN_ID, 1, 45);
  await createApiKeysInApiGatewayUsagePlan(SUPER_ADMIN_ID + 1, 46, 110);

  const apiKeys = (await getKeysFromAwsApiGatewayUsagePlan()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  await createApiKeysForFundingOrganisation(apiKeys);

  console.log("Successfully added data to Apply database");
};

const deleteApiKeysData = async (): Promise<void> => {
  await runSqlForApply(
    [deleteApiKeys, deleteApiKeysFundingOrganisations],
    deleteApiKeysSubstitutions, // the $1, etc in the sql script
  );

  console.log("Successfully removed Keys from Apply database");

  await removeKeysFromAwsApiGatewayUsagePlan();
  console.log("Successfully removed Keys Aws Api Gateway");
};

const cleanupTestSpotlightSubmissions = async () => {
  await runSqlForApply([readdQueuedSpotlightSubmissions], null);
};

const updateSpotlightSubmission = async (status: string) => {
  await runSqlForApply([removeQueuedSpotlightSubmissions], null);

  const row = await runSqlForApply([updateSpotlightSubmissionStatus], {
    [updateSpotlightSubmissionStatus]: [
      status,
      V2_INTERNAL_SCHEME_ID,
      V2_INTERNAL_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
      V2_INTERNAL_NON_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
    ],
  });

  return row;
};

const addToRecentBatch = async () => {
  const row = await runSqlForApply(
    [addSubmissionToMostRecentBatch],
    spotlightSubstitutions,
  );

  return row;
};

const deleteSpotlightBatch = async () => {
  const row = await runSqlForApply(
    [deleteSpotlightBatchRow],
    spotlightSubstitutions,
  );

  return row;
};

const deleteSpotlightSubmission = async () => {
  await runSqlForApply([deleteSpotlightSubmissionRow], spotlightSubstitutions);
};

const addSpotlightBatch = async () => {
  const row = await runSqlForApply(
    [addSpotlightBatchRow],
    spotlightSubstitutions,
  );

  return row;
};

const insertSubmissionsAndMQs = async () => {
  await runSqlForApply(
    [insertSubmissions, insertMandatoryQuestions, insertSpotlightSubmission],
    applyUpdateSubstitutions,
  );
};

const getExportedSubmissionUrlAndLocation = async (schemeId: string) => {
  const row = await runSqlForApply(
    [getExportedSubmission],
    applyInsertSubstitutions,
  );
  console.log(schemeId, row[0][0]);
  return {
    url: `${postLoginBaseUrl}/apply/admin/scheme/${schemeId}/${row[0][0].export_batch_id}`,
    location: row[0][0].location.split("/")[1],
  };
};

const createApiKeysForFundingOrganisation = async (apiKeys: UsagePlanKey[]) => {
  for (let i = 0; i < apiKeys.length; i++) {
    const { id, name } = apiKeys[i];
    await runSqlForApply(
      [createApiKey],
      createApiKeySubstitutions(i, id, name),
    );
  }
};

const createApiKeysInApiGatewayUsagePlan = async (
  fundingOrganisation: number,
  startingPoint: number,
  endingPoint: number,
) => {
  for (let i = startingPoint; i < endingPoint; i++) {
    const paddedNumber = (i + 1).toString().padStart(3, "0");
    const orgName = fundingOrganisation === SUPER_ADMIN_ID ? "Org1" : "Org2";
    const keyName = `${orgName}Cypress${paddedNumber}`;
    await createKeyInAwsApiGatewayUsagePlan(keyName);
  }
};
export {
  createApplyData,
  deleteApplyData,
  insertSubmissionsAndMQs,
  cleanupTestSpotlightSubmissions,
  updateSpotlightSubmission,
  addToRecentBatch,
  deleteSpotlightBatch,
  deleteSpotlightSubmission,
  addSpotlightBatch,
  getExportedSubmissionUrlAndLocation,
  deleteApiKeysData,
  createApiKeysData,
};
