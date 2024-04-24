import {
  clickText,
  log,
  runAccessibility,
  selectActionForItemInTable,
  signInAsSuperAdmin,
  signInToIntegrationSite,
  validateActionForItemInTable,
} from '../../common/common';
import { TEST_V1_INTERNAL_GRANT } from '../../common/constants';

describe('Super Admin', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
  });

  it('Can change grant ownership', () => {
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    runAccessibility();

    log('Super Admin Change Grant Ownership - Signing in as super admin');
    signInAsSuperAdmin();
    runAccessibility();

    log(
      'Super Admin Change Grant Ownership - Entering admin email in search box',
    );
    cy.get('[name=searchTerm]').type(Cypress.env('oneLoginAdminEmail'));

    log('Super Admin Change Grant Ownership - Clicking search button');
    cy.get('[data-cy=cy-button-Search]').click();
    runAccessibility();

    log('Super Admin Change Grant Ownership - Clicking edit on admin user');

    selectActionForItemInTable(Cypress.env('oneLoginAdminEmail'), 'Edit', {
      actionCellElement: 'td',
      textCellElement: 'td',
    });

    log('Super Admin Change Grant Ownership - Clicking change on first grant');
    selectActionForItemInTable(
      TEST_V1_INTERNAL_GRANT.schemeName,
      'Change owner',
    );

    log(
      'Super Admin Change Grant Ownership - Entering an email address not registered in the system',
    );
    cy.get('[data-cy="cy-emailAddress-text-input"]').type('blah@blah.com');

    log('Super Admin Change Grant Ownership - Clicking continue');
    clickText('Confirm');
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains('Email address does not belong to an admin user');

    log(
      'Super Admin Change Grant Ownership - Entering a non-admin email address',
    );
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type(
      Cypress.env('oneLoginApplicantEmail'),
    );

    log('Super Admin Change Grant Ownership - Clicking continue');
    clickText('Confirm');
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains('Email address does not belong to an admin user');

    log(
      'Super Admin Change Grant Ownership - Entering an invalid email address',
    );
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type('blah');

    log('Super Admin Change Grant Ownership - Clicking continue');
    clickText('Confirm');
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains('Please enter a valid email address');

    log(
      "Super Admin Change Grant Ownership - Entering the admin's email address",
    );
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type(
      Cypress.env('oneLoginAdminEmail'),
    );

    log('Super Admin Change Grant Ownership - Clicking continue');
    clickText('Confirm');
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains('This user already owns this grant');

    log(
      "Super Admin Change Grant Ownership - Entering the super admin's email address",
    );
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type(
      Cypress.env('oneLoginSuperAdminEmail'),
    );

    log('Super Admin Change Grant Ownership - Clicking continue');
    clickText('Confirm');

    log('Super Admin Change Grant Ownership - Clicking confirm');
    clickText('Confirm transfer');

    log('Super Admin Change Grant Ownership - Hitting back button');
    cy.get('[data-cy="cy-back-button"]').click();
    runAccessibility();

    log(
      'Super Admin Change Grant Ownership - Entering super admin email in search box',
    );
    cy.get('[name=searchTerm]').type(Cypress.env('oneLoginSuperAdminEmail'));

    cy.get('[data-cy=cy-button-Search]').click();
    runAccessibility();

    log(
      'Super Admin Change Grant Ownership - Clicking edit on super admin user',
    );

    selectActionForItemInTable(Cypress.env('oneLoginSuperAdminEmail'), 'Edit', {
      actionCellElement: 'td',
      textCellElement: 'td',
    });

    log(
      'Super Admin Change Grant Ownership - Verifying that the grant appears in the list',
    );
    validateActionForItemInTable(
      TEST_V1_INTERNAL_GRANT.schemeName,
      'Change owner',
    );

    log('Super Admin Change Grant Ownership - Navigate to admin dashboard');
    cy.get('[data-cy="cy-back-button"]').click();
    cy.get('[data-cy="cyadminDashPageLink"] > .govuk-link').click();
    runAccessibility();

    log(
      'Super Admin Change Grant Ownership - Checking grant shows in admin dashboard',
    );
    cy.get('[data-cy="cy_table_row"] > :nth-child(1)').should(
      'contain.text',
      'Cypress - Test Scheme V1',
    );
  });
});
