import {
  signInToIntegrationSite,
  searchForGrant,
  signInAsApplyApplicant,
  log,
} from '../../common/common';

describe('Apply for a Grant', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyDataWithAds');
    signInToIntegrationSite();
  });

  it('Can complete V1 External grant journey', () => {
    // Sign in
    log('Apply V1 External Grant - Signing in as applicant');
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();

    // Search & Start external application
    log('Apply V1 External Grant - Searching for grant');
    cy.get('[data-cy="cy-find-a-grant-link"]').click();
    searchForGrant(Cypress.env('testV1ExternalGrant').advertName);
    cy.contains(Cypress.env('testV1ExternalGrant').advertName).click();
    cy.contains('Start new application').invoke('removeAttr', 'target').click();
  });
});
