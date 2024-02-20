export function checkTableContent(today) {
  // Check for keys belonging to "CypressApiKeysTestOrg"
  for (let i = 0; i < 6; i++) {
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

  // Check for keys belonging to "CypressApiKeysEvilOrg"
  for (let i = 6; i < 10; i++) {
    const paddedNumber = (i + 1).toString().padStart(3, "0");
    const keyName = `Org2Cypress${paddedNumber}`;

    cy.log(`Checking row ${i + 1} with key name ${keyName}`);
    cy.get(
      `[data-cy="admin-dashboard-list-table-row-API-key-${keyName}"]`,
    ).should("have.text", keyName);
    cy.get(
      `[data-cy="admin-dashboard-list-table-row-Department-${keyName}"]`,
    ).should("have.text", "CypressApiKeysEvilOrg");
    cy.get(
      `[data-cy="admin-dashboard-list-table-row-Created-${keyName}"]`,
    ).should("have.text", today);
    cy.get(
      `[data-cy="admin-dashboard-list-table-row-Revoked-${keyName}-link"]`,
    ).should("contain", "Revoke");
  }
}
