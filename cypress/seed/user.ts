import "dotenv/config";
import { runSQLFromJs } from "./database";
import {
  insertDepartments,
  insertRoles,
  insertUsers,
} from "./ts/insertTestUsers";
import { deleteUsers, deleteDepartments } from "./ts/deleteTestUsers";
import { addFailedSpotlightOauthAudit } from "./ts/insertApplyData";
import { deleteFailedSpotlightOauthAudit } from "./ts/deleteApplyData";

const userServiceDbName: string =
  process.env.USERS_DATABASE_NAME || "gapuserlocaldb";

const userDatabaseUrl: string =
  process.env.USERS_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

const SUPER_ADMIN_ID = -Math.abs(+process.env.FIRST_USER_ID);
const ADMIN_ID = -(Math.abs(+process.env.FIRST_USER_ID) + 1);
const APPLICANT_ID = -(Math.abs(+process.env.FIRST_USER_ID) + 2);
const DEPARTMENT_ID = -Math.abs(+process.env.FIRST_USER_ID);

const userSubstitutions = {
  [insertDepartments]: [DEPARTMENT_ID],
  [insertUsers]: [
    SUPER_ADMIN_ID,
    process.env.ONE_LOGIN_SUPER_ADMIN_EMAIL,
    process.env.ONE_LOGIN_SUPER_ADMIN_SUB,
    DEPARTMENT_ID,
    ADMIN_ID,
    process.env.ONE_LOGIN_ADMIN_EMAIL,
    process.env.ONE_LOGIN_ADMIN_SUB,
    DEPARTMENT_ID,
    APPLICANT_ID,
    process.env.ONE_LOGIN_APPLICANT_EMAIL,
    process.env.ONE_LOGIN_APPLICANT_SUB,
  ],
  [insertRoles]: [
    SUPER_ADMIN_ID,
    SUPER_ADMIN_ID,
    SUPER_ADMIN_ID,
    SUPER_ADMIN_ID,
    ADMIN_ID,
    ADMIN_ID,
    ADMIN_ID,
    APPLICANT_ID,
    APPLICANT_ID,
  ],
  [deleteUsers]: [
    SUPER_ADMIN_ID,
    ADMIN_ID,
    APPLICANT_ID,
    process.env.ONE_LOGIN_SUPER_ADMIN_SUB,
    process.env.ONE_LOGIN_ADMIN_SUB,
    process.env.ONE_LOGIN_APPLICANT_SUB,
    process.env.ONE_LOGIN_SUPER_ADMIN_EMAIL,
    process.env.ONE_LOGIN_ADMIN_EMAIL,
    process.env.ONE_LOGIN_APPLICANT_EMAIL,
  ],
  [deleteDepartments]: [DEPARTMENT_ID],
};

export const createTestUsers = async (): Promise<void> => {
  await runSQLFromJs(
    [insertDepartments, insertUsers, insertRoles],
    userSubstitutions,
    userServiceDbName,
    userDatabaseUrl,
  );
  console.log("Successfully added test users");
};

export const deleteTestUsers = async (): Promise<void> => {
  await runSQLFromJs(
    [deleteUsers, deleteDepartments],
    userSubstitutions,
    userServiceDbName,
    userDatabaseUrl,
  );
  console.log("Successfully removed test users");
};

export const addFailedOauthAudit = async () => {
  await runSQLFromJs(
    [addFailedSpotlightOauthAudit],
    {
      [addFailedSpotlightOauthAudit]: [SUPER_ADMIN_ID],
    },
    userServiceDbName,
    userDatabaseUrl,
  );
};

export const deleteFailedOauthAudit = async () => {
  await runSQLFromJs(
    [deleteFailedSpotlightOauthAudit],
    {
      [deleteFailedSpotlightOauthAudit]: [SUPER_ADMIN_ID],
    },
    userServiceDbName,
    userDatabaseUrl,
  );
};
