import {
  signInWithOneLogin,
  saveAndContinue,
  yesQuestionComplete,
  saveAndExit,
  signInToIntegrationSite,
} from "../../common/common";

const GRANT_NAME = "Cypress Test Grant";

describe("Create a Grant", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("loads the page", () => {
    cy.contains("Find a grant");
  });

  it("can create a new Grant and create advert", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInWithOneLogin(
      Cypress.env("oneLoginAdminEmail"),
      Cypress.env("oneLoginAdminPassword"),
    );

    createGrant();

    //create advert
    advertSection1();
    advertSection2();
    advertSection3();
    advertSection4();
    advertSection5();

    publishAdvert();

    applicationForm();

    function publishApplicationForm() {
      cy.get('[data-cy="cy_publishApplication-button"]').click();

      cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
      cy.get('[data-cy="cy_publishConfirmation-ConfirmButton"]').click();
    }

    function publishAdvert() {
      cy.get('[data-cy="cy-publish-advert-button"]').click();

      cy.get('[data-cy="cy-button-Schedule my advert"]').click();

      cy.get('[data-cy="cy-advert-scheduled"]').should("exist");

      cy.get('[data-cy="back-to-my-account-button"]').click();
    }

    function sectionsAndQuestions() {
      //add section
      cy.get('[data-cy="cy-button-addNewSection"]').click();
      cy.get('[data-cy="cy-sectionTitle-text-input"]').type("Custom Section");
      saveAndContinue();

      //add question to new section
      cy.get('[data-cy="cy_addAQuestion-Custom Section"]').click();
      cy.get('[data-cy="cy-fieldTitle-text-input"]').type("Custom Question 1");
      cy.get('[data-cy="cy-hintText-text-area"]').type("Short description");
      cy.get('[data-cy="cy-radioInput-option-No"]').click();
      saveAndContinue();

      cy.get('[data-cy="cy-radioInput-option-YesNo"]').click();
      saveAndContinue();

      //add section
      cy.get('[data-cy="cy-button-addNewSection"]').click();
      cy.get('[data-cy="cy-sectionTitle-text-input"]').type(
        "Deletable Section",
      );
      saveAndContinue();
      //delete section
      cy.get(
        '[data-cy="cy_sections_deleteSectionBtn-Deletable Section"]',
      ).click();
      cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
      cy.get('[data-cy="cy-button-Confirm"]').click();

      cy.get(
        '[data-cy="cy_sections_deleteSectionBtn-Deletable Section"]',
      ).should("not.exist");
    }

    function applicationForm() {
      cy.get('[data-cy="cyBuildApplicationForm"]').click();

      cy.get('[data-cy="cy-applicationName-text-input"]').type(
        "application form name",
      );
      cy.get('[data-cy="cy-button-Continue"]').click();

      cy.get('[data-cy="cy_Section-Eligibility Statement"]').click();

      cy.get('[data-cy="cy-displayText-text-area"]').type("eligibility");
      saveAndExit();

      cy.get('[data-cy="cy_Section-due-diligence-checks"]').click();

      cy.on("uncaught:exception", (err, runnable) => {
        return false;
      });

      cy.get(
        '[data-cy="cy-checkbox-value-I understand that applicants will be asked for this information"]',
      ).click();
      saveAndExit();

      sectionsAndQuestions();

      //publish
      publishApplicationForm();
    }

    function createGrant() {
      const ggisNumber = "Cypress Test GGIS Number";
      const contactEmail = "test@and-cypress-email.com";

      cy.get("[data-cy=cy_addAGrantButton]").click();

      cy.get("[data-cy=cy-name-text-input]").type(GRANT_NAME);

      saveAndContinue();

      cy.get("[data-cy=cy-ggisReference-text-input]").type(ggisNumber);

      saveAndContinue();

      cy.get("[data-cy=cy-contactEmail-text-input]").type(contactEmail);

      saveAndContinue();

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

    function advertSection5() {
      cy.get(
        '[data-cy="cy-5. Further information-sublist-task-name-Eligibility information"]',
      ).click();

      getIframeBody("#grantEligibilityTab_ifr")
        .find("p")
        .type("This is our Eligibility information", { force: true });

      yesQuestionComplete();

      getIframeBody("#grantSummaryTab_ifr")
        .find("p")
        .type("This is our Summary information", { force: true });

      yesQuestionComplete();

      getIframeBody("#grantDatesTab_ifr")
        .find("p")
        .type("This is our Date information", { force: true });

      yesQuestionComplete();

      getIframeBody("#grantObjectivesTab_ifr")
        .find("p")
        .type("This is our Objectives information", { force: true });

      yesQuestionComplete();

      getIframeBody("#grantApplyTab_ifr")
        .find("p")
        .type("This is our application information", { force: true });

      yesQuestionComplete();

      getIframeBody("#grantSupportingInfoTab_ifr")
        .find("p")
        .type("This is our supporting information", { force: true });

      yesQuestionComplete();
    }

    function advertSection4() {
      cy.get(
        '[data-cy="cy-4. How to apply-sublist-task-name-Link to application form"]',
      ).click();

      cy.get('[data-cy="cy-grantWebpageUrl-text-input"]').type(
        "https://www.google.com",
      );

      yesQuestionComplete();
    }

    function advertSection3() {
      cy.get(
        "[data-cy='cy-3. Application dates-sublist-task-name-Opening and closing dates']",
      ).click();

      const today = new Date();
      cy.get("[data-cy=cyDateFilter-grantApplicationOpenDateDay]").type("1");
      cy.get("[data-cy=cyDateFilter-grantApplicationOpenDateMonth]").type("1");
      cy.get("[data-cy=cyDateFilter-grantApplicationOpenDateYear]").type(
        today.getFullYear() + 1,
      );

      cy.get("[data-cy=cyDateFilter-grantApplicationCloseDateDay]").type("31");
      cy.get("[data-cy=cyDateFilter-grantApplicationCloseDateMonth]").type("1");
      cy.get("[data-cy=cyDateFilter-grantApplicationCloseDateYear]").type(
        today.getFullYear() + 1,
      );

      yesQuestionComplete();
    }

    function advertSection2() {
      cy.get(
        "[data-cy='cy-2. Award amounts-sublist-task-name-How much funding is available?']",
      ).click();

      cy.get("[data-cy=cy-grantTotalAwardAmount-text-input-numeric]").type(
        "10000",
      );
      cy.get("[data-cy=cy-grantMaximumAward-text-input-numeric]").type("50");
      cy.get("[data-cy=cy-grantMinimumAward-text-input-numeric]").type("10");

      yesQuestionComplete();
    }

    function advertSection1() {
      cy.get("[data-cy=cyBuildAdvert]").click();

      cy.get("[data-cy=cy-name-text-input]").type(GRANT_NAME);

      saveAndContinue();

      cy.get(
        "[data-cy='cy-1. Grant details-sublist-task-name-Short description']",
      ).click();

      cy.get("[data-cy=cy-grantShortDescription-text-area]").type(
        "This is a short description",
      );

      yesQuestionComplete();

      cy.contains("Where is the grant available?");

      cy.get("[data-cy=cy-checkbox-value-National]").click();

      yesQuestionComplete();

      cy.contains("Which organisation is funding this grant?");

      cy.get("[data-cy=cy-grantFunder-text-input]").type("The Cabinet Office");

      yesQuestionComplete();

      cy.contains("Who can apply for this grant?");

      cy.get("[data-cy='cy-checkbox-value-Personal / Individual']").click();

      yesQuestionComplete();
    }
  });
});

const getIframeDocument = (iFrameSelector) => {
  return (
    cy
      .get(iFrameSelector)
      // Cypress yields jQuery element, which has the real
      // DOM element under property "0".
      // From the real DOM iframe element we can get
      // the "document" element, it is stored in "contentDocument" property
      // Cypress "its" command can access deep properties using dot notation
      // https://on.cypress.io/its
      .its("0.contentDocument")
      .should("exist")
  );
};

const getIframeBody = (iFrameSelector) => {
  cy.wait(2000);
  // get the document
  return (
    getIframeDocument(iFrameSelector)
      // automatically retries until body is loaded
      .its("body")
      .should("not.be.undefined")
      // wraps "body" DOM element to allow
      // chaining more Cypress commands, like ".find(...)"
      .then(cy.wrap)
  );
};
