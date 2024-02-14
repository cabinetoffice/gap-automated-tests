import { type UsagePlanKey } from "@aws-sdk/client-api-gateway";
import {
  createKeyInAwsApiGatewayUsagePlan,
  deleteApiKey,
  getKeysFromAwsApiGatewayUsagePlan,
  removeKeysFromAwsApiGatewayUsagePlan,
} from "../apiGateway";
import { runSQLFromJs } from "../database";
import {
  deleteAdmins,
  deleteAdverts,
  deleteApiKeyById,
  deleteApiKeys,
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
  addSubmissionToMostRecentBatch,
  createApiKey,
  createApiKeyWithDefaultTimestamp,
  createApiKeysFundingOrganisations,
  insertAdmins,
  insertAdverts,
  insertApplicants,
  insertApplications,
  insertFundingOrgs,
  insertGrantApplicantOrgProfiles,
  insertMandatoryQuestions,
  insertSchemes,
  insertSpotlightSubmission,
  insertSubmissions,
  insertUsers,
} from "../ts/insertApplyData";
import {
  getExportedSubmission,
  selectAllApiKeys,
  selectApiKeysByFunderId,
} from "../ts/selectApplyData";
import {
  readdQueuedSpotlightSubmissions,
  removeQueuedSpotlightSubmissions,
  updateSpotlightSubmissionStatus,
} from "../ts/updateApplyData";
import {
  FUNDING_ID,
  SUPER_ADMIN_ID,
  V2_INTERNAL_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
  V2_INTERNAL_NON_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
  V2_INTERNAL_SCHEME_ID,
  applyDatabaseUrl,
  applyDeleteSubstitutions,
  applyInsertSubstitutions,
  applyServiceDbName,
  applyUpdateSubstitutions,
  createApiKeyFundingOrganisationSubstitutions,
  createApiKeySubstitutions,
  createApiKeySubstitutionsForRecreation,
  createApiKeySubstitutionsForTechSupport,
  deleteApiKeysSubstitutions,
  getAPIKeysByFunderIdSubstitutions,
  postLoginBaseUrl,
  spotlightSubstitutions,
} from "./constants";

import { promisify } from "util";
import { retry } from "./helper";

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
  await deleteAPIKeysForTechSupport();
  await runSqlForApply(
    [
      deleteApiKeys,
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

  console.log("Successfully created apiKeys into the Apply database");
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

  return rows;
};

const getAPIKeysByFunderId = async () => {
  const rows = await runSqlForApply(
    [selectApiKeysByFunderId],
    getAPIKeysByFunderIdSubstitutions,
  );
  console.log(`Successfully selected all Api Keys for Funder ID ${FUNDING_ID}`);

  return rows;
};

const deleteAPIKeysForTechSupport = async () => {
  const rows = await getAPIKeysByFunderId();
  for (const row of rows[0] as ApiKeyDb[]) {
    const key = {
      id: row.api_gateway_id,
      name: row.api_key_name,
    };
    await deleteApiKey(key);

    console.log("Successfully deleted all existing Technical Support Api Keys");
  }
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
  const row = await retry(
    async () =>
      await runSqlForApply([getExportedSubmission], applyInsertSubstitutions),
    (response: { status: string }) => response[0][0].status === "COMPLETE",
    30,
    1000,
  );
  console.log(schemeId, row[0][0]);
  return {
    url: `${postLoginBaseUrl}/apply/admin/scheme/${schemeId}/${row[0][0].export_batch_id}`,
    location: row[0][0].location.split("/")[1],
  };
};

const createApiKeysInDatabase = async (apiKeys: UsagePlanKey[]) => {
  const asyncSleep = promisify(setTimeout);

  for (let i = 0; i < apiKeys.length; i++) {
    const { id, name, value } = apiKeys[i];

    await runSqlForApply(
      [createApiKeyWithDefaultTimestamp],
      createApiKeySubstitutions(i, id, name, value),
    );
    await asyncSleep(200);
  }
};

const recreateApiKeysInDatabase = async (apiKeys: ApiKeyDb[]) => {
  for (const element of apiKeys) {
    await runSqlForApply(
      [createApiKey],
      createApiKeySubstitutionsForRecreation(element),
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

const createApiKeysInApiGatewayForTechnicalSupport = async (
  startingPoint: number,
  endingPoint: number,
) => {
  const asyncSleep = promisify(setTimeout);
  for (let i = startingPoint; i < endingPoint; i++) {
    const paddedNumber = i.toString().padStart(3, "0");
    const keyName = `CypressE2ETestTechSupport${paddedNumber}`;
    const keyId = await createKeyInAwsApiGatewayUsagePlan(keyName);
    const keyValue = keyName + keyName;

    await runSqlForApply(
      [createApiKeyWithDefaultTimestamp],
      createApiKeySubstitutionsForTechSupport(i, keyId, keyName, keyValue),
    );
    await asyncSleep(200);
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
  addSpotlightBatch,
  addToRecentBatch,
  cleanupTestSpotlightSubmissions,
  createApiKeysData,
  createApiKeysInApiGatewayForTechnicalSupport,
  createApplyData,
  deleteAPIKeysForTechSupport,
  deleteApiKeysData,
  deleteApplyData,
  deleteExistingApiKeys,
  deleteSpotlightBatch,
  deleteSpotlightSubmission,
  getAPIKeysByFunderId,
  getExportedSubmissionUrlAndLocation,
  grabAllApiKeys,
  insertSubmissionsAndMQs,
  recreateApiKeysInDatabase,
  refillDbWithAllPreExistingApiKeys,
  updateSpotlightSubmission,
  type ApiKeyDb,
};
