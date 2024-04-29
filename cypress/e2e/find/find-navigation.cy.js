import { runAccessibility, signInToIntegrationSite } from '../../common/common';

describe('Find a Grant - Navigation', () => {
  beforeEach(() => {
    signInToIntegrationSite();
  });

  it('loads the page', () => {
    cy.contains('Find a grant');
    runAccessibility();
  });

  it('Can navigate to information pages', () => {
    cy.contains('Find a grant');
    runAccessibility();

    // navigates to about us menu
    cy.get('[data-cy="cyaboutGrantsPageLink"]').click();
    runAccessibility();

    cy.get('[data-cy="cyAbout usTitle"]').should('have.text', 'About us');
    runAccessibility();
  });
});
