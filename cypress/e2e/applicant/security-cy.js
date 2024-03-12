import {
  BASE_URL,
  signInAsApplyApplicant,
  signInToIntegrationSite,
} from '../../common/common';

const API_DASHBOARD_BASE_URL = BASE_URL + '/find/api/admin';

describe('Api Dashboard Security', () => {
  beforeEach(() => {
    signInToIntegrationSite();
  });

  it('Applicant users should not have access to any API dashboard endpoints', () => {
    cy.log('Clicking Sign in as an Applicant');
    cy.get('[data-cy=cySignInAndApply-Link]').click();

    signInAsApplyApplicant();

    cy.getCookie('user-service-token').then((cookie) => {
      cy.log('sending a POST request to /api-keys/create');
      cy.request(
        {
          failOnStatusCode: false,
          method: 'POST',
          url: `${API_DASHBOARD_BASE_URL}/api-keys/create`,
          headers: {
            Cookie: cookie.value,
          },
        },
        {
          keyName: 'Cypress',
        },
      ).then((r) => {
        expect(r.status).to.eq(500);
        expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
      });

      cy.log('sending a GET request to /api-keys/create');
      cy.request(
        {
          failOnStatusCode: false,
          method: 'GET',
          url: `${API_DASHBOARD_BASE_URL}/api-keys/create`,
          headers: {
            Cookie: cookie.value,
          },
        },
        {
          keyName: 'Cypress',
        },
      ).then((r) => {
        expect(r.status).to.eq(500);
        expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
      });

      cy.log('sending a GET request to /api-keys');
      cy.request(
        {
          failOnStatusCode: false,
          method: 'GET',
          url: `${API_DASHBOARD_BASE_URL}/api-keys`,
          headers: {
            Cookie: cookie.value,
          },
        },
        {
          keyName: 'Cypress',
        },
      ).then((r) => {
        expect(r.status).to.eq(500);
        expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
      });

      cy.log('sending a GET request to /api-keys/manage');
      cy.request(
        {
          failOnStatusCode: false,
          method: 'GET',
          url: `${API_DASHBOARD_BASE_URL}/api-keys/manage`,
          headers: {
            Cookie: cookie.value,
          },
        },
        {
          keyName: 'Cypress',
        },
      ).then((r) => {
        expect(r.status).to.eq(500);
        expect(r.redirects[0]).to.contain(`/find/api/admin/error`);
      });
    });
  });
});
