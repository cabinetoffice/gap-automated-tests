import { runSQL } from "./database";
import "dotenv/config";

const applyServiceDbName: string =
  process.env.CYPRESS_APPLY_DATABASE_NAME || "gapapplylocaldb";

export const createTestUsers = async (): Promise<void> => {
  await runSQL("./cypress/seed/sql/apply.sql", applyServiceDbName);
  console.log("Successfully added data to Apply database");
};

export const deleteTestUsers = async (): Promise<void> => {
  await runSQL("./cypress/seed/sql/delete_apply.sql", applyServiceDbName);
  console.log("Successfully removed data from database");
};
