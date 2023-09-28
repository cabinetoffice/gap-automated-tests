import { runSQL } from "./database";
import "dotenv/config";

const applyServiceDbName: string =
  process.env.CYPRESS_APPLY_DATABASE_NAME || "gapapplylocaldb";

const applyDatabaseUrl: string =
  process.env.CYPRESS_APPLY_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

export const createApplyData = async (): Promise<void> => {
  await runSQL(
    "./cypress/seed/sql/apply.sql",
    applyServiceDbName,
    applyDatabaseUrl,
  );
  console.log("Successfully added data to Apply database");
};

export const deleteApplyData = async (): Promise<void> => {
  await runSQL(
    "./cypress/seed/sql/delete_apply.sql",
    applyServiceDbName,
    applyDatabaseUrl,
  );
  console.log("Successfully removed data from Apply database");
};
