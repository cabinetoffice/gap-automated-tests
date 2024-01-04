import { getUUID , getTestID } from "../seed/apply/helper";

require("dotenv").config();

const firstUserId = Math.abs(+process.env.FIRST_USER_ID);
const firstGrantId = Math.abs(+process.env.FIRST_USER_ID);
const secondGrantId = Math.abs(+process.env.FIRST_USER_ID) + 1;

export const ADDED_DEPARTMENT_NAME = "Cypress Test Add Department";

export const TEST_V1_INTERNAL_GRANT = {
  advertName: `Cypress - Automated E2E Test Grant V1 Internal ID:${firstUserId}`,
  advertId: getUUID(),
  contentfulId: `cypress_test_advert_v1_internal_contentful_id_${firstUserId}`,
  contentfulSlug: `cypress_test_advert_v1_internal_contentful_slug_${firstUserId}`,
  applicationUrl: `${process.env.POST_LOGIN_BASE_URL}/apply/applicant/applications/-${firstGrantId}`,
  applicationName: "Cypress - Test Application V1 Internal",
  schemeName: "Cypress - Test Scheme V1 Internal",
  schemeId: getTestID(),
};

export const TEST_V1_EXTERNAL_GRANT = {
  advertName: `Cypress - Automated E2E Test Grant V1 External ID:${firstUserId}`,
  advertId: getUUID(3),
  contentfulId: `cypress_test_advert_v1_external_contentful_id_${firstUserId}`,
  contentfulSlug: `cypress_test_advert_v1_external_contentful_slug_${firstUserId}`,
  applicationUrl: "https://www.google.com",
  applicationName: "Cypress - Test Application V1 External",
  schemeName: "Cypress - Test Scheme V1 External",
  schemeId: getTestID(3),
};

export const TEST_V2_INTERNAL_GRANT = {
  advertName: `Cypress - Automated E2E Test Grant V2 Internal ID:${firstUserId}`,
  advertId: getUUID(1),
  contentfulId: `cypress_test_advert_v2_internal_contentful_id_${firstUserId}`,
  contentfulSlug: `cypress_test_advert_v2_internal_contentful_slug_${firstUserId}`,
  applicationUrl: `${process.env.POST_LOGIN_BASE_URL}/apply/applicant/applications/-${secondGrantId}`,
  applicationName: "Cypress - Test Application V2 Internal",
  schemeName: "Cypress - Test Scheme V2 Internal",
  schemeId: getTestID(1),
};

export const TEST_V2_EXTERNAL_GRANT = {
  advertName: `Cypress - Automated E2E Test Grant V2 External ID:${firstUserId}`,
  advertId: getUUID(2),
  contentfulId: `cypress_test_advert_v2_external_contentful_id_${firstUserId}`,
  contentfulSlug: `cypress_test_advert_v2_external_contentful_slug_${firstUserId}`,
  applicationUrl: "https://www.google.com",
  applicationName: "Cypress - Test Application V2 External",
  schemeName: "Cypress - Test Scheme V2 External",
  schemeId: getTestID(2),
};
