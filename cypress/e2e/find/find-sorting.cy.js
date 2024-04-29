import {
  log,
  runAccessibility,
  searchForGrant,
  signInToIntegrationSite,
} from '../../common/common';

describe('Sort search results', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyDataWithAds');
    cy.task('setUpFindData');

    signInToIntegrationSite();
  });

  it('can sort by each type', () => {
    cy.contains('Find a grant');
    runAccessibility();

    searchForGrant(Cypress.env('testV2InternalGrant').advertName);
    cy.contains(Cypress.env('testV2InternalGrant').advertName);
    runAccessibility();

    log('Find Sorting - Opening date sort');
    runAccessibility();

    cy.get('.govuk-select').contains('Opening date').click();
    cy.get('#combo-0').contains('Opening date').click({ force: true });
    runAccessibility();

    cy.get('.grants_list')
      .children('li')
      .first()
      .should('include.text', Cypress.env('testV2InternalGrant').advertName);

    log('Find Sorting - Closing date sort');
    runAccessibility();

    cy.get('.govuk-select').contains('Opening date').click();
    cy.get('#combo-1').contains('Closing date').click({ force: true });
    runAccessibility();

    cy.get('.grants_list')
      .children('li')
      .first()
      .should('include.text', Cypress.env('testV2InternalGrant').advertName);

    log('Find Sorting - High to low sort');
    runAccessibility();

    cy.get('.govuk-select').contains('Closing date').click();
    cy.get('#combo-2')
      .contains('Grant value: High to low')
      .click({ force: true });
    runAccessibility();

    cy.get('.grants_list')
      .children('li')
      .first()
      .should('include.text', Cypress.env('testV2InternalGrant').advertName);
    runAccessibility();

    log('Find Sorting - Low to high sort');
    runAccessibility();

    cy.get('.govuk-select').contains('Grant value: High to low').click();
    cy.get('#combo-3')
      .contains('Grant value: Low to high')
      .click({ force: true });
    runAccessibility();

    // 'Low to high' sorts by minimum value, and lots of grants start at £1 minimum.
    // This means the precise the grant we want may not be at the top of the list.
    // Instead verify that the first grant is at least one with the minimum possible value.
    cy.get('.grants_list').children('li').first().should('include.text', '£1');
  });
});
