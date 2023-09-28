# gap-automated-tests

Automated test repository for Grant Application Portal - Find a Grant.

The E2E tests are built using [Cypress](https://docs.cypress.io/guides/overview/why-cypress).

There are example tests contained at `cypress/_examples` to use as a guide when writing tests.

## Getting Started

- To install dependencies, run `npm install`
- You'll then need to copy the `.env.example` file to a file called `.env` and enter the login in details for the accounts you will use for testing. You can obtain these by talking to Conor Fayle or Connor MacQueen.
  - `one-login-sandbox-` properties used for signing in to the One Login integration environment - this is a static username/password for the whole environment.
  - The other email/password combinations are for specific accounts.
- ESLint, Prettier and Husky are installed, so your code will auto-format when committing changes.

## Running tests

### GUI

To run the tests in the GUI, you have two options. The one you choose dictates whether the tests automatically rerun when you make changes to them.

- `npm run cy:open:watch`
- `npm run cy:open:nowatch`

Both of these will open a window that will allow you to select your browser, then select test suites to run.

It can be useful to have file watching on when debugging failures `npm run cy:open:watch`.

However, if you are writing tests for a new journey, it can often be better to turn it off `npm run cy:open:nowatch`, allowing you to run through the journey and obtain the required data selectors etc without the tests running every time you make a change.

### Console

To run the tests in the command line, run `npm run cy:run` - this will output the Cypress report in your console, and also generate a HTML report as below.

## Reports

When running the E2E tests via `npm run cy:run`, reports are generated via [Mochawesome](https://www.npmjs.com/package/mochawesome) and [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) in HTML format. They are stored at `mochawesome-report/*.html`

Cypress is built on top of Mocha, so any reporting tool that works for Mocha will also work for Cypress.

# Writing tests

When writing tests, there are a few things to keep in mind.

### Common actions

There's a shared file of actions that are repeated throught the app located at `/cypress/common/common.ts`. These include functions such as:

- Signing in as a specific user
- Clicking `Save` or `Save and Continue` buttons
- Accepting the radio buttons for `Yes, I have completed this section`
- Searching for a grant

Please use these where possible, and add to them as appropriate.

### Searching for a grant in Find

If your test needs to search for a grant in Find, you must first publish adverts for that test in Contentful and wait for them to be added:

```js
it("can search for a grant", () => {
  // publish grant to contentful
  cy.task("publishGrantsToContentful");
  // wait for grant to be published to contentful
  cy.wait(5000);
  // now you can search for it as normal
  searchForGrant("Cypress");
  // continue tests and assertions as normal
  // ...
});
```

While SQL data is being set up and torn down for every test, this is not done in Contentful in order to prevent rate limiting, hence this is done on a test-by-test basis.
