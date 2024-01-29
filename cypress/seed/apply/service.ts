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
  deleteApiKeys,
  deleteApiKeysByFunderId,
  deleteApiKeysById,
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
  createApiKeyBaseQuery,
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
  await deleteAPIKeysFromAwsForTechSupport();
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

const deleteAPIKeysFromAwsForTechSupport = async () => {
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

  await runSqlForApply([deleteApiKeysById], {
    [deleteApiKeysById]: [apiKeyIds],
  });

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
  const asyncSleep = promisify(setTimeout);

  // for (let i = 0; i < apiKeys.length; i++) {
  //   const { id, name, value } = apiKeys[i];

  //   await runSqlForApply(
  //     [createApiKeyWithDefaultTimestamp],
  //     createApiKeySubstitutions(i, id, name, value),
  //   );
  //   await asyncSleep(200);
  // }

  const params = [];
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];
    params.push(
      createApiKeySubstitutions(i, apiKey.id, apiKey.name, apiKey.value),
    );
  }

  const numberOfColumns = 10;
  const substitutionParameters = buildDynamicQuerySubstitutions(
    params,
    numberOfColumns,
  );
  const queryString = `${createApiKeyBaseQuery}${substitutionParameters.join(
    ", ",
  )}`;

  await runSqlForApply([queryString], {
    [queryString]: params.flatMap((item) => item),
  });

  await asyncSleep(200);
};

const buildDynamicQuerySubstitutions = (
  items: any[],
  numberOfParamsPerItem: number,
) => {
  const substitutionGroups = [];

  for (let i = 0; i < items.length; i++) {
    const substitutions = [];
    for (let j = 1; j <= numberOfParamsPerItem; j++) {
      substitutions.push("$" + (numberOfParamsPerItem * i + j));
    }
    substitutionGroups.push("(" + substitutions.join(", ") + ")");
  }

  return substitutionGroups;
};

const recreateApiKeysInDatabase = async (apiKeys: ApiKeyDb[]) => {
  if (apiKeys !== null && apiKeys.length > 0) {
    const numberOfColumns = 10;
    const substitutionParameters = buildDynamicQuerySubstitutions(
      apiKeys,
      numberOfColumns,
    );
    const queryString = `${createApiKeyBaseQuery}${substitutionParameters.join(
      ", ",
    )}`;

    await runSqlForApply(
      [queryString],
      createApiKeySubstitutionsForRecreation(queryString, apiKeys),
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
  // TODO do we need the async sleep here? Someone who knows JS pls advise
  const asyncSleep = promisify(setTimeout);

  const params = [];
  for (let i = startingPoint; i < endingPoint; i++) {
    const paddedNumber = i.toString().padStart(3, "0");
    const keyName = `CypressE2ETestTechSupport${paddedNumber}`;
    const keyId = await createKeyInAwsApiGatewayUsagePlan(keyName);
    const keyValue = keyName + keyName;

    params.push(
      createApiKeySubstitutionsForTechSupport(i, keyId, keyName, keyValue),
    );
  }

  const numberOfColumns = 10;
  const substitutionParameters = buildDynamicQuerySubstitutions(
    params,
    numberOfColumns,
  );
  const queryString = `${createApiKeyBaseQuery}${substitutionParameters.join(
    ", ",
  )}`;

  await runSqlForApply([queryString], {
    [queryString]: params.flatMap((item) => item),
  });

  await asyncSleep(200);
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
  deleteAPIKeysFromAwsForTechSupport,
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
