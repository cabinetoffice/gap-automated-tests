import { getUUID, getTestID } from '../seed/apply/helper';

require('dotenv').config();

const firstUserId = Math.abs(+process.env.FIRST_USER_ID);
const firstGrantId = Math.abs(+process.env.FIRST_USER_ID);
const secondGrantId = Math.abs(+process.env.FIRST_USER_ID) + 1;

export const ADDED_DEPARTMENT_NAME = `Cypress - Test Add Department -${firstUserId}`;
export const ADMIN_TEST_GRANT_NAME = `Cypress Admin E2E Test Grant ID:${firstUserId}`;

export const TEST_V1_INTERNAL_GRANT = {
  advertName: `Cypress - Automated E2E Test Grant V1 Internal ID:${firstUserId}`,
  advertId: getUUID(),
  applicationUrl: `${process.env.POST_LOGIN_BASE_URL}/apply/applicant/applications/-${firstGrantId}`,
  applicationName: 'Cypress - Test Application V1 Internal',
  applicationId: getTestID(),
  schemeName: 'Cypress - Test Scheme V1 Internal',
  schemeId: getTestID(),
};

export const TEST_V1_EXTERNAL_GRANT = {
  advertName: `Cypress - Automated E2E Test Grant V1 External ID:${firstUserId}`,
  advertId: getUUID(3),
  applicationUrl: 'https://www.google.com',
  applicationName: 'Cypress - Test Application V1 External',
  applicationId: getTestID(3),
  schemeName: 'Cypress - Test Scheme V1 External',
  schemeId: getTestID(3),
};

export const TEST_V2_INTERNAL_GRANT = {
  advertName: `Cypress - Automated E2E Test Grant V2 Internal ID:${firstUserId}`,
  advertId: getUUID(1),
  applicationUrl: `${process.env.POST_LOGIN_BASE_URL}/apply/applicant/applications/-${secondGrantId}`,
  applicationName: 'Cypress - Test Application V2 Internal',
  applicationId: getTestID(1),
  schemeName: 'Cypress - Test Scheme V2 Internal',
  schemeId: getTestID(1),
};

export const TEST_V2_EXTERNAL_GRANT = {
  advertName: `Cypress - Automated E2E Test Grant V2 External ID:${firstUserId}`,
  advertId: getUUID(2),
  applicationUrl: 'https://www.google.com',
  applicationName: 'Cypress - Test Application V2 External',
  applicationId: getTestID(2),
  schemeName: 'Cypress - Test Scheme V2 External',
  schemeId: getTestID(2),
};

export const MQ_DETAILS = {
  name: 'MyOrg',
  address: ['addressLine1', 'addressLine2', 'city', 'county', 'postcod'],
  orgType: 'Limited company',
  companiesHouse: '12345',
  charitiesCommission: '67890',
  howMuchFunding: '100',
  fundingLocation: [
    'North East (England)',
    'North West (England)',
    'Yorkshire and the Humber',
    'East Midlands (England)',
    'West Midlands (England)',
    'London',
    'South East (England)',
    'South West (England)',
    'Scotland',
    'Wales',
    'Northern Ireland',
    'Outside of the UK',
  ],
};

export const EXPORT_BATCH = {
  export_batch_id_v1: getUUID(),
  export_batch_id_v2: getUUID(1),
};

export const wcagCategories = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
};
