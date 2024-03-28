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
import './commands';
import 'cypress-mochawesome-reporter/register';
import 'cypress-file-upload';
import type * as axe from 'axe-core';
import { log } from '../common/common';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// @ts-expect-error skip-error
Cypress.Commands.add(
  'upload_file',
  (fileName: string, fileType = ' ', selector) => {
    cy.get(selector).then((subject) => {
      cy.fixture(fileName, 'base64').then((content) => {
        const el = subject[0];
        const testFile = new File([content], fileName, { type: fileType });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);
        el.files = dataTransfer.files;
      });
    });
  },
);

const formatAccessibilityViolations = (
  accessibilityReport: axe.Result[],
  url: string,
) => {
  console.log('got ', accessibilityReport.length, ' violations for url ', url);
  const violationData = accessibilityReport.map(
    ({ impact, description, tags }) => ({
      impact,
      description,
      tags: tags.toString(),
    }),
  );
  let info = `${violationData.length} accessibility violation${
    violationData.length === 1 ? '' : 's'
  } ${violationData.length === 1 ? 'was' : 'were'} detected on page: ${url}\n`;

  violationData.forEach((violation) => {
    info += `${violation.impact}: ${violation.description}\n`;
  });
  return info;
};

// =====================================================================================================================
// Copied from https://github.com/component-driven/cypress-axe/blob/master/src/index.ts
function summarizeResults(
  includedImpacts: string[] | undefined,
  violations: axe.Result[],
): axe.Result[] {
  return includedImpacts &&
    Array.isArray(includedImpacts) &&
    Boolean(includedImpacts.length)
    ? violations.filter((v) => v.impact && includedImpacts.includes(v.impact))
    : violations;
}

export interface Options extends axe.RunOptions {
  includedImpacts?: string[];
  interval?: number;
  retries?: number;
}

function isEmptyObjectorNull(value: any) {
  if (value == null) {
    return true;
  }
  return Object.entries(value).length === 0 && value.constructor === Object;
}

export interface InjectOptions {
  axeCorePath?: string;
}

export const injectAxe = (injectOptions?: InjectOptions) => {
  const fileName =
    injectOptions?.axeCorePath ||
    (typeof require?.resolve === 'function'
      ? require.resolve('axe-core/axe.min.js')
      : 'node_modules/axe-core/axe.min.js');
  cy.readFile<string>(fileName).then((source) =>
    cy.window({ log: false }).then((window) => {
      window.eval(source);
    }),
  );
};

const checkA11y = (
  context?: axe.ElementContext,
  options?: Options,
  violationCallback?: (violations: axe.Result[]) => void,
  skipFailures = false,
) => {
  cy.window({ log: false })
    .then(async (win) => {
      if (isEmptyObjectorNull(context)) {
        context = undefined;
      }
      if (isEmptyObjectorNull(options)) {
        options = undefined;
      }
      if (isEmptyObjectorNull(violationCallback)) {
        violationCallback = undefined;
      }
      const { includedImpacts, interval, retries, ...axeOptions } =
        options || {};
      let remainingRetries = retries || 0;
      async function runAxeCheck(): Promise<axe.Result[]> {
        // @ts-expect-error - win.axe does exist, I promise x
        return win.axe
          .run(context || win.document, axeOptions)
          .then(async ({ violations }) => {
            const results = summarizeResults(includedImpacts, violations);
            if (results.length > 0 && remainingRetries > 0) {
              remainingRetries--;
              return await new Promise((resolve) => {
                setTimeout(resolve, interval || 1000);
              }).then(runAxeCheck);
            } else {
              return results;
            }
          });
      }
      return await runAxeCheck();
    })
    .then((violations) => {
      if (violations.length) {
        if (violationCallback) {
          violationCallback(violations);
        }
        violations.forEach((v) => {
          const selectors = v.nodes
            // @ts-expect-error - it's fine
            .reduce<string[]>((acc, node) => acc.concat(node.target), [])
            .join(', ');

          Cypress.log({
            $el: Cypress.$(selectors),
            name: 'a11y error!',
            consoleProps: () => v,
            message: `${v.id} on ${v.nodes.length} Node${
              v.nodes.length === 1 ? '' : 's'
            }`,
          });
        });
      }

      return cy.wrap(violations, { log: false });
    })
    .then((violations) => {
      if (!skipFailures) {
        assert.equal(
          violations.length,
          0,
          `${violations.length} accessibility violation${
            violations.length === 1 ? '' : 's'
          } ${violations.length === 1 ? 'was' : 'were'} detected`,
        );
      } else if (violations.length) {
        Cypress.log({
          name: 'a11y violation summary',
          message: `${violations.length} accessibility violation${
            violations.length === 1 ? '' : 's'
          } ${violations.length === 1 ? 'was' : 'were'} detected`,
        });
      }
    });
};
// =====================================================================================================================

// =====================================================================================================================
// Modified from https://github.com/cypress-io/code-coverage/blob/d1cbb1df981fd12c97204a0409eb45757c70f24e/task.js
const registerHooks = () => {
  // This variable is shared between hooks to allow the accessibility reports to be saved
  let windowAccessibilityObjects: string[];

  beforeEach(() => {
    // reset at the start of each test
    windowAccessibilityObjects = [];
    const specName = Cypress.spec.name;
    const testName = Cypress.currentTest.title;

    cy.task('initialiseAccessibilityLogFile', { specName, testName });

    const saveAccessibilityObject = async (win: Cypress.AUTWindow) => {
      const url = win.location.href;
      injectAxe();
      checkA11y(
        null,
        null,
        (accessibilityReport) => {
          // Prevent about:blank and duplicate urls
          if (
            url !== 'about:blank' &&
            !JSON.stringify(windowAccessibilityObjects).includes(url)
          )
            windowAccessibilityObjects.push(
              formatAccessibilityViolations(accessibilityReport, url),
            );
        },
        true,
      );
    };

    // save reference to accessibility for each app window loaded in the test
    cy.on('window:load', saveAccessibilityObject);

    // save reference if visiting a page inside a before() hook
    cy.window({ log: false }).then(saveAccessibilityObject);
  });

  afterEach(() => {
    // save accessibility to a file after the test
    const specName = Cypress.spec.name;
    const testName = Cypress.currentTest.title;
    log(
      `${specName} - ${testName} - Found ${windowAccessibilityObjects.length} pages with violations`,
    );
    if (!windowAccessibilityObjects.length) {
      cy.writeFile(
        `cypress/accessibility/logs/${specName}/${testName}.txt`,
        'No accessibility violations detected.' + '\n',
        'utf-8',
        { flag: 'a+', log: false },
      );
      return;
    }
    windowAccessibilityObjects.forEach((accessibilityReport) => {
      cy.writeFile(
        `cypress/accessibility/logs/${specName}/${testName}.txt`,
        accessibilityReport + '\n',
        'utf-8',
        { flag: 'a+', log: false },
      );
    });
  });
};

if (Cypress.browser.name !== 'chrome') {
  console.log('Skipping accessibility checks');
} else {
  registerHooks();
}
// =====================================================================================================================
