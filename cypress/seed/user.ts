import "dotenv/config";
import { runSQLFromJs } from "./database";
import {
  insertDepartments,
  insertRole,
  insertRoles,
  insertUsers,
} from "./ts/insertTestUsers";
import {
  deleteUsers,
  deleteDepartments,
  deleteRole,
} from "./ts/deleteTestUsers";
import {
  addFailedSpotlightOauthAudit,
  addSuccessSpotlightOauthAudit,
} from "./ts/insertApplyData";
import { deleteFailedSpotlightOauthAudit } from "./ts/deleteApplyData";
import { ADDED_DEPARTMENT_NAME } from "../common/constants";

const userServiceDbName: string =
  process.env.USERS_DATABASE_NAME || "gapuserlocaldb";

const userDatabaseUrl: string =
  process.env.USERS_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

const SUPER_ADMIN_ID = -Math.abs(+process.env.FIRST_USER_ID);
const ADMIN_ID = -(Math.abs(+process.env.FIRST_USER_ID) + 1);
const APPLICANT_ID = -(Math.abs(+process.env.FIRST_USER_ID) + 2);
const TECHNICAL_SUPPORT_ID = -(Math.abs(+process.env.FIRST_USER_ID) + 3);
const DEPARTMENT_ID = -Math.abs(+process.env.FIRST_USER_ID);
const EDIT_DEPARTMENT_ID = -Math.abs(+process.env.FIRST_USER_ID) - 1;
const DELETE_DEPARTMENT_ID = -Math.abs(+process.env.FIRST_USER_ID) - 2;

const userSubstitutions = {
  [insertDepartments]: [
    DEPARTMENT_ID,
    EDIT_DEPARTMENT_ID,
    DELETE_DEPARTMENT_ID,
  ],
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
    TECHNICAL_SUPPORT_ID,
    process.env.ONE_LOGIN_TECHNICAL_SUPPORT_EMAIL,
    process.env.ONE_LOGIN_TECHNICAL_SUPPORT_SUB,
    DEPARTMENT_ID,
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
    TECHNICAL_SUPPORT_ID,
    TECHNICAL_SUPPORT_ID,
    TECHNICAL_SUPPORT_ID,
  ],
  [deleteFailedSpotlightOauthAudit]: [SUPER_ADMIN_ID],
  [deleteUsers]: [
    SUPER_ADMIN_ID,
    ADMIN_ID,
    APPLICANT_ID,
    TECHNICAL_SUPPORT_ID,
    process.env.ONE_LOGIN_SUPER_ADMIN_SUB,
    process.env.ONE_LOGIN_ADMIN_SUB,
    process.env.ONE_LOGIN_APPLICANT_SUB,
    process.env.ONE_LOGIN_TECHNICAL_SUPPORT_SUB,
    process.env.ONE_LOGIN_SUPER_ADMIN_EMAIL,
    process.env.ONE_LOGIN_ADMIN_EMAIL,
    process.env.ONE_LOGIN_APPLICANT_EMAIL,
    process.env.ONE_LOGIN_TECHNICAL_SUPPORT_EMAIL,
  ],
  [deleteDepartments]: [
    DEPARTMENT_ID,
    EDIT_DEPARTMENT_ID,
    DELETE_DEPARTMENT_ID,
    ADDED_DEPARTMENT_NAME,
  ],
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
    [deleteFailedSpotlightOauthAudit, deleteUsers, deleteDepartments],
    userSubstitutions,
    userServiceDbName,
    userDatabaseUrl,
  );
  console.log("Successfully removed test users");
};

export const addTechSupportRoleToAdmin = async (): Promise<void> => {
  console.log("Adding TECH_SUPPORT role for admin, in user db");

  await runSQLFromJs(
    [insertRole],
    { [insertRole]: [5, ADMIN_ID] },
    userServiceDbName,
    userDatabaseUrl,
  );

  console.log("Successfully added TECH_SUPPORT role for admin, in user db");
};

export const removeTechSupportRoleFromAdmin = async (): Promise<void> => {
  console.log("Removing TECH_SUPPORT role for admin, in user db");

  await runSQLFromJs(
    [deleteRole],
    { [deleteRole]: [5, ADMIN_ID] },
    userServiceDbName,
    userDatabaseUrl,
  );

  console.log("Successfully removed TECH_SUPPORT role for admin, in user db");
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

export const addSuccessOauthAudit = async () => {
  await runSQLFromJs(
    [addSuccessSpotlightOauthAudit],
    {
      [addSuccessSpotlightOauthAudit]: [SUPER_ADMIN_ID],
    },
    userServiceDbName,
    userDatabaseUrl,
  );
};
