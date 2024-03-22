import {
  clickSave,
  clickSaveAndContinue,
  clickSaveAndExit,
  log,
  signInAsAdmin,
  signInAsSuperAdmin,
  signInToIntegrationSite,
  signOut,
} from '../../common/common';

describe('Admin co-authorship', () => {
  beforeEach(() => {
    cy.task('setUpUser');
    cy.task('setUpApplyData');
    signInToIntegrationSite();
  });

  it('manages editors', () => {
    log('Co-auth: Checking initial editor status as super-admin');
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsSuperAdmin();
    cy.contains('a', 'Admin dashboard').click();
    cy.contains('Grants you own').should('not.exist');
    cy.contains('Grants you can edit');

    cy.contains('a', Cypress.env('testV2InternalGrant').schemeName).click();
    cy.contains('a', 'View editors').click();
    cy.contains('a', 'Add an editor').should('not.exist');
    cy.contains('a', 'Remove').should('not.exist');
    cy.get('.govuk-summary-list').children().should('have.length', 3);
    signOut();

    log('Co-auth: Removing super-admin as editor');
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsAdmin();
    cy.contains('Grants you own');
    cy.contains('Grants you can edit').should('not.exist');

    cy.contains('a', Cypress.env('testV2InternalGrant').schemeName).click();
    cy.contains('a', 'Add or manage editors').click();
    cy.get('.govuk-summary-list').children().should('have.length', 3);

    cy.contains('a', 'Remove').click();
    cy.contains('button', 'Remove editor').click();
    cy.get('.govuk-summary-list').children().should('have.length', 2);
    signOut();

    log('Co-auth: Checking super-admin has been removed as editor');
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsSuperAdmin();
    cy.contains('a', 'Admin dashboard').click();
    cy.contains('Grants you own').should('not.exist');
    cy.contains('Grants you can edit');
    cy.contains('a', Cypress.env('testV2InternalGrant').schemeName).should(
      'not.exist',
    );
    signOut();

    log('Co-auth: Readding super-admin as editor');
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsAdmin();
    cy.contains('Grants you own');
    cy.contains('Grants you can edit').should('not.exist');

    cy.contains('a', Cypress.env('testV2InternalGrant').schemeName).click();
    cy.contains('a', 'Add or manage editors').click();
    cy.get('.govuk-summary-list').children().should('have.length', 2);

    log("Co-auth: Checking 'Add an editor' validation");
    cy.contains('a', 'Add an editor').click();
    cy.get('[data-cy="cy-editorEmailAddress-text-input"]').type(
      Cypress.env('oneLoginApplicantEmail'),
    );
    cy.contains('button', 'Confirm').click();
    cy.contains("This account does not have an 'Administrator' account.");
    cy.get('[data-cy="cy-editorEmailAddress-text-input"]').type(
      '{selectall}{backspace}' + 'Not a real email',
    );
    cy.contains('button', 'Confirm').click();
    cy.contains('Input a valid email address');
    cy.get('[data-cy="cy-editorEmailAddress-text-input"]').type(
      '{selectall}{backspace}' + Cypress.env('oneLoginSuperAdminEmail'),
    );
    cy.contains('button', 'Confirm').click();
    cy.get('.govuk-summary-list').children().should('have.length', 3);
    signOut();

    log('Co-auth: Checking super-admin re-added editor status');
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsSuperAdmin();
    cy.contains('a', 'Admin dashboard').click();
    cy.contains('Grants you own').should('not.exist');
    cy.contains('Grants you can edit');
    cy.contains('a', Cypress.env('testV2InternalGrant').schemeName);
  });

  it('throws an error when multiple people simultaneously edit the application form', () => {
    cy.get('[data-cy=cySignInAndApply-Link]').click();
    signInAsAdmin();
    cy.contains('Grants you own');
    cy.contains('Grants you can edit').should('not.exist');

    cy.contains('a', Cypress.env('testV1InternalGrant').schemeName).click();
    cy.contains(
      'a',
      Cypress.env('testV1InternalGrant').applicationName,
    ).click();
    cy.contains('a', 'Unpublish').click();
    cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
    cy.contains('button', 'Confirm').click();

    log('Multiple Editors - Eligibility');
    cy.contains('Eligibility Statement')
      .parent()
      .parent()
      .within(() => {
        cy.contains('a', 'View').click();
      });
    cy.get('[data-cy="cy-displayText-text-area"]').type(' Edited');
    cy.task('simulateMultipleApplicationFormEditors');
    clickSaveAndExit();
    assertMultipleEditorsErrorPage();

    cy.contains('a', 'Add a new section').click();
    cy.get('[data-cy="cy-sectionTitle-text-input"]').type('Custom Section Two');
    clickSaveAndContinue();

    log('Multiple Editors - Section title');
    cy.contains('a', 'Edit').click();
    cy.get('[data-cy="cy-sectionTitle-text-input"]').type(' Edited');
    cy.task('simulateMultipleApplicationFormEditors');
    clickSave();
    assertMultipleEditorsErrorPage();

    log('Multiple Editors - Reorder sections');
    cy.contains('4. Custom Section Two');
    cy.task('simulateMultipleApplicationFormEditors');
    cy.contains('4. Custom Section Two')
      .parent()
      .within(() => {
        cy.contains('button', 'Up').click();
      });
    assertMultipleEditorsErrorPage();

    log('Multiple Editors - Delete section');
    cy.contains('4. Custom Section Two')
      .parent()
      .within(() => {
        cy.contains('a', 'Edit section').click();
      });
    cy.contains('a', 'Delete section').click();
    cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
    cy.task('simulateMultipleApplicationFormEditors');
    cy.contains('button', 'Confirm').click();
    assertMultipleEditorsErrorPage();

    log('Multiple Editors - Question title');
    cy.contains('Custom Question 1')
      .parent()
      .parent()
      .within(() => {
        cy.contains('a', 'Edit').click();
      });
    cy.get('[data-cy="cy-fieldTitle-text-input"]').type(' Edited');
    cy.task('simulateMultipleApplicationFormEditors');
    cy.contains('button', 'Save changes').click();
    assertMultipleEditorsErrorPage();
    cy.contains('Custom Question 1 Edited').should('not.exist');

    log('Multiple Editors - Question type');
    cy.contains('Custom Question 1')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Yes/No');
        cy.contains('a', 'Edit').click();
      });
    cy.contains('a', 'Change question type').click();
    cy.get('[data-cy="cy-radioInput-option-ShortAnswer"]').click();
    cy.task('simulateMultipleApplicationFormEditors');
    clickSaveAndContinue();
    assertMultipleEditorsErrorPage();
    cy.contains('Custom Question 1')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Yes/No');
        cy.contains('Short answer').should('not.exist');
      });

    log('Multiple Editors - Question type - Max Words');
    cy.contains('Custom Question 1')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Yes/No');
        cy.contains('a', 'Edit').click();
      });
    cy.contains('a', 'Change question type').click();
    cy.get('[data-cy="cy-radioInput-option-LongAnswer"]').click();
    clickSaveAndContinue();
    cy.get('[data-cy="cy-maxWords-text-input-numeric"]').type('1000');
    cy.task('simulateMultipleApplicationFormEditors');
    clickSaveAndContinue();
    assertMultipleEditorsErrorPage();
    cy.contains('Custom Question 1')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Yes/No');
        cy.contains('Long answer').should('not.exist');
      });

    log('Multiple Editors - Question type - Options');
    cy.contains('Custom Question 1')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Yes/No');
        cy.contains('a', 'Edit').click();
      });
    cy.contains('a', 'Change question type').click();
    cy.get('[data-cy="cy-radioInput-option-MultipleChoice"]').click();
    clickSaveAndContinue();
    cy.get('[data-cy="cy-options[0]-text-input"]').type('Option 1');
    cy.get('[data-cy="cy-options[1]-text-input"]').type('Option 2');
    cy.task('simulateMultipleApplicationFormEditors');
    clickSaveAndContinue();
    assertMultipleEditorsErrorPage();
    cy.contains('Custom Question 1')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Yes/No');
        cy.contains('Multiple choice').should('not.exist');
      });

    log('Multiple Editors - Delete question');
    cy.contains('Custom Question 1')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Yes/No');
        cy.contains('a', 'Edit').click();
      });
    cy.contains('a', 'Delete question').click();
    cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
    cy.task('simulateMultipleApplicationFormEditors');
    cy.contains('button', 'Confirm').click();
    assertMultipleEditorsErrorPage();

    log('Multiple Editors - Reorder questions - Up');
    cy.contains('3. Custom Section')
      .parent()
      .within(() => {
        cy.contains('a', 'Edit section').click();
      });
    cy.contains('Custom Question 2');
    cy.task('simulateMultipleApplicationFormEditors');
    cy.contains('Custom Question 2')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Short answer');
        cy.contains('button', 'Up').click();
      });
    assertMultipleEditorsErrorPage();

    log('Multiple Editors - Reorder questions - Down');
    cy.contains('3. Custom Section')
      .parent()
      .within(() => {
        cy.contains('a', 'Edit section').click();
      });
    cy.contains('Custom Question 1');
    cy.task('simulateMultipleApplicationFormEditors');
    cy.contains('Custom Question 1')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Yes/No');
        cy.contains('button', 'Down').click();
      });
    assertMultipleEditorsErrorPage();
  });
});

const assertMultipleEditorsErrorPage = () => {
  cy.contains('Your changes could not be saved');
  cy.contains(
    'Another editor has made changes to the grant and your changes could not be saved.',
  );
  cy.contains('The last edit was made by ' + Cypress.env('oneLoginAdminEmail'));
  cy.contains('To try again, you can');
  cy.contains('a', 'return to the application builder')
    .should(
      'have.attr',
      'href',
      `/apply/admin/build-application/${
        Cypress.env('testV1InternalGrant').applicationId
      }/dashboard`,
    )
    .click();
};
