import {
  clickSaveAndContinue,
  signInToIntegrationSite,
  signInAsApplyApplicant,
  clickText,
  log,
  yesSectionComplete,
} from '../../common/common';
import {
  partialFillOrgProfile,
  confirmDetailsOnSummaryScreen,
  editOrgDetails,
  editFundingDetails,
  validateSubmissionSummarySection,
  triggerChangeFromSummary,
} from './helper';
import {
  equalitySectionDecline,
  fillMqFunding,
  fillOutEligibity,
  submitApplication,
} from '../../common/apply-helper';
import { MQ_DETAILS } from '../../common/constants';

describe('Apply for a Grant V2', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
  });

  it('Mandatory Questions Flow - Partially Filled Org Profile', () => {
    // Sign in
    log('Apply V2 Internal MQ Partial - Logging in as applicant');
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();

    /*
    Test Coverage:
    - Internal Application
    - Partially Filled Org Profile
    - Edit on Org Details and Funding Details
    - Skip E&D Questions
    */

    // Partially fill org profile
    log('Apply V2 Internal MQ Partial - Partially filling org profile');
    partialFillOrgProfile(MQ_DETAILS);

    // Search & Start new application
    log('Apply V2 Internal MQ Partial - Searching for application');
    cy.get('[data-cy="cySearch grantsPageLink"] > .govuk-link').click();
    cy.get('[data-cy="cySearchAgainInput"]').type(
      Cypress.env('testV2InternalGrant').advertName,
    );
    cy.get('[data-cy="cySearchAgainButton"]').click();

    log(
      'Apply V2 Internal MQ Partial - Beginning application for V2 Internal grant',
    );
    cy.contains(Cypress.env('testV2InternalGrant').advertName).click();
    cy.contains('Start new application').invoke('removeAttr', 'target').click();

    // Before you start
    log(
      'Apply V2 Internal MQ Partial - Beginning MQ flow for V2 Internal Partial',
    );
    cy.contains('Before you start');
    cy.contains('Continue').click();

    // Org Type - should be filled

    log('Apply V2 Internal MQ Partial - MQ Org Type Limited Company');
    cy.get('[data-cy="cy-radioInput-option-LimitedCompany"]').should(
      'be.checked',
    );
    clickSaveAndContinue();

    // Name - Should be empty
    log('Apply V2 Internal MQ Partial - MQ Name');
    cy.get('[data-cy="cy-name-text-input"]')
      .should('be.empty')
      .type(MQ_DETAILS.name);
    clickSaveAndContinue();

    // Address - should be full
    log('Apply V2 Internal MQ Partial - MQ Address');
    ['addressLine1', 'addressLine2', 'city', 'county', 'postcode'].forEach(
      (item, index) => {
        cy.get(`[data-cy="cy-${item}-text-input"]`).should(
          'have.value',
          MQ_DETAILS.address[index],
        );
      },
    );
    clickSaveAndContinue();

    // Companies House - should be empty
    log('Apply V2 Internal MQ Partial - MQ Companies House');
    cy.get('[data-cy="cy-companiesHouseNumber-text-input"]')
      .should('be.empty')
      .type(MQ_DETAILS.companiesHouse);
    clickSaveAndContinue();

    // Charities Commission - Should be filled
    log('Apply V2 Internal MQ Partial - MQ Charity Commission');
    cy.get('[data-cy="cy-charityCommissionNumber-text-input"]').should(
      'have.value',
      MQ_DETAILS.charitiesCommission,
    );
    clickSaveAndContinue();

    // Complete rest of MQ journey
    log('Apply V2 Internal MQ Partial - MQ Funding');
    fillMqFunding(MQ_DETAILS);
    log('Apply V2 Internal MQ Partial - MQ Summary');
    confirmDetailsOnSummaryScreen(MQ_DETAILS);
    log('Apply V2 Internal MQ Partial - Submit MQ');
    clickText('Confirm and submit');

    cy.get('[data-cy="cyAccount detailsPageLink"] > .govuk-link').click();
    cy.get('[data-cy="cy-link-card-Your saved information"]').click();

    log('Apply V2 Internal MQ Partial - Checking profile org type');
    cy.get('[data-cy="cy-organisation-value-Type of organisation"]').contains(
      MQ_DETAILS.orgType,
    );
    log('Apply V2 Internal MQ Partial - Checking profile address');
    cy.get('[data-cy=cy-organisation-value-Address]')
      .find('ul')
      .children('li')
      .each((listItem, index) => {
        cy.wrap(listItem).contains(
          MQ_DETAILS.address[index] + (index < 4 ? ',' : ''),
        );
      });

    log('Apply V2 Internal MQ Partial - Checking profile Companies House');
    cy.get('[data-cy="cy-organisation-value-Companies House number"]').contains(
      MQ_DETAILS.companiesHouse,
    );
    log('Apply V2 Internal MQ Partial - Checking profile Charity Commission');
    cy.get(
      '[data-cy="cy-organisation-value-Charity Commission number"]',
    ).contains(MQ_DETAILS.charitiesCommission);

    cy.get('[data-cy="cy-back-to-dashboard-button"]').click();

    log('Apply V2 Internal MQ Partial - Navigate to application');
    cy.get('[data-cy="cy-your-applications-link"]').click();
    cy.contains('Edit').click();

    // Complete & Submit application
    log('Apply V2 Internal MQ Partial - Fill out Eligibility');
    fillOutEligibity();
    log('Apply V2 Internal MQ Partial - Edit Org Details');
    editOrgDetails(MQ_DETAILS);
    log('Apply V2 Internal MQ Partial - Edit Funding Details');
    editFundingDetails(MQ_DETAILS);

    log('Apply V2 Internal MQ Partial - Reviewing submission');

    log('Apply V1 Internal Grant - Reviewing submission');
    cy.contains('Review and submit').click();
    validateSubmissionSummarySection('Eligibility', [
      { key: 'Eligibility Statement', value: 'Yes' },
    ]);
    validateSubmissionSummarySection('Your organisation', [
      { key: 'Type of organisation', value: 'Charity' },
      { key: 'Name', value: 'MyOrg1' },
      {
        key: 'Address',
        value: 'addressLine11,addressLine21,city1,county1,postcod1',
      },
      { key: 'Enter your Charity Commission number', value: '678901' },
      { key: 'Enter your Charity Commission number', value: 'Change' },
      { key: 'Enter your Companies House number', value: '123451' },
    ]);
    validateSubmissionSummarySection('Funding', [
      {
        key: 'How much does your organisation require as a grant?',
        value: '1001',
      },
      {
        key: 'Where will this funding be spent?',
        value: 'North East (England)',
      },
    ]);

    log(
      'Apply V2 Internal Grant - validating that can change answers from summary page',
    );
    triggerChangeFromSummary('Your organisation', 'Name');
    cy.get('[data-cy="cy-name-text-input"]').type(
      '{selectall}{backspace}MyOrg2',
    );
    clickSaveAndContinue();

    triggerChangeFromSummary(
      'Your organisation',
      'Enter your Charity Commission number',
    );
    cy.get('[data-cy="cy-charityCommissionNumber-text-input"]').clear();
    clickSaveAndContinue();

    validateSubmissionSummarySection('Your organisation', [
      { key: 'Name', value: 'MyOrg2' },
      { key: 'Enter your Charity Commission number', value: '-' },
    ]);

    log(
      'Apply V2 Internal Grant - checking that setting Eligibility to No does not return you to summary',
    );
    triggerChangeFromSummary('Eligibility', 'Eligibility Statement');
    cy.get('[data-cy="cy-radioInput-option-No"]').click();
    clickSaveAndContinue();
    yesSectionComplete();

    cy.contains('Review and submit').should('be.disabled');

    cy.get('[data-cy="cy-section-title-link-Eligibility"]').click();
    cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
    clickSaveAndContinue();
    yesSectionComplete();

    cy.contains('Review and submit').click();
    validateSubmissionSummarySection('Eligibility', [
      { key: 'Eligibility Statement', value: 'Yes' },
    ]);

    // Submit, skip E&D questions and return to dashboard
    log('Apply V2 Internal MQ Partial - Submitting application');
    submitApplication();
    equalitySectionDecline();
    clickText('View your applications');
    clickText('Back');
  });
});
