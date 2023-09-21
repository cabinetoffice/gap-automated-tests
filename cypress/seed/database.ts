import { Client } from "pg";
import fs from "fs/promises";

const databaseUrl: string =
  process.env.CYPRESS_USERS_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

export const runSQL = async (
  filePath: string,
  dbName: string,
): Promise<void> => {
  try {
    const connectionString: string = getConnectionStringByDbName(dbName);
    const sqlScript: string = await fs.readFile(filePath, "utf8");
    const client: Client = new Client({ connectionString });
    await client.connect();
    console.log("sqlScript: ", sqlScript);
    await client.query(sqlScript);
    await client.end();

    console.log("SQL script executed successfully.");
  } catch (error) {
    console.error("Error executing SQL script: ", error);
  }
};

export const getConnectionStringByDbName = (dbName: string): string => {
  return databaseUrl + "/" + dbName;
};
