import {
  runAccessibility,
  searchForGrant,
  signInToIntegrationSite,
} from '../../common/common';
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
    runAccessibility();

    cy.get('[data-cy="cyhomePageLink"]')
      .children('a')
      .should('have.text', 'Home')
      .click();
    runAccessibility();

    // browse grants and perform invalid search on home page(> 100 characters)
    cy.get('[data-cy="cyBrowseGrantsHomePageTextLink"]').click();
    runAccessibility();

    cy.get('[data-cy="cyhomePageLink"]')
      .children('a')
      .should('have.text', 'Home')
      .click();
    runAccessibility();

    // perform invalid search
    const invalidSearch = 'x'.repeat(101);
    cy.get('[data-cy="cyHomePageSearchInput"]').type(invalidSearch);
    runAccessibility();

    cy.get('[data-cy="cySearchGrantsBtn"]').click();
    runAccessibility();

    // assert the error banner is there and contains correct text
    cy.get('[data-cy="cyErrorBannerHeading"]').should(
      'have.text',
      'There is a problem',
    );
    runAccessibility();

    cy.get('[data-cy="cyError_searchAgainTermInput"]').should(
      'have.text',
      'Search term must be 100 characters or less',
    );
    runAccessibility();
  });

  it('can search for a grant', () => {
    const grantAdvertName = Cypress.env('testV1InternalGrant').advertName;
    searchForGrant(grantAdvertName);
    runAccessibility();

    const grantData = {
      Location: 'National',
      'Funding organisation': 'The Department of Business',
      'Who can apply': 'Personal / Individual',
      'How much you can get': 'From £1 to £10,000',
      'Total size of grant scheme': '£1 million',
      'Opening date': '24 August 2023, 12:01am',
      'Closing date': '24 October 2040, 11:59pm',
    };
    cy.contains('a', grantAdvertName)
      .parent()
      .parent()
      .within(() => {
        Object.entries(grantData).forEach(([key, value]) => {
          cy.contains(key);
          cy.contains(value);
        });
      });
  });

  it('can navigate through pagination and limit search term to < 100 characters', () => {
    cy.contains('Find a grant');
    runAccessibility();

    cy.get('[data-cy="cySearchGrantsBtn"]').click();
    runAccessibility();

    cy.get('[data-cy="cyGrantsFoundMessage"]').should(
      'not.contain.text',
      "We've found 0",
    );
    runAccessibility();

    countNumberOfPages();
    runAccessibility();

    cy.get('@pageCount').then((pageCount) => {
      clickThroughPagination(pageCount);
    });
    cy.get('[data-cy="cyPaginationPageNumber1"]').click();
    cy.url().should(
      'equal',
      `${Cypress.env(
        'applicationBaseUrl',
      )}/grants?searchTerm=&skip=0&limit=10&page=1`,
    );

    // perform invalid search
    const invalidSearch = 'x'.repeat(101);
    cy.get('[data-cy="cySearchAgainInput"]').type(invalidSearch);
    cy.get('[data-cy="cySearchAgainButton"]').click();
    runAccessibility();

    cy.get('[data-cy="cyErrorBanner"]').contains('h2', 'There is a problem');
    cy.get('[data-cy="cyError_searchAgainTermInput"]').contains(
      'a',
      'Search term must be 100 characters or less',
    );
    runAccessibility();

    cy.get('[data-cy="cySearchAgainInput"]').type(
      Cypress.env('testV1InternalGrant').advertName,
    );
    cy.get('[data-cy="cySearchAgainButton"]').click();
    runAccessibility();

    cy.get('[data-cy="cyGrantNameAndLink"]').should(
      'include.text',
      Cypress.env('testV1InternalGrant').advertName,
    );
  });
});
