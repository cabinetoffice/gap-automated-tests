import { runSQLFromJs } from "./database";
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
} from "./ts/insertApplyData";
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
  deleteSpotlightBatchRow,
  deleteSpotlightSubmissionRow,
} from "./ts/deleteApplyData";
import {
  TEST_V1_INTERNAL_GRANT,
  TEST_V1_EXTERNAL_GRANT,
  TEST_V2_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
} from "../common/constants";
import {
  v1InternalAdvert,
  v1ExternalAdvert,
  v2ExternalAdvert,
  v2InternalAdvert,
} from "./data/apply";

import {
  addSubmissionToMostRecentBatch,
  updateSpotlightSubmissionStatus,
  removeQueuedSpotlightSubmissions,
  readdQueuedSpotlightSubmissions,
} from "./ts/updateApplyData";

require("dotenv").config();

const applyServiceDbName: string =
  process.env.APPLY_DATABASE_NAME || "gapapplylocaldb";

const applyDatabaseUrl: string =
  process.env.APPLY_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

const allSubs: string[] = [
  process.env.ONE_LOGIN_SUPER_ADMIN_SUB,
  process.env.ONE_LOGIN_ADMIN_SUB,
  process.env.ONE_LOGIN_APPLICANT_SUB,
];

const SUPER_ADMIN_ID = -Math.abs(+process.env.FIRST_USER_ID);
const ADMIN_ID = -(Math.abs(+process.env.FIRST_USER_ID) + 1);
const APPLICANT_ID = -(Math.abs(+process.env.FIRST_USER_ID) + 2);
const FUNDING_ID = -Math.abs(+process.env.FIRST_USER_ID);
const SCHEME_ID = -Math.abs(+process.env.FIRST_USER_ID);
const ADVERT_ID_V1_INTERNAL = `${Math.abs(+process.env.FIRST_USER_ID)
  .toString()
  .padStart(8, "0")}-0000-0000-0000-000000000000`;
const ADVERT_ID_V1_EXTERNAL = `${Math.abs(+process.env.FIRST_USER_ID + 3)
  .toString()
  .padStart(8, "0")}-0000-0000-0000-000000000000`;
const ADVERT_ID_V2_INTERNAL = `${(Math.abs(+process.env.FIRST_USER_ID) + 1)
  .toString()
  .padStart(8, "0")}-0000-0000-0000-000000000000`;
const ADVERT_ID_V2_EXTERNAL = `${(Math.abs(+process.env.FIRST_USER_ID) + 2)
  .toString()
  .padStart(8, "0")}-0000-0000-0000-000000000000`;

const SPOTLIGHT_SUBMISSION_ID = `${(Math.abs(+process.env.FIRST_USER_ID) + 4)
  .toString()
  .padStart(8, "0")}-0000-0000-0000-000000000000`;

const SPOTLIGHT_BATCH_ID = `${(Math.abs(+process.env.FIRST_USER_ID) + 5)
  .toString()
  .padStart(8, "0")}-0000-0000-0000-000000000000`;

const applySubstitutions = {
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
    APPLICANT_ID,
    process.env.ONE_LOGIN_APPLICANT_SUB,
  ],
  [insertFundingOrgs]: [FUNDING_ID],
  [insertAdmins]: [
    SUPER_ADMIN_ID,
    FUNDING_ID,
    SUPER_ADMIN_ID,
    ADMIN_ID,
    FUNDING_ID,
    ADMIN_ID,
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
    SCHEME_ID,
    FUNDING_ID,
    ADMIN_ID,
    process.env.ONE_LOGIN_ADMIN_EMAIL,
    ADMIN_ID,
    SCHEME_ID - 1,
    FUNDING_ID,
    ADMIN_ID,
    process.env.ONE_LOGIN_ADMIN_EMAIL,
    ADMIN_ID,
    SCHEME_ID - 2,
    FUNDING_ID,
    ADMIN_ID,
    process.env.ONE_LOGIN_ADMIN_EMAIL,
    ADMIN_ID,
    SCHEME_ID - 3,
    FUNDING_ID,
    ADMIN_ID,
    process.env.ONE_LOGIN_ADMIN_EMAIL,
    ADMIN_ID,
  ],
  [insertApplications]: [
    SCHEME_ID,
    SCHEME_ID,
    ADMIN_ID,
    TEST_V1_INTERNAL_GRANT.applicationName,
    ADMIN_ID,
    SCHEME_ID - 1,
    SCHEME_ID - 1,
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
    SCHEME_ID,
    ADVERT_ID_V2_INTERNAL,
    TEST_V2_INTERNAL_GRANT.contentfulId,
    TEST_V2_INTERNAL_GRANT.contentfulSlug,
    TEST_V2_INTERNAL_GRANT.advertName,
    v2InternalAdvert,
    ADMIN_ID,
    ADMIN_ID,
    SCHEME_ID - 1,
    ADVERT_ID_V2_EXTERNAL,
    TEST_V2_EXTERNAL_GRANT.contentfulId,
    TEST_V2_EXTERNAL_GRANT.contentfulSlug,
    TEST_V2_EXTERNAL_GRANT.advertName,
    v2ExternalAdvert,
    ADMIN_ID,
    ADMIN_ID,
    SCHEME_ID - 2,
    ADVERT_ID_V1_EXTERNAL,
    TEST_V1_EXTERNAL_GRANT.contentfulId,
    TEST_V1_EXTERNAL_GRANT.contentfulSlug,
    TEST_V1_EXTERNAL_GRANT.advertName,
    v1ExternalAdvert,
    ADMIN_ID,
    ADMIN_ID,
    SCHEME_ID - 3,
  ],
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
  [deleteAdmins]: [SUPER_ADMIN_ID, ADMIN_ID, ...allSubs],
  [deleteFundingOrgs]: [SUPER_ADMIN_ID],
  [deleteApplicants]: [SUPER_ADMIN_ID, ADMIN_ID, APPLICANT_ID, ...allSubs],
  [deleteUsers]: [SUPER_ADMIN_ID, ADMIN_ID, APPLICANT_ID, ...allSubs],
  [deleteApplicantOrgProfiles]: [SUPER_ADMIN_ID, ADMIN_ID, APPLICANT_ID],
};

export const createApplyData = async (): Promise<void> => {
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

export const deleteApplyData = async (): Promise<void> => {
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

export const cleanupTestSpotlightSubmissions = async () => {
  await runSQLFromJs(
    [readdQueuedSpotlightSubmissions],
    null,
    applyServiceDbName,
    applyDatabaseUrl,
  );
};

export const updateSpotlightSubmission = async (status: string) => {
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
        SCHEME_ID - 1,
      ],
    },
    applyServiceDbName,
    applyDatabaseUrl,
  );

  return row;
};

export const addToRecentBatch = async () => {
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

export const deleteSpotlightBatch = async () => {
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

export const deleteSpotlightSubmission = async () => {
  await runSQLFromJs(
    [deleteSpotlightSubmissionRow],
    {
      [deleteSpotlightSubmissionRow]: [SCHEME_ID - 1],
    },
    applyServiceDbName,
    applyDatabaseUrl,
  );
};

export const addSpotlightBatch = async () => {
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
