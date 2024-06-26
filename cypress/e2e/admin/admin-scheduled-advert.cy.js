import {
  initialiseAccessibilityLogFile,
  log,
  runAccessibility,
  signInAsAdmin,
  signInToIntegrationSite,
} from '../../common/common';
import { GRANT_NAME, TASKS } from './constants';
import {
  advertSection1,
  advertSection2,
  advertSection3,
  advertSection4,
  advertSection5,
  createGrant,
  publishAdvert,
} from './helper';

const { REMOVE_ADVERT_BY_NAME } = TASKS;

describe('Create a Grant', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
    initialiseAccessibilityLogFile();
  });

  it('View scheme details with a scheduled advert', () => {
    cy.task(REMOVE_ADVERT_BY_NAME, GRANT_NAME);
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    runAccessibility();
    signInAsAdmin();
    runAccessibility();
    log('View scheme details with scheduled advert journey  - creating Grant');
    createGrant(GRANT_NAME + ' no application form');
    runAccessibility();

    // create advert
    log(
      'View scheme details with scheduled advert journey - creating Advert Section 1',
    );
    advertSection1(GRANT_NAME);
    runAccessibility();
    log(
      'View scheme details with scheduled advert journey - creating Advert Section 2',
    );
    advertSection2();
    runAccessibility();
    log(
      'View scheme details with scheduled advert journey - creating Advert Section 3',
    );
    advertSection3(true);
    runAccessibility();
    log(
      'View scheme details with scheduled advert journey - creating Advert Section 4',
    );
    advertSection4();
    runAccessibility();
    log(
      'View scheme details with scheduled advert journey - creating Advert Section 5',
    );
    advertSection5();
    runAccessibility();

    log(
      'View scheme details with scheduled advert journey - publishing advert',
    );
    publishAdvert(GRANT_NAME, true);
    runAccessibility();

    log(
      'Scheme details with an in progress advert journey - submitting feedback form',
    );
    cy.contains('Send feedback').click();
    runAccessibility();

    cy.contains('Grant advert');
    cy.contains('Your advert is scheduled to be published on');
    cy.contains('View or change your advert');
  });
});
