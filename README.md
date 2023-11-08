# gap-automated-tests

Automated test repository for Grant Application Portal - Find a Grant.

The E2E tests are built using [Cypress](https://docs.cypress.io/guides/overview/why-cypress).

There are example tests contained at `cypress/_examples` to use as a guide when writing tests.

## Getting Started

- To install dependencies, run `npm install`
- You'll then need to copy the `.env.example` file to a file called `.env` and enter the login in details for the accounts you will use for testing. You can obtain these by talking to Conor Fayle or Connor MacQueen.
  - `ONE_LOGIN_SANDBOX_` properties used for signing in to the One Login integration environment - this is a static username/password for the whole environment.
  - The other email/password combinations are for specific accounts.
- ESLint, Prettier and Husky are installed, so your code will auto-format when committing changes.
- E2E tests should not be run in parallel - there are measures in place to prevent this in GitHub Actions, but this will not stop you running them locally. If you wish to run against Sandbox, please check https://github.com/cabinetoffice/gap-automated-tests/actions to ensure there are no current jobs running, and coordinate with each other.
- Make sure you are whilelisted in the Sandbox DB VPC. This can be done by
  - Running the command `npm run vpc:add`
    - To remove yourself: `npm run vpc:remove`
  - Or following the steps in [Confluence Page](https://technologyprogramme.atlassian.net/wiki/spaces/GAS/pages/2511798342/Connecting+to+the+Apply+Databases).
- If you wish to run your tests locally, you'll also need to modify the contentful slug to something unique. This is to prevent Contentful conflicts. You'll need to do this in the following files:
  - `cypress/seed/sql/apply.sql>L46`
  - `cypress/seed/contentful.ts>L43`

## Running tests

### GUI

To run the tests in the GUI, you have two options. The one you choose dictates whether the tests automatically rerun when you make changes to them.

- `npm run cy:open:watch`
- `npm run cy:open:nowatch`

Both of these will open a window that will allow you to select your browser, then select test suites to run.

It can be useful to have file watching on when debugging failures `npm run cy:open:watch`.

However, if you are writing tests for a new journey, it can often be better to turn it off `npm run cy:open:nowatch`, allowing you to run through the journey and obtain the required data selectors etc. without the tests running every time you make a change.

### Console

To run the tests in the command line, run `npm run cy:run:all` - this will output the Cypress report in your console, and also generate a HTML report as below.
Alternatively you can run them for a single suite:

- `npm run cy:run:find`
- `npm run cy:run:apply`
- `npm run cy:run:admin`
- `npm run cy:run:superadmin`

## Reports

When running the E2E tests via `npm run cy:run:*`, reports are generated via [Mochawesome](https://www.npmjs.com/package/mochawesome) and [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) in HTML format. They are stored at `mochawesome-report/*.html`

Cypress is built on top of Mocha, so any reporting tool that works for Mocha will also work for Cypress.

# Writing tests

When writing tests, there are a few things to keep in mind.

### Common actions

There's a shared file of actions that are repeated throughout the app located at `/cypress/common/common.ts`. These include functions such as:

- Signing in as a specific user
- Clicking `Save` or `Save and Continue` buttons
- Accepting the radio buttons for `Yes, I have completed this section`
- Searching for a grant

Please use these where possible, and add to them as appropriate if they can be shared between suites.

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

### Adding new environment variables

When adding new environment variables, you must do this in several places:

- `.env` - this is not committed
- `.env.example`
- `cypress.config.ts`
- `.github/workflows/reusable_e2e_test_run.yml` - add to `Generate .env` stage
- GitHub Secrets/Variables
  - Secrets should be used instead of Variables unless you need to view the env var during/after the test run (e.g. AWS Access Key and Region are in Variables to allow us to copy the presigned url to the report)
