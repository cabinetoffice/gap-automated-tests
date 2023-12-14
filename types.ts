export {};

declare global {
  namespace Cypress {
    interface Chainable {
      parseXlsx: (file: string) => Cypress.Chainable<any>;
      downloadFile: (url: string, directory: string, fileName: string) => void;
    }
  }
}
