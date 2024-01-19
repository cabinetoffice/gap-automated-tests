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

export function paginationLinkHasTheRightHref(
  pageNumber,
  filteredDepartmentName,
) {
  cy.log(`Checking pagination link for page ${pageNumber}`);
  cy.get(
    `[data-cy="admin-dashboard-pagination-page-${pageNumber}-link"]`,
  ).should(
    "have.attr",
    "href",
    `/find/api/admin/api-keys/manage?page=${pageNumber}${
      filteredDepartmentName
        ? "&selectedDepartments=" + filteredDepartmentName.replace(" ", "%20")
        : ""
    }`,
  );
}

export function paginationNextItemHasTheRightHref(
  expectedPageNumber,
  filteredDepartmentName,
) {
  cy.log(`Checking pagination next link is for page ${expectedPageNumber}`);
  cy.get(`[data-cy="admin-dashboard-pagination-next-page-link"]`).should(
    "have.attr",
    "href",
    `/find/api/admin/api-keys/manage?page=${expectedPageNumber}${
      filteredDepartmentName
        ? "&selectedDepartments=" + filteredDepartmentName.replace(" ", "%20")
        : ""
    }`,
  );
}

export function paginationItemHasCurrentAsCssClass(pageNumber) {
  cy.log(`Checking css pagination item for page ${pageNumber} is current`);
  cy.get(
    `[data-cy="admin-dashboard-pagination-page-${pageNumber}-item"]`,
  ).should("have.class", "govuk-pagination__item--current");
}

export function paginationItemHasNotCurrentAsCssClass(pageNumber) {
  cy.log(`Checking css pagination item for page ${pageNumber} is not current`);
  cy.get(
    `[data-cy="admin-dashboard-pagination-page-${pageNumber}-item"]`,
  ).should("not.have.class", "govuk-pagination__item--current");
}

export function paginationItemsDoesNotExist(pageNumbers) {
  pageNumbers.forEach((pageNumber) => {
    cy.log(`Checking pagination item for page ${pageNumber} does not exist`);
    cy.get(
      `[data-cy="admin-dashboard-pagination-page-${pageNumber}-item"]`,
    ).should("not.exist");
  });
}

export function paginationPreviousItemHasTheRightHref(expectedPageNumber) {
  cy.log(`Checking pagination previous link is for page ${expectedPageNumber}`);
  cy.get(`[data-cy="admin-dashboard-pagination-previous-page-link"]`).should(
    "have.attr",
    "href",
    `/find/api/admin/api-keys/manage?page=${expectedPageNumber}`,
  );
}
