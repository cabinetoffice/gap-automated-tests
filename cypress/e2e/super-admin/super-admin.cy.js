import {
  signInAsSuperAdmin,
  signInToIntegrationSite,
} from "../../common/common";

describe("Manage Users", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it.only("can land on super admin dashboard", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();

    signInAsSuperAdmin();

    cy.contains("Manage users");
  });
});
