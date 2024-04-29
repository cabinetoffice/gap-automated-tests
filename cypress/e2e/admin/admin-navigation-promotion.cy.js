import {
  clickText,
  runAccessibility,
  selectActionForItemInTable,
  signInAsApplyApplicant,
  signInAsSuperAdmin,
  signInToIntegrationSite,
  signOut,
} from '../../common/common';

describe('Admin navigation', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
    runAccessibility();
  });

  it('Applicant promoted to admin can view the dashboard', () => {
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    runAccessibility();
    signInAsSuperAdmin();
    runAccessibility();
    cy.log('Promoting applicant account -> admin account');
    cy.get('[name=searchTerm]').type(Cypress.env('oneLoginApplicantEmail'));
    cy.get('[data-cy=cy-button-Search]').click();
    runAccessibility();
    selectActionForItemInTable(Cypress.env('oneLoginApplicantEmail'), 'Edit', {
      actionCellElement: 'td',
      textCellElement: 'td',
    });
    runAccessibility();
    selectActionForItemInTable('Roles', 'Change', {
      actionCellElement: 'dd',
      textCellElement: 'dt',
    });
    runAccessibility();
    cy.get('[data-cy=cy-checkbox-value-3]').check();
    runAccessibility();
    cy.log('Changing user roles');
    clickText('Change Roles');
    runAccessibility();
    cy.log('Adding a department');
    clickText('Cypress - Test Department');
    runAccessibility();
    clickText('Change department');
    runAccessibility();
    signOut();
    cy.log(
      'Super admin signed out -> logging in with newly promoted admin account',
    );
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsApplyApplicant();
    runAccessibility();
    cy.visit('/apply/admin/dashboard');
    cy.log('asserting on content within the admin dashboard');
    cy.contains('Manage a grant');
    cy.contains('You do not own or have editing permissions for any grants.');
    cy.contains('Add a grant');
  });
});
