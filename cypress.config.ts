import { defineConfig } from "cypress";
require("dotenv").config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      oneLoginSandboxUsername: process.env["one-login-sandbox-username"],
      oneLoginSandboxPassword: process.env["one-login-sandbox-password"],
      oneLoginApplicantEmail: process.env["one-login-applicant-email"],
      oneLoginApplicantPassword: process.env["one-login-applicant-password"],
      oneLoginAdminEmail: process.env["one-login-admin-email"],
      oneLoginAdminPassword: process.env["one-login-admin-password"],
      oneLoginSuperAdminEmail: process.env["one-login-super-admin-email"],
      oneLoginSuperAdminPassword: process.env["one-login-super-admin-password"],
    },
    watchForFileChanges: !!+process.env["watch-for--file-changes"],
    // reporter: 'teamcity',
    // reporterOptions: {
    //   mochaFile: 'results/my-test-output.xml',
    //   toConsole: true,
    // },
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "mochawesome-report",
      charts: true,
      reportPageTitle: "Find a Grant",
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
      debug: true,
    },
  },
});
