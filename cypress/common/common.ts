export const BASE_URL = Cypress.env("applicationBaseUrl");
export const ONE_LOGIN_BASE_URL = Cypress.env("oneLoginSandboxBaseUrl");
export const POST_LOGIN_BASE_URL = Cypress.env("postLoginBaseUrl");

export const signInWithOneLoginApply = (email: string, password: string) => {
  cy.contains("Sign in with GOV.UK One Login").click();
  cy.origin(ONE_LOGIN_BASE_URL, () => {
    cy.contains("Sign in").click();
  });
  signInWithOneLogin(email, password);
};

export const signInWithOneLogin = (email: string, password: string) => {
  cy.origin(
    ONE_LOGIN_BASE_URL,
    { args: { email, password } },
    ({ email, password }) => {
      cy.get('[name="email"]').type(email);
      cy.contains("Continue").click();
      cy.get('[name="password"]').type(password);
      cy.contains("Continue").click();
      // Accept the terms of use update on first retry - keeping code in but commented out for now
      // if (currentRetry === 1) {
      //   cy.contains("GOV.UK One Login terms of use update");
      //   cy.contains("Continue").click();
      // }
    },
  );

  // on firefox we get a `t.ctx.req is undefined` exception thrown here, and cypress stops
  // processing on any exception. This line just tells it to continue on an unchecked exception.
  cy.on("uncaught:exception", () => false);
};

export const signInAsApplyApplicant = () => {
  signInWithOneLoginApply(
    Cypress.env("oneLoginApplicantEmail"),
    Cypress.env("oneLoginApplicantPassword"),
  );
};

export const signInAsFindApplicant = () => {
  clickText("Continue to GOV.UK One Login");
  cy.origin(ONE_LOGIN_BASE_URL, () => {
    cy.get('[id="sign-in-button"]').click();
  });
  signInWithOneLogin(
    Cypress.env("oneLoginApplicantEmail"),
    Cypress.env("oneLoginApplicantPassword"),
  );
};

export const signInAsAdmin = () => {
  signInWithOneLoginApply(
    Cypress.env("oneLoginAdminEmail"),
    Cypress.env("oneLoginAdminPassword"),
  );
};

export const signInAsSuperAdmin = () => {
  signInWithOneLoginApply(
    Cypress.env("oneLoginSuperAdminEmail"),
    Cypress.env("oneLoginSuperAdminPassword"),
  );
};

export const signOut = () => {
  cy.contains("Sign out").click();
  cy.contains("Find a grant");
};

const typeIntoSearchBar = (searchTerm: string) => {
  cy.get('[name="searchTerm"]')
    .should("have.attr", "placeholder")
    .should("contains", "enter a keyword or search term here");
  cy.get('[name="searchTerm"]').type(searchTerm);
};

export const searchForGrant = (searchTerm: string) => {
  typeIntoSearchBar(searchTerm);
  cy.get("[data-cy=cySearchGrantsBtn]").click();
};

export const searchAgainForGrant = (searchTerm: string) => {
  typeIntoSearchBar(searchTerm);
  cy.get('[data-cy="cySearchAgainButton"]').click();
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

export const clickText = (text: string) => {
  cy.contains(text).click();
};

export const clickBack = () => {
  clickText("Back");
};

export const clickSave = () => {
  clickText("Save");
};

export const clickContinue = () => {
  clickText("Continue");
};

export const clickSaveAndContinue = () => {
  clickText("Save and continue");
};

export const clickSaveAndExit = () => {
  clickText("Save and exit");
};

export const yesSectionComplete = () => {
  cy.get("[data-cy=cy-radioInput-option-YesIveCompletedThisSection]").click();
  clickSaveAndContinue();
};

export const yesQuestionComplete = () => {
  cy.get("[data-cy=cy-radioInput-option-YesIveCompletedThisQuestion]").click();
  clickSaveAndContinue();
};

export const saveAndExit = () => {
  clickText("Save and exit");
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

export const clickThroughPagination = (pageCount) => {
  Cypress._.times(pageCount, () => {
    cy.get('[data-cy="cyPaginationNextButton"]').click();
    cy.wait(300);
  });
};

export const findGrantOnSearchPage = (grantName, pageCount) => {
  let grantFound = false;
  Cypress._.times(pageCount, () => {
    cy.wait(1000);
    cy.get(".grants_list li h2 a").each(($grant, index) => {
      console.log("GRANT TEXT: " + $grant.text() + "(" + index + ")");
      if (grantFound) {
        return;
      }
      if ($grant.text() === grantName) {
        cy.wrap($grant).click();
        grantFound = true;
      }
    });
    cy.get(".grants_list li h2 a").invoke("map", ($grant) => {
      if (grantFound) {
        return;
      }
      if ($grant.innerText === grantName) {
        cy.wrap($grant).click();
        grantFound = true;
      }
      console.log("GRANT object: " + $grant);
      console.log("grant text: " + $grant.innerText);
    });
    cy.get('[data-cy="cyPaginationNextButton"]').click();
    cy.wait(1000);
  });
};

export const assert200 = (element: Cypress.Chainable) => {
  element
    .should("not.be.disabled")
    .invoke("attr", "href")
    .then((url) => {
      cy.request(url).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
};

export const log = (message: string) => {
  cy.log(message);
  cy.task("log", message);
};
