import {
  clickSaveAndContinue,
  clickText,
  log,
  saveAndExit,
  signInAsAdmin,
  signInToIntegrationSite,
} from "../../common/common";
import { GRANT_NAME } from "./constants";

describe("Create a Grant", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("View scheme details of grant with application form and no advert", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    log("View scheme details with no advert journey - creating grant");
    createGrant(GRANT_NAME + " no advert");

    // create application form
    log(
      "View scheme details with no advert journey - creating application form",
    );
    applicationForm();

    // view scheme details
    cy.get("[data-cy=cy_publishSuccess-manageThisGrant-button]").click();

    cy.contains("Send feedback").click();

    cy.contains("Grant application form");
    cy.contains("View submitted applications");
    cy.contains(GRANT_NAME + " no advert");
  });
});

function createGrant(GRANT_NAME) {
  const ggisNumber = "Cypress Test GGIS Number";
  const contactEmail = "test@and-cypress-email.com";

  cy.get("[data-cy=cy_addAGrantButton]").click();

  cy.get("[data-cy=cy-name-text-input]").click();
  cy.get("[data-cy=cy-name-text-input]").type(GRANT_NAME, { force: true });

  clickSaveAndContinue();

  cy.get("[data-cy=cy-ggisReference-text-input]").click();
  cy.get("[data-cy=cy-ggisReference-text-input]").type(ggisNumber, {
    force: true,
  });

  clickSaveAndContinue();

  cy.get("[data-cy=cy-contactEmail-text-input]").click();
  cy.get("[data-cy=cy-contactEmail-text-input]").type(contactEmail, {
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

  cy.get("[data-cy=cy_addAGrantConfirmationPageButton]").click();

  cy.contains(GRANT_NAME).parent().contains("View").click();
}

function applicationForm() {
  cy.get('[data-cy="cyBuildApplicationForm"]').click();

  cy.get('[data-cy="cy-applicationName-text-input"]').click();
  cy.get('[data-cy="cy-applicationName-text-input"]').type(
    "Cypress - Grant Application",
    { force: true },
  );
  cy.get('[data-cy="cy-button-Continue"]').click();

  cy.get('[data-cy="cy_Section-Eligibility Statement"]').click();

  cy.get('[data-cy="cy-displayText-text-area"]').type("eligibility", {
    force: true,
  });
  saveAndExit();

  cy.get('[data-cy="cy_Section-due-diligence-checks"]').click();

  // the diligence checks page throws a React error in the background of loading the page, and cypress stops
  // processing on any exception. This line just tells it to continue on an unchecked exception.
  cy.on("uncaught:exception", () => false);

  cy.get(
    '[data-cy="cy-checkbox-value-I understand that applicants will be asked for this information"]',
  ).click();
  saveAndExit();

  sectionsAndQuestions();

  // publish
  publishApplicationForm();
}

function publishApplicationForm() {
  cy.get('[data-cy="cy_publishApplication-button"]').click();

  cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
  cy.get('[data-cy="cy_publishConfirmation-ConfirmButton"]').click();
}

function sectionsAndQuestions() {
  // add section
  cy.get('[data-cy="cy-button-addNewSection"]').click();
  cy.get('[data-cy="cy-sectionTitle-text-input"]').click();
  cy.get('[data-cy="cy-sectionTitle-text-input"]').type("Custom Section", {
    force: true,
  });
  clickSaveAndContinue();

  // add question to new section
  addOptionalQuestion(
    "Custom Question 1",
    "Short description",
    '[data-cy="cy-radioInput-option-YesNo"]',
  );

  addOptionalQuestion(
    "Custom Question 2",
    "Short description",
    '[data-cy="cy-radioInput-option-ShortAnswer"]',
  );

  addOptionalQuestion(
    "Custom Question 3",
    "Short description",
    '[data-cy="cy-radioInput-option-LongAnswer"]',
  );

  addOptionalMultiChoiceQuestion(
    "Custom Question 4",
    "Short description",
    '[data-cy="cy-radioInput-option-MultipleChoice"]',
  );

  addOptionalMultiChoiceQuestion(
    "Custom Question 5",
    "Short description",
    '[data-cy="cy-radioInput-option-MultipleSelect"]',
  );

  addOptionalQuestion(
    "Custom Question 6",
    "Short description",
    '[data-cy="cy-radioInput-option-DocumentUpload"]',
  );

  addOptionalQuestion(
    "Custom Question 7",
    "Short description",
    '[data-cy="cy-radioInput-option-Date"]',
  );

  addOptionalQuestion(
    "To edit and delete question",
    "Short description",
    '[data-cy="cy-radioInput-option-ShortAnswer"]',
  );

  editQuestion(8, "To edit and delete question", "To delete question");

  deleteQuestion(8, "To delete question");

  const questionIndexes = Array.from({ length: 7 }, (_, index) =>
    String(index + 1),
  );
  questionIndexes.forEach((idx) => {
    cy.get("table").contains("td", `Custom Question ${idx}`);
  });

  cy.contains(".govuk-button", "Save and go back").click();

  // add section
  cy.get('[data-cy="cy-button-addNewSection"]').click();
  cy.get('[data-cy="cy-sectionTitle-text-input"]').click();
  cy.get('[data-cy="cy-sectionTitle-text-input"]').type("Deletable Section", {
    force: true,
  });
  clickSaveAndContinue();
  // delete section
  cy.get(".govuk-button").contains("Delete section").click();
  cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
  cy.get('[data-cy="cy-button-Confirm"]').click();

  cy.get('[data-cy="cy_sections_deleteSectionBtn-Deletable Section"]').should(
    "not.exist",
  );
}

function addOptionalQuestion(questionText, description, type) {
  cy.contains(".govuk-button", "Add a new question").click();
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

function editQuestion(index, previousQuestionTitle, newQuestionTitle) {
  cy.contains(previousQuestionTitle).should("exist");
  cy.get("a:contains(Edit)").each(($element, eleIndex) => {
    if (eleIndex === index) {
      cy.wrap($element).click();
    }
  });
  cy.get('[data-cy="cy-fieldTitle-text-input"]')
    .clear()
    .type(newQuestionTitle, {
      force: true,
    });
  clickText("Save changes");
  cy.contains(previousQuestionTitle).should("not.exist");
  cy.contains(newQuestionTitle).should("exist");
}

function deleteQuestion(index, questionTitle) {
  cy.contains(questionTitle).should("exist");
  cy.get("a:contains(Edit)").each(($element, eleIndex) => {
    if (eleIndex === index) {
      cy.wrap($element).click();
    }
  });
  cy.contains(".govuk-button", "Delete question").click();
  cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
  clickText("Confirm");
  cy.contains(questionTitle).should("not.exist");
}

function addOptionalMultiChoiceQuestion(questionText, description, type) {
  cy.contains(".govuk-button", "Add a new question").click();
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
  cy.get('[data-cy="cy-options[0]-text-input"]').type("Choice 1", {
    force: true,
  });
  cy.get('[data-cy="cy-button-Add another option"]').click();
  cy.get('[data-cy="cy-options[1]-text-input"]').type("Choice 2", {
    force: true,
  });
  cy.get('[data-cy="cy-button-Save question"]').click();
}
