export const checkManageNotificationsInfoScreen = () => {
  cy.get("h1").should("have.text", "Manage your notifications");
};

export const checkForNoSavedSearchesOrNotifications = () => {
  cy.get('[data-cy="cyManageYourNotificationsNoData"]').should(
    "have.text",
    "You are not signed up for any notifications, and you don't have any saved searches.",
  );
};

export const createSavedSearch = (searchTerm) => {
  cy.get('[data-cy="cyNameThisSearchInput"]').type(searchTerm);
  cy.get('[data-cy="cySaveAndContinueButton"]').click();
  cy.get('[data-cy="cy-radio-yes"]').click();
  cy.get('[data-cy="cySubmitNotificationsChoice"]').click();
};

export const countNumberOfPages = () => {
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

export const clickThroughPagination = (numberOfPages) => {
  Cypress._.times(numberOfPages, () => {
    cy.get('[data-cy="cyPaginationNextButton"]').click();
    cy.wait(300);
  });
};
