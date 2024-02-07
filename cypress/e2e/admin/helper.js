import dayjs from "dayjs";
import {
  clickSaveAndContinue,
  downloadFileFromLink,
  log,
  yesQuestionComplete,
} from "../../common/common";

const getIframeBody = (iFrameSelector) =>
  cy
    .get(iFrameSelector, { timeout: 8000 })
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap);

export function publishAdvert(scheduled) {
  cy.get('[data-cy="cy-publish-advert-button"]').click();

  cy.get(
    `[data-cy="cy-button-${
      scheduled ? "Schedule my advert" : "Confirm and publish"
    }"]`,
  ).click();

  cy.get(
    `[data-cy="cy-advert-${scheduled ? "scheduled" : "published"}"]`,
  ).should("exist");

  cy.get('[data-cy="back-to-my-account-button"]').click();
}

export function advertSection5() {
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

export function advertSection4() {
  cy.get(
    '[data-cy="cy-4. How to apply-sublist-task-name-Link to application form"]',
  ).click();

  // TODO copy url from application form
  cy.get('[data-cy="cy-grantWebpageUrl-text-input"]').click();
  cy.get('[data-cy="cy-grantWebpageUrl-text-input"]').type(
    "https://www.google.com",
    { force: true },
  );

  yesQuestionComplete();
}

export function advertSection3(scheduled) {
  cy.get(
    "[data-cy='cy-3. Application dates-sublist-task-name-Opening and closing dates']",
  ).click();

  const today = new Date();
  cy.get("[data-cy=cyDateFilter-grantApplicationOpenDateDay]").click().clear();
  cy.get("[data-cy=cyDateFilter-grantApplicationOpenDateDay]").type("1", {
    force: true,
  });
  cy.get("[data-cy=cyDateFilter-grantApplicationOpenDateMonth]")
    .clear()
    .type("1", {
      force: true,
    });
  cy.get("[data-cy=cyDateFilter-grantApplicationOpenDateYear]")
    .clear()
    .type(`${today.getFullYear() + (scheduled ? 1 : 0)}`, { force: true });

  cy.get("[data-cy=cyDateFilter-grantApplicationCloseDateDay]")
    .clear()
    .type("31", {
      force: true,
    });
  cy.get("[data-cy=cyDateFilter-grantApplicationCloseDateMonth]")
    .clear()
    .type("1", {
      force: true,
    });
  cy.get("[data-cy=cyDateFilter-grantApplicationCloseDateYear]")
    .clear()
    .type(`${today.getFullYear() + 1}`, { force: true });

  yesQuestionComplete();
}

export function advertSection2() {
  cy.get(
    "[data-cy='cy-2. Award amounts-sublist-task-name-How much funding is available?']",
  ).click();

  cy.get("[data-cy=cy-grantTotalAwardAmount-text-input-numeric]").click();
  cy.get("[data-cy=cy-grantTotalAwardAmount-text-input-numeric]").type(
    "10000",
    { force: true },
  );
  cy.get("[data-cy=cy-grantMaximumAward-text-input-numeric]").type("50", {
    force: true,
  });
  cy.get("[data-cy=cy-grantMinimumAward-text-input-numeric]").type("10", {
    force: true,
  });

  yesQuestionComplete();
}

export function advertSection1(GRANT_NAME) {
  cy.get("[data-cy=cyBuildAdvert]").click();

  cy.get("[data-cy=cy-name-text-input]").click();
  cy.get("[data-cy=cy-name-text-input]").type(GRANT_NAME, { force: true });

  clickSaveAndContinue();

  cy.get(
    "[data-cy='cy-1. Grant details-sublist-task-name-Short description']",
  ).click();

  cy.get("[data-cy=cy-grantShortDescription-text-area]").click();
  cy.get("[data-cy=cy-grantShortDescription-text-area]").type(
    "This is a short description",
    { force: true },
  );

  yesQuestionComplete();

  cy.contains("Where is the grant available?");

  cy.get("[data-cy=cy-checkbox-value-National]").click();

  yesQuestionComplete();

  cy.contains("Which organisation is funding this grant?");

  cy.get("[data-cy=cy-grantFunder-text-input]").click();
  cy.get("[data-cy=cy-grantFunder-text-input]").type("The Cabinet Office", {
    force: true,
  });

  yesQuestionComplete();

  cy.contains("Who can apply for this grant?");

  cy.get("[data-cy='cy-checkbox-value-Personal / Individual']").click();

  yesQuestionComplete();
}

export const convertDateToString = (date, dateFormat = "YYYY-MM-DD") =>
  dayjs(date).format(dateFormat);

export const publishApplication = (choice) => {
  cy.contains("Manage this grant").click();
  // feedback form
  log(
    "Scheme details with a completed application journey - submitting feedback",
  );
  if (choice === true) {
    cy.contains("Very satisfied").click();
  }
  cy.get('[data-cy="cy-comment-text-area"]').type(
    "<INITIATING_DEMONSTRATION_OF_SATISFACTION>\n" +
      "Cypress-bot would be satisifed with this service, were it capable of experience emotion.\n" +
      "<CEASING_DEMONSTRATION_OF_SATISFACTION/>",
  );
  cy.contains("Send feedback").click();
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
    ".submissions-download-table tbody .govuk-table__row";
  cy.get(tableRowSelector).each((row, index) => {
    if (row.text().includes(submissionFileName)) {
      downloadFileFromLink(
        cy.get(".submissions-download-table a").eq(index),
        "submission_export.zip",
      );
      return false;
    }
  });
};

export const validateSubmissionDownload = (schemeId, filenameSuffix = 1) => {
  cy.task("getExportedSubmissionUrlAndLocation", schemeId).then(
    (submission) => {
      log(JSON.stringify(submission));

      cy.visit(submission.url);

      const submissionFileName = submission.location
        .split(".zip")[0]
        .substring(0, 50);

      downloadSubmissionExportZip(submissionFileName);

      cy.unzip({ path: "cypress/downloads/", file: "submission_export.zip" });

      const folder = "cypress/downloads/unzip/submission_export";

      cy.readFile(`${folder}/${submissionFileName}_${filenameSuffix}.odt`);
    },
  );
};
