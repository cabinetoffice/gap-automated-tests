import { runSQL } from "./database";
import "dotenv/config";

const userServiceDbName: string =
  process.env.CYPRESS_USERS_DATABASE_NAME || "gapuserlocaldb";

const userDatabaseUrl: string =
  process.env.CYPRESS_USERS_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

export const createTestUsers = async (): Promise<void> => {
  await runSQL(
    "./cypress/seed/sql/addTestUsers.sql",
    userServiceDbName,
    userDatabaseUrl,
  );
  console.log("Successfully added test users");
};

export const deleteTestUsers = async (): Promise<void> => {
  await runSQL(
    "./cypress/seed/sql/deleteTestUsers.sql",
    userServiceDbName,
    userDatabaseUrl,
  );
  console.log("Successfully removed test users");
};
