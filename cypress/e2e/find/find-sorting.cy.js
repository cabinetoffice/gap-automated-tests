import { searchForGrant, signInToIntegrationSite } from "../../common/common";

describe("Sort search results", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    cy.task("setUpFindData");
    signInToIntegrationSite();
  });

  it("can sort by each type", () => {
    cy.contains("Find a grant");

    cy.task("publishGrantsToContentful");
    cy.wait(5000);

    searchForGrant(Cypress.env("testV2InternalGrant").advertName);
    cy.contains(Cypress.env("testV2InternalGrant").advertName);

    // Opening date sort
    cy.get(".govuk-select").contains("Opening date").click();
    cy.get("#combo-0").contains("Opening date").click();

    cy.wait(5000);

    cy.get(".grants_list")
      .children("li")
      .first()
      .should("include.text", Cypress.env("testV2InternalGrant").advertName);

    // Closing date sort
    cy.get(".govuk-select").contains("Opening date").click();
    cy.get("#combo-1").contains("Closing date").click();

    cy.wait(5000);

    cy.get(".grants_list")
      .children("li")
      .first()
      .should("include.text", Cypress.env("testV2InternalGrant").advertName);

    // High to low sort
    cy.get(".govuk-select").contains("Closing date").click();
    cy.get("#combo-2").contains("Grant value: High to low").click();

    cy.wait(5000);

    cy.get(".grants_list")
      .children("li")
      .first()
      .should("include.text", Cypress.env("testV2InternalGrant").advertName);

    // Low to high sort
    cy.get(".govuk-select").contains("Grant value: High to low").click();
    cy.get("#combo-3").contains("Grant value: Low to high").click();

    cy.wait(5000);

    // 'Low to high' sorts by minimum value, and lots of grants start at £1 minimum.
    // This means the precise the grant we want may not be at the top of the list.
    // Instead verify that the first grant is at least one with the minimum possible value.
    cy.get(".grants_list").children("li").first().should("include.text", "£1");
  });
});
