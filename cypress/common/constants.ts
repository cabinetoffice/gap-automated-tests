import "dotenv/config";

const firstUserId = Math.abs(+process.env.FIRST_USER_ID);
export const TEST_V1_GRANT = {
  advertName: `Cypress - Automated E2E Test Grant V1 ID:${firstUserId}`,
  contentfulId: `cypress_test_advert_contentful_id_${firstUserId}`,
  contentfulSlug: `cypress_test_advert_contentful_slug_${firstUserId}`,
  applicationUrl: `${process.env.POST_LOGIN_BASE_URL}/apply/applicant/applications/-${firstUserId}`,
  applicationName: "Cypress - Test Application V1",
  schemeName: "Cypress - Test Scheme V1",
};
