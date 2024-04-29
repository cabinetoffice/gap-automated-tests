import {
  log,
  runAccessibility,
  signInAsTechnicalSupport,
  signInToIntegrationSite,
} from '../../common/common';

const today = new Date().toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const firstUserId = Cypress.env('firstUserId');
const existingApiKeyName = `CypressE2ETestTechSupport001${firstUserId}`;
describe('API Admin - Existing API Keys', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('deleteAPIKeysFromAwsForTechSupport');
    cy.task('setUpApplyData');
    cy.task('createApiKeysInApiGatewayForTechnicalSupport');
    signInToIntegrationSite();
    runAccessibility();

    cy.get('[data-cy=cySignInAndApply-Link]').click();
    runAccessibility();
    log('Technical Support User - Signing in');
    signInAsTechnicalSupport();
    runAccessibility();
  });

  it('Should render API key dashboard with list of API keys and prevent creation of a key with duplicate name', () => {
    // View existing API Keys
    log(
      'Tech Support - existing API key journey - checking API dashboard has existing API keys',
    );
    cy.get('[data-cy="api-keys-heading"]')
      .should('be.visible')
      .should('have.text', 'Manage API keys');

    cy.get('[data-cy="api-keys-department"]')
      .should('be.visible')
      .contains('Department');

    cy.get('[data-cy="api-keys-department-name"]')
      .should('be.visible')
      .contains('Cypress - Test Department');

    cy.get('[data-cy="create-key-summary-list"]')
      .children()
      .should('have.length', 1);

    cy.get(`[data-cy="api-key-name-${existingApiKeyName}"]`)
      .should('be.visible')
      .should('have.text', existingApiKeyName);

    cy.get(`[data-cy="api-key-created-date-${existingApiKeyName}"]`)
      .should('be.visible')
      .should('have.text', 'Created ' + today);

    cy.get(`[data-cy="api-key-revoke-${existingApiKeyName}"]`)
      .should('be.visible')
      .contains('Revoke');

    cy.get('[data-cy="api-keys-create-button"]')
      .should('be.visible')
      .contains('Create an API key');

    // Should display validation errors for existing API key name
    log(
      'Tech Support - existing API key journey - checking validation errors for existing API key name',
    );
    cy.get('[data-cy="api-keys-create-button"]')
      .should('be.visible')
      .contains('Create an API key')
      .click();
    runAccessibility();

    cy.get('[data-cy="create-key-input"]').type(existingApiKeyName);

    cy.get('[data-cy="create-key-continue"]')
      .should('be.visible')
      .contains('Continue')
      .click();
    runAccessibility();

    cy.get('[data-cy="create-key-error-banner-heading"]')
      .should('be.visible')
      .contains('There is a problem');

    cy.get('[data-cy="create-key-error-summary-list"]')
      .should('have.length', 1)
      .contains('An API key with this name already exists');

    cy.get('[data-cy="create-key-input-validation-error-details"]')
      .should('be.visible')
      .should('have.text', 'An API key with this name already exists');

    cy.get('[data-cy="create-key-back-button"]')
      .should('be.visible')
      .should('have.text', 'Back')
      .click();
    runAccessibility();
  });

  it('Should render API key confirmation page and revoke API key', () => {
    log('Tech Support - revoke API key journey - beginning API key revocation');
    cy.get(`[data-cy="api-key-revoke-${existingApiKeyName}"]`)
      .should('be.visible')
      .contains('Revoke')
      .click();
    runAccessibility();

    cy.get('[data-cy="revoke-heading"]')
      .should('be.visible')
      .should('have.text', 'Revoke an API key');

    cy.get('[data-cy="revoke-paragraph-1"]')
      .should('be.visible')
      .contains(
        'If you revoke this API key, you will no longer be able to use it to request data from Find a grant.',
      );

    cy.get('[data-cy="revoke-paragraph-2"]')
      .should('be.visible')
      .contains(
        'You cannot re-enable a revoked API key. If you want to request data again, you will need to create a new API key.',
      );

    cy.get('[data-cy="revoke-revoke-button"]')
      .should('be.visible')
      .should('have.text', 'Revoke key');

    cy.get('[data-cy="revoke-cancel-button"]')
      .should('be.visible')
      .should('have.text', 'Cancel')
      .click();
    runAccessibility();

    cy.get(`[data-cy="api-key-revoke-${existingApiKeyName}"]`)
      .should('be.visible')
      .contains('Revoke')
      .click();
    runAccessibility();

    log(
      'Tech Support - revoke API key journey - checking API key has been revoked',
    );
    cy.get('[data-cy="revoke-revoke-button"]')
      .should('be.visible')
      .should('have.text', 'Revoke key')
      .click();
    runAccessibility();

    cy.get('[data-cy="create-key-summary-list"]')
      .children()
      .should('have.length', 1);

    cy.get(`[data-cy="api-key-name-${existingApiKeyName}"]`)
      .should('be.visible')
      .should('have.text', existingApiKeyName);

    cy.get(`[data-cy="api-key-created-date-${existingApiKeyName}"]`)
      .should('be.visible')
      .should('have.text', 'Created ' + today);

    cy.get(`[data-cy="api-key-revoked-${existingApiKeyName}"]`)
      .should('be.visible')
      .should('have.text', 'Revoked ' + today);
  });
});
