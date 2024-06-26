import {
  clickBack,
  log,
  navigateToSpecificUser,
  runAccessibility,
  signInAsApplyApplicant,
  signInAsSuperAdmin,
  signInToIntegrationSite,
} from '../../common/common';

describe('Super Admin', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
  });

  it('Can manage roles', () => {
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    log('Super Admin Manage Roles - Signing in as super admin');
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env('oneLoginAdminEmail'));

    log('Super Admin Manage Roles - Navigate to role selection');
    cy.get(
      ':nth-child(3) > .govuk-summary-list__actions > .govuk-link',
    ).click();
    runAccessibility();

    log(
      'Super admin manage roles - check that user with grant ownership CANNOT be demoted (copy text also appears)',
    );
    cy.contains(
      'While this user owns grants, you cannot demote them to an applicant or delete their account. You must transfer those grants to another owner first.',
    );
    cy.get('[data-cy="cy-checkbox-value-3"]').should('be.disabled');

    log('Navigate back to user page');
    cy.get('.govuk-back-link').click();
    runAccessibility();

    log('Super admin manage roles - Delete schemes and reload page');
    cy.task('deleteSchemes');
    cy.reload();

    log('Super Admin Manage Roles - Navigate to role selection');
    cy.get(
      ':nth-child(3) > .govuk-summary-list__actions > .govuk-link',
    ).click();
    runAccessibility();

    log('Super Admin Manage Roles - Unchecking admin role');
    cy.get('[data-cy="cy-checkbox-value-3"]').click();
    runAccessibility();

    log('Super Admin Manage Roles - Clicking change roles');
    cy.get('.govuk-button').contains('Change Roles').click();
    runAccessibility();

    log(
      'Super Admin Manage Roles - Verifying that the user is now an applicant',
    );
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains('Applicant');

    clickBack();
    runAccessibility();

    navigateToSpecificUser(Cypress.env('oneLoginApplicantEmail'));

    log('Super Admin Manage Roles - Adding super admin role');
    cy.get(
      ':nth-child(3) > .govuk-summary-list__actions > .govuk-link',
    ).click();
    cy.get('[data-cy="cy-checkbox-value-4"]').click();
    cy.get('.govuk-button').contains('Change Roles').click();
    runAccessibility();

    log('Super Admin Manage Roles - Giving a department');
    cy.get('[data-cy="cy-radioInput-label-CypressTestDepartment"]')
      .first()
      .click();
    cy.get('.govuk-button').contains('Change department').click();
    runAccessibility();

    log('Super Admin Manage Roles - Signing out');
    cy.get('[data-cy="cy_SignOutLink"]').click();
    runAccessibility();

    log('Super Admin Manage Roles - Signing in as applicant');
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    runAccessibility();
    signInAsApplyApplicant();
    runAccessibility();
    cy.visit('/apply/admin/super-admin-dashboard');

    log('Super Admin Manage Roles - Expecting to land on super admin dashbard');
    cy.contains('Manage users');
  });
});
