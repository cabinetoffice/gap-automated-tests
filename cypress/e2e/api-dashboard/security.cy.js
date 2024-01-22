import {
  BASE_URL,
  signInAsAdmin,
  signInAsApplyApplicant,
  signInAsSuperAdmin,
  signInAsTechnicalSupport,
  signInToIntegrationSite,
} from "../../common/common";

import {
  ERROR_PAGE_BODY_SUPER_ADMIN,
  ERROR_PAGE_BODY_TECHNICAL_SUPPORT,
} from "../../utils/errorPageString";

const API_DASHBOARD_BASE_URL = BASE_URL + "/find/api/admin";

describe("Api Dashboard Security", () => {
  describe("Super Admin Users", () => {
    beforeEach(() => {
      signInToIntegrationSite();

      cy.log("Clicking Sign in as a superAdmin");
      cy.get("[data-cy=cySignInAndApply-Link]").click();

      signInAsSuperAdmin();

      cy.log("Clicking Manage API Keys");
      cy.get('[data-cy="cytechnicalDashPageLink"] > .govuk-link').click();
    });

    it("shoud not be able to send a POST request to /api-keys/create", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            method: "POST",
            url: `${API_DASHBOARD_BASE_URL}/api-keys/create`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(200);
          expect(r.redirects[0]).to.contain(`/api-keys/error`);
          expect(r.body).to.eq(ERROR_PAGE_BODY_SUPER_ADMIN);
        });
      });
    });

    it("shoud not be able to send a GET request to /api-keys/create", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            method: "GET",
            url: `${API_DASHBOARD_BASE_URL}/api-keys/create`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(200);
          expect(r.redirects[0]).to.contain(`/api-keys/error`);
          expect(r.body).to.eq(ERROR_PAGE_BODY_SUPER_ADMIN);
        });
      });
    });

    it("shoud not be able to send a POST request to /api-keys", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            method: "GET",
            url: `${API_DASHBOARD_BASE_URL}/api-keys`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(200);
          expect(r.redirects[0]).to.contain(`/api-keys/error`);
          expect(r.body).to.eq(ERROR_PAGE_BODY_SUPER_ADMIN);
        });
      });
    });
  });

  describe("Technical Support Users", () => {
    beforeEach(() => {
      signInToIntegrationSite();

      cy.log("Clicking Sign in as a superAdmin");
      cy.get("[data-cy=cySignInAndApply-Link]").click();

      signInAsTechnicalSupport();
    });

    it("shoud not be able to send a GET request to /api-keys/manage", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            method: "GET",
            url: `${API_DASHBOARD_BASE_URL}/api-keys/manage`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(200);
          expect(r.redirects[0]).to.contain(`/api-keys/error`);
          expect(r.body).to.eq(ERROR_PAGE_BODY_TECHNICAL_SUPPORT);
        });
      });
    });
  });

  describe("Admin Users", () => {
    beforeEach(() => {
      signInToIntegrationSite();

      cy.log("Clicking Sign in as a superAdmin");
      cy.get("[data-cy=cySignInAndApply-Link]").click();

      signInAsAdmin();
    });

    it("shoud not be able to send a POST request to /api-keys/create", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            failOnStatusCode: false,
            method: "POST",
            url: `${API_DASHBOARD_BASE_URL}/api-keys/create`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(500);
          expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
        });
      });
    });

    it("shoud not be able to send a GET request to /api-keys/create", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            failOnStatusCode: false,
            method: "GET",
            url: `${API_DASHBOARD_BASE_URL}/api-keys/create`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(500);
          expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
        });
      });
    });

    it("shoud not be able to send a POST request to /api-keys", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            failOnStatusCode: false,
            method: "GET",
            url: `${API_DASHBOARD_BASE_URL}/api-keys`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(500);
          expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
        });
      });
    });

    it("shoud not be able to send a GET request to /api-keys/manage", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            failOnStatusCode: false,
            method: "GET",
            url: `${API_DASHBOARD_BASE_URL}/api-keys/manage`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(500);
          expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
        });
      });
    });
  });

  describe("Applicant Users", () => {
    beforeEach(() => {
      signInToIntegrationSite();

      cy.log("Clicking Sign in as a superAdmin");
      cy.get("[data-cy=cySignInAndApply-Link]").click();

      signInAsApplyApplicant();
    });

    it("shoud not be able to send a POST request to /api-keys/create", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            failOnStatusCode: false,
            method: "POST",
            url: `${API_DASHBOARD_BASE_URL}/api-keys/create`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(500);
          expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
        });
      });
    });

    it("shoud not be able to send a GET request to /api-keys/create", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            failOnStatusCode: false,
            method: "GET",
            url: `${API_DASHBOARD_BASE_URL}/api-keys/create`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(500);
          expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
        });
      });
    });

    it("shoud not be able to send a POST request to /api-keys", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            failOnStatusCode: false,
            method: "GET",
            url: `${API_DASHBOARD_BASE_URL}/api-keys`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(500);
          expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
        });
      });
    });

    it("shoud not be able to send a GET request to /api-keys/manage", () => {
      cy.getCookie("user-service-token").then((cookie) => {
        cy.log(cookie.value);
        cy.request(
          {
            failOnStatusCode: false,
            method: "GET",
            url: `${API_DASHBOARD_BASE_URL}/api-keys/manage`,
            headers: {
              Cookie: cookie.value,
            },
          },
          {
            keyName: "Cypress",
          },
        ).then((r) => {
          expect(r.status).to.eq(500);
          expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
        });
      });
    });
  });
});
