require("dotenv").config();
const { Client } = require("pg");

const userServiceDbName = process.env.USERS_DATABASE_NAME || "gapuserlocaldb";

const userDatabaseUrl =
  process.env.USERS_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432";

const script = `
SELECT sub, email, gap_user_id, r.name from public.gap_users gu INNER JOIN public.roles_users ru  on ru.users_gap_user_id = gu.gap_user_id inner join public.roles r on r.id = ru.roles_id  WHERE email IN ($1, $2, $3) 
`;

const emails = [
  process.env.ONE_LOGIN_APPLICANT_EMAIL,
  process.env.ONE_LOGIN_ADMIN_EMAIL,
  process.env.ONE_LOGIN_SUPER_ADMIN_EMAIL,
];

const runSQLFromJs = async (sqlScript, substitutions, dbName, dbUrl) => {
  try {
    const connectionString = dbUrl + "/" + dbName;
    const client = new Client({ connectionString });
    await client.connect();
    const res = await client.query(sqlScript, substitutions || []);
    await client.end();
    return res;
  } catch (error) {
    console.error("Error executing SQL script: ", error);
  }
};

(async () => {
  console.log("Checking User DB for the following emails:", emails);
  try {
    const res = await runSQLFromJs(
      script,
      emails,
      userServiceDbName,
      userDatabaseUrl,
    );
    console.log(res.rows);
    res.rows.forEach((row) => {
      const emailEnvVarName = Object.keys(process.env).find(
        (key) => process.env[key] === row.email,
      );
      const prefix = emailEnvVarName.split("_EMAIL")[0];
      const subEnvVarName = `${prefix}_SUB`;
      const passwordEnvVarName = `${prefix}_PASSWORD`;
      console.log(`${emailEnvVarName}=${row.email}`);
      console.log(`${subEnvVarName}=${row.sub}`);
      console.log(`${passwordEnvVarName}=XXXXXXXX`);
    });
  } catch (e) {
    console.log("Execution failed", e);
  }
})();
