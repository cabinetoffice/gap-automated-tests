import {
  clickBack,
  clickText,
  log,
  saveAndExit,
  signInAsAdmin,
  signInToIntegrationSite,
  clickContinue,
} from "../../common/common";
import { GRANT_NAME, TASKS } from "./constants";
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
} from "./helper";

import {
  fillMqFunding,
  fillMqOrgQuestionsAsLimitedCompany,
} from "../../common/apply-helper";
import { MQ_DETAILS } from "../../common/constants";

const { REMOVE_ADVERT_BY_NAME } = TASKS;

describe("Create a Grant", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Admin can create a new Grant with Advert and Application Form", () => {
    cy.task(REMOVE_ADVERT_BY_NAME, GRANT_NAME);
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    log("Admin grant creation journey - Signing in as admin");
    signInAsAdmin();
    log("Admin grant creation journey - creating Grant");
    createGrant(GRANT_NAME);

    // create advert
    log(
      "Scheme details with an in progress advert journey - creating Advert Section 1",
    );
    advertSection1(GRANT_NAME);
    log(
      "Scheme details with an in progress advert journey - creating Advert Section 2",
    );
    advertSection2();

    log(
      "Scheme details with an in progress advert journey - exiting advert creation",
    );
    // exit advert creation
    cy.get('[data-cy="cy-exit"]').click();

    cy.get('[data-cy="cyViewOrChangeYourAdvert-link"]').click();

    log(
      "Scheme details with an in progress advert journey - creating Advert Section 3",
    );
    advertSection3(true);
    log(
      "Scheme details with an in progress advert journey - creating Advert Section 4",
    );
    advertSection4();
    log(
      "Scheme details with an in progress advert journey - creating Advert Section 5",
    );
    advertSection5();

    log(
      "Scheme details with an in progress advert journey - publishing advert",
    );
    publishAdvert(true);

    log(
      "Scheme details with an in progress advert journey - submitting feedback form",
    );
    cy.contains("Send feedback").click();

    log(
      "Scheme details with an in progress advert journey - Changing from scheduled to published",
    );
    cy.get('[data-cy="cyViewOrChangeYourAdvert-link"]').click();
    cy.get('[data-cy="cy-unschedule-advert-button"]').click();
    cy.get('[data-cy="cy-radioInput-option-YesUnscheduleMyAdvert"]').click();
    cy.get('[data-cy="cy_unscheduleConfirmation-ConfirmButton"]').click();
    advertSection3(false);
    publishAdvert(false);

    cy.contains("Very satisfied").click();
    cy.contains("Send feedback").click();
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
        cy.get('[data-cy="cy-unpublish-advert-button"]').click();
        cy.get('[data-cy="cy-radioInput-option-YesUnpublishMyAdvert"]').click();
        cy.get('[data-cy="cy_unpublishConfirmation-ConfirmButton"]').click();
        cy.get('[data-cy="confirmation-message-title"]').contains(
          "Your advert has been unpublished",
        );
        // Need to wait for Contentful to update.
        log(
          "Scheme details with an in progress advert journey - Waiting for Contentful to unpublish advert",
        );
        cy.wait(10000);

        cy.visit(advertUrl, { failOnStatusCode: false });
        cy.contains("Page not found");
        cy.visit(schemeUrl);
        cy.get('[data-cy="cyViewOrChangeYourAdvert-link"]').click();
        cy.get('[data-cy="cy-publish-advert-button"]').click();
        cy.get('[data-cy="cy-button-Confirm and publish"]').click();
        cy.get('[data-cy="cy-advert-published"]').contains(
          "Grant advert published",
        );
        cy.visit(advertUrl);
        cy.contains(GRANT_NAME);
        searchForAGrant(GRANT_NAME);
        // List contains the advert
        cy.get('[data-cy="cyGrantNameAndLink"]').contains(GRANT_NAME);
        cy.visit(schemeUrl);
      });
    });

    cy.contains("An advert for this grant is live on Find a grant.");

    cy.get('[data-cy="cy-link-to-advert-on-find"]').should("have.attr", "href");

    cy.contains("View or change your advert");

    log(
      "View scheme details with application in progress journey - creating application form",
    );
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

    log(
      "Scheme details with an in progress application journey - exiting application form",
    );
    saveAndExit();

    // exit build application form
    clickText("Exit");

    // view scheme details
    cy.contains("Grant application form");
    cy.contains(GRANT_NAME);

    log(
      "Scheme details with an in progress application journey - resuming application form",
    );
    cy.get('[data-cy="cy_view-application-link"]').click();
    cy.get('[data-cy="cy_Section-due-diligence-checks"]').click();

    cy.on("uncaught:exception", () => false);

    cy.get(
      '[data-cy="cy-checkbox-value-I understand that applicants will be asked for this information"]',
    ).click();
    saveAndExit();

    log(
      "Scheme details with a completed journey - publishing application form",
    );
    // publish
    publishApplicationForm();
    cy.url().then((url) => {
      const schemeUrl = url;
      cy.get(".break-all-words > .govuk-link").then(($el) => {
        const applicationUrl = $el.text();
        cy.log("Visiting application while published");
        cy.visit(applicationUrl, { failOnStatusCode: false });
        cy.get(".govuk-heading-l").contains("Before you start");
        clickContinue();
        fillMqOrgQuestionsAsLimitedCompany(MQ_DETAILS);
        fillMqFunding(MQ_DETAILS);
        clickText("Confirm and submit");
        cy.contains("Cypress - Grant Application");
        cy.contains("Your Application");
        cy.get('[data-cy="cy-status-tag-Eligibility-Not Started"]');
        clickBack();
        cy.contains("p", "Cypress - Grant Application")
          .parent()
          .parent()
          .within(() => {
            cy.contains("strong", "In Progress");
          });
        cy.log("Heading back to scheme");
        cy.visit(schemeUrl);
        publishApplication(false);
        cy.visit(applicationUrl, { failOnStatusCode: false });
        cy.contains("p", "Cypress - Grant Application")
          .parent()
          .parent()
          .within(() => {
            cy.contains("strong", "Grant Closed");
          });
        cy.log("Heading back to scheme");
        cy.visit(schemeUrl);
        publishApplication(true);
        cy.visit(applicationUrl);
        cy.contains("p", "Cypress - Grant Application")
          .parent()
          .parent()
          .within(() => {
            cy.contains("strong", "In Progress");
          });
      });
    });

    log(
      "Scheme details with an in progress application journey - validating application form and advert",
    );
    cy.get(".govuk-header__content > .govuk-header__link")
      .contains("Find a grant")
      .click();
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.get('[data-cy="cy-apply-register-button"]').click();
    cy.get('[data-cy="cy_SchemeListButton"]').click();
    cy.get(`[data-cy="cy_linkToScheme_${GRANT_NAME}"]`).click();
    cy.contains("Grant application form");
    cy.contains("View submitted applications");
    cy.contains(GRANT_NAME);
    cy.contains("An advert for this grant is live on Find a grant.");
    cy.get('[data-cy="cy-link-to-advert-on-find"]').should("have.attr", "href");
    cy.contains("View or change your advert");
  });
});
