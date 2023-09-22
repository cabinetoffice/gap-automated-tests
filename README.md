# gap-automated-tests

Automated test repository for Grant Application Portal - Find a Grant.

The E2E tests are built using [Cypress](https://docs.cypress.io/guides/overview/why-cypress).

There are example tests contained at `cypress/_examples` to use as a guide when writing tests.

## Getting Started

- To install dependencies, run `npm install`
- You'll then need to copy the `.env.example` file to a file called `.env` and enter the login in details for the accounts you will use for testing. You can obtain these by talking to Conor Fayle or Connor MacQueen.
  - In the `.env` there is a property called `watch-for-file-changes` - this controls whether the tests automatically rerun when you make changes to them.
  - It can be useful to have this on when debugging failures `watch-for-file-changes=1` but if you are writing tests for a new journey, it can often be handy to turn it off `watch-for-file-changes=0`, allowing you to run through the journey and obtain the required data selectors etc.
- ESLint, Prettier and Husky are installed, so your code will auto-format when committing changes.

## Running tests

To run the tests in the GUI, run `npm run cy:open` - this will open a window that will allow you to select your browser, then select test suites to run.

To run the tests in the command line, run `npm run cy:run` - this will output the Cypress report in your console, and also as a HTML report as below.

## Reports

When running the E2E tests via `npm run cy:run`, reports are generated via [Mochawesome](https://www.npmjs.com/package/mochawesome) in HTML format. They are stored at `mochawesome-report/mochawesome.html`

Cypress is built on top of Mocha, so any reporting tool that works for Mocha will also work for Cypress.
