import {
  searchForGrant,
  signInToIntegrationSite,
  clickText,
  signInAsFindApplicant,
  ONE_LOGIN_BASE_URL,
} from "../../common/common";

const checkInfoScreen = (headerText, bodyText) => {
  cy.get("h1").should("have.text", headerText);
  cy.contains(bodyText);
};

const checkForNoSavedSearchesOrNotifications = () => {
  cy.get('[data-cy="cyManageYourNotificationsNoData"]').should(
    "have.text",
    "You are not signed up for any notifications, and you don't have any saved searches.",
  );
};

const checkSuccessBanner = (headerElement, bodyElement, bodyText) => {
  cy.get(headerElement).should("have.text", "Success");
  cy.get(bodyElement).should("contain.text", bodyText);
};

// TODO: Implement date assertions - make sure format matches dates used on site
const convertDate = (subscribedDate) => {
  const dateOfSubscription = new Date(subscribedDate);
  return dateOfSubscription.toLocaleString([], {
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
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

  it("Interacts with the home page and enters a search term > 100 characters", () => {
    cy.contains("Find a grant");

    //navigates to about us menu
    cy.get('[data-cy="cyaboutGrantsPageLink"]').click();

    cy.get('[data-cy="cyAbout usTitle"]').should("have.text", "About us");

    cy.get('[data-cy="cyhomePageLink"]')
      .children("a")
      .should("have.text", "Home")
      .click();

    //browse grants and perform invalid search on home page(> 100 characters)
    cy.get('[data-cy="cyBrowseGrantsHomePageTextLink"]').click();

    cy.get('[data-cy="cyhomePageLink"]')
      .children("a")
      .should("have.text", "Home")
      .click();

    //perform invalid search
    const invalidSearch = "x".repeat(101);
    cy.get('[data-cy="cyHomePageSearchInput"]').click().type(invalidSearch);

    cy.get('[data-cy="cySearchGrantsBtn"]').click();

    //assert the error banner is there and contains correct text
    cy.get('[data-cy="cyErrorBannerHeading"]').should(
      "have.text",
      "There is a problem",
    );

    cy.get('[data-cy="cyError_searchAgainTermInput"]').should(
      "have.text",
      "Search term must be 100 characters or less",
    );
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
      "Who can apply": "Personal / Individual",
      "How much you can get": "From £1 to £10,000",
      "Total size of grant scheme": "£1 million",
      "Opening date": "24 August 2023, 12:01am",
      "Closing date": "24 October 2040, 11:59pm",
    };
    Object.entries(grantData).forEach(([key, value]) => {
      cy.get("#cypress_test_advert_contentful_slug").contains(key);
      cy.get("#cypress_test_advert_contentful_slug").contains(value);
    });
  });

  it("can manage notifications through One Login when there are no notifications or saved searches", () => {
    // journey when not logged in
    cy.contains("Find a grant");
    cy.get('[data-cy="cyManageNotificationsHomeLink"]').click();

    checkInfoScreen(
      "Manage your notifications",
      "To manage your notifications, you need to sign in with GOV.UK One Login.",
    );

    clickText("Continue to One Login");

    cy.origin(ONE_LOGIN_BASE_URL, () => {
      cy.get('[id="sign-in-button"]').click();
    });

    signInAsFindApplicant();

    cy.get('[data-cy="cyManageYourNotificationsHeading"]').should(
      "have.text",
      "Manage your notifications and saved searches",
    );
    checkForNoSavedSearchesOrNotifications();

    cy.get('[data-cy="cyhomePageLink"]').click();

    // journey when already logged in
    cy.get('[data-cy="cyManageNotificationsHomeLink"]').click();
    cy.get('[data-cy="cyManageYourNotificationsHeading"]').should(
      "have.text",
      "Manage your notifications and saved searches",
    );
    checkForNoSavedSearchesOrNotifications();
  });

  it.only("can subscribe and unsubscribe from updates for a SINGLE grant", () => {
    cy.task("setUpFindData");
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    // --- UNAUTHENTICATED JOURNEY ---
    // go to home page
    cy.contains("Find a grant");

    // search for and view test grant advert
    searchForGrant("Cypress");
    // cy.get('[data-cy="cyGrantNameAndLink"]').should('have.text', 'Cypress - Automated E2E Test Grant');

    cy.get("#cypress_test_advert_contentful_slug")
      .children("h2")
      .should("have.text", "Cypress - Automated E2E Test Grant")
      .click();

    // click 'Sign up for updates' and continue to One Login
    clickText("Sign up for updates");
    //capture date
    cy.wrap(Date.now()).as("subscribedDate");

    checkInfoScreen(
      "Sign up for updates",
      "To sign up for updates, you need to sign in with GOV.UK One Login.",
    );
    clickText("Continue to One Login");

    cy.origin(ONE_LOGIN_BASE_URL, () => {
      cy.get('[id="sign-in-button"]').click();
    });

    signInAsFindApplicant();

    // check success banner and notification has appeared
    checkSuccessBanner(
      '[data-cy="cyImportantBannerTitle"]',
      '[data-cy="cyImportantBannerBody"]',
      "You have signed up for updates about",
    );

    cy.get(
      '[data-cy="cyCypress - Automated E2E Test GrantUnsubscriptionTableName"]',
    ).should("have.text", "Cypress - Automated E2E Test Grant");

    // TODO : Implement Date Assertions
    // cy.get('@subscribedDate').then((subscribedDateTimestamp) => {
    //   const subscriptionDate = convertDate(subscribedDateTimestamp);
    //   cy.get('[data-cy="cyCypress - Automated E2E Test GrantUnsubscriptionTableName"]')
    //       .parent()
    //       .next()
    //       .should('contain.text',
    //           "You signed up for updates on "
    //           + subscriptionDate.getDay() + " "
    //           + subscriptionDate.getMonth()
    //           + subscriptionDate.getFullYear() + " at "
    //           + subscriptionDate.getHours() + ":" + subscriptionDate.getMinutes());
    //
    // });

    // Cancel unsubscribe action
    clickText("Unsubscribe");
    cy.get('[data-cy="cyUnsubscribeGrantConfirmationPageTitle"]').should(
      "have.text",
      "Are you sure you want to unsubscribe?",
    );
    clickText("Cancel");

    // Unsubscribe from updates
    clickText("Unsubscribe");
    cy.get('[data-cy="cyUnsubscribeConfirmationButton"]').click();

    // Check confirmation banner and that notification has been removed
    checkSuccessBanner(
      "#govuk-notification-banner-title",
      '[data-cy="cySubscribeSuccessMessageContent"]',
      "You have been unsubscribed from",
    );
    checkForNoSavedSearchesOrNotifications();

    // --- AUTHENTICATED JOURNEY ---
    // search for grant
    clickText("Search for grants");
    cy.get('[name="searchTerm"]').type("Cypress");
    cy.get('[data-cy="cySearchAgainButton"]').click();

    cy.get("#cypress_test_advert_contentful_slug")
      .children("h2")
      .should("have.text", "Cypress - Automated E2E Test Grant")
      .click();

    clickText("Sign up for updates");

    checkSuccessBanner(
      "#govuk-notification-banner-title",
      '[data-cy="cySubscribeSuccessMessageContent"]',
      "You have signed up for updates about",
    );

    cy.get(
      '[data-cy="cyCypress - Automated E2E Test GrantUnsubscriptionTableName"]',
    ).should("have.text", "Cypress - Automated E2E Test Grant");

    // Unsubscribe from updates
    clickText("Unsubscribe");
    cy.get('[data-cy="cyUnsubscribeConfirmationButton"]').click();

    // Check confirmation banner and that notification has been removed
    checkSuccessBanner(
      "#govuk-notification-banner-title",
      '[data-cy="cySubscribeSuccessMessageContent"]',
      "You have been unsubscribed from",
    );
    checkForNoSavedSearchesOrNotifications();
  });
});
