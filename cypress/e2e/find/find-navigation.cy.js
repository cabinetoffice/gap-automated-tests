describe("Find a Grant - Navigation", () => {
  it("loads the page", () => {
    cy.contains("Find a grant");
  });

  it("Can navigate to information pages", () => {
    cy.contains("Find a grant");

    // navigates to about us menu
    cy.get('[data-cy="cyaboutGrantsPageLink"]').click();

    cy.get('[data-cy="cyAbout usTitle"]').should("have.text", "About us");
  });
});
