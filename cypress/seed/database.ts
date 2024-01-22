import { Client } from "pg";
import "dotenv/config";

export const runSQLFromJs = async (
  sqlScripts: string[],
  substitutions: any,
  dbName: string,
  dbUrl: string,
): Promise<unknown[]> => {
  const response = [];
  const maxConnectionRetries = 5;
  let connectionRetries = 0;

  while (connectionRetries < maxConnectionRetries) {
    try {
      const connectionString: string = getConnectionStringByDbName(
        dbUrl,
        dbName,
      );

      const client = new Client({ connectionString });
      await client.connect();
      for (const sqlScript of sqlScripts) {
        await runSingleQuery(client, sqlScript, substitutions, response);
      }
      await client.end();
      return response;
    } catch (error) {
      connectionRetries++;

      console.error(
        `Error executing SQL script : (Retry ${connectionRetries}/${maxConnectionRetries}): ${error}`,
      );
    }
  }
};

export const getConnectionStringByDbName = (
  dbUrl: string,
  dbName: string,
): string => {
  return dbUrl + "/" + dbName;
};

export const runSingleQuery = async (
  client: any,
  sqlScript: string,
  substitutions: any,
  response: any[],
) => {
  const maxRetries = 5;
  let retries = 0;
  let success = false;

  while (!success && retries < maxRetries) {
    try {
      const res = await client.query(
        sqlScript,
        substitutions?.[sqlScript] || [],
      );
      response.push(res.rows);
      success = true;
    } catch (error) {
      retries++;

      console.error(
        `Error executing SQL script ${sqlScript}: (Retry ${retries}/${maxRetries}): ${error}`,
      );
    }
  }

  if (!success) {
    throw new Error(
      `Failed to execute SQL script '${sqlScript}' after ${maxRetries} attempts`,
    );
  }
};
