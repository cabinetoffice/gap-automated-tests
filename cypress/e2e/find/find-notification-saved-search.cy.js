import {
  clickText,
  signInAsFindApplicant,
  signInToIntegrationSite,
  runAccessibility, // Added import for runAccessibility
} from '../../common/common';
import {
  checkSuccessBanner,
  convertDateToString,
  createSavedSearch,
} from './helper';

describe('Find a Grant - Saved Search Notifications', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    cy.task('setUpFindData');
    signInToIntegrationSite();
  });
  it('Can subscribe and unsubscribe a saved search notification', () => {
    cy.contains('Find a grant');
    // start saved search login journey
    cy.get('[data-cy="cySearchGrantsBtn"]').click();
    runAccessibility(); // Added after a page action
    cy.get('[data-cy="cy£5,000,000 plusCheckbox"]').click();
    cy.get('[data-cy="cyApplyFilter"]').click();
    runAccessibility(); // Added after filter changes the page
    cy.get('[data-cy="cySaveSearchLink"]').click();
    runAccessibility(); // Added after clicking save search which may change the page

    signInAsFindApplicant();
    runAccessibility(); // Added after signing in, which changes the page
    // capture date
    cy.wrap(Date.now()).as('subscribedDate');

    createSavedSearch('test saved search');
    runAccessibility(); // Added after creating a saved search
    checkSuccessBanner(
      '[data-cy="cyImportantBannerTitle"]',
      '[data-cy="cyImportantBannerBody"]',
      'Your saved search has been added.',
    );

    // assert date
    cy.get('@subscribedDate').then((subscribedDateTimestamp) => {
      const subscriptionDates = convertDateToString(subscribedDateTimestamp);
      cy.get('.govuk-table__body > .govuk-table__row > :nth-child(2)')
        .invoke('text')
        .should(
          'be.oneOf',
          subscriptionDates.map(
            (subscriptionDate) =>
              'You saved this search on ' + subscriptionDate,
          ),
        );
    });

    cy.get('[data-cy="cytest saved searchSavedSearchTableName"]').contains(
      'test saved search',
    );
    // unsubscribe
    cy.get('[data-cy="cytest saved searchDeleteLink"]').click();
    runAccessibility(); // Added after triggering an action that changes the page
    clickText('Yes, delete');
    runAccessibility(); // Added after confirming the deletion
    cy.get('[data-cy="cytest saved searchSavedSearchTableName"]').should(
      'not.exist',
    );
    runAccessibility(); // Consider adding here if the page content changes after deletion
    checkSuccessBanner(
      '#govuk-notification-banner-title',
      '[data-cy="cySubscribeSuccessMessageContent"]',
      'You have deleted the saved search called:  test saved search',
    );
  });
});
