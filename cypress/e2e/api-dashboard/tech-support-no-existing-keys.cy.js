import {
  ADMIN_DASHBOARD_URL,
  BASE_URL,
  log,
  signInAsTechnicalSupport,
  signInToIntegrationSite,
  SUPER_ADMIN_DASHBOARD_URL,
  runAccessibility,
} from '../../common/common';

const firstUserId = Cypress.env('firstUserId');
const apiKeyName = `CypressE2ETestTechSupportCreateAPIKey${firstUserId}`;
describe('API Admin - No existing keys', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('deleteAPIKeysFromAwsForTechSupport');
    cy.task('setUpApplyData');
    signInToIntegrationSite();

    cy.get('[data-cy=cySignInAndApply-Link]').click();
    runAccessibility();
    log('Technical Support User - Signing in');
    runAccessibility();
    signInAsTechnicalSupport();
  });

  it('Technical Support can view API Key dashboard without API Keys and create a key', () => {
    // API Key dashboard without API Keys
    log(
      'Tech Support - create API key journey - checking API dashboard has no API keys',
    );

    cy.get('[data-cy="header"]').should('be.visible').contains('Find a Grant');

    cy.get('[data-cy="beta-banner"]').should('be.visible').contains('BETA');

    cy.get('[data-cy="header-sign-out-link"]').contains('Sign out');

    cy.get('[data-cy="header-feedback-link"]')
      .should(
        'have.attr',
        'href',
        'https://docs.google.com/forms/d/e/1FAIpQLSd2V0IqOMpb2_yQnz_Ges0WCYFnDOTxZpF299gePV1j8kMdLA/viewform',
      )
      .contains('feedback');

    cy.get('[data-cy="footer"]')
      .should('be.visible')
      .contains(
        'All content is available under the Open Government Licence v3.0, except where otherwise stated',
      );

    cy.get('[data-cy="api-keys-heading"]')
      .should('be.visible')
      .contains('Manage API keys');

    cy.get('[data-cy="api-keys-department"]')
      .should('be.visible')
      .contains('Department');

    cy.get('[data-cy="api-keys-department-name"]')
      .should('be.visible')
      .contains('Cypress - Test Department');

    cy.get('[data-cy="api-keys-no-api-keys"]')
      .should('be.visible')
      .contains(
        "You don't have any API keys yet. When you create one, you will be able to see a list of your API keys and revoke access to them on this screen.",
      );

    cy.get('[data-cy="api-keys-create-button"]')
      .should('be.visible')
      .contains('Create an API key');

    // Go to create API key page
    log('Tech Support - create API key journey - beginning API key creation');

    cy.get('[data-cy="api-keys-create-button"]')
      .should('be.visible')
      .contains('Create an API key')
      .click();
    runAccessibility();

    cy.url().should('include', 'api-keys/create');

    cy.get('[data-cy="header-sign-out-link"]').contains('Sign out');

    cy.get('[data-cy="create-key-error-banner"]').should('not.exist');

    cy.get('[data-cy="create-key-heading"]')
      .should('be.visible')
      .contains('Name your API key');
    runAccessibility();

    cy.get('[data-cy="create-key-hint-text"]')
      .should('be.visible')
      .contains(
        'This name will be shown in your list of API keys to make it easier to find. We recommend using the name of the service you will be using the API key to integrate with',
      );

    cy.get('[data-cy="create-key-continue"]')
      .should('be.visible')
      .contains('Continue');

    cy.get('[data-cy="create-key-back-button"]')
      .should('be.visible')
      .should('have.text', 'Back')
      .click();

    cy.get('[data-cy="api-keys-heading"]')
      .should('be.visible')
      .should('have.text', 'Manage API keys');

    cy.get('[data-cy="api-keys-create-button"]')
      .should('be.visible')
      .contains('Create an API key')
      .click();

    cy.url().should('include', '/admin/api-keys/create');

    // Should display validation errors for blank name
    log(
      'Tech Support - create API key journey - checking validation errors for blank name',
    );
    cy.get('[data-cy="create-key-continue"]')
      .should('be.visible')
      .contains('Continue')
      .click();

    cy.get('[data-cy="create-key-error-banner-heading"]')
      .should('be.visible')
      .contains('There is a problem');

    cy.get('[data-cy="create-key-error-summary-list"]')
      .should('have.length', 1)
      .contains('Enter a key name');

    cy.get('[data-cy="create-key-input-validation-error-details"]')
      .should('be.visible')
      .should('have.text', 'Enter a key name');

    // Should display validation errors for empty space at start of name
    log(
      'Tech Support - create API key journey - checking validation errors empty space at start of name',
    );
    cy.get('[data-cy="create-key-input"]').clear().type(' api key name');

    cy.get('[data-cy="create-key-continue"]')
      .should('be.visible')
      .contains('Continue')
      .click();

    cy.get('[data-cy="create-key-error-banner-heading"]')
      .should('be.visible')
      .contains('There is a problem');

    cy.get('[data-cy="create-key-error-summary-list"]')
      .should('have.length', 1)
      .contains('Key name must not start with empty spaces');

    cy.get('[data-cy="create-key-input-validation-error-details"]')
      .should('be.visible')
      .should('have.text', 'Key name must not start with empty spaces');

    // Should display validation errors for empty space at the end of name
    log(
      'Tech Support - create API key journey - checking validation errors empty space at the end of name',
    );
    cy.get('[data-cy="create-key-input"]').clear().type('api key name ');

    cy.get('[data-cy="create-key-continue"]')
      .should('be.visible')
      .contains('Continue')
      .click();

    cy.get('[data-cy="create-key-error-banner-heading"]')
      .should('be.visible')
      .contains('There is a problem');

    cy.get('[data-cy="create-key-error-summary-list"]')
      .should('have.length', 1)
      .contains('Key name must not end with empty spaces');

    cy.get('[data-cy="create-key-input-validation-error-details"]')
      .should('be.visible')
      .should('have.text', 'Key name must not end with empty spaces');

    // Should successfully create key and display value
    log(
      'Tech Support - create API key journey - checking successful creation of API key',
    );
    cy.get('[data-cy="create-key-input"]').clear().type(apiKeyName);

    cy.get('[data-cy="create-key-continue"]')
      .should('be.visible')
      .contains('Continue')
      .click();

    cy.url().should('include', '/admin/api-keys/create');

    cy.get('[data-cy="new-key-heading"]')
      .should('be.visible')
      .should('have.text', 'New API key');

    cy.get('[data-cy="new-key-your-api-key"]')
      .should('be.visible')
      .should('have.text', 'Your API key:');

    cy.get('[data-cy="new-key-paragraph"]')
      .should('be.visible')
      .should(
        'have.text',
        'You should keep a copy of this API key somewhere safe.',
      );

    cy.get('[data-cy="new-key-paragraph-2"]')
      .should('be.visible')
      .should(
        'have.text',
        'When you leave this screen, you will not be able to see this API key again.',
      );

    cy.get('[data-cy="new-key-back-button"]')
      .should('be.visible')
      .contains('Back to your API keys')
      .click();

    cy.get('[data-cy="api-keys-heading"]')
      .should('be.visible')
      .should('have.text', 'Manage API keys');
  });

  it('Should render error page when trying to access super admin api keys and 404 when trying to access applicant, admin or superadmin dashboards', () => {
    log(
      'Tech Support Navigation - Checking super admin api keys page returns an error page',
    );
    cy.visit(`${BASE_URL}/find/api/admin/api-keys/manage`);

    cy.get('[data-cy="error-heading"]')
      .should('be.visible')
      .should('have.text', 'Something went wrong');

    cy.get('[data-cy="error-paragraph"]')
      .should('be.visible')
      .should(
        'have.text',
        'Something went wrong while trying to complete your request.',
      );

    cy.get('[data-cy="error-paragraph-with-link"]')
      .should('be.visible')
      .contains('You can return to the API dashboard to try again.');

    cy.get('[data-cy="error-back-link"]')
      .should('have.attr', 'href', '/find/api/admin/api-keys')
      .contains('return to the API dashboard')
      .click();

    cy.get('[data-cy="api-keys-heading"]')
      .should('be.visible')
      .should('have.text', 'Manage API keys');

    log(
      'Tech Support Navigation - Checking applicant, admin and super-admin dashboard returns 404',
    );
    [ADMIN_DASHBOARD_URL, SUPER_ADMIN_DASHBOARD_URL].forEach((page) => {
      cy.visit(page, { failOnStatusCode: false });
      cy.get('[data-cy="error-heading"]')
        .should('be.visible')
        .should('have.text', 'Something went wrong');

      cy.get('[data-cy="error-paragraph"]')
        .should('be.visible')
        .should(
          'have.text',
          'Something went wrong while trying to complete your request.',
        );
    });
  });
});
