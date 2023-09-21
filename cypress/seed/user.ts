import { runUserSQL } from "./database";
import "dotenv/config";

const userServiceDbName: string =
  process.env.CYPRESS_USERS_DATABASE_NAME || "gapuserlocaldb";

export const createTestUsers = async (): Promise<void> => {
  await runUserSQL("./cypress/seed/sql/addTestUsers.sql", userServiceDbName);
  console.log("Successfully added test users");
};

export const deleteTestUsers = async (): Promise<void> => {
  await runUserSQL("./cypress/seed/sql/deleteTestUsers.sql", userServiceDbName);
  console.log("Successfully removed test users");
};
