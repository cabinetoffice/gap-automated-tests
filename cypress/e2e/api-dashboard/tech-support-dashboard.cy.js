import {
  BASE_URL,
  signInAsTechnicalSupport,
  signInToIntegrationSite,
  signOut,
} from '../../common/common';

const API_DASHBOARD_BASE_URL = BASE_URL + '/find/api/admin';

describe('API Dashboard', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('deleteAPIKeysFromAwsForTechSupport');
    cy.task('setUpApplyData');
    signInToIntegrationSite();

    cy.log('Clicking Sign in as a Technical Support user');
    cy.get('[data-cy=cySignInAndApply-Link]').click();

    signInAsTechnicalSupport();
  });

  it('Technical Support users should not have access to any Super Admin API Dashboard endpoints', () => {
    cy.getCookie('user-service-token').then((cookie) => {
      cy.request(
        {
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
        expect(r.status).to.eq(200);
        expect(r.redirects[0]).to.contain(`/api-keys/error`);
        expect(r.body).to.contain('Something went wrong');
      });
    });

    cy.log('signing out');
    signOut();
  });
});
