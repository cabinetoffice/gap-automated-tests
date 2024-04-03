import {
  downloadFileFromLink,
  log,
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
  });

  it('View scheme details of grant with application form and no advert', () => {
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsAdmin();
    log('View scheme details with no advert journey - creating grant');
    createGrant(GRANT_NAME + ' no advert');

    // create application form
    log(
      'View scheme details with no advert journey - creating application form',
    );
    applicationForm();

    // view scheme details
    cy.get('[data-cy=cy_publishSuccess-manageThisGrant-button]').click();

    cy.contains('Send feedback').click();

    cy.contains('Grant application form');
    cy.contains('View submitted applications');
    cy.contains(GRANT_NAME + ' no advert');

    log('View scheme details with no advert journey - validating preview');
    cy.contains('a', 'Cypress - Grant Application').click();

    validatePreview();

    log('View scheme details with no advert journey - validating odt download');
    downloadFileFromLink(
      cy.contains('a', 'Download an overview (ODT)'),
      'application.odt',
    );
  });
});
