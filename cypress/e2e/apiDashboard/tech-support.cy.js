import {
  signInAsTechnicalSupport,
  signInToIntegrationSite,
  log,
} from "../../common/common";

describe("Technical Support User", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Technical Support can view API Key dashboard without API Keys", () => {
    //   cy.task(REMOVE_ADVERT_BY_NAME, GRANT_NAME);
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    log("Technical Support User- Signing in as admin");
    signInAsTechnicalSupport();
    log("Technical Support User- creating Grant");
    //   createGrant(GRANT_NAME);
    // cy.get('[data-cy="header"]').should("be.visible").contains("Find a Grant");

    // cy.get('[data-cy="beta-banner"]').should("be.visible").contains("BETA");
  });
});
