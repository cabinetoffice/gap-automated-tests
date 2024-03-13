import { signInAsAdmin, signInToIntegrationSite } from '../../common/common';

describe('Admin co-authorship', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
  });

  it('manages editors', () => {
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsAdmin();
  });
});
