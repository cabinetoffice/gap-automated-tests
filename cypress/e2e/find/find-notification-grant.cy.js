import {
  clickText,
  initialiseAccessibilityLogFile,
  runAccessibility,
  searchForGrant,
  signInAsFindApplicant,
  signInToIntegrationSite,
} from '../../common/common';
import {
  checkForNoSavedSearchesOrNotifications,
  checkInfoScreen,
  checkSuccessBanner,
  convertDateToString,
} from './helper';

describe('Find a Grant - Grant Notification', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyDataWithAds');
    cy.task('setUpFindData');
    signInToIntegrationSite();
    initialiseAccessibilityLogFile();
  });

  it('can subscribe and unsubscribe from updates for a SINGLE grant', () => {
    // --- UNAUTHENTICATED JOURNEY ---
    // go to home page
    cy.contains('Find a grant');

    const grantAdvertName = Cypress.env('testV1InternalGrant').advertName;
    // search for and view test grant advert
    searchForGrant(grantAdvertName);

    cy.get(`[id="${Cypress.env('testV1InternalGrant').advertName}"]`)
      .children('h2')
      .should('have.text', grantAdvertName)
      .click();
    runAccessibility();

    // click 'Sign up for updates' and continue to One Login
    clickText('Sign up for updates');

    checkInfoScreen(
      'Sign up for updates',
      'To sign up for updates, you need to sign in with GOV.UK One Login.',
    );

    signInAsFindApplicant();
    // capture date
    cy.wrap(Date.now()).as('subscribedDate1');

    // check success banner and notification has appeared
    checkSuccessBanner(
      '#govuk-notification-banner-title',
      '[data-cy="cyImportantBannerBody"]',
      'You have signed up for updates about',
    );

    cy.get(`[data-cy="cy${grantAdvertName}UnsubscriptionTableName"]`).should(
      'have.text',
      grantAdvertName,
    );

    cy.get('@subscribedDate1').then((subscribedDateTimestamp) => {
      const subscriptionDates = convertDateToString(subscribedDateTimestamp);

      cy.get(`[data-cy="cy${grantAdvertName}UnsubscriptionTableName"]`)
        .parent()
        .next()
        .invoke('text')
        .should(
          'be.oneOf',
          subscriptionDates.map(
            (subscriptionDate) =>
              'You signed up for updates on ' + subscriptionDate,
          ),
        );
    });

    // Cancel unsubscribe action
    clickText('Unsubscribe');
    cy.get('[data-cy="cyUnsubscribeGrantConfirmationPageTitle"]').should(
      'contain.text',
      'Are you sure you want to unsubscribe?',
    );
    clickText('Cancel');
    runAccessibility();

    // Unsubscribe from updates
    clickText('Unsubscribe');
    runAccessibility();
    cy.get('[data-cy="cyUnsubscribeConfirmationButton"]').click();

    // Check confirmation banner and that notification has been removed
    checkSuccessBanner(
      '#govuk-notification-banner-title',
      '[data-cy="cySubscribeSuccessMessageContent"]',
      'You have been unsubscribed from',
    );
    checkForNoSavedSearchesOrNotifications();

    // --- AUTHENTICATED JOURNEY ---
    // search for grant
    clickText('Search for grants');
    cy.get('[name="searchTerm"]').type(grantAdvertName);
    cy.get('[data-cy="cySearchAgainButton"]').click();
    runAccessibility();

    cy.get(`[id="${Cypress.env('testV1InternalGrant').advertName}"]`)
      .children('h2')
      .should('have.text', grantAdvertName)
      .click();
    runAccessibility();

    clickText('Sign up for updates');
    cy.wrap(Date.now()).as('subscribedDate2');

    checkSuccessBanner(
      '#govuk-notification-banner-title',
      '[data-cy="cySubscribeSuccessMessageContent"]',
      'You have signed up for updates about',
    );

    cy.get(`[data-cy="cy${grantAdvertName}UnsubscriptionTableName"]`).should(
      'have.text',
      grantAdvertName,
    );

    cy.get('@subscribedDate2').then((subscribedDateTimestamp) => {
      const subscriptionDates = convertDateToString(subscribedDateTimestamp);
      cy.get(`[data-cy="cy${grantAdvertName}UnsubscriptionTableName"]`)
        .parent()
        .next()
        .invoke('text')
        .should(
          'be.oneOf',
          subscriptionDates.map(
            (subscriptionDate) =>
              'You signed up for updates on ' + subscriptionDate,
          ),
        );
    });

    // Unsubscribe from updates
    clickText('Unsubscribe');
    cy.get('[data-cy="cyUnsubscribeConfirmationButton"]').click();

    // Check confirmation banner and that notification has been removed
    checkSuccessBanner(
      '#govuk-notification-banner-title',
      '[data-cy="cySubscribeSuccessMessageContent"]',
      'You have been unsubscribed from',
    );
    checkForNoSavedSearchesOrNotifications();
  });
});
