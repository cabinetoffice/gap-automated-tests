import {
  searchForGrant,
  signInToIntegrationSite,
  clickText,
  signInAsFindApplicant,
  ONE_LOGIN_BASE_URL,
} from "../../common/common";

import { TEST_GRANT_NAME } from "../../common/constants";

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

const convertDate = (subscribedDate) => {
  const dateOfSubscription = new Date(subscribedDate);
  const month = dateOfSubscription.toLocaleString([], {
    month: "long",
    hour12: true,
  });
  console.log("month: " + month);
  const day = dateOfSubscription.getDay();
  console.log(
    "day (should be 14): " +
      day.toLocaleString([], {
        day: "numeric",
      }),
  );
  const year = dateOfSubscription.getFullYear();
  console.log("Year: " + year);
  const hourAndPm = dateOfSubscription
    .toLocaleString([], {
      hour: "",
      hour12: true,
    })
    .split(" ");
  console.log("Hour: " + hourAndPm);
  const minutes = dateOfSubscription.getMinutes();
  console.log("Minutes : " + minutes);
  // const amOrPm = dateOfSubscription.get
  // console.log();

  const dateAsString =
    day +
    " " +
    month +
    " " +
    year +
    " at " +
    hourAndPm[0] +
    ":" +
    minutes +
    hourAndPm[1];
  console.log(dateAsString);
  return dateAsString;
};

const countNumberOfPages = () => {
  cy.get('[data-cy="cyPaginationComponent"]')
      .find("ul")
      .children("li")
      .last()
      .prev()
      .children("a")
      .invoke("attr", "href")
      .then((href) => {
        cy.wrap(+href.split("page=")[1] - 1).as("pageCount");
      });
};

const clickThroughPagination = (numberOfPages) => {
  Cypress._.times(numberOfPages, () => {
    cy.get('[data-cy="cyPaginationNextButton"]').click();
    cy.wait(300);

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

    searchForGrant(TEST_GRANT_NAME);

    cy.contains(TEST_GRANT_NAME);

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

    cy.get('[data-cy="cySearch grantsPageLink"]').click();
    clickText("Back");

    // journey when already logged in
    cy.get('[data-cy="cyManageNotificationsHomeLink"]').click();
    cy.get('[data-cy="cyManageYourNotificationsHeading"]').should(
      "have.text",
      "Manage your notifications and saved searches",
    );
    checkForNoSavedSearchesOrNotifications();
  });

  it("can subscribe and unsubscribe from updates for a SINGLE grant", () => {
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
        "#govuk-notification-banner-title",
        '[data-cy="cyImportantBannerBody"]',
        "You have signed up for updates about",
    );

    cy.get(
        '[data-cy="cyCypress - Automated E2E Test GrantUnsubscriptionTableName"]',
    ).should("have.text", "Cypress - Automated E2E Test Grant");

    // TODO : Implement Date Assertions
    cy.get("@subscribedDate").then((subscribedDateTimestamp) => {
      const subscriptionDate = convertDate(subscribedDateTimestamp);

      cy.get(
          '[data-cy="cyCypress - Automated E2E Test GrantUnsubscriptionTableName"]',
      )
          .parent()
          .next()
          .should(
              "contain.text",
              "You signed up for updates on " + subscriptionDate,
          );
    });

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

  it("can navigate through pagination and limit search term to < 100 characters", () => {
    cy.contains("Find a grant");

    cy.get('[data-cy="cySearchGrantsBtn"]').click();

    cy.get('[data-cy="cyGrantsFoundMessage"]').should(
      "not.contain.text",
      "We've found 0",
    );

    countNumberOfPages();

    cy.get("@pageCount").then((pageCount) => {
      clickThroughPagination(pageCount);
    });
    cy.get('[data-cy="cyPaginationNextButton"]').should("not.exist");
    cy.get('[data-cy="cyPaginationPageNumber1"]').click();

    //perform invalid search
    const invalidSearch = "x".repeat(101);
    cy.get('[data-cy="cySearchAgainInput"]').click().type(invalidSearch);
    cy.get('[data-cy="cySearchAgainButton"]').click();

    cy.get('[data-cy="cyErrorBanner"]').contains("h2", "There is a problem");
    cy.get('[data-cy="cyError_searchAgainTermInput"]').contains(
      "a",
      "Search term must be 100 characters or less",
    );

    cy.get('[data-cy="cySearchAgainInput"]').click().type(TEST_GRANT_NAME);
    cy.get('[data-cy="cySearchAgainButton"]').click();

    cy.get('[data-cy="cyGrantNameAndLink"]').should(
      "include.text",
      TEST_GRANT_NAME,
    );
  });

  it("Can subscribe and unsubscribe from newsletter notifications", () => {
    cy.contains("Find a grant");
    clickText("Sign up and we will email you when new grants have been added.");
    clickText("Continue to One Login");
    cy.origin(ONE_LOGIN_BASE_URL, () => {
      cy.get('[id="sign-in-button"]').click();
    });
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
