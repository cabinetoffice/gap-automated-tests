import dayjs from 'dayjs';
import {
  clickBack,
  clickSave,
  clickSaveAndContinue,
  clickText,
  downloadFileFromLink,
  log,
  runAccessibility,
  saveAndExit,
  selectActionForItemInTable,
  yesQuestionComplete,
} from '../../common/common';

const getIframeBody = (iFrameSelector) =>
  cy
    .get(iFrameSelector, { timeout: 8000 })
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap);

export function createGrant(GRANT_NAME) {
  const ggisNumber = 'Cypress Test GGIS Number';
  const contactEmail = 'test@and-cypress-email.com';

  cy.get('[data-cy=cy_addAGrantButton]').click();
  runAccessibility();

  cy.get('[data-cy=cy-grantName-text-input]').click();
  cy.get('[data-cy=cy-grantName-text-input]').type(GRANT_NAME, { force: true });

  clickSaveAndContinue();
  runAccessibility();
  runAccessibility();

  cy.get('[data-cy=cy-ggisReference-text-input]').click();
  cy.get('[data-cy=cy-ggisReference-text-input]').type(ggisNumber, {
    force: true,
  });

  clickSaveAndContinue();
  runAccessibility();

  cy.get('[data-cy=cy-contactEmail-text-input]').click();
  cy.get('[data-cy=cy-contactEmail-text-input]').type(contactEmail, {
    force: true,
  });

  clickSaveAndContinue();
  runAccessibility();

  cy.get("[data-cy='cy_summaryListValue_Grant name']").contains(GRANT_NAME);

  cy.get(
    "[data-cy='cy_summaryListValue_GGIS Scheme Reference Number']",
  ).contains(ggisNumber);

  cy.get("[data-cy='cy_summaryListValue_Support email address']").contains(
    contactEmail,
  );

  cy.get('[data-cy=cy_addAGrantConfirmationPageButton]').click();
  runAccessibility();

  cy.contains(GRANT_NAME).click();
}

export function applicationForm() {
  cy.get('[data-cy="cyBuildApplicationForm"]').click();
  runAccessibility();

  cy.get('[data-cy="cy-applicationName-text-input"]').click();
  runAccessibility();

  cy.get('[data-cy="cy-applicationName-text-input"]').type(
    'Cypress - Grant Application',
    { force: true },
  );
  cy.get('[data-cy="cy-button-Continue"]').click();

  cy.get('[data-cy="cy_Section-Eligibility Statement"]').click();

  cy.get('[data-cy="cy-displayText-text-area"]').type('eligibility', {
    force: true,
  });
  saveAndExit();

  cy.get('[data-cy="cy_Section-due-diligence-checks"]').click();

  // the diligence checks page throws a React error in the background of loading the page, and cypress stops
  // processing on any exception. This line just tells it to continue on an unchecked exception.
  cy.on('uncaught:exception', () => false);

  cy.get(
    '[data-cy="cy-checkbox-value-I understand that applicants will be asked for this information"]',
  ).click();
  saveAndExit();

  sectionsAndQuestions();

  // publish
  publishApplicationForm();
}

export function publishApplicationForm() {
  cy.get('[data-cy="cy_publishApplication-button"]').click();
  runAccessibility();
  cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
  cy.get('[data-cy="cy_publishConfirmation-ConfirmButton"]').click();
}

function sectionsAndQuestions() {
  // add section
  cy.get('[data-cy="cy-button-addNewSection"]').click();
  cy.get('[data-cy="cy-sectionTitle-text-input"]')
    .click()
    .type('Custom Section', {
      force: true,
    });
  clickSaveAndContinue();

  // add question to new section
  addOptionalQuestion(
    'Custom Question 1',
    'Short description',
    '[data-cy="cy-radioInput-option-YesNo"]',
  );

  addOptionalQuestion(
    'Custom Question 2',
    'Short description',
    '[data-cy="cy-radioInput-option-ShortAnswer"]',
  );

  addOptionalQuestion(
    'Custom Question 3',
    'Short description',
    '[data-cy="cy-radioInput-option-LongAnswer"]',
  );

  cy.get('[data-cy="cy-maxWords-text-input-numeric"]').type('500');
  clickSaveAndContinue();

  addOptionalMultiChoiceQuestion(
    'Custom Question 4',
    'Short description',
    '[data-cy="cy-radioInput-option-MultipleChoice"]',
  );

  addOptionalMultiChoiceQuestion(
    'Custom Question 5',
    'Short description',
    '[data-cy="cy-radioInput-option-MultipleSelect"]',
  );

  addOptionalQuestion(
    'Custom Question 6',
    'Short description',
    '[data-cy="cy-radioInput-option-DocumentUpload"]',
  );

  addOptionalQuestion(
    'Custom Question 7',
    'Short description',
    '[data-cy="cy-radioInput-option-Date"]',
  );

  addOptionalQuestion(
    'To edit and delete question',
    'Short description',
    '[data-cy="cy-radioInput-option-ShortAnswer"]',
  );

  editQuestion('To edit and delete question', 'To delete question');

  deleteQuestion('To delete question');

  editSectionName('Custom Section', 'Shiny new section name');

  moveQuestion(0, 'Custom Question 1', 'Down');
  moveQuestion(1, 'Custom Question 1', 'Down');
  moveQuestion(2, 'Custom Question 1', 'Down');
  moveQuestion(3, 'Custom Question 1', 'Down');
  moveQuestion(4, 'Custom Question 1', 'Down');
  moveQuestion(5, 'Custom Question 1', 'Down');

  moveQuestion(6, 'Custom Question 1', 'Up');
  moveQuestion(5, 'Custom Question 1', 'Up');
  moveQuestion(4, 'Custom Question 1', 'Up');
  moveQuestion(3, 'Custom Question 1', 'Up');
  moveQuestion(2, 'Custom Question 1', 'Up');
  moveQuestion(1, 'Custom Question 1', 'Up');

  const questionIndexes = Array.from({ length: 7 }, (_, index) =>
    String(index + 1),
  );
  questionIndexes.forEach((idx) => {
    cy.get('table').contains('td', `Custom Question ${idx}`);
  });

  cy.contains('.govuk-button', 'Save and go back').click();

  cy.get('[data-cy="cy-button-addNewSection"]').click();
  cy.get('[data-cy="cy-sectionTitle-text-input"]')
    .click()
    .type('Custom Section two', {
      force: true,
    });
  clickSaveAndContinue();
  clickText('Save and go back');

  cy.get('[data-cy="cy-button-addNewSection"]').click();
  cy.get('[data-cy="cy-sectionTitle-text-input"]')
    .click()
    .type('Custom Section three', {
      force: true,
    });
  clickSaveAndContinue();
  clickText('Save and go back');

  moveSection('3. Shiny new section name', 'Down');
  moveSection('4. Shiny new section name', 'Down');

  moveSection('5. Shiny new section name', 'Up');
  moveSection('4. Shiny new section name', 'Up');

  selectActionForItemInTable('4. Custom Section two', 'Edit section', {
    actionCellElement: 'div',
    textCellElement: 'div',
  });
  cy.get('.govuk-button').contains('Delete section').click();
  cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
  cy.get('[data-cy="cy-button-Confirm"]').click();

  selectActionForItemInTable('4. Custom Section three', 'Edit section', {
    actionCellElement: 'div',
    textCellElement: 'div',
  });
  cy.get('.govuk-button').contains('Delete section').click();
  cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
  cy.get('[data-cy="cy-button-Confirm"]').click();
}

function moveSection(sectionName, direction) {
  selectActionForItemInTable(sectionName, direction, {
    actionCellElement: 'div',
    textCellElement: 'div',
    actionCellType: 'button',
  });
}

function moveQuestion(currentIndex, questionName, direction) {
  cy.get('table')
    // Not a great selector but not sure of a better way to do this
    .find(
      `[aria-label="Move question ${questionName} ${direction.toLowerCase()}"]`,
    )
    .parents('tr')
    .invoke('index')
    .then((i) => {
      cy.wrap(i).should('eq', currentIndex);
    });

  selectActionForItemInTable(questionName, direction, {
    actionCellElement: 'td',
    textCellElement: 'td',
    actionCellType: 'button',
  });

  cy.get('table')
    .find(
      `[aria-label="Move question ${questionName} ${direction.toLowerCase()}"]`,
    )
    .parents('tr')
    .invoke('index')
    .then((i) => {
      cy.wrap(i).should('eq', currentIndex + (direction === 'Up' ? -1 : 1));
    });
}

function editSectionName(previousSectionName, newSectionName) {
  cy.contains(previousSectionName).should('exist');
  selectActionForItemInTable(previousSectionName, 'Edit', {
    actionCellElement: 'dd',
    textCellElement: 'dd',
  });
  cy.get('[data-cy="cy-sectionTitle-text-input"]')
    .clear()
    .type(newSectionName, {
      force: true,
    });
  clickSave();
  cy.contains(previousSectionName).should('not.exist');
  cy.contains(newSectionName).should('exist');
}

function addOptionalQuestion(questionText, description, type) {
  cy.contains('.govuk-button', 'Add a new question').click();
  cy.get('[data-cy="cy-fieldTitle-text-input"]').click();
  cy.get('[data-cy="cy-fieldTitle-text-input"]').type(questionText, {
    force: true,
  });
  cy.get('[data-cy="cy-hintText-text-area"]').type(description, {
    force: true,
  });
  cy.get('[data-cy="cy-radioInput-option-No"]').click();
  clickSaveAndContinue();
  cy.get(type).click();
  clickSaveAndContinue();
}

function editQuestion(previousQuestionTitle, newQuestionTitle) {
  cy.contains(previousQuestionTitle).should('exist');
  selectActionForItemInTable(previousQuestionTitle, 'Edit', {
    actionCellElement: 'td',
    textCellElement: 'td',
  });
  cy.get('[data-cy="cy-fieldTitle-text-input"]')
    .clear()
    .type(newQuestionTitle, {
      force: true,
    });
  clickText('Save changes');
  cy.contains(previousQuestionTitle).should('not.exist');
  cy.contains(newQuestionTitle).should('exist');
}

function deleteQuestion(questionTitle) {
  cy.contains(questionTitle).should('exist');
  selectActionForItemInTable(questionTitle, 'Edit', {
    actionCellElement: 'td',
    textCellElement: 'td',
  });
  cy.contains('.govuk-button', 'Delete question').click();
  cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
  clickText('Confirm');
  cy.contains(questionTitle).should('not.exist');
}

function addOptionalMultiChoiceQuestion(questionText, description, type) {
  cy.contains('.govuk-button', 'Add a new question').click();
  cy.get('[data-cy="cy-fieldTitle-text-input"]').click();
  cy.get('[data-cy="cy-fieldTitle-text-input"]').type(questionText, {
    force: true,
  });
  cy.get('[data-cy="cy-hintText-text-area"]').type(description, {
    force: true,
  });
  cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
  clickSaveAndContinue();
  cy.get(type).click();
  clickSaveAndContinue();

  cy.get('[data-cy="cy-options[0]-text-input"]').click();
  cy.get('[data-cy="cy-options[0]-text-input"]').type('Choice 1', {
    force: true,
  });
  cy.get('[data-cy="cy-button-Add another option"]').click();
  cy.get('[data-cy="cy-options[1]-text-input"]').type('Choice 2', {
    force: true,
  });
  cy.get('[data-cy="cy-options[2]-text-input"]').type('Choice 3', {
    force: true,
  });
  cy.get('[data-cy="cy-button-Save question"]').click();
}

export function publishAdvert(advertName, scheduled) {
  cy.get('[data-cy="cy-publish-advert-button"]').click();
  runAccessibility();

  cy.get(
    `[data-cy="cy-button-${
      scheduled ? 'Schedule my advert' : 'Confirm and publish'
    }"]`,
  ).click();
  runAccessibility();

  if (!scheduled) cy.task('waitForAdvertToPublish', advertName);

  cy.get(
    `[data-cy="cy-advert-${scheduled ? 'scheduled' : 'published'}"]`,
  ).should('exist');

  cy.get('[data-cy="back-to-my-account-button"]').click();
  runAccessibility();
}

export function advertSection5() {
  cy.get(
    '[data-cy="cy-5. Further information-sublist-task-name-Eligibility information"]',
  ).click();
  runAccessibility();

  getIframeBody('#grantEligibilityTab_ifr')
    .find('p')
    .type('This is our Eligibility information', { force: true });

  yesQuestionComplete();
  runAccessibility();

  getIframeBody('#grantSummaryTab_ifr')
    .find('p')
    .type('This is our Summary information', { force: true });

  yesQuestionComplete();
  runAccessibility();

  getIframeBody('#grantDatesTab_ifr')
    .find('p')
    .type('This is our Date information', { force: true });

  yesQuestionComplete();
  runAccessibility();

  getIframeBody('#grantObjectivesTab_ifr')
    .find('p')
    .type('This is our Objectives information', { force: true });

  yesQuestionComplete();
  runAccessibility();

  getIframeBody('#grantApplyTab_ifr')
    .find('p')
    .type('This is our application information', { force: true });

  yesQuestionComplete();
  runAccessibility();

  getIframeBody('#grantSupportingInfoTab_ifr')
    .find('p')
    .type('This is our supporting information', { force: true });

  yesQuestionComplete();
  runAccessibility();
}

export function advertSection4() {
  cy.get(
    '[data-cy="cy-4. How to apply-sublist-task-name-Link to application form"]',
  ).click();
  runAccessibility();

  // TODO copy url from application form
  cy.get('[data-cy="cy-grantWebpageUrl-text-input"]').click();
  cy.get('[data-cy="cy-grantWebpageUrl-text-input"]').type(
    'https://www.google.com',
    { force: true },
  );

  yesQuestionComplete();
  runAccessibility();
}

export function advertSection3(scheduled) {
  cy.get(
    "[data-cy='cy-3. Application dates-sublist-task-name-Opening and closing dates']",
  ).click();
  runAccessibility();

  const today = new Date();
  cy.get('[data-cy=cyDateFilter-grantApplicationOpenDateDay]').click().clear();
  cy.get('[data-cy=cyDateFilter-grantApplicationOpenDateDay]').type('1', {
    force: true,
  });
  cy.get('[data-cy=cyDateFilter-grantApplicationOpenDateMonth]')
    .clear()
    .type('1', {
      force: true,
    });
  cy.get('[data-cy=cyDateFilter-grantApplicationOpenDateYear]')
    .clear()
    .type(`${today.getFullYear() + (scheduled ? 1 : 0)}`, { force: true });

  cy.get('[data-cy=cyDateFilter-grantApplicationCloseDateDay]')
    .clear()
    .type('31', {
      force: true,
    });
  cy.get('[data-cy=cyDateFilter-grantApplicationCloseDateMonth]')
    .clear()
    .type('1', {
      force: true,
    });
  cy.get('[data-cy=cyDateFilter-grantApplicationCloseDateYear]')
    .clear()
    .type(`${today.getFullYear() + 1}`, { force: true });

  yesQuestionComplete();
  runAccessibility();
}

export function advertSection2() {
  cy.get(
    "[data-cy='cy-2. Award amounts-sublist-task-name-How much funding is available?']",
  ).click();
  runAccessibility();

  cy.get('[data-cy=cy-grantTotalAwardAmount-text-input-numeric]').click();
  cy.get('[data-cy=cy-grantTotalAwardAmount-text-input-numeric]').type(
    '10000',
    { force: true },
  );
  cy.get('[data-cy=cy-grantMaximumAward-text-input-numeric]').type('50', {
    force: true,
  });
  cy.get('[data-cy=cy-grantMinimumAward-text-input-numeric]').type('10', {
    force: true,
  });

  yesQuestionComplete();
  runAccessibility();
}

export function advertSection1(GRANT_NAME) {
  cy.get('[data-cy=cyBuildAdvert]').click();
  runAccessibility();

  cy.get('[data-cy=cy-advertName-text-input]').click();
  runAccessibility();
  cy.get('[data-cy=cy-advertName-text-input]').type(GRANT_NAME, {
    force: true,
  });

  clickSaveAndContinue();
  runAccessibility();

  cy.get(
    "[data-cy='cy-1. Grant details-sublist-task-name-Short description']",
  ).click();
  runAccessibility();

  cy.get('[data-cy=cy-grantShortDescription-text-area]').click();
  cy.get('[data-cy=cy-grantShortDescription-text-area]').type(
    'This is a short description',
    { force: true },
  );

  yesQuestionComplete();
  runAccessibility();

  cy.contains('Where is the grant available?');

  cy.get('[data-cy=cy-checkbox-value-National]').click();

  yesQuestionComplete();
  runAccessibility();

  cy.contains('Which organisation is funding this grant?');

  cy.get('[data-cy=cy-grantFunder-text-input]').click();
  cy.get('[data-cy=cy-grantFunder-text-input]').type('The Cabinet Office', {
    force: true,
  });

  yesQuestionComplete();
  runAccessibility();

  cy.contains('Who can apply for this grant?');

  cy.get("[data-cy='cy-checkbox-value-Personal / Individual']").click();

  yesQuestionComplete();
  runAccessibility();
}

export const convertDateToString = (date, dateFormat = 'YYYY-MM-DD') =>
  dayjs(date).format(dateFormat);

export const publishApplication = (choice) => {
  cy.contains('Manage this grant').click();
  runAccessibility();
  // feedback form
  log(
    'Scheme details with a completed application journey - submitting feedback',
  );
  if (choice === true) {
    cy.contains('Very satisfied').click();
  }
  cy.get('[data-cy="cy-comment-text-area"]').type(
    '<INITIATING_DEMONSTRATION_OF_SATISFACTION>\n' +
      'Cypress-bot would be satisifed with this service, were it capable of experience emotion.\n' +
      '<CEASING_DEMONSTRATION_OF_SATISFACTION/>',
  );
  cy.contains('Send feedback').click();
  runAccessibility();
  cy.wait(1000);

  cy.get('[data-cy="cy_view-application-link"]').click();
  runAccessibility();
  if (choice === true) {
    cy.get('[data-cy="cy_publishApplication-button"]').click();
    runAccessibility();
    cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
    cy.get('[data-cy="cy_publishConfirmation-ConfirmButton"]').click();
    runAccessibility();
  } else {
    cy.get('[data-cy="cy_unpublishApplication-button"]').click();
    runAccessibility();
    cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
    cy.get('[data-cy="cy_unpublishConfirmation-ConfirmButton"]').click();
    runAccessibility();
  }
};

export const searchForAGrant = (grantName) => {
  cy.get('[data-cy="cySearch grantsPageLink"] > .govuk-link').click();
  cy.get('[data-cy="cySearchAgainInput"]').type(grantName);
  cy.get('[data-cy="cySearchAgainButton"]').click();
};

const downloadSubmissionExportZip = (submissionFileName) => {
  const tableRowSelector =
    '.submissions-download-table tbody .govuk-table__row';
  cy.get(tableRowSelector).each((row, index) => {
    if (row.text().includes(submissionFileName)) {
      downloadFileFromLink(
        cy.get('.submissions-download-table a').eq(index),
        'submission_export.zip',
      );
      return false;
    }
  });
};

export const goToSubmissionExportURL = (schemeId) => {
  cy.task('getExportedSubmissionUrlAndLocation', schemeId).then(
    (submission) => {
      cy.visit(submission.url);
    },
  );
};

export const validateSubmissionDownload = (schemeId, filenameSuffix = 1) => {
  cy.task('getExportedSubmissionUrlAndLocation', schemeId).then(
    (submission) => {
      log(JSON.stringify(submission));

      cy.visit(submission.url);

      const submissionFileName = submission.location
        .split('.zip')[0]
        .substring(0, 50);

      downloadSubmissionExportZip(submissionFileName);

      cy.unzip({ path: 'cypress/downloads/', file: 'submission_export.zip' });

      const folder = 'cypress/downloads/unzip/submission_export';

      cy.readFile(`${folder}/${submissionFileName}_${filenameSuffix}.odt`);
    },
  );
};

export const submissionExportSuccess = (grantInformation, version) => {
  goToSubmissionExportURL(grantInformation.schemeId);

  // Submission export page
  cy.contains(grantInformation.schemeName);
  cy.contains(
    `Your grant has ${
      version === 1 ? '1 application' : '3 applications'
    } available to download.`,
  );

  const downloadAllButton = cy
    .get('.govuk-button')
    .contains('Download all applications');
  downloadFileFromLink(downloadAllButton);

  cy.get('.govuk-button').contains('View individual applications').click();

  // Download Individual page
  cy.contains(grantInformation.schemeName);
  cy.contains('Download individual applications');

  if (version === 1) {
    cy.contains('Showing 1 to 1 of 1 applications');
    cy.contains('V1 Internal Limited company');
  } else if (version === 2) {
    cy.contains('Showing 1 to 3 of 3 applications');
    cy.contains('V2 Limited Company');
    cy.contains('V2 Non-limited Company');
    cy.contains('V2 Individual');
  }

  downloadFileFromLink(cy.get('.govuk-link').contains('Download'));

  cy.get('.govuk-button').contains('Return to overview').click();
  cy.contains('Applications available to download');
};

export const validatePreview = () => {
  log(
    'View scheme details with no advert journey - validating preview overview',
  );
  cy.contains('a', 'Preview your application form').click();
  cy.contains(
    'This is a preview of your application form. You cannot enter any answers.',
  );
  cy.contains(
    'a',
    'See an overview of the questions you will be asked',
  ).click();
  runAccessibility();
  checkOverviewPage();
  clickBack();

  log(
    'View scheme details with no advert journey - validating preview sections',
  );
  // Eligibility
  cy.contains('Eligibility')
    .parent()
    .parent()
    .within(() => {
      cy.contains('Not Started');
    });
  cy.contains('a', 'Eligibility').click();
  cy.contains('Question preview');
  cy.contains('Eligibility Statement');
  cy.get('[data-cy="cy-radioInput-option-Yes"]');
  cy.get('[data-cy="cy-radioInput-label-Yes"]');
  cy.get('[data-cy="cy-radioInput-option-No"]');
  cy.get('[data-cy="cy-radioInput-label-No"]');
  cy.contains('a', 'Back to overview').click();
  cy.contains('Eligibility')
    .parent()
    .parent()
    .within(() => {
      cy.contains('Not Started');
    });

  // Your details
  cy.contains('Your details')
    .parent()
    .parent()
    .within(() => {
      cy.contains('Not Started');
    });
  cy.contains('a', 'Your details').click();
  cy.contains('Question preview');
  cy.contains('Enter the name of your organisation');
  cy.get('[data-cy="cy-preview-text-input"]').should('be.disabled');
  cy.contains('a', 'Preview next question').click();

  cy.contains('Question preview');
  cy.contains('Choose your organisation type');
  cy.get('[data-cy="cy-preview-select"]').select('Limited company');
  cy.get('[data-cy="cy-preview-select"]').select('Non-limited company');
  cy.get('[data-cy="cy-preview-select"]').select('Registered charity');
  cy.get('[data-cy="cy-preview-select"]').select('Unregistered charity');
  cy.get('[data-cy="cy-preview-select"]').select('Other');
  cy.contains('a', 'Preview next question').click();

  cy.contains('Question preview');
  cy.contains("Enter your organisation's address");
  cy.contains('Address line 1');
  cy.get('[data-cy="cy-preview-address-line-1-text-input"]').should(
    'be.disabled',
  );
  cy.contains('Address line 2 (optional)');
  cy.get('[data-cy="cy-preview-address-line-2-text-input"]').should(
    'be.disabled',
  );
  cy.contains('Town or City');
  cy.get('[data-cy="cy-preview-town-text-input"]').should('be.disabled');
  cy.contains('County (optional)');
  cy.get('[data-cy="cy-preview-county-text-input"]').should('be.disabled');
  cy.contains('Postcode');
  cy.get('[data-cy="cy-preview-postcode-text-input"]').should('be.disabled');
  cy.contains('a', 'Preview next question').click();

  cy.contains('Question preview');
  cy.contains(
    'Enter your Charity Commission number (if you have one) (optional)',
  );
  cy.get('[data-cy="cy-preview-text-input"]').should('be.disabled');
  cy.contains('a', 'Preview next question').click();

  cy.contains('Question preview');
  cy.contains('Enter your Companies House number (if you have one) (optional)');
  cy.get('[data-cy="cy-preview-text-input"]').should('be.disabled');
  cy.contains('a', 'Back to overview').click();
  cy.contains('Your details')
    .parent()
    .parent()
    .within(() => {
      cy.contains('Not Started');
    });

  // Funding
  cy.contains('Funding')
    .parent()
    .parent()
    .within(() => {
      cy.contains('Not Started');
    });
  cy.contains('a', 'Funding').click();
  cy.contains('Question preview');
  cy.contains('How much does your organisation require as a grant?');
  cy.get('[data-cy="cy-preview-text-input-numeric"]').should('be.disabled');
  cy.contains('a', 'Preview next question').click();

  cy.contains('Question preview');
  cy.contains('Where will this funding be spent?');
  cy.get('[data-cy="cy-checkbox-value-North East England"]');
  cy.contains('a', 'Back to overview').click();
  cy.contains('Funding')
    .parent()
    .parent()
    .within(() => {
      cy.contains('Not Started');
    });

  // Custom section
  cy.contains('Shiny new section name')
    .parent()
    .parent()
    .within(() => {
      cy.contains('Not Started');
    });
  cy.contains('a', 'Shiny new section name').click();
  cy.contains('Question preview');
  cy.contains('Custom Question 1');
  cy.contains('a', 'Back to overview').click();
  cy.contains('Shiny new section name')
    .parent()
    .parent()
    .within(() => {
      cy.contains('Not Started');
    });

  cy.contains('a', 'Shiny new section name').click();
  cy.contains('Question preview');
  cy.contains('Custom Question 1');
  cy.get('[data-cy="cy-radioInput-option-Yes"]');
  cy.get('[data-cy="cy-radioInput-label-Yes"]');
  cy.get('[data-cy="cy-radioInput-option-No"]');
  cy.get('[data-cy="cy-radioInput-label-No"]');
  cy.contains('a', 'Preview next question').click();

  cy.contains('Question preview');
  cy.contains('Custom Question 2');
  cy.get('[data-cy="cy-preview-text-input"]').should('be.disabled');
  cy.contains('a', 'Preview next question').click();

  cy.contains('Question preview');
  cy.contains('Custom Question 3');
  cy.get('[data-cy="cy-preview-text-area"]').should('be.disabled');
  cy.contains('a', 'Preview next question').click();

  cy.contains('Question preview');
  cy.contains('Custom Question 4 (optional)');
  cy.get('[data-cy="cy-preview-select"]').select('Choice 1');
  cy.get('[data-cy="cy-preview-select"]').select('Choice 2');
  cy.get('[data-cy="cy-preview-select"]').select('Choice 3');
  cy.contains('a', 'Preview next question').click();

  cy.contains('Question preview');
  cy.contains('Custom Question 5 (optional)');
  cy.contains('Choice 1').click();
  cy.contains('Choice 2').click();
  cy.contains('Choice 3').click();
  cy.contains('a', 'Preview next question').click();

  cy.contains('Question preview');
  cy.contains('Custom Question 6');
  cy.get('[data-testid="file-upload-input"]').should('be.disabled');
  cy.contains('a', 'Preview next question').click();

  cy.contains('Question preview');
  cy.contains('Custom Question 7');
  cy.get('[data-cy="cyDateFilter-previewDay"]');
  cy.get('[data-cy="cyDateFilter-previewMonth"]');
  cy.get('[data-cy="cyDateFilter-previewYear"]');
  cy.contains('a', 'Back to overview').click();
  cy.contains('Shiny new section name')
    .parent()
    .parent()
    .within(() => {
      cy.contains('Not Started');
    });

  cy.contains('a', 'Exit preview').click();

  cy.contains('Build an application form');
};

const checkOverviewPage = () => {
  // assert on headings
  cy.get('[data-cy="cy-application-name"]').should(
    'have.text',
    'Cypress - Grant Application',
  );
  cy.contains(
    '[data-cy="cy-overview-heading"]',
    'Overview of application questions',
  );

  // assert on section headings
  cy.contains('Eligibility')
    .parent()
    .within(() => {
      cy.contains('Does your organisation meet the eligibility criteria?');
    });

  cy.contains('Your details')
    .parent()
    .within(() => {
      cy.contains('Enter the name of your organisation');
      cy.contains('Choose your organisation type');
      cy.contains("Enter your organisation's address");
      cy.contains('Charity Commission number (if applicable)');
      cy.contains('Companies House number (if applicable)');
    });

  cy.contains('Funding')
    .parent()
    .within(() => {
      cy.contains('How much does your organisation require as a grant?');
      cy.contains('Where will this funding be spent?');
    });

  cy.contains('Shiny new section name')
    .parent()
    .within(() => {
      for (let i = 1; i <= 7; i++) {
        cy.contains(`Custom Question ${i}`);
      }
    });

  // return to application form
  cy.get('[data-cy="cy-back-to-application"]').click();
};
