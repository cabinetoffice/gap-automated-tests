# gap-automated-tests

Automated test repository for Grant Application Portal - Find a Grant.

The E2E tests are built using [Cypress](https://docs.cypress.io/guides/overview/why-cypress).

There are example tests contained at `cypress/_examples` to use as a guide when writing tests.

## Getting Started

- To install dependencies, run `npm install`
- You'll then need to copy the `.env.example` file to a file called `.env` and enter the login in details for the accounts you will use for testing. You can obtain these by following the steps below.
  - `ONE_LOGIN_SANDBOX_` properties used for signing in to the One Login integration environment - this is a static username/password for the whole environment, and you can obtain these by speaking to Conor Fayle (or probably most devs by this point).
  - The other email/password combinations are for specific accounts.
- ESLint, Prettier and Husky are installed, so your code will auto-format when committing changes.
- Make sure you are whilelisted in the VPC for the environment you're running in. This can be done by
  - Running the command `npm run vpc:add`
    - To remove yourself: `npm run vpc:remove`
    - If you don't have AWS access, you can run `npm run vpc:add:print` which will output the command with your IP address and the VPC Security Group ID, so that you can send this to someone with AWS access to execute it for you.
  - Or following the steps in [Confluence Page](https://technologyprogramme.atlassian.net/wiki/spaces/GAS/pages/2511798342/Connecting+to+the+Apply+Databases).
- Tests can be run against QA or Sandbox. You'll need to have the appropriate .env file in order to be able to run tests against each environment. The current `.env` file in use should be called simply `.env` and the other should be called `.env.qa` or `.env.sandbox` respectively.
  - There is a command to switch your current environment between the two: `npm run env:switch`
- You will need to set up 3 users with One Login, and use these to run E2E tests locally. Steps:
  1. Go to Find a Grant for the environment you wish to run against
  2. Click `Sign in and Apply`
  3. Create a new account for the intended role (you can use the + trick to generate a "new" email still linked to your inbox) until you reach the dashboard **(passwords cannot contain #)**
  4. Repeat steps 2-3 for applicant, admin and super admin
  5. Put each of these 3 emails into the .env under ONE_LOGIN_APPLICANT_EMAIL, ONE_LOGIN_ADMIN_EMAIL and ONE_LOGIN_SUPER_ADMIN_EMAIL appropriately.
  6. Add yourself to the VPC if you haven't already (`npm run vpc:add`)
  7. Run `npm run subs` to get the subs for each of your users
  ```
    ONE_LOGIN_APPLICANT_EMAIL=example+applicant@cabinetoffice.gov.uk
    ONE_LOGIN_APPLICANT_SUB=urn:fdc:gov.uk:20XX:1234567890qwertyuiopasdfghjklzxcvbnm
    ONE_LOGIN_APPLICANT_PASSWORD=XXXXXXXX
    ONE_LOGIN_ADMIN_EMAIL=example+admin@cabinetoffice.gov.uk
    ONE_LOGIN_ADMIN_SUB=urn:fdc:gov.uk:20XX:1234567890qwertyuiopasdfghjklzxcvbnm
    ONE_LOGIN_ADMIN_PASSWORD=XXXXXXXX
    ONE_LOGIN_SUPER_ADMIN_EMAIL=example+super_admin@cabinetoffice.gov.uk
    ONE_LOGIN_SUPER_ADMIN_SUB=urn:fdc:gov.uk:20XX:1234567890qwertyuiopasdfghjklzxcvbnm
    ONE_LOGIN_SUPER_ADMIN_PASSWORD=XXXXXXXX
  ```
  8. Copy the output into your .env
  9. Fill in the passwords
- You _must_ set the .env FIRST_USER_ID to a number unique to yourself. It will iterate up by the number of users and grants (3 at the time of writing) so please ensure there are no collisions.

## Running tests

### GUI

To run the tests in the GUI, you have two options. The one you choose dictates whether the tests automatically rerun when you make changes to them.

- `npm run cy:open:watch`
- `npm run cy:open:nowatch` / `npm run cy:open`

Both of these will open a window that will allow you to select your browser, then select test suites to run.

It can be useful to have file watching on when debugging failures: `npm run cy:open:watch`

However, if you are writing tests for a new journey, it can often be better to turn it off `npm run cy:open:nowatch`, allowing you to run through the journey and obtain the required data selectors etc. without the tests running every time you make a change.

You can just use `npm run cy:open` as well which will do the same thing as `npm run cy:open:nowatch`

### Console

To run all the tests via the command line, run:

- `npm run cy:run:all`

This will output the Cypress report in your console, and also generate a HTML report as below.
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

### Logging actions

You should log every major action that you perform, particularly if this action takes a while. You don't need to log every assertion, but having periodic logs helps us check that the tests are running correctly during the run on GitHub Actions. There are examples in the apply journeys of the types of things that should be logged, e.g.

```js
it("Can apply for a V1 Grant", () => {
  cy.task("publishGrantsToContentful");
  // wait for grant to be published to contentful
  cy.wait(5000);

  log("Apply V1 Internal Grant - Searching for grant");
  searchForGrant(ADVERT_NAME);

  log("Apply V1 Internal Grant - Beginning application");
  applyForGrant(ADVERT_NAME);

  log("Apply V1 Internal Grant - Signing in as applicant");
  signInAsApplyApplicant();

  log("Apply V1 Internal Grant - Filling out Eligibility");
  fillOutEligibity();

  // ...etc
});
```

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
  - ensure you also have it in `.env.qa` or `.env.sandbox` depending on your current env
- `.env.example`
- `cypress.config.ts` - if it's referenced by a test
- `.github/workflows/reusable_e2e_test_run.yml` - add to `Generate .env` stage if it's needed for the run
- GitHub Secrets/Variables
  - Secrets should be used instead of Variables unless you need to view the env var during/after the test run (e.g. AWS Access Key and Region are in Variables to allow us to copy the presigned url to the report)
  - If the environment variable is environment-specific (most are) then a variable should be added for both Sandbox and QA, prefixed either `SANDBOX_` or `QA_`

### Tests that type into inputs

Cypress has a bug where sometimes typing into an input won't work because the input is "disabled" - this happens mainly when it tries to type into an element before the page has fully loaded.

To resolve this, you should click onto the first input you want to type in, then type, and all type actions on that page should contain a `force` option:

```js
cy.get('[data-cy="cy-title-text-input"]').click();
cy.get('[data-cy="cy-title-text-input"]').type("title", {
  force: true,
});
cy.get('[data-cy="cy-description-text-area"]').type("description", {
  force: true,
});
```

However, it's recommended to only do this if the test is flaky - it shouldn't be the default option as `force` is not how a user would type into the input.

### Capturing and Formatting a DATE

Step 1) Capture the date and store it as a variable **at the moment where the subscription/saved search is logged** (after signing in is a good point to set the date).

```js
// sign in
signInAsApplicant();
//capture date
cy.wrap(Date.now()).as("subscribedDate");
```

- Here, the "cy.wrap()" command is used, along with "as()" to create an **alias**. This will be used when you go to assert the captured date.

Step 2) Use the alias along with the "convertDateToString()" function to store the possible dates as a variable. (This is stored as an array of dates to prevent the a +/-1 increment to cause the date to error).

```js
cy.get("@subscribedDate").then((subscribedDateTimestamp) => {
      const subscriptionDates = convertDateToString(subscribedDateTimestamp);
```

Step 3) Assert using this date variable, which is already formatted in the way that Find a Grant requires. The **text** of the element you are trying to target is **invoked** and mapped against all possible dates.

```js
cy.get(
  `[data-cy="cy${
    Cypress.env("testV1InternalGrant").advertName
  }UnsubscriptionTableName"]`,
)
  .parent()
  .next()
  .invoke("text")
  .should(
    "be.oneOf",
    subscriptionDates.map(
      (subscriptionDate) => "You signed up for updates on " + subscriptionDate,
    ),
  );
```

- Here, an element is targeted, the text is invoked so that it can be chained.Then the possible dates (_subscriptionDates_) are mapped, checking that the date is contained in this array.
