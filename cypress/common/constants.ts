import "dotenv/config";

export const TEST_V1_GRANT = {
  name: `Cypress - Automated E2E Test Grant V1 ID:${process.env.FIRST_USER_ID}`,
  contentfulId: `cypress_test_advert_contentful_id_${process.env.FIRST_USER_ID}`,
  contentfulSlug: `cypress_test_advert_contentful_slug_${process.env.FIRST_USER_ID}`,
};
