import { runSQL, runSQLFromJs } from "./database";
import "dotenv/config";
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
    [[], [], [], [], [], [], [], []],
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
    [[], [], [], [], [], [], [], [], []],
    applyServiceDbName,
    applyDatabaseUrl,
  );
  console.log("Successfully removed data from Apply database");
};
