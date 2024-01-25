export function checkFirst10RowsContent(today) {
  for (let i = 0; i < 10; i++) {
    const paddedNumber = (i + 1).toString().padStart(3, "0");
    const keyName = `Org1Cypress${paddedNumber}`;

    cy.log(`Checking row ${i + 1} with key name ${keyName}`);
    cy.get(
      `[data-cy="admin-dashboard-list-table-row-API-key-${keyName}"]`,
    ).should("have.text", keyName);
    cy.get(
      `[data-cy="admin-dashboard-list-table-row-Department-${keyName}"]`,
    ).should("have.text", "CypressApiKeysTestOrg");
    cy.get(
      `[data-cy="admin-dashboard-list-table-row-Created-${keyName}"]`,
    ).should("have.text", today);
    cy.get(
      `[data-cy="admin-dashboard-list-table-row-Revoked-${keyName}-link"]`,
    ).should("contain", "Revoke");
  }
}

const manageApiKeyPageHref = (pageNumber, filteredDepartmentName) =>
  `/find/api/admin/api-keys/manage?page=${pageNumber}${
    filteredDepartmentName
      ? "&selectedDepartments=" + filteredDepartmentName.replace(" ", "%20")
      : ""
  }`;

export function assertPaginationLinkHasTheCorrectHref(
  pageNumber,
  filteredDepartmentName,
) {
  cy.log(`Checking pagination link for page ${pageNumber}`);
  cy.get(
    `[data-cy="admin-dashboard-pagination-page-${pageNumber}-link"]`,
  ).should(
    "have.attr",
    "href",
    manageApiKeyPageHref(pageNumber, filteredDepartmentName),
  );
}

export function assertPaginationNextItemHasTheCorrectHref(
  expectedPageNumber,
  filteredDepartmentName,
) {
  cy.log(`Checking pagination next link is for page ${expectedPageNumber}`);
  cy.get(`[data-cy="admin-dashboard-pagination-next-page-link"]`).should(
    "have.attr",
    "href",
    manageApiKeyPageHref(expectedPageNumber, filteredDepartmentName),
  );
}

export function assertPaginationItemHasCorrectCssClass(
  pageNumber,
  currentPage,
) {
  const assertion = (currentPage === pageNumber ? "" : "not.") + "have.class";
  cy.log(`Checking css pagination item for page ${pageNumber} is current`);
  cy.get(
    `[data-cy="admin-dashboard-pagination-page-${pageNumber}-item"]`,
  ).should(assertion, "govuk-pagination__item--current");
}

export function assertPaginationItemsDoNotExist(pageNumbers) {
  pageNumbers.forEach((pageNumber) => {
    cy.log(`Checking pagination item for page ${pageNumber} does not exist`);
    cy.get(
      `[data-cy="admin-dashboard-pagination-page-${pageNumber}-item"]`,
    ).should("not.exist");
  });
}

export function assertPaginationPreviousItemHasTheCorrectHref(
  expectedPageNumber,
) {
  cy.log(`Checking pagination previous link is for page ${expectedPageNumber}`);
  cy.get(`[data-cy="admin-dashboard-pagination-previous-page-link"]`).should(
    "have.attr",
    "href",
    manageApiKeyPageHref(expectedPageNumber, ""),
  );
}

// This is a bit complex:
// All pages will have the first and last pagination items (1 and 11)
// Then, each page will have pagination items for just the previous (pageNumber - 1) and next (pageNumber + 2) pages
// EXCEPT for page 4, which has a pagination item for page 2 as well (pageNumber - 2) hence `- (pageNumber === 4 ? 2 : 1)`
export const filterNonExistentPaginationItems = (item, pageNumber) =>
  item === 1 ||
  !(pageNumber - (pageNumber === 4 ? 2 : 1) > item || item > pageNumber + 1) ||
  item === 11;

export const partitionPaginationItems = (pageNumber) =>
  Cypress._.partition([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], (item) =>
    filterNonExistentPaginationItems(item, pageNumber),
  );
