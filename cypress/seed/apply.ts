import { runApplySQL } from "./database";
import "dotenv/config";
import { deleteGrantAdverts, publishGrantAdverts } from "./contentful";

const applyServiceDbName: string =
  process.env.CYPRESS_APPLY_DATABASE_NAME || "gapapplylocaldb";

export const createApplyData = async (): Promise<void> => {
  await runApplySQL("./cypress/seed/sql/apply.sql", applyServiceDbName);
  await publishGrantAdverts();
  console.log("Successfully added data to Apply database");
};

export const deleteApplyData = async (): Promise<void> => {
  await runApplySQL("./cypress/seed/sql/delete_apply.sql", applyServiceDbName);
  await deleteGrantAdverts();
  console.log("Successfully removed data from database");
};
