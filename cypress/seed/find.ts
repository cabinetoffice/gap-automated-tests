import { runSQLFromJs } from "./database";
import "dotenv/config";
import { insertFindUser } from "./ts/insertFindData";

import {
  deleteFromUnsubscribe,
  deleteFromSubscription,
  deleteFindUser,
} from "./ts/deleteFindData";

const findServiceDbName: string =
  process.env.CYPRESS_FIND_DATABASE_NAME || "postgres";

const findDatabaseUrl: string =
  process.env.CYPRESS_FIND_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

export const createFindData = async (): Promise<void> => {
  await runSQLFromJs(
    [insertFindUser],
    process.env.ONE_LOGIN_APPLICANT_SUB,
    findServiceDbName,
    findDatabaseUrl,
  );
  console.log("Successfully added data to Find database");
};

export const deleteFindData = async (): Promise<void> => {
  await runSQLFromJs(
    [deleteFromUnsubscribe, deleteFromSubscription, deleteFindUser],
    process.env.ONE_LOGIN_APPLICANT_SUB,
    findServiceDbName,
    findDatabaseUrl,
  );
  console.log("Successfully removed data from Find database");
};
