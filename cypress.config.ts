import { defineConfig } from "cypress";
import { createTestUsers, deleteTestUsers } from "./cypress/seed/user";
import { createApplyData, deleteApplyData } from "./cypress/seed/apply";
import { createFindData, deleteFindData } from "./cypress/seed/find";
import { publishGrantAdverts } from "./cypress/seed/contentful";
import {
  TEST_V1_GRANT,
  TEST_V2_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
} from "./cypress/common/constants";
require("dotenv").config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      // implement node event listeners here
      on("task", {
        async setUpUser() {
          await deleteTestUsers().then(async () => {
            await createTestUsers();
          });

          return null;
        },
        async setUpApplyData() {
          await deleteApplyData().then(async () => {
            await createApplyData();
          });

          return null;
        },
        async setUpFindData() {
          await deleteFindData().then(async () => await createFindData());

          return null;
        },
        async publishGrantsToContentful() {
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
      oneLoginSandboxBaseUrl: process.env.ONE_LOGIN_BASE_URL,
      oneLoginSandboxUsername: process.env.ONE_LOGIN_USERNAME,
      oneLoginSandboxPassword: process.env.ONE_LOGIN_PASSWORD,
      oneLoginApplicantEmail: process.env.ONE_LOGIN_APPLICANT_EMAIL,
      oneLoginApplicantPassword: process.env.ONE_LOGIN_APPLICANT_PASSWORD,
      oneLoginAdminEmail: process.env.ONE_LOGIN_ADMIN_EMAIL,
      oneLoginAdminPassword: process.env.ONE_LOGIN_ADMIN_PASSWORD,
      oneLoginSuperAdminEmail: process.env.ONE_LOGIN_SUPER_ADMIN_EMAIL,
      oneLoginSuperAdminPassword: process.env.ONE_LOGIN_SUPER_ADMIN_PASSWORD,
      userDbUrl: process.env.USERS_DATABASE_URL,
      userDbName: process.env.USERS_DATABASE_NAME,
      applyDbUrl: process.env.APPLY_DATABASE_URL,
      applyDbName: process.env.APPLY_DATABASE_NAME,
      applicationBaseUrl: process.env.APPLICATION_BASE_URL,
      postLoginBaseUrl: process.env.POST_LOGIN_BASE_URL,
      firstUserId: process.env.FIRST_USER_ID,
      testV1Grant: {
        ...TEST_V1_GRANT,
      },
      testV2InternalGrant: {
        ...TEST_V2_INTERNAL_GRANT,
      },
      testV2ExternalGrant: {
        ...TEST_V2_EXTERNAL_GRANT,
      },
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
