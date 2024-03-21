# Writing tests

When writing tests, there are a few things to keep in mind.

## Best Practice

### Logging actions

You should log every major action that you perform, particularly if this action takes a while. You don't need to log every assertion, but having periodic logs helps us check that the tests are running correctly during the run on GitHub Actions.

Ideally you will put both the title/summary of the test as well as the specific action you're performing.

There are examples in the apply journeys of the types of things that should be logged, e.g.

```js
it('Can apply for a V1 Grant', () => {
  cy.task('setUpApplyData');

  log('Apply V1 Internal Grant - Searching for grant');
  searchForGrant(ADVERT_NAME);

  log('Apply V1 Internal Grant - Beginning application');
  applyForGrant(ADVERT_NAME);

  log('Apply V1 Internal Grant - Signing in as applicant');
  signInAsApplyApplicant();

  log('Apply V1 Internal Grant - Filling out Eligibility');
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

### Adding data setup

If you are adding data setup, please be aware that once this runs on the GitHub Actions runner (i.e. by creating a Pull Request to `develop`), your setup could impact all tests across the environment.

This occurs if you add data setup that is not set up for cascade deletion, causing `develop` to be unable to tear down this data and stalling all E2E tests apart from those running on your branch.

If this is the case, please either keep the PR small so that it can be reviewed, actioned and merged swiftly, or create a separate PR to add the teardown to `develop` branch.

### Adding new environment variables

When adding new environment variables, you must do this in several places:

- `.env` - this is not committed
  - ensure you also have it in `.env.qa` or `.env.sandbox` depending on your current env
- `.env.example`
- `cypress.config.ts` - if it's referenced by a test
- `.github/workflows/reusable_e2e_test_run.yml` - add to `Generate .env` stage if it's needed for the run
- GitHub Secrets/Variables
  - Secrets should be used instead of Variables unless you need to view the env var during/after the test run (e.g. AWS Access Key and Region are in Variables to allow us to copy the presigned url to the report)
    - Please be careful with new secrets and ensure they don't collide with existing variables - every variable is in there for a reason!
  - If the environment variable is environment-specific (most are) then a variable should be added for both Sandbox and QA, prefixed either `SANDBOX_` or `QA_`

### Treating a test as a full journey

A test should be treated as a full journey of what a user would perform.

We want to avoid small unit-test like tests where we make only a couple of assertions[^1], as these add to the run time exponentially due to test initiation, setup/teardown and login times[^2]. A 2 second test would actually take 20 with these things added on!

If you have concerns about debugging, fear not! If we add [proper logging](#logging-actions) to our tests it is easy to identify where in the test we are so that we can debug from there. Some tests can even be split into multiple for debugging purposes, so that you can run it as `it.only`.

With this in mind, we can have confidence that tests can be bundled together in many cases.

For example, if you have a set of tests that check links in the app and navigates to them, they should be all part of the same test even if that means you need to manually revisit the same page multiple times using `cy.visit()`. Doing this can save several minutes on the run.

In another case, you might need to test that values being inserted to the database (perhaps through a lambda or external application) change the state of the application. Instead of creating two tests (one for "no data" and one for "data") you could just execute a DB script that inserts the necessary data and then refresh the page.[^3] For an example of this, we perform this in the [spotlight reconnect journey](cypress/e2e/super-admin/super-admin.cy.js#L328)

Tests should not be arbitrarily combined, but similar tests that are part of a user journey should be if possible.

Here is a table describing some differences between functional and E2E tests[^4]

| Aspect           | Functional Tests                                               | End-to-End Tests                                            |
| ---------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| Scope            | Testing is limited to one single piece of code or application. | Testing crosses multiple applications and user groups.      |
| Goal             | Ensures the tested software meets acceptance criteria.         | Ensures a process continues to work after changes are made. |
| Test Method      | Tests the way a single user engages with the application.      | Tests the way multiple users work across applications.      |
| What To Validate | Validate the result of each test for inputs and outputs.       | Validate that each step in the process is completed.        |

For more information

[^1]: https://docs.cypress.io/guides/references/best-practices#Creating-Tiny-Tests-With-A-Single-Assertion
[^2]: https://dev.to/noriste/one-long-e2e-test-or-small-independent-ones-33ao
[^3]: https://trstringer.com/e2e-test-optimization/
[^4]: https://katalon.com/resources-center/blog/end-to-end-e2e-testing

### Prefer automated setup instead of the test creating the data

By creating scripts to populate data directly in the DB, we can save valuable time that we would otherwise spend repeating journeys that are covered by other tests.

If the data you need cannot be populated in the DB (e.g. you're testing submission download with an uploaded file) then it is acceptable to run through the journey to create the data.

## Helpers

If there are any patterns you need to implement in your test that are complicated and could be useful for other tests, please document them here.

### Searching for a grant in Find

If your test needs to search for a grant in Find, you must first publish adverts for that test in Contentful:

```js
it('can search for a grant', () => {
  // publish grant to contentful
  cy.task('setUpApplyDataWithAds');
  // now you can search for it as normal
  searchForGrant('Cypress');
  // continue tests and assertions as normal
  // ...
});
```

While SQL data is being set up and torn down for every test, this is not done in Contentful in order to prevent rate limiting, hence this is done on a test-by-test basis.

### Tests that type into inputs

Cypress has a bug where sometimes typing into an input won't work because the input is "disabled" - this happens mainly when it tries to type into an element before the page has fully loaded.

To resolve this, you should click onto the first input you want to type in, then type, and all type actions on that page should contain a `force` option:

```js
cy.get('[data-cy="cy-title-text-input"]').click();
cy.get('[data-cy="cy-title-text-input"]').type('title', {
  force: true,
});
cy.get('[data-cy="cy-description-text-area"]').type('description', {
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
cy.wrap(Date.now()).as('subscribedDate');
```

- Here, the "cy.wrap()" command is used, along with "as()" to create an **alias**. This will be used when you go to assert the captured date.

Step 2) Use the alias along with the "convertDateToString()" function to store the possible dates as a variable. (This is stored as an array of dates to prevent the a +/-1 increment to cause the date to error).

```js
cy.get('@subscribedDate').then((subscribedDateTimestamp) => {
  const subscriptionDates = convertDateToString(subscribedDateTimestamp);
});
```

Step 3) Assert using this date variable, which is already formatted in the way that Find a Grant requires. The **text** of the element you are trying to target is **invoked** and mapped against all possible dates.

```js
cy.get(
  `[data-cy="cy${
    Cypress.env('testV1InternalGrant').advertName
  }UnsubscriptionTableName"]`,
)
  .parent()
  .next()
  .invoke('text')
  .should(
    'be.oneOf',
    subscriptionDates.map(
      (subscriptionDate) => 'You signed up for updates on ' + subscriptionDate,
    ),
  );
```

- Here, an element is targeted, the text is invoked so that it can be chained.Then the possible dates (_subscriptionDates_) are mapped, checking that the date is contained in this array.

### Firefox navigation

There seems to be an issue with Firefox where you cannot use `cy.go("back")` - please try to avoid this where possible and use `cy.visit(YOUR_URL)` instead.
