// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-mochawesome-reporter/register";
import "cypress-file-upload";

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Commands.add("upload_file", (fileName, fileType = " ", selector) => {
  cy.get(selector).then((subject) => {
    cy.fixture(fileName, "base64").then((content) => {
      const el = subject[0];
      const testFile = new File([content], fileName, { type: fileType });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);
      el.files = dataTransfer.files;
    });
  });
});
