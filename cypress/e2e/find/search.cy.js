require("dotenv").config();

const BASE_URL =
  "https://dev-env.find-a-grant-support-dev.service.cabinetoffice.gov.uk/";

describe("Find a Grant", () => {
  beforeEach(() => {
    // We have to visit base url first to prevent issues with cross-origin
    cy.visit(BASE_URL);
    // then log in to the One Login integration environment to prevent the popup appearing
    const username = Cypress.env("oneLoginSandboxUsername");
    const password = Cypress.env("oneLoginSandboxPassword");
    cy.visit(
      `https://${username}:${password}@signin.integration.account.gov.uk/sign-in-or-create`,
      {
        failOnStatusCode: false,
      },
    );
    // then return back to the base url to execute the tests
    cy.visit(BASE_URL);
  });

  it("loads the page", () => {
    cy.contains("Find a grant");
  });

  it("can search for a grant", () => {
    cy.get('[name="searchTerm"]')
      .should("have.attr", "placeholder")
      .should("contains", "enter a keyword or search term here");
    cy.get('[name="searchTerm"]').type(
      "Big Business Grant For Business Things",
    );

    cy.get("[data-cy=cySearchGrantsBtn]").click();

    const grantData = {
      Location: "National",
      "Funding organisation": "The Department of Business",
      "Who can apply": "Non-profit",
      "How much you can get": "From £1 to £10,000",
      "Total size of grant scheme": "£1 million",
      "Opening date": "24 August 2023, 12:01am",
      "Closing date": "24 October 2040, 11:59pm",
    };
    Object.entries(grantData).forEach(([key, value]) => {
      cy.contains(key);
      cy.contains(value);
    });
  });

  it.only("can apply for a grant", () => {
    cy.get('[name="searchTerm"]')
      .should("have.attr", "placeholder")
      .should("contains", "enter a keyword or search term here");
    cy.get('[name="searchTerm"]').type(
      "Big Business Grant For Business Things",
    );

    cy.get("[data-cy=cySearchGrantsBtn]").click();

    cy.contains("Big Business Grant For Business Things").click();

    cy.contains("Start new application").invoke("removeAttr", "target").click();

    cy.contains("Sign in with GOV.UK One Login").click();

    cy.origin("https://signin.integration.account.gov.uk", () => {
      cy.contains("Sign in").click();
      cy.get('[name="email"]').type("");
      cy.contains("Continue").click();
      cy.get('[name="password"]').type("");
      cy.contains("Continue").click();
    });

    cy.origin("https://sandbox-gap.service.cabinetoffice.gov.uk", () => {
      cy.contains("Continue").click();
    });
  });
});
