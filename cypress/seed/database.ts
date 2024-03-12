import 'dotenv/config';
import { Client } from 'pg';

export const runSQLFromJs = async (
  sqlScripts: string[],
  substitutions: any,
  dbName: string,
  dbUrl: string,
): Promise<unknown[]> => {
  let response = [];
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
      response = await Promise.all(
        sqlScripts.map(
          async (sqlScript) =>
            await runSingleQuery(client, sqlScript, substitutions),
        ),
      );
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
  return dbUrl + '/' + dbName;
};

export const runSingleQuery = async (
  client: any,
  sqlScript: string,
  substitutions: any,
) => {
  const maxRetries = 5;
  let retries = 0;
  let success = false;
  let response;

  while (!success && retries < maxRetries) {
    try {
      const res = await client.query(
        sqlScript,
        substitutions?.[sqlScript] || [],
      );
      response = res.rows;
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

  return response;
};
