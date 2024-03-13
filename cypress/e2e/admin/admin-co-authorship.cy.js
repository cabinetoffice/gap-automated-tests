import {
  signInAsAdmin,
  signInAsSuperAdmin,
  signInToIntegrationSite,
  signOut,
} from '../../common/common';

describe('Admin co-authorship', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
  });

  it('manages editors', () => {
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsSuperAdmin();
    cy.contains('a', 'Admin dashboard').click();
    cy.contains('Grants you own').should('not.exist');
    cy.contains('Grants you can edit');

    cy.contains('a', Cypress.env('testV2InternalGrant').schemeName).click();
    cy.contains('a', 'View editors').click();
    cy.contains('a', 'Add an editor').should('not.exist');
    cy.contains('a', 'Remove').should('not.exist');
    cy.get('.govuk-summary-list').children().should('have.length', 3);
    signOut();

    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsAdmin();
    cy.contains('Grants you own');
    cy.contains('Grants you can edit').should('not.exist');

    cy.contains('a', Cypress.env('testV2InternalGrant').schemeName).click();
    cy.contains('a', 'Add or manage editors').click();
    cy.get('.govuk-summary-list').children().should('have.length', 3);

    cy.contains('a', 'Remove').click();
    cy.contains('button', 'Remove editor').click();
    cy.get('.govuk-summary-list').children().should('have.length', 2);
    signOut();

    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsSuperAdmin();
    cy.contains('a', 'Admin dashboard').click();
    cy.contains('Grants you own').should('not.exist');
    cy.contains('Grants you can edit');
    cy.contains('a', Cypress.env('testV2InternalGrant').schemeName).should(
      'not.exist',
    );
    signOut();

    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsAdmin();
    cy.contains('Grants you own');
    cy.contains('Grants you can edit').should('not.exist');

    cy.contains('a', Cypress.env('testV2InternalGrant').schemeName).click();
    cy.contains('a', 'Add or manage editors').click();
    cy.get('.govuk-summary-list').children().should('have.length', 2);

    cy.contains('a', 'Add an editor').click();
    cy.get('[data-cy="cy-editorEmailAddress-text-input"]').type(
      Cypress.env('oneLoginApplicantEmail'),
    );
    cy.contains('button', 'Confirm').click();
    cy.contains("This account does not have an 'Administrator' account.");
    cy.get('[data-cy="cy-editorEmailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-editorEmailAddress-text-input"]').type(
      'Not a real email',
    );
    cy.contains('button', 'Confirm').click();
    cy.contains('Input a valid email address');
    cy.get('[data-cy="cy-editorEmailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-editorEmailAddress-text-input"]').type(
      Cypress.env('oneLoginSuperAdminEmail'),
    );
    cy.contains('button', 'Confirm').click();
    cy.get('.govuk-summary-list').children().should('have.length', 3);
    signOut();

    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsSuperAdmin();
    cy.contains('a', 'Admin dashboard').click();
    cy.contains('Grants you own').should('not.exist');
    cy.contains('Grants you can edit');
    cy.contains('a', Cypress.env('testV2InternalGrant').schemeName);
  });
});
