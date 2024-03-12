import dayjs from 'dayjs';
import {
  clickSave,
  clickSaveAndContinue,
  clickText,
  downloadFileFromLink,
  log,
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

  cy.get('[data-cy=cy-name-text-input]').click();
  cy.get('[data-cy=cy-name-text-input]').type(GRANT_NAME, { force: true });

  clickSaveAndContinue();

  cy.get('[data-cy=cy-ggisReference-text-input]').click();
  cy.get('[data-cy=cy-ggisReference-text-input]').type(ggisNumber, {
    force: true,
  });

  clickSaveAndContinue();

  cy.get('[data-cy=cy-contactEmail-text-input]').click();
  cy.get('[data-cy=cy-contactEmail-text-input]').type(contactEmail, {
    force: true,
  });

  clickSaveAndContinue();

  cy.get("[data-cy='cy_summaryListValue_Grant name']").contains(GRANT_NAME);

  cy.get(
    "[data-cy='cy_summaryListValue_GGIS Scheme Reference Number']",
  ).contains(ggisNumber);

  cy.get("[data-cy='cy_summaryListValue_Support email address']").contains(
    contactEmail,
  );

  cy.get('[data-cy=cy_addAGrantConfirmationPageButton]').click();

  cy.contains(GRANT_NAME).click();
}

export function applicationForm() {
  cy.get('[data-cy="cyBuildApplicationForm"]').click();

  cy.get('[data-cy="cy-applicationName-text-input"]').click();
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

export function publishAdvert(scheduled) {
  cy.get('[data-cy="cy-publish-advert-button"]').click();

  cy.get(
    `[data-cy="cy-button-${
      scheduled ? 'Schedule my advert' : 'Confirm and publish'
    }"]`,
  ).click();

  cy.get(
    `[data-cy="cy-advert-${scheduled ? 'scheduled' : 'published'}"]`,
  ).should('exist');

  cy.get('[data-cy="back-to-my-account-button"]').click();
}

export function advertSection5() {
  cy.get(
    '[data-cy="cy-5. Further information-sublist-task-name-Eligibility information"]',
  ).click();

  getIframeBody('#grantEligibilityTab_ifr')
    .find('p')
    .type('This is our Eligibility information', { force: true });

  yesQuestionComplete();

  getIframeBody('#grantSummaryTab_ifr')
    .find('p')
    .type('This is our Summary information', { force: true });

  yesQuestionComplete();

  getIframeBody('#grantDatesTab_ifr')
    .find('p')
    .type('This is our Date information', { force: true });

  yesQuestionComplete();

  getIframeBody('#grantObjectivesTab_ifr')
    .find('p')
    .type('This is our Objectives information', { force: true });

  yesQuestionComplete();

  getIframeBody('#grantApplyTab_ifr')
    .find('p')
    .type('This is our application information', { force: true });

  yesQuestionComplete();

  getIframeBody('#grantSupportingInfoTab_ifr')
    .find('p')
    .type('This is our supporting information', { force: true });

  yesQuestionComplete();
}

export function advertSection4() {
  cy.get(
    '[data-cy="cy-4. How to apply-sublist-task-name-Link to application form"]',
  ).click();

  // TODO copy url from application form
  cy.get('[data-cy="cy-grantWebpageUrl-text-input"]').click();
  cy.get('[data-cy="cy-grantWebpageUrl-text-input"]').type(
    'https://www.google.com',
    { force: true },
  );

  yesQuestionComplete();
}

export function advertSection3(scheduled) {
  cy.get(
    "[data-cy='cy-3. Application dates-sublist-task-name-Opening and closing dates']",
  ).click();

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
}

export function advertSection2() {
  cy.get(
    "[data-cy='cy-2. Award amounts-sublist-task-name-How much funding is available?']",
  ).click();

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
}

export function advertSection1(GRANT_NAME) {
  cy.get('[data-cy=cyBuildAdvert]').click();

  cy.get('[data-cy=cy-name-text-input]').click();
  cy.get('[data-cy=cy-name-text-input]').type(GRANT_NAME, { force: true });

  clickSaveAndContinue();

  cy.get(
    "[data-cy='cy-1. Grant details-sublist-task-name-Short description']",
  ).click();

  cy.get('[data-cy=cy-grantShortDescription-text-area]').click();
  cy.get('[data-cy=cy-grantShortDescription-text-area]').type(
    'This is a short description',
    { force: true },
  );

  yesQuestionComplete();

  cy.contains('Where is the grant available?');

  cy.get('[data-cy=cy-checkbox-value-National]').click();

  yesQuestionComplete();

  cy.contains('Which organisation is funding this grant?');

  cy.get('[data-cy=cy-grantFunder-text-input]').click();
  cy.get('[data-cy=cy-grantFunder-text-input]').type('The Cabinet Office', {
    force: true,
  });

  yesQuestionComplete();

  cy.contains('Who can apply for this grant?');

  cy.get("[data-cy='cy-checkbox-value-Personal / Individual']").click();

  yesQuestionComplete();
}

export const convertDateToString = (date, dateFormat = 'YYYY-MM-DD') =>
  dayjs(date).format(dateFormat);

export const publishApplication = (choice) => {
  cy.contains('Manage this grant').click();
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
  cy.wait(1000);

  cy.get('[data-cy="cy_view-application-link"]').click();
  if (choice === true) {
    cy.get('[data-cy="cy_publishApplication-button"]').click();
    cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
    cy.get('[data-cy="cy_publishConfirmation-ConfirmButton"]').click();
  } else {
    cy.get('[data-cy="cy_unpublishApplication-button"]').click();
    cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
    cy.get('[data-cy="cy_unpublishConfirmation-ConfirmButton"]').click();
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
