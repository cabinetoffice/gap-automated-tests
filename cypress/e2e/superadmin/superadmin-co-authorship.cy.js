import {
  clickBack,
  log,
  runAccessibility,
  selectActionForItemInTable,
  signInAsSuperAdmin,
  signInToIntegrationSite,
} from '../../common/common';

describe('Super Admin', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
  });

  it('prevents users being deleted or demoted if they own grants', () => {
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    runAccessibility();

    log('Super Admin Change Grant Ownership - Signing in as super admin');
    signInAsSuperAdmin();
    runAccessibility();

    log(
      'Super Admin Change Grant Ownership - Entering admin email in search box',
    );
    cy.get('[name=searchTerm]').type(Cypress.env('oneLoginAdminEmail'));
    runAccessibility();

    log('Super Admin Change Grant Ownership - Clicking search button');
    cy.get('[data-cy=cy-button-Search]').click();
    runAccessibility();

    log('Super Admin Change Grant Ownership - Clicking edit on admin user');
    runAccessibility();

    selectActionForItemInTable(Cypress.env('oneLoginAdminEmail'), 'Edit', {
      textCellElement: 'td',
      actionCellElement: 'td',
      actionCellType: 'a',
    });

    cy.contains('button', 'Delete user').should('be.disabled');
    runAccessibility();

    cy.contains('div', 'Roles')
      .parent()
      .parent()
      .within(() => {
        cy.get('dd a').contains('Change').click();
      });
    cy.get('[data-cy="cy-checkbox-value-3"]').should('be.disabled');
    clickBack();
    runAccessibility();
  });
});
