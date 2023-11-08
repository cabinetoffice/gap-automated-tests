import { Client } from "pg";
import { promises as fs } from "fs";
import "dotenv/config";

export const runSQL = async (
  filePath: string,
  dbName: string,
  dbUrl: string,
): Promise<void> => {
  try {
    const connectionString: string = getConnectionStringByDbName(dbUrl, dbName);
    // console.log("Connection:" + connectionString);
    const sqlScript: string = await fs.readFile(filePath, "utf8");
    const client = new Client({ connectionString });
    await client.connect();
    // console.log("sqlScript: ", sqlScript);
    await client.query(sqlScript);
    await client.end();

    // console.log("SQL script executed successfully.");
  } catch (error) {
    console.error("Error executing SQL script: ", error);
  }
};

export const runSQLFromJs = async (
  sqlScripts: Array<string>,
  substitutions: any,
  dbName: string,
  dbUrl: string,
): Promise<void> => {
  try {
    const connectionString: string = getConnectionStringByDbName(dbUrl, dbName);
    // console.log("Connection:" + connectionString);
    const client = new Client({ connectionString });
    await client.connect();
    // console.log("sqlScript: ", sqlScript);
    for (const sqlScript of sqlScripts) {
      await client.query(sqlScript, substitutions[sqlScript] || []);
    }
    await client.end();

    // console.log("SQL script executed successfully.");
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
