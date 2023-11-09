import "dotenv/config";
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
} from "./ts/deleteApplyData";

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

const SUPER_ADMIN_ID = -process.env.FIRST_USER_ID;
const ADMIN_ID = -(+process.env.FIRST_USER_ID + 1);
const APPLICANT_ID = -(+process.env.FIRST_USER_ID + 2);

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
  [insertAdmins]: [SUPER_ADMIN_ID, SUPER_ADMIN_ID, ADMIN_ID, ADMIN_ID],
  [insertGrantApplicantOrgProfiles]: [
    SUPER_ADMIN_ID,
    SUPER_ADMIN_ID,
    ADMIN_ID,
    ADMIN_ID,
    APPLICANT_ID,
    APPLICANT_ID,
  ],
  [insertSchemes]: [process.env.ONE_LOGIN_ADMIN_EMAIL],
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
  [deleteApplicants]: [SUPER_ADMIN_ID, ADMIN_ID, APPLICANT_ID, ...allSubs],
  [deleteUsers]: [SUPER_ADMIN_ID, ADMIN_ID, APPLICANT_ID, ...allSubs],
  [deleteApplicantOrgProfiles]: [SUPER_ADMIN_ID, ADMIN_ID, APPLICANT_ID],
};

export const createApplyData = async (): Promise<void> => {
  await runSQLFromJs(
    [
      insertApplicants,
      insertUsers,
      //insertFundingOrgs,
      insertAdmins,
      insertGrantApplicantOrgProfiles,
      //insertSchemes,
      //insertApplications,
      //insertAdverts,
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
      //deleteFundingOrgs,
      deleteApplicantOrgProfiles,
    ],
    applySubstitutions,
    applyServiceDbName,
    applyDatabaseUrl,
  );
  console.log("Successfully removed data from Apply database");
};
