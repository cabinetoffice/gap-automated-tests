import { defineConfig } from "cypress";
require("dotenv").config();
import { createTestUsers, deleteTestUsers } from "./cypress/seed/user";
import { createApplyData, deleteApplyData } from "./cypress/seed/apply";
import {
  deleteGrantAdverts,
  publishGrantAdverts,
} from "./cypress/seed/contentful";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        async setUpUser() {
          await deleteTestUsers().then(() => createTestUsers());

          return null;
        },
        async setUpApplyData() {
          await deleteApplyData().then(() => createApplyData());

          return null;
        },
        async publishGrantsToContentful() {
          await deleteGrantAdverts();
          await publishGrantAdverts();

          return null;
        },
        log(message) {
          console.log(message);

          return null;
        },
        table(message) {
          console.table(message);

          return null;
        },
      });
      require("cypress-mochawesome-reporter/plugin")(on);
    },
    env: {
      oneLoginSandboxBaseUrl: process.env["ONE_LOGIN_SANDBOX_BASE_URL"],
      oneLoginSandboxUsername: process.env["ONE_LOGIN_SANDBOX_USERNAME"],
      oneLoginSandboxPassword: process.env["ONE_LOGIN_SANDBOX_PASSWORD"],
      oneLoginApplicantEmail: process.env["ONE_LOGIN_APPLICANT_EMAIL"],
      oneLoginApplicantPassword: process.env["ONE_LOGIN_APPLICANT_PASSWORD"],
      oneLoginAdminEmail: process.env["ONE_LOGIN_ADMIN_EMAIL"],
      oneLoginAdminPassword: process.env["ONE_LOGIN_ADMIN_PASSWORD"],
      oneLoginSuperAdminEmail: process.env["ONE_LOGIN_SUPER_ADMIN_EMAIL"],
      oneLoginSuperAdminPassword: process.env["ONE_LOGIN_SUPER_ADMIN_PASSWORD"],
      userDbUrl: process.env["CYPRESS_USERS_DATABASE_URL"],
      userDbName: process.env["CYPRESS_USERS_DATABASE_NAME"],
      applyDbUrl: process.env["CYPRESS_APPLY_DATABASE_URL"],
      applyDbName: process.env["CYPRESS_APPLY_DATABASE_NAME"],
      applicationBaseUrl: process.env["APPLICATION_BASE_URL"],
    },
    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      reportDir: "mochawesome-report",
      reportFilename: "[status]_[datetime]_report",
      timestamp: "yyyy-mm-ddTHH:MM:ssZ",
      charts: true,
      reportPageTitle: "Find a Grant",
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
      debug: true,
      html: true,
      json: false,
      overwrite: false,
    },
  },
});
