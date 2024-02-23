import {
  SUPER_ADMIN_DASHBOARD_URL,
  assert404,
  clickText,
  signInAsAdmin,
  signInToIntegrationSite,
} from "../../common/common";

describe("Admin navigation", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Admin can view the dashboard, cannot access the super-admin dashboard", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    cy.log("Logged into admin account - asserting on dashboard content");
    cy.contains("Your grants");
    cy.contains(Cypress.env("testV1InternalGrant").schemeName);
    cy.contains(Cypress.env("testV2InternalGrant").schemeName);
    cy.contains("View all grants").click();
    cy.contains("All grants");
    cy.log("asserting on content within the 'all grants' page");
    cy.contains(Cypress.env("testV2ExternalGrant").schemeName);
    cy.contains(Cypress.env("testV1ExternalGrant").schemeName);
    cy.contains(Cypress.env("testV2InternalGrant").schemeName);
    cy.contains(Cypress.env("testV1InternalGrant").schemeName);
    clickText("View");
    cy.contains("Grant summary");
    cy.log("asserting the admin cannot view the super admin dashboard");
    assert404(SUPER_ADMIN_DASHBOARD_URL);
  });
});
