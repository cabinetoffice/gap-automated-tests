import {
  clickBack,
  clickContinue,
  clickText,
  log,
  runAccessibility,
  saveAndExit,
  signInAsAdmin,
  signInToIntegrationSite,
} from '../../common/common';
import { GRANT_NAME, TASKS } from './constants';
import {
  advertSection1,
  advertSection2,
  advertSection3,
  advertSection4,
  advertSection5,
  createGrant,
  publishAdvert,
  publishApplication,
  publishApplicationForm,
  searchForAGrant,
} from './helper';

import {
  fillMqFunding,
  fillMqOrgQuestionsAsLimitedCompany,
} from '../../common/apply-helper';
import { MQ_DETAILS } from '../../common/constants';

const { REMOVE_ADVERT_BY_NAME } = TASKS;

describe('Create a Grant', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
    runAccessibility();
  });

  it('Admin can create a new Grant with Advert and Application Form', async () => {
    cy.task(REMOVE_ADVERT_BY_NAME, GRANT_NAME);
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    log('Admin grant creation journey - Signing in as admin');
    signInAsAdmin();
    runAccessibility();
    log('Admin grant creation journey - creating Grant');
    createGrant(GRANT_NAME);
    runAccessibility();

    // create advert
    log(
      'Scheme details with an in progress advert journey - creating Advert Section 1',
    );
    advertSection1(GRANT_NAME);
    log(
      'Scheme details with an in progress advert journey - creating Advert Section 2',
    );
    runAccessibility();
    advertSection2();

    log(
      'Scheme details with an in progress advert journey - exiting advert creation',
    );
    // exit advert creation
    cy.get('[data-cy="cy-exit"]').click();
    runAccessibility();

    cy.get('[data-cy="cyViewOrChangeYourAdvert-link"]').click();
    runAccessibility();

    log(
      'Scheme details with an in progress advert journey - creating Advert Section 3',
    );
    advertSection3(true);
    log(
      'Scheme details with an in progress advert journey - creating Advert Section 4',
    );
    advertSection4();
    log(
      'Scheme details with an in progress advert journey - creating Advert Section 5',
    );
    advertSection5();

    log(
      'Scheme details with an in progress advert journey - publishing advert',
    );
    publishAdvert(GRANT_NAME, true);

    log(
      'Scheme details with an in progress advert journey - submitting feedback form',
    );
    cy.contains('Send feedback').click();
    runAccessibility();

    log(
      'Scheme details with an in progress advert journey - Changing from scheduled to published',
    );
    cy.get('[data-cy="cyViewOrChangeYourAdvert-link"]').click();
    runAccessibility();
    cy.get('[data-cy="cy-unschedule-advert-button"]').click();
    runAccessibility();
    cy.get('[data-cy="cy-radioInput-option-YesUnscheduleMyAdvert"]').click();
    runAccessibility();
    cy.get('[data-cy="cy_unscheduleConfirmation-ConfirmButton"]').click();
    runAccessibility();
    advertSection3(false);
    runAccessibility();
    publishAdvert(GRANT_NAME, false);

    cy.contains('Very satisfied').click();
    runAccessibility();
    cy.contains('Send feedback').click();
    runAccessibility();
    // This wait is necessary as the cy.url() command will attempt to execute immediately after submitting the form
    // hence later cy.visit() commands will attempt to visit the wrong page
    cy.wait(1000);

    cy.url().then((url) => {
      const schemeUrl = url;
      cy.get('[data-cy="cy-link-to-advert-on-find"]').then(($el) => {
        const advertUrl = $el.text();
        cy.visit(advertUrl);
        cy.contains(GRANT_NAME);
        searchForAGrant(GRANT_NAME);
        // List contains the advert
        cy.get('[data-cy="cyGrantNameAndLink"]').contains(GRANT_NAME);

        cy.visit(schemeUrl);
        cy.get('[data-cy="cyViewOrChangeYourAdvert-link"]').click();
        runAccessibility();
        cy.get('[data-cy="cy-unpublish-advert-button"]').click();
        runAccessibility();
        cy.get('[data-cy="cy-radioInput-option-YesUnpublishMyAdvert"]').click();
        runAccessibility();
        cy.get('[data-cy="cy_unpublishConfirmation-ConfirmButton"]').click();
        runAccessibility();
        cy.get('[data-cy="confirmation-message-title"]').contains(
          'Your advert has been unpublished',
        );
        // Need to wait for Contentful to update.
        log(
          'Scheme details with an in progress advert journey - Waiting for Contentful to unpublish advert',
        );
        cy.wait(10000);

        cy.visit(advertUrl, { failOnStatusCode: false });
        cy.contains('Page not found');
        cy.visit(schemeUrl);
        cy.get('[data-cy="cyViewOrChangeYourAdvert-link"]').click();
        runAccessibility();
        cy.get('[data-cy="cy-publish-advert-button"]').click();
        runAccessibility();
        cy.get('[data-cy="cy-button-Confirm and publish"]').click();
        runAccessibility();
        cy.get('[data-cy="cy-advert-published"]').contains(
          'Grant advert published',
        );
        cy.wait(3000);
        cy.visit(advertUrl);
        cy.contains(GRANT_NAME);
        searchForAGrant(GRANT_NAME);
        runAccessibility();
        // List contains the advert
        cy.get('[data-cy="cyGrantNameAndLink"]').contains(GRANT_NAME);
        cy.visit(schemeUrl);
        runAccessibility();
      });
    });

    cy.contains('An advert for this grant is live on Find a grant.');

    cy.get('[data-cy="cy-link-to-advert-on-find"]').should('have.attr', 'href');

    cy.contains('View or change your advert');

    log(
      'View scheme details with application in progress journey - creating application form',
    );
    cy.get('[data-cy="cyBuildApplicationForm"]').click();
    runAccessibility();

    cy.get('[data-cy="cy-applicationName-text-input"]').click();
    runAccessibility();
    cy.get('[data-cy="cy-applicationName-text-input"]').type(
      'Cypress - Grant Application',
      { force: true },
    );
    cy.get('[data-cy="cy-button-Continue"]').click();
    runAccessibility();

    cy.get('[data-cy="cy_Section-Eligibility Statement"]').click();
    runAccessibility();

    cy.get('[data-cy="cy-displayText-text-area"]').type('eligibility', {
      force: true,
    });

    log(
      'Scheme details with an in progress application journey - exiting application form',
    );
    saveAndExit();
    runAccessibility();

    // exit build application form
    clickText('Exit');
    runAccessibility();

    // view scheme details
    cy.contains('Grant application form');
    cy.contains(GRANT_NAME);

    log(
      'Scheme details with an in progress application journey - resuming application form',
    );
    runAccessibility();
    cy.get('[data-cy="cy_view-application-link"]').click();
    runAccessibility();
    cy.get('[data-cy="cy_Section-due-diligence-checks"]').click();
    runAccessibility();

    cy.on('uncaught:exception', () => false);

    cy.get(
      '[data-cy="cy-checkbox-value-I understand that applicants will be asked for this information"]',
    ).click();
    runAccessibility();
    saveAndExit();
    runAccessibility();

    log(
      'Scheme details with a completed journey - publishing application form',
    );
    // publish
    publishApplicationForm();
    runAccessibility();
    cy.url().then((url) => {
      const schemeUrl = url;
      cy.get('.break-all-words > .govuk-link').then(($el) => {
        const applicationUrl = $el.text();
        cy.log('Visiting application while published');
        cy.visit(applicationUrl, { failOnStatusCode: false });
        runAccessibility();
        cy.get('.govuk-heading-l').contains('Before you start');
        clickContinue();
        runAccessibility();
        fillMqOrgQuestionsAsLimitedCompany(MQ_DETAILS);
        fillMqFunding(MQ_DETAILS);
        clickText('Confirm and submit');
        runAccessibility();
        cy.contains('Cypress - Grant Application');
        cy.contains('Your Application');
        cy.get('[data-cy="cy-status-tag-Eligibility-Not Started"]');
        clickBack();
        runAccessibility();
        cy.contains('p', 'Cypress - Grant Application')
          .parent()
          .parent()
          .within(() => {
            cy.contains('strong', 'In Progress');
          });
        cy.log('Heading back to scheme');
        cy.visit(schemeUrl);
        runAccessibility();
        publishApplication(false);
        cy.visit(applicationUrl, { failOnStatusCode: false });
        cy.contains('p', 'Cypress - Grant Application')
          .parent()
          .parent()
          .within(() => {
            cy.contains('strong', 'Grant Closed');
          });
        cy.log('Heading back to scheme');
        cy.visit(schemeUrl);
        runAccessibility();
        publishApplication(true);
        runAccessibility();
        cy.visit(applicationUrl);
        runAccessibility();
        cy.contains('p', 'Cypress - Grant Application')
          .parent()
          .parent()
          .within(() => {
            cy.contains('strong', 'In Progress');
          });
      });
    });

    log(
      'Scheme details with an in progress application journey - validating application form and advert',
    );
    cy.get('.govuk-header__content > .govuk-header__link')
      .contains('Find a grant')
      .click();
    runAccessibility();
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    runAccessibility();
    cy.get(`[data-cy="cy_linkToScheme_${GRANT_NAME}"]`).click();
    runAccessibility();
    cy.contains('Grant application form');
    cy.contains('View submitted applications');
    cy.contains(GRANT_NAME);
    cy.contains('An advert for this grant is live on Find a grant.');
    cy.get('[data-cy="cy-link-to-advert-on-find"]').should('have.attr', 'href');
    cy.contains('View or change your advert');

    // Trigger schedule unpublish immediately
    cy.task('unpublishAdvert', GRANT_NAME);
    runAccessibility();

    // Check the adverts unpublished
    cy.get('[data-cy="cyViewOrChangeYourAdvert-link"]').click();
    runAccessibility();
    cy.get('[data-cy="cy-publish-advert-button"]').click();
    runAccessibility();
    cy.contains('Review your advert');
    cy.get('[data-cy="cy-advert-summary-page-back-button"]').click();
    runAccessibility();
    cy.get('[data-cy="cy-back-button"]').click();
    runAccessibility();

    // Check the application forms unpublished
    cy.get('[data-cy="cy_view-application-link"]').click();
    runAccessibility();
    cy.get('[data-cy="cy_publishApplication-button"]').click();
    runAccessibility();
    cy.contains('Are you sure you want to publish your application form?');
  });
});
