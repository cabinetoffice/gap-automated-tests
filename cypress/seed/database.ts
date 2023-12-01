import { Client } from "pg";
import "dotenv/config";
import { cloneWith } from "cypress/types/lodash";

export const runSQLFromJs = async (
  sqlScripts: string[],
  substitutions: any,
  dbName: string,
  dbUrl: string,
): Promise<unknown[]> => {
  const response = [];
  console.log({ dbUrl, dbName, substitutions });
  try {
    const connectionString: string = getConnectionStringByDbName(dbUrl, dbName);
    console.log({ connectionString });

    const client = new Client({ connectionString });
    await client.connect();

    for (const sqlScript of sqlScripts) {
      // console.log("sqlScript: ", sqlScript, substitutions[sqlScript]);
      const res = await client.query(
        sqlScript,
        substitutions?.[sqlScript] || [],
      );
      console.log(res);
      response.push(res.rows);
    }
    await client.end();
    return response;
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
