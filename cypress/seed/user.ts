import { runSQL } from "./database";

const userServiceDbName: string =
  process.env.CYPRESS_USER_SERVICE_DB_NAME || "gapuserlocaldb";

export const createTestUsers = async (): Promise<void> => {
  await runSQL("./sql/addTestUsers.sql", userServiceDbName);
  console.log("Successfully added test users");
};

export const deleteTestUsers = async (): Promise<void> => {
  await runSQL("./sql/deleteTestUsers.sql", userServiceDbName);
  console.log("Successfully removed test users");
};
