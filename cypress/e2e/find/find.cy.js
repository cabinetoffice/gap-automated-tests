import {
  searchForGrant,
  signInToIntegrationSite,
  clickText,
  signInAsFindApplicant,
  ONE_LOGIN_BASE_URL,
} from "../../common/common";
import { TEST_GRANT_NAME } from "../../common/constants";

const checkManageNotificationsInfoScreen = () => {
  cy.get("h1").should("have.text", "Manage your notifications");
};

const checkForNoSavedSearchesOrNotifications = () => {
  cy.get('[data-cy="cyManageYourNotificationsNoData"]').should(
    "have.text",
    "You are not signed up for any notifications, and you don't have any saved searches.",
  );
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
      cy.contains(key);
      cy.contains(value);
    });
  });

  it("can manage notifications through One Login when there are no notifications or saved searches", () => {
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
});
