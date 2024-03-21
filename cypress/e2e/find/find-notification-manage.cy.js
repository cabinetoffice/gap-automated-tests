import {
  checkForNoSavedSearchesOrNotifications,
  checkInfoScreen,
} from './helper';
import {
  clickText,
  signInAsFindApplicant,
  signInToIntegrationSite,
  runAccessibility,
} from '../../common/common';

describe('Find a Grant - Manage Notifications', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    cy.task('setUpFindData');
    signInToIntegrationSite();
  });
  it('can manage notifications through One Login when there are no notifications or saved searches', () => {
    // journey when not logged in
    cy.contains('Find a grant');
    cy.get('[data-cy="cyManageNotificationsHomeLink"]').click();
    checkInfoScreen(
      'Manage your notifications',
      'To manage your notifications, you need to sign in with GOV.UK One Login.',
      'If you do not have a GOV.UK One Login, you can create one.',
      'If you want to unsubscribe from notifications without creating a GOV.UK One Login, you can use the unsubscribe' +
        ' link in the emails we send to you.',
    );
    signInAsFindApplicant();
    runAccessibility();

    cy.get('[data-cy="cyManageYourNotificationsHeading"]').should(
      'have.text',
      'Manage your notifications and saved searches',
    );
    checkForNoSavedSearchesOrNotifications();

    cy.get('[data-cy="cySearch grantsPageLink"]').click();
    clickText('Back');
    runAccessibility();

    // journey when already logged in
    cy.get('[data-cy="cyManageNotificationsHomeLink"]').click();
    cy.get('[data-cy="cyManageYourNotificationsHeading"]').should(
      'have.text',
      'Manage your notifications and saved searches',
    );
    checkForNoSavedSearchesOrNotifications();
  });
});
