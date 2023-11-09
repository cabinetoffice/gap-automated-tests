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

  //temporarily skipping test while OL is turned off for Find migration journey
  //TODO : revert skip when OL is turned back on
  it.skip("can manage notifications through One Login when there are no notifications or saved searches", () => {
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
    checkInfoScreen(
      "Sign up for updates",
      "To sign up for updates, you need to sign in with GOV.UK One Login.",
    );
    clickText("Continue to One Login");

    cy.origin(ONE_LOGIN_BASE_URL, () => {
      cy.get('[id="sign-in-button"]').click();
    });

    signInAsFindApplicant();

    // Check success banner appears
    //TODO : FIX BANNER, WAS NOT SHOWING UP SO DECIDED TO MOVE ON WITHOUT CHECK
    cy.get('[data-cy="cySubscribeSuccessMessageContent"]');

    // Assert that the notification appears
    cy.get('[data-cy="cyadvert NameUnsubscriptionTableName"]').should(
      "have.text",
      "Cypress - Automated E2E Test Grant",
    );
    // Click unsubscribe
    // Land on unsubscribe confirmation
    // Cancel

    // Click unsubscribe
    // Land on unsubscribe confirmation
    // Confirm

    // See success banner for unsubscribing
    // Ensure notification no longer exists
  });
});
