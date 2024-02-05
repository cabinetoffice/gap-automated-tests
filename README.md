# gap-automated-tests

Automated test repository for Grant Application Portal - Find a Grant.

The E2E tests are built using [Cypress](https://docs.cypress.io/guides/overview/why-cypress).

There are example tests contained at `cypress/_examples` to use as a guide when writing tests.

## [Setup](SETUP.md)

## [Contributing](CONTRIBUTING.md)

Please read this before writing tests!

## Running tests

### GitHub Actions

When running via GitHub actions, there are several ways to do so. Most of these are automatic as detailed below.

If a job is running on both Sandbox and QA, these will occur simultaneously. However, browser jobs run sequentially.

I.E. If a multi-browser, multi-env run is kicked off, the Chrome tests will occur on Sandbox and QA at the same time, and when each test run has finished on the respective environment, the Firefox tests will kick off on that environment.

#### Reports and notifications

If enabled, the job will notify of the runs on Slack in the `cabinet-office-gap-e2e-test-alerts` channel.

If enabled, reports will be uploaded to the [gap-automated-tests s3 bucket](https://s3.console.aws.amazon.com/s3/buckets/gap-automated-tests?region=eu-west-2&tab=objects) under the relevant env, and presigned in the `Presign report for sharing` step for easy access.

#### Manual runs

Manual runs can be triggered by visiting the [Manual Actions page](https://github.com/cabinetoffice/gap-automated-tests/actions/workflows/manual_e2e_test_run.yml).

Here you can select the branch, as well as any of the following configurations:

- One or all suites
- One or both browsers
- One environment
  - If selecting QA, ensure that you've selected the `main` branch as this should be versioned to the latest release.
- Reports uploaded and pre-signed, or not
- Slack notifications enabled/disabled

Manual runs are particularly useful when:

- You want to test that you haven't introduced a regression when merging a feature or release, or that you have fixed a regression.
- You've made changes to the GHA secrets in this repo but haven't made code changes
- You're investigating a flaky run

#### Scheduled runs

Scheduled runs kick off automatically at 4am Monday-Friday. Previous runs can be viewed at the [Scheduled Actions page](https://github.com/cabinetoffice/gap-automated-tests/actions/workflows/scheduled_e2e_test_run.yml)

They have the following configuration:

- All suites
- Both browsers
- Both environments
- Reports uploaded and pre-signed
- Slack notifications enabled

This means they will run a full suite of tests for both browsers, against both environments.

The reports and notifications will be handled as above in [Reports and notifications](#reports-and-notifications)

#### Push runs

Push runs kick off automatically when creating a PR to develop, or when a push is made to develop or main.

It runs with the following configuration:

- All affected tests (described below)
- Chrome browser
- Sandbox environment
- No reports (uploaded or presigned)
- No Slack notification

If you want to change any of these settings for your branch, this can be done [here](.github/workflows/manual_e2e_test_run.yml)

Affected Tests

1. If you make a change to any tests (or add a new test) then only those tests will execute (with 2 exceptions, listed below).
2. if you make a change to a `helper`/`constants`/etc file in a test folder, then all the tests in that folder will execute.
3. If you make a change to certain files/folders (e.g. `workflows`, `seed`, `common` - full list below) then all the tests in the repo will execute.

Files/folders that will trigger all suites:

- `package.json`
- `cypress.config.ts`
- `cypress/common/*`
- `cypress/seed/*`
- `cypress/support/*`
- `cypress/fixtures/*`
- `.github/workflows/push_e2e_test_run.yml`
- `.github/workflows/reusable_e2e_test_run.yml`

---

### Running Locally

#### GUI

To run the tests in the GUI, you have two options. The one you choose dictates whether the tests automatically rerun when you make changes to them.

- `npm run cy:open:watch`
- `npm run cy:open:nowatch` / `npm run cy:open`

Both of these will open a window that will allow you to select your browser, then select test suites to run.

It can be useful to have file watching on when debugging failures: `npm run cy:open:watch`

However, if you are writing tests for a new journey, it can often be better to turn it off `npm run cy:open:nowatch`, allowing you to run through the journey and obtain the required data selectors etc. without the tests running every time you make a change.

You can just use `npm run cy:open` as well which will do the same thing as `npm run cy:open:nowatch`

#### Console

To run all the tests via the command line, run:

- `npm run cy:run:all`

This will output the Cypress report in your console, and also generate a HTML report as below.
Alternatively you can run them for a single suite:

- `npm run cy:run:find`
- `npm run cy:run:apply`
- `npm run cy:run:admin`
- `npm run cy:run:superadmin`

#### Reports

When running the E2E tests via `npm run cy:run:*`, reports are generated via [Mochawesome](https://www.npmjs.com/package/mochawesome) and [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) in HTML format. They are stored at `mochawesome-report/*.html`

Cypress is built on top of Mocha, so any reporting tool that works for Mocha will also work for Cypress.
