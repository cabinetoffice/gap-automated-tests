import { runSQLFromJs } from './database';
import 'dotenv/config';

import {
  deleteFromUnsubscribe,
  deleteFromSubscription,
  deleteFromNewsletter,
  deleteFromSavedSearch,
  deleteFindUser,
} from './ts/deleteFindData';

const findServiceDbName: string = process.env.FIND_DATABASE_NAME || 'postgres';

const findDatabaseUrl: string =
  process.env.FIND_DATABASE_URL ||
  'postgres://postgres:postgres@localhost:5432';

const findSubstitutions = {
  [deleteFromUnsubscribe]: [process.env.ONE_LOGIN_APPLICANT_SUB],
  [deleteFromSubscription]: [process.env.ONE_LOGIN_APPLICANT_SUB],
  [deleteFromNewsletter]: [process.env.ONE_LOGIN_APPLICANT_SUB],
  [deleteFromSavedSearch]: [process.env.ONE_LOGIN_APPLICANT_SUB],
  [deleteFindUser]: [
    -Math.abs(+process.env.FIRST_USER_ID),
    process.env.ONE_LOGIN_APPLICANT_SUB,
  ],
};

export const deleteFindData = async (): Promise<void> => {
  await runSQLFromJs(
    [
      deleteFromUnsubscribe,
      deleteFromSubscription,
      deleteFromNewsletter,
      deleteFromSavedSearch,
      deleteFindUser,
    ],
    findSubstitutions,
    findServiceDbName,
    findDatabaseUrl,
  );
  console.log('Successfully removed data from Find database');
};
