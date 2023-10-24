import {
  searchForGrant,
  signInToIntegrationSite,
  clickText,
  signInAsFindApplicant,
  ONE_LOGIN_BASE_URL,
} from "../../common/common";

const checkManageNotificationsInfoScreen = () => {
  cy.get("h1").should("have.text", "Manage your notifications");
  cy.contains(
    "To manage your notifications, you need to sign in with GOV.UK One Login.",
  );
  cy.contains("If you do not have a GOV.UK One Login, you can create one.");
  cy.contains(
    "If you want to unsubscribe from notifications without creating a GOV.UK One Login, you can use the " +
      "unsubscribe link in the emails we send to you.",
  );
};

const checkSavedSearchesOrNotifications = (userHasSearchesOrNotifications) => {
  if (!userHasSearchesOrNotifications) {
    cy.get('[data-cy="cyManageYourNotificationsNoData"]').should(
      "have.text",
      "You are not signed up for any notifications, and you don't have any saved searches.",
    );
  } else {
    // TODO: Implement test to ensure user has notifications or saved searches
  }
};

describe("Find a Grant", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("loads the page", () => {
    cy.contains("Find a grant");
  });

  it("can search for a grant", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    searchForGrant("Cypress");

    cy.contains("Cypress - Automated E2E Test Grant");

    const grantData = {
      Location: "National",
      "Funding organisation": "The Department of Business",
      "Who can apply": "Non-profit",
      "How much you can get": "From £1 to £10,000",
      "Total size of grant scheme": "£1 million",
      "Opening date": "24 August 2023, 12:01am",
      "Closing date": "24 October 2040, 11:59pm",
    };
    Object.entries(grantData).forEach(([key, value]) => {
      cy.contains(key);
      cy.contains(value);
    });
  });

  it.only("can manage notifications through One Login", () => {
    // journey when not logged in
    cy.contains("Find a grant");
    cy.get('[data-cy="cyManageNotificationsHomeLink"]').click();

    checkManageNotificationsInfoScreen();

    clickText("Continue to One Login");

    cy.origin(ONE_LOGIN_BASE_URL, () => {
      cy.get('[id="sign-in-button"]').click();
    });

    signInAsFindApplicant();

    cy.get('[data-cy="cyManageYourNotificationsHeading"]').should(
      "have.text",
      "Manage your notifications and saved searches",
    );
    checkSavedSearchesOrNotifications(false);

    cy.get('[data-cy="cyhomePageLink"]').click();

    // journey when already logged in
    cy.get('[data-cy="cyManageNotificationsHomeLink"]').click();
    cy.get('[data-cy="cyManageYourNotificationsHeading"]').should(
      "have.text",
      "Manage your notifications and saved searches",
    );
  });
});
