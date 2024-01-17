import { runSQLFromJs } from "../database";
import { type UsagePlanKey } from "@aws-sdk/client-api-gateway";
import {
  deleteAdmins,
  deleteAdverts,
  deleteApiKeyById,
  deleteApiKeysByFunderId,
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
  createApiKeyFundingOrganisationSubstitutions,
  createApiKeySubstitutionsForRecreation,
} from "./constants";
import { getExportedSubmission, selectAllApiKeys } from "../ts/selectApplyData";
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
    [createApiKeysFundingOrganisations],
    createApiKeyFundingOrganisationSubstitutions,
  );
  console.log("Successfully created and updated fundingOrganisation");

  console.log("Creating Keys in usage plan for SUPER_ADMIN_ID - 1");
  await createApiKeysInApiGatewayUsagePlan(SUPER_ADMIN_ID - 1, 1, 46);
  console.log("Successfully created Keys in usage plan for SUPER_ADMIN_ID - 1");

  console.log("Creating Keys in usage plan for SUPER_ADMIN_ID - 2");
  await createApiKeysInApiGatewayUsagePlan(SUPER_ADMIN_ID - 2, 46, 111);
  console.log("Successfully created Keys in usage plan for SUPER_ADMIN_ID - 2");

  const apiKeys = (await getKeysFromAwsApiGatewayUsagePlan()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  console.log(
    `Successfully retrieved ${apiKeys.length}  Keys from Aws Api Gateway`,
  );

  await createApiKeysInDatabase(apiKeys);

  console.log("Successfully added data to Apply database");
};

const deleteApiKeysData = async (): Promise<void> => {
  await runSqlForApply(
    [deleteApiKeysByFunderId, deleteApiKeysFundingOrganisations],
    deleteApiKeysSubstitutions, // the $1, etc in the sql script
  );

  console.log(
    "Successfully removed Keys from Apply database and the funding Organisation associated with it",
  );

  await removeKeysFromAwsApiGatewayUsagePlan();
  console.log("Successfully removed Keys Aws Api Gateway");
};

const grabAllApiKeys = async () => {
  const rows = await runSqlForApply([selectAllApiKeys], null);
  console.log("Successfully selected all Api Keys");
  console.log(rows[0]);
  return rows;
};

const deleteExistingApiKeys = async (originalData: ApiKeyDb[]) => {
  const apiKeyIds = originalData.map((data) => data.api_key_id);

  await Promise.all(
    apiKeyIds.map(async (apiKeyId) => {
      await runSqlForApply([deleteApiKeyById], {
        [deleteApiKeyById]: [apiKeyId],
      });
    }),
  );

  console.log("Successfully deleted all existing Api Keys");
};

const refillDbWithAllPreExistingApiKeys = async (originalData: ApiKeyDb[]) => {
  await recreateApiKeysInDatabase(originalData);
  console.log("Successfully recreated all Api Keys");
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

const createApiKeysInDatabase = async (apiKeys: UsagePlanKey[]) => {
  for (let i = 0; i < apiKeys.length; i++) {
    const { id, name } = apiKeys[i];
    await runSqlForApply(
      [createApiKey],
      createApiKeySubstitutions(i, id, name),
    );
  }
};

const recreateApiKeysInDatabase = async (apiKeys: ApiKeyDb[]) => {
  for (let i = 0; i < apiKeys.length; i++) {
    await runSqlForApply(
      [createApiKey],
      createApiKeySubstitutionsForRecreation(apiKeys[i]),
    );
  }
};

const createApiKeysInApiGatewayUsagePlan = async (
  fundingOrganisation: number,
  startingPoint: number,
  endingPoint: number,
) => {
  for (let i = startingPoint; i < endingPoint; i++) {
    const paddedNumber = i.toString().padStart(3, "0");
    const orgName =
      fundingOrganisation === SUPER_ADMIN_ID - 1 ? "Org1" : "Org2";
    const keyName = `${orgName}Cypress${paddedNumber}`;
    await createKeyInAwsApiGatewayUsagePlan(keyName);
  }
};

interface ApiKeyDb {
  api_key_id: number;
  funder_id: number;
  api_key_value: string;
  api_key_name: string;
  api_key_description: string;
  created_date: string;
  is_revoked: boolean;
  revocation_date: string;
  revoked_by: number;
  api_gateway_id: string;
}
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
  grabAllApiKeys,
  type ApiKeyDb,
  deleteExistingApiKeys,
  recreateApiKeysInDatabase,
  refillDbWithAllPreExistingApiKeys,
};
