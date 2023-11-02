import { runSQL } from "./database";
import "dotenv/config";

const findServiceDbName: string =
  process.env.CYPRESS_FIND_DATABASE_NAME || "postgres";

const findDatabaseUrl: string =
  process.env.CYPRESS_FIND_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

export const createFindData = async (): Promise<void> => {
  await runSQL(
    "./cypress/seed/sql/find.sql",
    findServiceDbName,
    findDatabaseUrl,
  );
  console.log("Successfully added data to Find database");
};

export const deleteFindData = async (): Promise<void> => {
  await runSQL(
    "./cypress/seed/sql/delete_find.sql",
    findServiceDbName,
    findDatabaseUrl,
  );
  console.log("Successfully removed data from Find database");
};
