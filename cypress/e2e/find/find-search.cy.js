import { searchForGrant, signInToIntegrationSite } from '../../common/common';
import { clickThroughPagination, countNumberOfPages } from './helper';

describe('Find a Grant - Search', () => {
  before(() => {
    cy.task('setUpApplyDataWithAds');
  });

  beforeEach(() => {
    signInToIntegrationSite();
  });

  it('Interacts with the home page and enters a search term > 100 characters', () => {
    cy.contains('Find a grant');

    cy.get('[data-cy="cyhomePageLink"]')
      .children('a')
      .should('have.text', 'Home')
      .click();

    // browse grants and perform invalid search on home page(> 100 characters)
    cy.get('[data-cy="cyBrowseGrantsHomePageTextLink"]').click();

    cy.get('[data-cy="cyhomePageLink"]')
      .children('a')
      .should('have.text', 'Home')
      .click();

    // perform invalid search
    const invalidSearch = 'x'.repeat(101);
    cy.get('[data-cy="cyHomePageSearchInput"]').click().type(invalidSearch);

    cy.get('[data-cy="cySearchGrantsBtn"]').click();

    // assert the error banner is there and contains correct text
    cy.get('[data-cy="cyErrorBannerHeading"]').should(
      'have.text',
      'There is a problem',
    );

    cy.get('[data-cy="cyError_searchAgainTermInput"]').should(
      'have.text',
      'Search term must be 100 characters or less',
    );
  });

  it('can search for a grant', () => {
    searchForGrant(Cypress.env('testV1InternalGrant').advertName);

    cy.contains(Cypress.env('testV1InternalGrant').advertName);

    const grantData = {
      Location: 'National',
      'Funding organisation': 'The Department of Business',
      'Who can apply': 'Personal / Individual',
      'How much you can get': 'From £1 to £10,000',
      'Total size of grant scheme': '£1 million',
      'Opening date': '24 August 2023, 12:01am',
      'Closing date': '24 October 2040, 11:59pm',
    };
    Object.entries(grantData).forEach(([key, value]) => {
      const elementId = `#${Cypress.env('testV1InternalGrant').advertName}`;
      cy.get(elementId).contains(key);
      cy.get(elementId).contains(value);
    });
  });

  it('can navigate through pagination and limit search term to < 100 characters', () => {
    cy.contains('Find a grant');

    cy.get('[data-cy="cySearchGrantsBtn"]').click();

    cy.get('[data-cy="cyGrantsFoundMessage"]').should(
      'not.contain.text',
      "We've found 0",
    );

    countNumberOfPages();

    cy.get('@pageCount').then((pageCount) => {
      clickThroughPagination(pageCount);
    });
    cy.get('[data-cy="cyPaginationPageNumber1"]').click();

    // perform invalid search
    const invalidSearch = 'x'.repeat(101);
    cy.get('[data-cy="cySearchAgainInput"]').click().type(invalidSearch);
    cy.get('[data-cy="cySearchAgainButton"]').click();

    cy.get('[data-cy="cyErrorBanner"]').contains('h2', 'There is a problem');
    cy.get('[data-cy="cyError_searchAgainTermInput"]').contains(
      'a',
      'Search term must be 100 characters or less',
    );

    cy.get('[data-cy="cySearchAgainInput"]')
      .click()
      .type(Cypress.env('testV1InternalGrant').advertName);
    cy.get('[data-cy="cySearchAgainButton"]').click();

    cy.get('[data-cy="cyGrantNameAndLink"]').should(
      'include.text',
      Cypress.env('testV1InternalGrant').advertName,
    );
  });
});
