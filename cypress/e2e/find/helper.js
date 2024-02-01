import dayjs from "dayjs";

export const checkInfoScreen = (headerText, ...bodyTexts) => {
  cy.get("h1").should("have.text", headerText);
  bodyTexts.forEach((bodyText) => {
    cy.contains(bodyText);
  });
};

export const checkSuccessBanner = (headerElement, bodyElement, bodyText) => {
  cy.get(headerElement).should("have.text", "Success");
  cy.get(bodyElement).should("contain.text", bodyText);
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
    cy.wait(750);
  });
};

export const convertDateToString = (date) => {
  const dateFormat = "D MMMM YYYY [at] h:mma";
  const original = dayjs(date).format(dateFormat);
  const originalInc = dayjs(date).add(1, "minute").format(dateFormat);
  const originalDec = dayjs(date).subtract(1, "minute").format(dateFormat);
  return [original, originalInc, originalDec];
};
