import {
  signInToIntegrationSite,
  clickSave,
  signInAsApplyApplicant,
  log,
  ADMIN_DASHBOARD_URL,
  SUPER_ADMIN_DASHBOARD_URL,
} from '../../common/common';

describe('Apply for a Grant', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
  });

  it('can land on application dashboard and view details', () => {
    cy.get('[data-cy=cySignInAndApply-Link]').click();

    log('Apply Dashboard & Profile - Signing in as applicant');
    signInAsApplyApplicant();

    log('Apply Dashboard & Profile - Viewing profile');
    cy.contains('Your saved information').click();

    log('Apply Dashboard & Profile - Editing name');
    cy.get(
      '[data-cy=cy-organisation-details-navigation-organisationName]',
    ).click();
    cy.get('[data-cy=cy-legalName-text-input]').type('Organisation Name');
    clickSave();
    cy.get('[data-cy=cy-organisation-value-Name]').should(
      'have.text',
      'Organisation Name',
    );

    log('Apply Dashboard & Profile - Editing address');
    const addressData = [
      'Address line 1',
      'Address line 2',
      'Town',
      'County',
      'Postcode',
    ];
    cy.get(
      '[data-cy=cy-organisation-details-navigation-organisationAddress]',
    ).click();
    cy.get('[data-cy=cy-addressLine1-text-input]').type(addressData[0]);
    cy.get('[data-cy=cy-addressLine2-text-input]').type(addressData[1]);
    cy.get('[data-cy=cy-town-text-input').type(addressData[2]);
    cy.get('[data-cy=cy-county-text-input').type(addressData[3]);
    cy.get('[data-cy=cy-postcode-text-input').type(addressData[4]);
    clickSave();
    cy.get('[data-cy=cy-organisation-value-Address]')
      .find('ul')
      .children('li')
      .each((listItem, index) => {
        cy.wrap(listItem).should(
          'have.text',
          addressData[index] + (index < 4 ? ',' : ''),
        );
      });

    log('Apply Dashboard & Profile - Editing org type');
    cy.get(
      '[data-cy=cy-organisation-details-navigation-organisationType]',
    ).click();
    cy.get('[data-cy=cy-radioInput-option-Other]').click();
    cy.get('[data-cy=cy-radioInput-option-IAmApplyingAsAnIndividual]').click();
    cy.get('[data-cy=cy-radioInput-option-Charity]').click();
    cy.get('[data-cy=cy-radioInput-option-NonLimitedCompany]').click();
    cy.get('[data-cy=cy-radioInput-option-LimitedCompany]').click();
    clickSave();
    cy.contains('Limited company').should('exist');

    log('Apply Dashboard & Profile - Editing Companies House number');
    cy.get(
      '[data-cy=cy-organisation-details-navigation-organisationCompaniesHouseNumber]',
    ).click();
    cy.get('[data-cy=cy-companiesHouseNumber-text-input]').type('01234');
    clickSave();
    cy.contains('01234').should('exist');

    log('Apply Dashboard & Profile - Editing Charity Commission number');
    cy.get(
      '[data-cy=cy-organisation-details-navigation-organisationCharity]',
    ).click();
    cy.get('[data-cy=cy-charityCommissionNumber-text-input]').type('56789');
    clickSave();
    cy.contains('56789').should('exist');

    log('Apply Dashboard & Profile - Returning to dashboard');
    cy.contains('Back to my account').click();

    cy.get('[data-cy=cy-find-a-grant-link').click();
    cy.get('[data-cy=cyHomePageTitle]').should('have.text', 'Find a grant');
    cy.go('back');

    log(
      'Apply Dashboard & Profile - Checking admin and super-admin dashboard returns 404',
    );
    [ADMIN_DASHBOARD_URL, SUPER_ADMIN_DASHBOARD_URL].forEach((page) => {
      cy.visit(page, { failOnStatusCode: false })
        .contains('Page not found')
        .should('exist');
      cy.go('back');
    });

    log('Apply Dashboard & Profile - Editing One Login details');
    cy.contains('Your sign in details').click();

    // TODO reenable click when MFA strategy is defined
    cy.contains('Change your sign in details in your GOV.UK One Login');
    // .click();

    // cy.origin(Cypress.env('oneLoginBaseUrl'), () => {
    //   cy.contains("Enter the 6 digit security code");
    // });
  });
});
