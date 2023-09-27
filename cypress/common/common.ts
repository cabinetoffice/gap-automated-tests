export const BASE_URL =
  "https://dev-env.find-a-grant-support-dev.service.cabinetoffice.gov.uk/";

export const signInWithOneLogin = (email: string, password: string) => {
  cy.contains("Sign in with GOV.UK One Login").click();

  cy.origin(
    "https://signin.integration.account.gov.uk",
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
};

export const signInToIntegrationSite = () => {
  // We have to visit base url first to prevent issues with cross-origin
  cy.visit(BASE_URL);
  // then log in to the One Login integration environment to prevent the popup appearing
  const username = Cypress.env("oneLoginSandboxUsername");
  const password = Cypress.env("oneLoginSandboxPassword");
  cy.visit(
    `https://${username}:${password}@signin.integration.account.gov.uk/sign-in-or-create`,
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
