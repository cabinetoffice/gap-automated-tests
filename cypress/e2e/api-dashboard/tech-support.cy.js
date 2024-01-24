import {
  signInAsTechnicalSupport,
  signInToIntegrationSite,
  log,
  BASE_URL,
} from "../../common/common";

const today = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const apiKeyName = "CypressE2ETestTechSupportCreateAPIKey";
const existingApiKeyName = "CypressE2ETestTechSupport001";

describe("API Admin - No existing keys", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();

    cy.get("[data-cy=cySignInAndApply-Link]").click();
    log("Technical Support User - Signing in");
    signInAsTechnicalSupport();
  });

  it("Technical Support can view API Key dashboard without API Keys and create a key", () => {
    // API Key dashboard without API Keys
    cy.get('[data-cy="header"]').should("be.visible").contains("Find a Grant");

    cy.get('[data-cy="beta-banner"]').should("be.visible").contains("BETA");

    cy.get('[data-cy="header-sign-out-link"]').contains("Sign out");

    cy.get('[data-cy="header-feedback-link"]')
      .should(
        "have.attr",
        "href",
        "https://docs.google.com/forms/d/e/1FAIpQLSd2V0IqOMpb2_yQnz_Ges0WCYFnDOTxZpF299gePV1j8kMdLA/viewform",
      )
      .contains("feedback");

    cy.get('[data-cy="footer"]')
      .should("be.visible")
      .contains(
        "All content is available under the Open Government Licence v3.0, except where otherwise stated",
      );

    cy.get('[data-cy="api-keys-heading"]')
      .should("be.visible")
      .contains("Manage API keys");

    cy.get('[data-cy="api-keys-department"]')
      .should("be.visible")
      .contains("Department");

    cy.get('[data-cy="api-keys-department-name"]')
      .should("be.visible")
      .contains("Cypress - Test Funding Organisation");

    cy.get('[data-cy="api-keys-no-api-keys"]')
      .should("be.visible")
      .contains(
        "You don't have any API keys yet. When you create one, you will be able to see a list of your API keys and revoke access to them on this screen.",
      );

    cy.get('[data-cy="api-keys-create-button"]')
      .should("be.visible")
      .contains("Create an API key");

    // Go to create API key page
    cy.get('[data-cy="api-keys-create-button"]')
      .should("be.visible")
      .contains("Create an API key")
      .click();

    cy.url().should("include", "api-keys/create");

    cy.get('[data-cy="header-sign-out-link"]').contains("Sign out");

    cy.get('[data-cy="create-key-error-banner"]').should("not.exist");

    cy.get('[data-cy="create-key-heading"]')
      .should("be.visible")
      .contains("Name your API key");

    cy.get('[data-cy="create-key-hint-text"]')
      .should("be.visible")
      .contains(
        "This name will be shown in your list of API keys to make it easier to find. We recommend using the name of the service you will be using the API key to integrate with",
      );

    cy.get('[data-cy="create-key-continue"]')
      .should("be.visible")
      .contains("Continue");

    cy.get('[data-cy="create-key-back-button"]')
      .should("be.visible")
      .should("have.text", "Back")
      .click();

    cy.get('[data-cy="api-keys-heading"]')
      .should("be.visible")
      .should("have.text", "Manage API keys");

    cy.get('[data-cy="api-keys-create-button"]')
      .should("be.visible")
      .contains("Create an API key")
      .click();

    cy.url().should("include", "/admin/api-keys/create");

    // Should display validation errors for blank name
    cy.get('[data-cy="create-key-continue"]')
      .should("be.visible")
      .contains("Continue")
      .click();

    cy.get('[data-cy="create-key-error-banner-heading"]')
      .should("be.visible")
      .contains("There is a problem");

    cy.get('[data-cy="create-key-error-summary-list"]')
      .should("have.length", 1)
      .contains("Enter a key name");

    cy.get('[data-cy="create-key-input-validation-error-details"]')
      .should("be.visible")
      .should("have.text", "Enter a key name");

    // Should display validation errors for blank spaces
    cy.get('[data-cy="create-key-input"]').clear().type("api key name");

    cy.get('[data-cy="create-key-continue"]')
      .should("be.visible")
      .contains("Continue")
      .click();

    cy.get('[data-cy="create-key-error-banner-heading"]')
      .should("be.visible")
      .contains("There is a problem");

    cy.get('[data-cy="create-key-error-summary-list"]')
      .should("have.length", 1)
      .contains("Key name must be alphanumeric");

    cy.get('[data-cy="create-key-input-validation-error-details"]')
      .should("be.visible")
      .should("have.text", "Key name must be alphanumeric");

    // Should successfully create key and display value
    cy.get('[data-cy="create-key-input"]').clear().type(apiKeyName);

    cy.get('[data-cy="create-key-continue"]')
      .should("be.visible")
      .contains("Continue")
      .click();

    cy.url().should("include", "/admin/api-keys/create");

    cy.get('[data-cy="new-key-heading"]')
      .should("be.visible")
      .should("have.text", "New API key");

    cy.get('[data-cy="new-key-your-api-key"]')
      .should("be.visible")
      .should("have.text", "Your API key:");

    cy.get('[data-cy="new-key-value"]').then(($span) => {
      const apiKeyValue = $span.text();
      cy.get('[data-cy="new-key-copy-to-clipboard-button"]')
        .should("be.visible")
        .contains("Copy to clipboard")
        .click();

      cy.window()
        .then((win) => {
          cy.stub(win.navigator.clipboard, "readText").resolves(apiKeyValue);
        })
        .then(() => {
          cy.window().then((win) => {
            win.navigator.clipboard.readText().then((clipboardContent) => {
              expect(clipboardContent).to.equal(apiKeyValue);
            });
          });
        });
    });

    cy.get('[data-cy="new-key-paragraph"]')
      .should("be.visible")
      .should(
        "have.text",
        "You should keep a copy of this API key somewhere safe.",
      );

    cy.get('[data-cy="new-key-paragraph-2"]')
      .should("be.visible")
      .should(
        "have.text",
        "When you leave this screen, you will not be able to see this API key again.",
      );

    cy.get('[data-cy="new-key-back-button"]')
      .should("be.visible")
      .contains("Back to your API keys")
      .click();

    cy.get('[data-cy="api-keys-heading"]')
      .should("be.visible")
      .should("have.text", "Manage API keys");
  });

  it("Should render error page when trying to access super admin dashboard", () => {
    cy.visit(`${BASE_URL}/find/api/admin/api-keys/manage`);

    cy.get('[data-cy="error-heading"]')
      .should("be.visible")
      .should("have.text", "Something went wrong");

    cy.get('[data-cy="error-paragraph"]')
      .should("be.visible")
      .should(
        "have.text",
        "Something went wrong while trying to complete your request.",
      );

    cy.get('[data-cy="error-paragraph-with-link"]')
      .should("be.visible")
      .contains("You can return to the API dashboard to try again.");

    cy.get('[data-cy="error-back-link"]')
      .should("have.attr", "href", "/find/api/admin/api-keys")
      .contains("return to the API dashboard")
      .click();

    cy.get('[data-cy="api-keys-heading"]')
      .should("be.visible")
      .should("have.text", "Manage API keys");
  });
});
describe("API Admin - Existing API Keys", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    cy.task("createApiKeysInApiGatewayForTechnicalSupport");
    signInToIntegrationSite();

    cy.get("[data-cy=cySignInAndApply-Link]").click();
    log("Technical Support User - Signing in");
    signInAsTechnicalSupport();
  });

  it("Should render API key dashboard with list of API keys and prevent creation of a key with duplicate name", () => {
    // View existing API Keys
    cy.get('[data-cy="api-keys-heading"]')
      .should("be.visible")
      .should("have.text", "Manage API keys");

    cy.get('[data-cy="api-keys-department"]')
      .should("be.visible")
      .contains("Department");

    cy.get('[data-cy="api-keys-department-name"]')
      .should("be.visible")
      .should("have.text", "Cypress - Test Funding Organisation");

    cy.get('[data-cy="create-key-summary-list"]')
      .children()
      .should("have.length", 1);

    cy.get(`[data-cy="api-key-name-${existingApiKeyName}"]`)
      .should("be.visible")
      .should("have.text", existingApiKeyName);

    cy.get(`[data-cy="api-key-created-date-${existingApiKeyName}"]`)
      .should("be.visible")
      .should("have.text", "Created " + today);

    cy.get(`[data-cy="api-key-revoke-${existingApiKeyName}"]`)
      .should("be.visible")
      .contains("Revoke");

    cy.get('[data-cy="api-keys-create-button"]')
      .should("be.visible")
      .contains("Create an API key");

    // Should display validation errors for existing API key name
    cy.get('[data-cy="api-keys-create-button"]')
      .should("be.visible")
      .contains("Create an API key")
      .click();

    cy.get('[data-cy="create-key-input"]').type(existingApiKeyName);

    cy.get('[data-cy="create-key-continue"]')
      .should("be.visible")
      .contains("Continue")
      .click();

    cy.get('[data-cy="create-key-error-banner-heading"]')
      .should("be.visible")
      .contains("There is a problem");

    cy.get('[data-cy="create-key-error-summary-list"]')
      .should("have.length", 1)
      .contains("An API key with this name already exists");

    cy.get('[data-cy="create-key-input-validation-error-details"]')
      .should("be.visible")
      .should("have.text", "An API key with this name already exists");

    cy.get('[data-cy="create-key-back-button"]')
      .should("be.visible")
      .should("have.text", "Back")
      .click();
  });

  it("Should render API key confirmation page and revoke API key", () => {
    cy.get(`[data-cy="api-key-revoke-${existingApiKeyName}"]`)
      .should("be.visible")
      .contains("Revoke")
      .click();

    cy.get('[data-cy="revoke-heading"]')
      .should("be.visible")
      .should("have.text", "Revoke an API key");

    cy.get('[data-cy="revoke-paragraph-1"]')
      .should("be.visible")
      .contains(
        "If you revoke this API key, you will no longer be able to use it to request data from Find a grant.",
      );

    cy.get('[data-cy="revoke-paragraph-2"]')
      .should("be.visible")
      .contains(
        "You cannot re-enable a revoked API key. If you want to request data again, you will need to create a new API key.",
      );

    cy.get('[data-cy="revoke-revoke-button"]')
      .should("be.visible")
      .should("have.text", "Revoke key");

    cy.get('[data-cy="revoke-cancel-button"]')
      .should("be.visible")
      .should("have.text", "Cancel")
      .click();

    cy.get(`[data-cy="api-key-revoke-${existingApiKeyName}"]`)
      .should("be.visible")
      .contains("Revoke")
      .click();

    cy.get('[data-cy="revoke-revoke-button"]')
      .should("be.visible")
      .should("have.text", "Revoke key")
      .click();

    cy.get('[data-cy="create-key-summary-list"]')
      .children()
      .should("have.length", 1);

    cy.get(`[data-cy="api-key-name-${existingApiKeyName}"]`)
      .should("be.visible")
      .should("have.text", existingApiKeyName);

    cy.get(`[data-cy="api-key-created-date-${existingApiKeyName}"]`)
      .should("be.visible")
      .should("have.text", "Created " + today);

    cy.get(`[data-cy="api-key-revoked-${existingApiKeyName}"]`)
      .should("be.visible")
      .should("have.text", "Revoked " + today);
  });
});