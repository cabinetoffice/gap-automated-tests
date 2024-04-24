import {
  downloadFileFromLink,
  log,
  runAccessibility,
  signInAsAdmin,
  signInToIntegrationSite,
} from '../../common/common';
import { GRANT_NAME } from './constants';
import { applicationForm, createGrant, validatePreview } from './helper';

describe('Create a Grant', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
    runAccessibility();
  });

  it('View scheme details of grant with application form and no advert', () => {
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    runAccessibility();
    signInAsAdmin();
    runAccessibility();
    log('View scheme details with no advert journey - creating grant');
    createGrant(GRANT_NAME + ' no advert');
    runAccessibility();

    // create application form
    log(
      'View scheme details with no advert journey - creating application form',
    );
    applicationForm();
    runAccessibility();

    // view scheme details
    cy.get('[data-cy=cy_publishSuccess-manageThisGrant-button]').click();
    runAccessibility();

    cy.contains('Send feedback').click();
    runAccessibility();

    cy.contains('Grant application form');
    cy.contains('View submitted applications');
    cy.contains(GRANT_NAME + ' no advert');

    log('View scheme details with no advert journey - validating preview');
    cy.contains('a', 'Cypress - Grant Application').click();
    runAccessibility();

    validatePreview();

    log('View scheme details with no advert journey - validating odt download');
    downloadFileFromLink(
      cy.contains('a', 'Download an overview (ODT)'),
      'application.odt',
    );
  });
});
