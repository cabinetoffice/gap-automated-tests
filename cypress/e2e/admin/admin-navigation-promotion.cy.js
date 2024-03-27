import {
  clickText,
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
  });

  it('Applicant promoted to admin can view the dashboard', () => {
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsSuperAdmin();
    cy.log('Promoting applicant account -> admin account');
    cy.get('[name=searchTerm]').type(Cypress.env('oneLoginApplicantEmail'));
    cy.get('[data-cy=cy-button-Search]').click();
    selectActionForItemInTable(Cypress.env('oneLoginApplicantEmail'), 'Edit', {
      actionCellElement: 'td',
      textCellElement: 'td',
    });
    selectActionForItemInTable('Roles', 'Change', {
      actionCellElement: 'dd',
      textCellElement: 'dt',
    });
    cy.get('[data-cy=cy-checkbox-value-3]').check();
    cy.log('Changing user roles');
    clickText('Change Roles');
    cy.log('Adding a department');
    clickText('Cypress - Test Department');
    clickText('Change department');
    signOut();
    cy.log(
      'Super admin signed out -> logging in with newly promoted admin account',
    );
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsApplyApplicant();
    cy.visit('/apply/admin/dashboard');
    cy.log('asserting on content within the admin dashboard');
    cy.contains('Manage a grant');
    cy.contains('You do not own or have editing permissions for any grants.');
    cy.contains('Add a grant');
  });
});
