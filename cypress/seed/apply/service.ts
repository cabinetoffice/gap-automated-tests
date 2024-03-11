import { type UsagePlanKey } from '@aws-sdk/client-api-gateway';
import {
  createKeyInAwsApiGatewayUsagePlan,
  deleteApiKeyFromAws,
  getKeysFromAwsApiGatewayUsagePlan,
  removeKeysFromAwsApiGatewayUsagePlan,
} from '../apiGateway';
import { runSQLFromJs } from '../database';
import {
  deleteAdmins,
  deleteAdverts,
  deleteApiKeys,
  deleteApiKeysByFunderId,
  deleteApiKeysFundingOrganisations,
  deleteApplicantOrgProfiles,
  deleteApplicants,
  deleteApplications,
  deleteExport,
  deleteExportBatch,
  deleteFundingOrgs,
  deleteSchemes,
  deleteEditors,
  deleteSpotlightBatchRow,
  deleteSpotlightSubmissionRow,
  deleteSubmissions,
  deleteTechSupportUser,
  deleteUsers,
} from '../ts/deleteApplyData';
import {
  addSpotlightBatchRow,
  addSubmissionToMostRecentBatch,
  createApiKeyBaseQuery,
  createApiKeysFundingOrganisations,
  insertAdmins,
  insertAdverts,
  insertApplicants,
  insertApplications,
  insertEditors,
  insertFundingOrgs,
  insertGrantApplicantOrgProfiles,
  insertMandatoryQuestions,
  insertSchemes,
  insertSpotlightSubmission,
  insertSubmissions,
  insertTechSupportUser,
  insertUsers,
} from '../ts/insertApplyData';
import {
  getExportedSubmission,
  selectApiKeysByFunderId,
} from '../ts/selectApplyData';
import {
  readdQueuedSpotlightSubmissions,
  removeQueuedSpotlightSubmissions,
  updateSpotlightSubmissionStatus,
} from '../ts/updateApplyData';
import {
  ADMIN_ID,
  APPLICANT_ID,
  FUNDING_ID,
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
  createApiKeySubstitutionsForTechSupport,
  deleteApiKeysSubstitutions,
  getAPIKeysByFunderIdSubstitutions,
  postLoginBaseUrl,
  spotlightSubstitutions,
} from './constants';

import { retry } from '../helper';

const FIRST_USER_ID = process.env.FIRST_USER_ID;
const AWS_ENVIRONMENT = process.env.AWS_ENVIRONMENT;
const API_KEY_VALUE = `${FIRST_USER_ID}${AWS_ENVIRONMENT}`;

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
      insertTechSupportUser,
      insertGrantApplicantOrgProfiles,
      insertSchemes,
      insertEditors,
      insertApplications,
      insertAdverts,
    ],
    applyInsertSubstitutions,
  );
  console.log('Successfully added data to Apply database');
};

const deleteApplyData = async (): Promise<void> => {
  console.log('deleting data from Apply database');
  await deleteAPIKeysFromAwsForTechSupport();
  await runSqlForApply(
    [
      deleteApiKeys,
      deleteTechSupportUser,
      deleteExport,
      deleteExportBatch,
      deleteAdverts,
      deleteSubmissions,
      deleteApplications,
      deleteSchemes,
      deleteEditors,
      deleteAdmins,
      deleteTechSupportUser,
      deleteApplicants,
      deleteUsers,
      deleteFundingOrgs,
      deleteApplicantOrgProfiles,
    ],
    applyDeleteSubstitutions,
  );
  console.log('Successfully removed data from Apply database');
};

const createApiKeysData = async (): Promise<void> => {
  await runSqlForApply(
    [createApiKeysFundingOrganisations],
    createApiKeyFundingOrganisationSubstitutions,
  );
  console.log('Successfully created and updated fundingOrganisation');

  console.log(`Creating Keys in usage plan for ${ADMIN_ID}`);
  await createApiKeysInApiGatewayUsagePlan(ADMIN_ID, 1, 7);
  console.log(
    `Successfully created Keys in usage plan for funding org: ${ADMIN_ID}`,
  );

  console.log(`Creating Keys in usage plan for ${APPLICANT_ID}`);
  await createApiKeysInApiGatewayUsagePlan(APPLICANT_ID, 7, 12);
  console.log(
    `Successfully created Keys in usage plan for funding org: ${APPLICANT_ID}`,
  );

  const apiKeys = (await getKeysFromAwsApiGatewayUsagePlan()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  console.log(
    `Successfully retrieved ${apiKeys.length}  Keys from Aws Api Gateway`,
  );

  await createApiKeysInDatabase(apiKeys);

  console.log('Successfully created apiKeys into the Apply database');
};

const deleteApiKeysData = async (): Promise<void> => {
  console.log('Deleting Api Keys and funding org from Apply database');
  await runSqlForApply(
    [deleteApiKeysByFunderId, deleteApiKeysFundingOrganisations],
    deleteApiKeysSubstitutions, // the $1, etc in the sql script
  );

  console.log(
    'Successfully removed Keys from Apply database and the funding Organisation associated with it',
  );

  await removeKeysFromAwsApiGatewayUsagePlan();
  console.log('Successfully removed Keys Aws Api Gateway');
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
  console.log(`Deleting all Api Keys for Funder ID ${FUNDING_ID} from AWS`);

  for (const row of rows[0] as ApiKeyDb[]) {
    const key = {
      id: row.api_gateway_id,
      name: row.api_key_name,
    };
    await deleteApiKeyFromAws(key);

    console.log('Successfully deleted all existing Technical Support Api Keys');
  }
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
    (response: { status: string }) => response[0][0].status === 'COMPLETE',
    30,
    1000,
  );
  console.log(schemeId, row[0][0]);
  return {
    url: `${postLoginBaseUrl}/apply/admin/scheme/${schemeId}/${row[0][0].export_batch_id}`,
    location: row[0][0].location.split('/')[1],
  };
};

const createApiKeysInDatabase = async (apiKeys: UsagePlanKey[]) => {
  console.log('Creating Api Keys in the database');
  const numberOfColumns = 10; // number of columns to be substituted in the database

  const substitutions = [];
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];

    substitutions.push(
      createApiKeySubstitutions(i, apiKey.id, apiKey.name, apiKey.value),
    );
  }

  const queryString = buildQueryStringForSubstitutions(
    createApiKeyBaseQuery,
    substitutions,
    numberOfColumns,
  );

  await runSqlForApply([queryString], {
    [queryString]: substitutions.flatMap((item) => item),
  });
  console.log('Successfully created Api Keys in the database');
};

const buildQueryStringForSubstitutions = (
  query: string,
  params: any[],
  numberOfColumns: number,
) => {
  const substitutionParameters = buildDynamicQuerySubstitutions(
    params,
    numberOfColumns,
  );

  return `${query}${substitutionParameters.join(', ')}`;
};

const buildDynamicQuerySubstitutions = (
  items: any[],
  numberOfParamsPerItem: number,
) => {
  const substitutionGroups = [];

  for (let i = 0; i < items.length; i++) {
    const substitutions = [];
    for (let j = 1; j <= numberOfParamsPerItem; j++) {
      substitutions.push('$' + (numberOfParamsPerItem * i + j));
    }
    substitutionGroups.push('(' + substitutions.join(', ') + ')');
  }
  return substitutionGroups;
};

const createApiKeysInApiGatewayUsagePlan = async (
  fundingOrganisation: number,
  startingPoint: number,
  endingPoint: number,
) => {
  for (let i = startingPoint; i < endingPoint; i++) {
    console.log('creating key in AWS: ' + i);

    const paddedNumber = i.toString().padStart(3, '0');
    const orgName = fundingOrganisation === ADMIN_ID ? 'Org1' : 'Org2';
    const keyName = `${orgName}Cypress${paddedNumber}${FIRST_USER_ID}`;
    const keyValue = API_KEY_VALUE.padEnd(20, 'x') + i;

    await createKeyInAwsApiGatewayUsagePlan(keyName, keyValue);
  }
};

const createApiKeysInApiGatewayForTechnicalSupport = async (
  startingPoint: number,
  endingPoint: number,
) => {
  const numberOfColumns = 10; // number of columns to be substituted in the database

  const params = [];
  for (let i = startingPoint; i < endingPoint; i++) {
    const paddedNumber = i.toString().padStart(3, '0');
    const keyName = `CypressE2ETestTechSupport${paddedNumber}${FIRST_USER_ID}`;
    const keyValue = keyName;
    const keyId = await createKeyInAwsApiGatewayUsagePlan(keyName, keyValue);

    console.log('creating key in AWS with value: ', keyValue);
    params.push(
      createApiKeySubstitutionsForTechSupport(i, keyId, keyName, keyValue),
    );
  }

  const queryString = buildQueryStringForSubstitutions(
    createApiKeyBaseQuery,
    params,
    numberOfColumns,
  );

  await runSqlForApply([queryString], {
    [queryString]: params.flatMap((item) => item),
  });
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
  deleteSpotlightBatch,
  deleteSpotlightSubmission,
  getAPIKeysByFunderId,
  getExportedSubmissionUrlAndLocation,
  insertSubmissionsAndMQs,
  updateSpotlightSubmission,
  type ApiKeyDb,
};
