import { Client } from "pg";
import { promises as fs } from "fs";
import "dotenv/config";

const userDatabaseUrl: string =
  process.env.CYPRESS_USERS_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

const applyDatabaseUrl: string =
  process.env.CYPRESS_APPLY_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

export const runUserSQL = async (
  filePath: string,
  dbName: string,
): Promise<void> => {
  try {
    const connectionString: string = getConnectionStringByDbName(
      userDatabaseUrl,
      dbName,
    );
    console.log("Connection:" + connectionString);
    const sqlScript: string = await fs.readFile(filePath, "utf8");
    const client = new Client({ connectionString });
    await client.connect();
    console.log("sqlScript: ", sqlScript);
    await client.query(sqlScript);
    await client.end();

    console.log("SQL script executed successfully.");
  } catch (error) {
    console.error("Error executing SQL script: ", error);
  }
};

export const runApplySQL = async (
  filePath: string,
  dbName: string,
): Promise<void> => {
  try {
    const connectionString: string = getConnectionStringByDbName(
      applyDatabaseUrl,
      dbName,
    );
    //console.log("Connection:" + connectionString);
    const sqlScript: string = await fs.readFile(filePath, "utf8");
    const client = new Client({ connectionString });
    await client.connect();
    console.log("sqlScript: ", sqlScript);
    await client.query(sqlScript);
    await client.end();

    console.log("SQL script executed successfully.");
  } catch (error) {
    console.error("Error executing SQL script: ", error);
  }
};

export const getConnectionStringByDbName = (
  dbUrl: string,
  dbName: string,
): string => {
  return dbUrl + "/" + dbName;
};
