import "dotenv/config";

export const TEST_V1_GRANT = {
  name: `Cypress - Automated E2E Test Grant V1 ID:${Math.abs(
    +process.env.FIRST_USER_ID,
  )}`,
  contentfulId: `cypress_test_advert_contentful_id_${Math.abs(
    +process.env.FIRST_USER_ID,
  )}`,
  contentfulSlug: `cypress_test_advert_contentful_slug_${Math.abs(
    +process.env.FIRST_USER_ID,
  )}`,
  applicationUrl: `${
    process.env.POST_LOGIN_BASE_URL
  }/apply/applicant/applications/-${Math.abs(+process.env.FIRST_USER_ID)}`,
  applicationName: "Cypress - Test Application V1",
};
