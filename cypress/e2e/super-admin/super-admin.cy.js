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

  it(
    "can land on super admin dashboard",
    {
      retries: {
        runMode: 1,
        openMode: 0,
      },
    },
    () => {
      cy.get("[data-cy=cySignInAndApply-Link]").click();

      signInAsSuperAdmin(Cypress.currentRetry);

      cy.contains("Manage users");
    },
  );
});
