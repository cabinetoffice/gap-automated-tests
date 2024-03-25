import {
  clickSaveAndContinue,
  yesSectionComplete,
  signInToIntegrationSite,
  searchForGrant,
  signInAsApplyApplicant,
  signOut,
  clickBack,
  log,
  runAccessibility,
  initialiseAccessibilityLogFile,
} from '../../common/common';
import {
  equalitySectionAccept,
  validateSubmissionSummarySection,
  triggerChangeFromSummary,
} from './helper';
import {
  fillOutCustomSection,
  fillOutDocUpload,
  fillOutEligibity,
  fillOutRequiredChecks,
  submitApplication,
} from '../../common/apply-helper';

describe('Apply for a Grant', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyDataWithAds');
    initialiseAccessibilityLogFile();
    signInToIntegrationSite();
  });

  it('Can start, save, come back, continue and submit new grant application for V1 Internal Grant', () => {
    log('Apply V1 Internal Grant - Searching for grant');
    runAccessibility();

    searchForGrant(Cypress.env('testV1InternalGrant').advertName);
    runAccessibility();

    cy.contains(Cypress.env('testV1InternalGrant').advertName).click();
    runAccessibility();

    cy.contains('Start new application').invoke('removeAttr', 'target').click();
    runAccessibility();

    log('Apply V1 Internal Grant - Signing in as applicant');
    signInAsApplyApplicant();
    runAccessibility();

    // checks 'mailto' support email link
    cy.get('[data-cy="cy-support-email"]').should(
      'have.attr',
      'href',
      `mailto:${Cypress.env('oneLoginAdminEmail')}`,
    );

    log('Apply V1 Internal Grant - Filling out Eligibility');
    fillOutEligibity();
    runAccessibility();

    // test sign out and back in
    log('Apply V1 Internal Grant - Signing out');
    cy.contains('Save and come back later').click();
    runAccessibility();

    signOut();
    runAccessibility();

    log('Apply V1 Internal Grant - Signing back in as applicant');
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    runAccessibility();

    signInAsApplyApplicant();
    runAccessibility();
    cy.visit('/apply/applicant/dashboard');
    runAccessibility();

    log('Apply V1 Internal Grant - Returning to in progress application');
    cy.get('[data-cy="cy-your-applications-link"]').click();
    runAccessibility();
    cy.contains('Edit').click();
    runAccessibility();

    cy.get('[data-cy="cy-status-tag-Eligibility-Completed"]');

    log('Apply V1 Internal Grant - Filling out Required Checks');
    fillOutRequiredChecks();
    runAccessibility();

    log('Apply V1 Internal Grant - Filling out Custom Section');
    fillOutCustomSection();
    runAccessibility();

    cy.get('[data-cy="cy-status-tag-Eligibility-Completed"]');
    cy.get('[data-cy="cy-status-tag-Required checks-Completed"]');
    cy.get('[data-cy="cy-status-tag-Custom Section-Completed"]');

    // test doc upload is required
    log('Apply V1 Internal Grant - Removing uploaded doc from submission');
    cy.contains('Review and submit').should('not.be.disabled');

    cy.contains('Custom Section').click();
    runAccessibility();

    clickSaveAndContinue();
    clickSaveAndContinue();
    clickSaveAndContinue();
    clickSaveAndContinue();
    clickSaveAndContinue();

    cy.contains('Custom Question 6');
    cy.contains('Uploaded File');
    cy.contains('example.doc');
    cy.contains('Remove File').click();
    cy.get('[data-testid="file-upload-input"]');

    clickBack();
    clickBack();
    clickBack();
    clickBack();
    clickBack();
    clickBack();

    cy.contains('Your Application');
    runAccessibility();

    cy.get('[data-cy="cy-status-tag-Custom Section-In Progress"]');

    cy.contains('Review and submit').should('be.disabled');

    // re-add doc upload
    log('Apply V1 Internal Grant - Re-adding uploaded doc to submission');
    cy.get('[data-cy="cy-section-title-link-Custom Section"]').click();
    runAccessibility();

    clickSaveAndContinue();
    runAccessibility();
    clickSaveAndContinue();
    runAccessibility();
    clickSaveAndContinue();
    runAccessibility();
    clickSaveAndContinue();
    runAccessibility();
    clickSaveAndContinue();
    runAccessibility();

    fillOutDocUpload();
    runAccessibility();

    clickSaveAndContinue();
    runAccessibility();

    yesSectionComplete();
    runAccessibility();
    cy.get('[data-cy="cy-status-tag-Custom Section-Completed"]');

    cy.contains('Review and submit').should('not.be.disabled');

    log('Apply V1 Internal Grant - Reviewing submission');
    cy.contains('Review and submit').click();
    runAccessibility();

    validateSubmissionSummarySection('Eligibility', [
      { key: 'Eligibility Statement', value: 'Yes' },
    ]);
    validateSubmissionSummarySection('Required checks', [
      { key: 'Enter the name of your organisation', value: 'My First Org' },
      { key: 'Choose your organisation type', value: 'Limited company' },
      {
        key: "Enter your organisation's address",
        value: 'Address line 1,Address line 2,Town,County,Postcode',
      },
      {
        key: 'Enter your Charity Commission number (if you have one)',
        value: '-',
      },
      {
        key: 'Enter your Companies House number (if you have one)',
        value: '-',
      },
      {
        key: 'How much does your organisation require as a grant?',
        value: '100',
      },
      {
        key: 'Where will this funding be spent?',
        value:
          'North East England,North West England,South East England,' +
          'South West England,Midlands,Scotland,Wales,Northern Ireland',
      },
    ]);
    validateSubmissionSummarySection('Custom Section', [
      { key: 'Custom Question 1', value: 'Yes' },
      { key: 'Custom Question 2', value: 'input 1' },
      { key: 'Custom Question 3', value: 'input 2' },
      { key: 'Custom Question 4', value: 'Choice 1' },
      { key: 'Custom Question 5', value: 'Choice 1,Choice 2' },
      { key: 'Custom Question 6', value: 'example.doc' },
      { key: 'Custom Question 7', value: '1 January 2000' },
    ]);

    log(
      'Apply V2 Internal Grant - validating that can change answers from summary page',
    );
    triggerChangeFromSummary(
      'Required checks',
      'Enter the name of your organisation',
    );
    cy.get('[data-cy="cy-APPLICANT_ORG_NAME-text-input"]').type(
      '{selectall}{backspace}My Second Org',
    );
    runAccessibility();

    clickSaveAndContinue();
    runAccessibility();

    validateSubmissionSummarySection('Required checks', [
      { key: 'Enter the name of your organisation', value: 'My Second Org' },
    ]);

    triggerChangeFromSummary('Custom Section', 'Custom Question 1');
    cy.get('[data-cy="cy-radioInput-option-No"]').click();
    clickSaveAndContinue();
    validateSubmissionSummarySection('Custom Section', [
      { key: 'Custom Question 1', value: 'No' },
    ]);

    triggerChangeFromSummary('Custom Section', 'Custom Question 5');
    cy.get('[data-cy="cy-checkbox-value-Choice 1"]').click();
    cy.get('[data-cy="cy-checkbox-value-Choice 2"]').click();
    clickSaveAndContinue();
    runAccessibility();
    validateSubmissionSummarySection('Custom Section', [
      { key: 'Custom Question 5', value: '-' },
    ]);

    // submit
    log('Apply V1 Internal Grant - Submitting application');
    submitApplication();
    runAccessibility();

    log('Apply V1 Internal Grant - Filling out equality section');
    equalitySectionAccept();
    runAccessibility();

    log('Apply V1 Internal Grant - Viewing submission');
    cy.contains('View your applications').click();
    runAccessibility();

    cy.contains('Your applications');
    cy.contains('All of your current and past applications are listed below.');
    cy.contains(Cypress.env('testV1InternalGrant').applicationName).should(
      'exist',
    );
    cy.get(
      '[data-cy="cy-status-tag-Cypress - Test Application V1 Internal-Submitted"]',
    ).should('exist');
    cy.contains('View').should('exist');

    // checks that clicking on submitted application does nothing
    cy.get(
      `[data-cy="cy-application-link-${
        Cypress.env('testV1InternalGrant').applicationName
      }"]`,
    ).should('not.have.attr', 'href');
  });
});
