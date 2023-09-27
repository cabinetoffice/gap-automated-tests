import { defineConfig } from "cypress";
require("dotenv").config();
import { createTestUsers, deleteTestUsers } from "./cypress/seed/user";
import { createApplyData, deleteApplyData } from "./cypress/seed/apply";

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
        log(message) {
          console.log(message);

          return null;
        },
        table(message) {
          console.table(message);

          return null;
        },
      });
    },
    env: {
      oneLoginSandboxBaseUrl: process.env["one-login-sandbox-base-url"],
      oneLoginSandboxUsername: process.env["one-login-sandbox-username"],
      oneLoginSandboxPassword: process.env["one-login-sandbox-password"],
      oneLoginApplicantEmail: process.env["one-login-applicant-email"],
      oneLoginApplicantPassword: process.env["one-login-applicant-password"],
      oneLoginAdminEmail: process.env["one-login-admin-email"],
      oneLoginAdminPassword: process.env["one-login-admin-password"],
      oneLoginSuperAdminEmail: process.env["one-login-super-admin-email"],
      oneLoginSuperAdminPassword: process.env["one-login-super-admin-password"],
      userDbUrl: process.env["CYPRESS_USERS_DATABASE_URL"],
      userDbName: process.env["CYPRESS_USERS_DATABASE_NAME"],
      applyDbUrl: process.env["CYPRESS_APPLY_DATABASE_URL"],
      applyDbName: process.env["CYPRESS_APPLY_DATABASE_NAME"],
      applicationBaseUrl: process.env["application-base-url"],
    },
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
