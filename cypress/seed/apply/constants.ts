import {
  insertApplicants,
  insertUsers,
  insertFundingOrgs,
  insertAdmins,
  insertGrantApplicantOrgProfiles,
  insertSchemes,
  insertApplications,
  insertAdverts,
  addSpotlightBatchRow,
  addSubmissionToMostRecentBatch,
  insertMandatoryQuestions,
  insertSpotlightSubmission,
  insertSubmissions,
  createApiKey,
  createApiKeysFundingOrganisations,
  createApiKeyWithDefaultTimestamp,
} from "../ts/insertApplyData";
import {
  deleteAdverts,
  deleteSubmissions,
  deleteApplications,
  deleteSchemes,
  deleteAdmins,
  deleteApplicants,
  deleteUsers,
  deleteFundingOrgs,
  deleteApplicantOrgProfiles,
  deleteSpotlightSubmissionRow,
  deleteSpotlightBatchRow,
  deleteApiKeysFundingOrganisations,
  deleteApiKeysByFunderId,
  deleteApiKeys,
} from "../ts/deleteApplyData";
import {
  TEST_V1_INTERNAL_GRANT,
  TEST_V1_EXTERNAL_GRANT,
  TEST_V2_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
} from "../../common/constants";
import {
  v1InternalAdvert,
  v1ExternalAdvert,
  v2ExternalAdvert,
  v2InternalAdvert,
} from "../data/apply";

import { getTestID, getUUID, hashApiKey } from "./helper";
import {
  getExportedSubmission,
  selectApiKeysByFunderId,
} from "../ts/selectApplyData";
import { type ApiKeyDb } from "./service";

require("dotenv").config();

const applyServiceDbName = process.env.APPLY_DATABASE_NAME || "gapapplylocaldb";

const applyDatabaseUrl =
  process.env.APPLY_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

const postLoginBaseUrl = process.env.POST_LOGIN_BASE_URL;

const allSubs = [
  process.env.ONE_LOGIN_SUPER_ADMIN_SUB,
  process.env.ONE_LOGIN_ADMIN_SUB,
  process.env.ONE_LOGIN_APPLICANT_SUB,
];

const DEPARTMENT_NAME = `Cypress - Test Department ${process.env.FIRST_USER_ID}`;

const SUPER_ADMIN_ID = getTestID();
const ADMIN_ID = getTestID(1);
const APPLICANT_ID = getTestID(2);
const TECHNICAL_SUPPORT_ID = getTestID(3);
const FUNDING_ID = getTestID();

const V1_INTERNAL_SCHEME_ID = getTestID();
const V1_EXTERNAL_SCHEME_ID = getTestID(3);
const V2_INTERNAL_SCHEME_ID = getTestID(1);
const V2_EXTERNAL_SCHEME_ID = getTestID(2);

const ADVERT_ID_V1_INTERNAL = getUUID();
const ADVERT_ID_V1_EXTERNAL = getUUID(3);
const ADVERT_ID_V2_INTERNAL = getUUID(1);
const ADVERT_ID_V2_EXTERNAL = getUUID(2);
const SPOTLIGHT_BATCH_ID = getUUID(5);

// The IDs of the submissions and MQs are not linked to the advert schemes themselves, they're just unique UUIDs.
const V1_INTERNAL_LIMITED_COMPANY_SUBMISSION_ID = ADVERT_ID_V1_INTERNAL;
const V2_INTERNAL_LIMITED_COMPANY_SUBMISSION_ID = ADVERT_ID_V2_INTERNAL;
const V2_INTERNAL_NON_LIMITED_COMPANY_SUBMISSION_ID = ADVERT_ID_V2_EXTERNAL;
const V2_INTERNAL_INDIVIDUAL_SUBMISSION_ID = ADVERT_ID_V1_EXTERNAL;

const V2_EXTERNAL_LIMITED_COMPANY_MANDATORY_QUESTION_ID = ADVERT_ID_V1_INTERNAL;
const V2_INTERNAL_LIMITED_COMPANY_MANDATORY_QUESTION_ID = ADVERT_ID_V2_INTERNAL;
const V2_INTERNAL_NON_LIMITED_COMPANY_MANDATORY_QUESTION_ID =
  ADVERT_ID_V2_EXTERNAL;
const V2_INTERNAL_INDIVIDUAL_MANDATORY_QUESTION_ID = ADVERT_ID_V1_EXTERNAL;

const V2_INTERNAL_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID =
  V2_INTERNAL_LIMITED_COMPANY_MANDATORY_QUESTION_ID;
const V2_INTERNAL_NON_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID =
  V2_INTERNAL_NON_LIMITED_COMPANY_MANDATORY_QUESTION_ID;

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

const applyInsertSubstitutions = {
  [insertApplicants]: [
    SUPER_ADMIN_ID,
    process.env.ONE_LOGIN_SUPER_ADMIN_SUB,
    ADMIN_ID,
    process.env.ONE_LOGIN_ADMIN_SUB,
    APPLICANT_ID,
    process.env.ONE_LOGIN_APPLICANT_SUB,
  ],
  [insertUsers]: [
    SUPER_ADMIN_ID,
    process.env.ONE_LOGIN_SUPER_ADMIN_SUB,
    ADMIN_ID,
    process.env.ONE_LOGIN_ADMIN_SUB,
    TECHNICAL_SUPPORT_ID,
    process.env.ONE_LOGIN_TECHNICAL_SUPPORT_SUB,
  ],
  [insertFundingOrgs]: [FUNDING_ID],
  [insertAdmins]: [
    SUPER_ADMIN_ID,
    FUNDING_ID,
    SUPER_ADMIN_ID,
    ADMIN_ID,
    FUNDING_ID,
    ADMIN_ID,
    TECHNICAL_SUPPORT_ID,
    FUNDING_ID,
    TECHNICAL_SUPPORT_ID,
  ],
  [insertGrantApplicantOrgProfiles]: [
    SUPER_ADMIN_ID,
    SUPER_ADMIN_ID,
    ADMIN_ID,
    ADMIN_ID,
    APPLICANT_ID,
    APPLICANT_ID,
  ],
  [insertSchemes]: [
    V1_INTERNAL_SCHEME_ID,
    FUNDING_ID,
    ADMIN_ID,
    process.env.ONE_LOGIN_ADMIN_EMAIL,
    ADMIN_ID,
    V2_INTERNAL_SCHEME_ID,
    FUNDING_ID,
    ADMIN_ID,
    process.env.ONE_LOGIN_ADMIN_EMAIL,
    ADMIN_ID,
    V2_EXTERNAL_SCHEME_ID,
    FUNDING_ID,
    ADMIN_ID,
    process.env.ONE_LOGIN_ADMIN_EMAIL,
    ADMIN_ID,
    V1_EXTERNAL_SCHEME_ID,
    FUNDING_ID,
    ADMIN_ID,
    process.env.ONE_LOGIN_ADMIN_EMAIL,
    ADMIN_ID,
  ],
  [insertApplications]: [
    V1_INTERNAL_SCHEME_ID,
    V1_INTERNAL_SCHEME_ID,
    ADMIN_ID,
    TEST_V1_INTERNAL_GRANT.applicationName,
    ADMIN_ID,
    V2_INTERNAL_SCHEME_ID,
    V2_INTERNAL_SCHEME_ID,
    ADMIN_ID,
    TEST_V2_INTERNAL_GRANT.applicationName,
    ADMIN_ID,
  ],
  [insertAdverts]: [
    ADVERT_ID_V1_INTERNAL,
    TEST_V1_INTERNAL_GRANT.contentfulId,
    TEST_V1_INTERNAL_GRANT.contentfulSlug,
    TEST_V1_INTERNAL_GRANT.advertName,
    v1InternalAdvert,
    ADMIN_ID,
    ADMIN_ID,
    V1_INTERNAL_SCHEME_ID,
    ADVERT_ID_V2_INTERNAL,
    TEST_V2_INTERNAL_GRANT.contentfulId,
    TEST_V2_INTERNAL_GRANT.contentfulSlug,
    TEST_V2_INTERNAL_GRANT.advertName,
    v2InternalAdvert,
    ADMIN_ID,
    ADMIN_ID,
    V2_INTERNAL_SCHEME_ID,
    ADVERT_ID_V2_EXTERNAL,
    TEST_V2_EXTERNAL_GRANT.contentfulId,
    TEST_V2_EXTERNAL_GRANT.contentfulSlug,
    TEST_V2_EXTERNAL_GRANT.advertName,
    v2ExternalAdvert,
    ADMIN_ID,
    ADMIN_ID,
    V2_EXTERNAL_SCHEME_ID,
    ADVERT_ID_V1_EXTERNAL,
    TEST_V1_EXTERNAL_GRANT.contentfulId,
    TEST_V1_EXTERNAL_GRANT.contentfulSlug,
    TEST_V1_EXTERNAL_GRANT.advertName,
    v1ExternalAdvert,
    ADMIN_ID,
    ADMIN_ID,
    V1_EXTERNAL_SCHEME_ID,
  ],
  [getExportedSubmission]: [
    SUPER_ADMIN_ID,
    ADMIN_ID,
    APPLICANT_ID,
    SUPER_ADMIN_ID,
    ADMIN_ID,
    ...allSubs,
  ],
};

const applyDeleteSubstitutions = {
  [deleteApiKeys]: [FUNDING_ID],
  [deleteAdverts]: [SUPER_ADMIN_ID, ADMIN_ID, ...allSubs],
  [deleteSubmissions]: [
    SUPER_ADMIN_ID,
    ADMIN_ID,
    APPLICANT_ID,
    SUPER_ADMIN_ID,
    ADMIN_ID,
    ...allSubs,
  ],
  [deleteApplications]: [SUPER_ADMIN_ID, ADMIN_ID, ...allSubs],
  [deleteSchemes]: [SUPER_ADMIN_ID, ADMIN_ID, ...allSubs],
  [deleteAdmins]: [SUPER_ADMIN_ID, ADMIN_ID, TECHNICAL_SUPPORT_ID, ...allSubs],
  [deleteFundingOrgs]: [SUPER_ADMIN_ID],
  [deleteApplicants]: [SUPER_ADMIN_ID, ADMIN_ID, APPLICANT_ID, ...allSubs],
  [deleteUsers]: [
    SUPER_ADMIN_ID,
    ADMIN_ID,
    APPLICANT_ID,
    TECHNICAL_SUPPORT_ID,
    ...allSubs,
  ],
  [deleteApplicantOrgProfiles]: [SUPER_ADMIN_ID, ADMIN_ID, APPLICANT_ID],
};

const deleteApiKeysSubstitutions = {
  [deleteApiKeysByFunderId]: [SUPER_ADMIN_ID - 1, SUPER_ADMIN_ID - 2],
  [deleteApiKeysFundingOrganisations]: [SUPER_ADMIN_ID - 1, SUPER_ADMIN_ID - 2],
};

const getAPIKeysByFunderIdSubstitutions = {
  [selectApiKeysByFunderId]: [FUNDING_ID],
};

const spotlightSubstitutions = {
  [addSubmissionToMostRecentBatch]: [
    V2_INTERNAL_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
    SPOTLIGHT_BATCH_ID,
    V2_INTERNAL_NON_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
    SPOTLIGHT_BATCH_ID,
  ],
  [deleteSpotlightBatchRow]: [SPOTLIGHT_BATCH_ID],
  [deleteSpotlightSubmissionRow]: [V2_INTERNAL_SCHEME_ID],
  [addSpotlightBatchRow]: [SPOTLIGHT_BATCH_ID],
};

const applyUpdateSubstitutions = {
  [insertSubmissions]: [
    // V1 Internal Limited company application
    V1_INTERNAL_LIMITED_COMPANY_SUBMISSION_ID,
    APPLICANT_ID,
    V1_INTERNAL_SCHEME_ID,
    APPLICANT_ID,
    APPLICANT_ID,
    V1_INTERNAL_SCHEME_ID,
    V1_INTERNAL_LIMITED_COMPANY_SUBMISSION_ID,
    // V2 Internal Limited company application
    V2_INTERNAL_LIMITED_COMPANY_SUBMISSION_ID,
    APPLICANT_ID,
    V2_INTERNAL_SCHEME_ID,
    APPLICANT_ID,
    APPLICANT_ID,
    V2_INTERNAL_SCHEME_ID,
    V2_INTERNAL_LIMITED_COMPANY_SUBMISSION_ID,
    // V2 Internal Non-limited company application
    V2_INTERNAL_NON_LIMITED_COMPANY_SUBMISSION_ID,
    ADMIN_ID,
    V2_INTERNAL_SCHEME_ID,
    ADMIN_ID,
    ADMIN_ID,
    V2_INTERNAL_SCHEME_ID,
    V2_INTERNAL_NON_LIMITED_COMPANY_SUBMISSION_ID,
    // V2 Internal Individual application
    V2_INTERNAL_INDIVIDUAL_SUBMISSION_ID,
    SUPER_ADMIN_ID,
    V2_INTERNAL_SCHEME_ID,
    SUPER_ADMIN_ID,
    SUPER_ADMIN_ID,
    V2_INTERNAL_SCHEME_ID,
    V2_INTERNAL_INDIVIDUAL_SUBMISSION_ID,
  ],
  [insertMandatoryQuestions]: [
    // Internal Limited company application
    V2_INTERNAL_LIMITED_COMPANY_MANDATORY_QUESTION_ID,
    V2_INTERNAL_SCHEME_ID,
    V2_INTERNAL_LIMITED_COMPANY_SUBMISSION_ID,
    APPLICANT_ID,
    APPLICANT_ID,
    V2_INTERNAL_LIMITED_COMPANY_MANDATORY_QUESTION_ID,
    // External Limited company application
    V2_EXTERNAL_LIMITED_COMPANY_MANDATORY_QUESTION_ID,
    V2_EXTERNAL_SCHEME_ID,
    APPLICANT_ID,
    APPLICANT_ID,
    V2_EXTERNAL_LIMITED_COMPANY_MANDATORY_QUESTION_ID,
    // Internal Non-limited company application
    V2_INTERNAL_NON_LIMITED_COMPANY_MANDATORY_QUESTION_ID,
    V2_INTERNAL_SCHEME_ID,
    V2_INTERNAL_NON_LIMITED_COMPANY_SUBMISSION_ID,
    APPLICANT_ID,
    APPLICANT_ID,
    V2_INTERNAL_NON_LIMITED_COMPANY_MANDATORY_QUESTION_ID,
    // Internal Individual application
    V2_INTERNAL_INDIVIDUAL_MANDATORY_QUESTION_ID,
    V2_INTERNAL_SCHEME_ID,
    V2_INTERNAL_INDIVIDUAL_SUBMISSION_ID,
    APPLICANT_ID,
    APPLICANT_ID,
    V2_INTERNAL_INDIVIDUAL_MANDATORY_QUESTION_ID,
  ],
  [insertSpotlightSubmission]: [
    V2_INTERNAL_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
    V2_INTERNAL_LIMITED_COMPANY_MANDATORY_QUESTION_ID,
    V2_INTERNAL_SCHEME_ID,
    V2_INTERNAL_NON_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
    V2_INTERNAL_NON_LIMITED_COMPANY_MANDATORY_QUESTION_ID,
    V2_INTERNAL_SCHEME_ID,
  ],
};

const createApiKeyFundingOrganisationSubstitutions = {
  [createApiKeysFundingOrganisations]: [SUPER_ADMIN_ID - 2, SUPER_ADMIN_ID - 1],
};

const createApiKeySubstitutions = (
  i: number,
  id: string,
  name: string,
  value: string,
) => {
  const fundingOrganisation = name.startsWith("Org1")
    ? SUPER_ADMIN_ID - 1
    : SUPER_ADMIN_ID - 2;
  return {
    [createApiKeyWithDefaultTimestamp]: [
      -(i + 1),
      fundingOrganisation,
      hashApiKey(value),
      name,
      null,
      false,
      null,
      null,
      id,
    ],
  };
};

const createApiKeySubstitutionsForTechSupport = (
  i: number,
  id: string,
  name: string,
  value: string,
) => {
  return {
    [createApiKeyWithDefaultTimestamp]: [
      -(1000 + i + 1),
      FUNDING_ID,
      hashApiKey(value),
      name,
      null,
      false,
      null,
      null,
      id,
    ],
  };
};

const createApiKeySubstitutionsForRecreation = (apiKey: ApiKeyDb) => {
  return {
    [createApiKey]: [
      apiKey.api_key_id,
      apiKey.funder_id,
      apiKey.api_key_value,
      apiKey.api_key_name,
      apiKey.api_key_description,
      apiKey.created_date,
      apiKey.is_revoked,
      apiKey.revocation_date,
      apiKey.revoked_by,
      apiKey.api_gateway_id,
    ],
  };
};

export {
  applyInsertSubstitutions,
  applyDeleteSubstitutions,
  applyUpdateSubstitutions,
  spotlightSubstitutions,
  applyServiceDbName,
  applyDatabaseUrl,
  postLoginBaseUrl,
  SUPER_ADMIN_ID,
  ADMIN_ID,
  APPLICANT_ID,
  TECHNICAL_SUPPORT_ID,
  FUNDING_ID,
  V1_INTERNAL_SCHEME_ID,
  V1_EXTERNAL_SCHEME_ID,
  V2_INTERNAL_SCHEME_ID,
  V2_EXTERNAL_SCHEME_ID,
  ADVERT_ID_V1_INTERNAL,
  ADVERT_ID_V1_EXTERNAL,
  ADVERT_ID_V2_INTERNAL,
  ADVERT_ID_V2_EXTERNAL,
  V2_INTERNAL_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
  V2_INTERNAL_NON_LIMITED_COMPANY_SPOTLIGHT_SUBMISSION_ID,
  SPOTLIGHT_BATCH_ID,
  MQ_DETAILS,
  DEPARTMENT_NAME,
  deleteApiKeysSubstitutions,
  createApiKeySubstitutions,
  createApiKeyFundingOrganisationSubstitutions,
  createApiKeySubstitutionsForRecreation,
  getAPIKeysByFunderIdSubstitutions,
  createApiKeySubstitutionsForTechSupport,
};
