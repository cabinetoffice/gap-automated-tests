import {
  clickText,
  signInAsFindApplicant,
  signInToIntegrationSite,
} from "../../common/common";

describe("Find a Grant - Newsletter Notifications", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    cy.task("setUpFindData");
    signInToIntegrationSite();
  });

  it("Can subscribe and unsubscribe from newsletter notifications", () => {
    cy.contains("Find a grant");
    clickText("Sign up and we will email you when new grants have been added.");
    signInAsFindApplicant();
    cy.get(".govuk-heading-m").contains("Updates about new grants");
    cy.get('[data-cy="cyViewWeeklyUpdatesButton"]').should(
      "have.text",
      "View Updates",
    );
    cy.contains("You signed up for updates");
    clickText("Unsubscribe from updates about new grants");
    clickText("Yes, unsubscribe");
    cy.get(".govuk-notification-banner__heading").contains(
      "You have unsubscribed from updates about new grants.",
    );
    cy.get("[data-cy='cyManageYourNotificationsNoData']").contains(
      "You are not signed up for any notifications, and you don't have any saved searches.",
    );
  });
});
