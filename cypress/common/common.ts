export const BASE_URL = Cypress.env("applicationBaseUrl");
export const ONE_LOGIN_BASE_URL = Cypress.env("oneLoginSandboxBaseUrl");

export const signInWithOneLogin = (email: string, password: string) => {
  cy.contains("Sign in with GOV.UK One Login").click();

  cy.origin(
    ONE_LOGIN_BASE_URL,
    { args: { email, password } },
    ({ email, password }) => {
      cy.contains("Sign in").click();
      cy.get('[name="email"]').type(email);
      cy.contains("Continue").click();
      cy.get('[name="password"]').type(password);
      cy.contains("Continue").click();
      // TODO TD-31
      // cy.contains("Continue").click();
    },
  );
  
  // on firefox we get a `t.ctx.req is undefined` exception thrown here, and cypress stops
  // processing on any exception. This line just tells it to continue on an unchecked exception.
  cy.on("uncaught:exception", () => false);
};

export const signInAsApplicant = () => {
  signInWithOneLogin(
    Cypress.env("oneLoginApplicantEmail"),
    Cypress.env("oneLoginApplicantPassword"),
  );
};

export const signInAsAdmin = () => {
  signInWithOneLogin(
    Cypress.env("oneLoginAdminEmail"),
    Cypress.env("oneLoginAdminPassword"),
  );
};

export const signInAsSuperAdmin = () => {
  signInWithOneLogin(
    Cypress.env("oneLoginSuperAdminEmail"),
    Cypress.env("oneLoginSuperAdminPassword"),
  );
};

export const searchForGrant = (searchTerm: string) => {
  cy.get('[name="searchTerm"]')
    .should("have.attr", "placeholder")
    .should("contains", "enter a keyword or search term here");
  cy.get('[name="searchTerm"]').type(searchTerm);

  cy.get("[data-cy=cySearchGrantsBtn]").click();
};

export const signInToIntegrationSite = () => {
  console.log(BASE_URL);
  // We have to visit base url first to prevent issues with cross-origin
  cy.visit(BASE_URL);
  // then log in to the One Login integration environment to prevent the popup appearing
  const username = Cypress.env("oneLoginSandboxUsername");
  const password = Cypress.env("oneLoginSandboxPassword");

  cy.visit(
    `https://${username}:${password}@${ONE_LOGIN_BASE_URL}/sign-in-or-create`,
    {
      failOnStatusCode: false,
    },
  );
  // then return back to the base url to execute the tests
  cy.visit(BASE_URL);
  cy.contains("Reject analytics cookies").click();
};

export const save = () => {
  cy.contains("Save").click();
};

export const saveAndContinue = () => {
  cy.contains("Save and continue").click();
};

export const yesSectionComplete = () => {
  cy.get("[data-cy=cy-radioInput-option-YesIveCompletedThisSection]").click();
  saveAndContinue();
};

export const yesQuestionComplete = () => {
  cy.get("[data-cy=cy-radioInput-option-YesIveCompletedThisQuestion]").click();
  saveAndContinue();
};

export const saveAndExit = () => {
  cy.get('[data-cy="cy-button-Save and exit"]').click();
};
