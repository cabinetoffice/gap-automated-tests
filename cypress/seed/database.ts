import { Client } from "pg";
import "dotenv/config";

export const runSQLFromJs = async (
  sqlScripts: string[],
  substitutions: any,
  dbName: string,
  dbUrl: string,
): Promise<void> => {
  try {
    const connectionString: string = getConnectionStringByDbName(dbUrl, dbName);
    const client = new Client({ connectionString });
    await client.connect();
    for (const sqlScript of sqlScripts) {
      // console.log("sqlScript: ", sqlScript, substitutions[sqlScript]);
      await client.query(sqlScript, substitutions[sqlScript] || []);
    }
    await client.end();
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
