import { defineConfig } from "cypress";
import {
  addFailedOauthAudit,
  createTestUsers,
  deleteTestUsers,
  deleteFailedOauthAudit,
} from "./cypress/seed/user";
import {
  createApplyData,
  deleteApplyData,
  updateSpotlightSubmission,
  addToRecentBatch,
  addSpotlightBatch,
  cleanupTestSpotlightSubmissions,
  deleteSpotlightBatch,
  deleteSpotlightSubmission,
  insertSubmissionsAndMQs,
  getExportedSubmissionUrlAndLocation,
  deleteApiKeysData,
  createApiKeysData,
  grabAllApiKeys,
  deleteExistingApiKeys,
  refillDbWithAllPreExistingApiKeys,
} from "./cypress/seed/apply/service";
import { createFindData, deleteFindData } from "./cypress/seed/find";
import {
  publishGrantAdverts,
  removeAdvertByName,
} from "./cypress/seed/contentful";
import {
  TEST_V1_INTERNAL_GRANT,
  TEST_V1_EXTERNAL_GRANT,
  TEST_V2_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
} from "./cypress/common/constants";
const xlsx = require("node-xlsx").default;
const fs = require("fs");
const decompress = require("decompress");
require("dotenv").config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      // implement node event listeners here
      on("task", {
        async addTestOauthAudit() {
          await deleteFailedOauthAudit().then(async () => {
            await addFailedOauthAudit();
          });
          return null;
        },
        async deleteFailedOauthAudit() {
          await deleteFailedOauthAudit();
          return null;
        },

        async addSpotlightBatch() {
          await deleteSpotlightBatch().then(async () => {
            await addSpotlightBatch();
          });
          return null;
        },
        async addSubmissionToMostRecentBatch() {
          await addToRecentBatch();
          return null;
        },
        async updateSpotlightSubmissionStatus(status) {
          await updateSpotlightSubmission(status);
          return null;
        },
        async cleanupTestSpotlightSubmissions() {
          await deleteSpotlightSubmission();
          await deleteSpotlightBatch();
          await cleanupTestSpotlightSubmissions();
          return null;
        },
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
        async create110ApiKeys() {
          await deleteApiKeysData().then(async () => {
            await createApiKeysData();
          });

          return null;
        },
        async grabExistingApiKeysFromDb() {
          return await grabAllApiKeys();
        },

        async deleteExistingApiKeysFromDb(originalData) {
          await deleteExistingApiKeys(originalData[0]);
          return null;
        },

        async refillDbWithPreExistingApiKeys(originalData) {
          console.log("originalData from cypressconfig: ", originalData[0]);
          await refillDbWithAllPreExistingApiKeys(originalData[0]);
          return null;
        },
        async deleteApiKeys() {
          await deleteApiKeysData();
          return null;
        },
        async removeAdvertByName(name) {
          await removeAdvertByName(name);
          return null;
        },
        async publishGrantsToContentful() {
          await publishGrantAdverts();

          return null;
        },
        async insertSubmissionsAndMQs() {
          await insertSubmissionsAndMQs();

          return null;
        },
        async parseXlsx({ filePath }) {
          try {
            return xlsx.parse(fs.readFileSync(__dirname + filePath));
          } catch (e) {
            console.error(e);
            return null;
          }
        },
        unzip({ path, file }) {
          return decompress(
            path + file,
            path + "unzip/" + file.replace(".zip", ""),
          );
        },
        async getExportedSubmissionUrlAndLocation(schemeId: string) {
          return await getExportedSubmissionUrlAndLocation(schemeId);
        },
        log(message) {
          console.log(message);

          return null;
        },
        async ls(filePath = "/cypress/downloads") {
          const list = fs.readdirSync(__dirname + filePath);
          console.log(list);
          return `ls ${filePath}: ${JSON.stringify(list)}`;
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
      oneLoginTechnicalSupportEmail:
        process.env.ONE_LOGIN_TECHNICAL_SUPPORT_EMAIL,
      oneLoginTechnicalSupportPassword:
        process.env.ONE_LOGIN_TECHNICAL_SUPPORT_PASSWORD,
      userDbUrl: process.env.USERS_DATABASE_URL,
      userDbName: process.env.USERS_DATABASE_NAME,
      applyDbUrl: process.env.APPLY_DATABASE_URL,
      applyDbName: process.env.APPLY_DATABASE_NAME,
      applicationBaseUrl: process.env.APPLICATION_BASE_URL,
      postLoginBaseUrl: process.env.POST_LOGIN_BASE_URL,
      firstUserId: process.env.FIRST_USER_ID,
      testV1InternalGrant: {
        ...TEST_V1_INTERNAL_GRANT,
      },
      testV1ExternalGrant: {
        ...TEST_V1_EXTERNAL_GRANT,
      },
      testV2InternalGrant: {
        ...TEST_V2_INTERNAL_GRANT,
      },
      testV2ExternalGrant: {
        ...TEST_V2_EXTERNAL_GRANT,
      },
      awsRegion: process.env.AWS_API_GATEWAY_REGION,
      awsAccessKey: process.env.AWS_API_GATEWAY_ACCESS_KEY,
      awsSecretKey: process.env.AWS_API_GATEWAY_SECRET_KEY,
      awsApiGatewayUsagePlanId: process.env.API_GATEWAY_USAGE_PLAN_ID,
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
    baseUrl: process.env.APPLICATION_BASE_URL,
  },
});
