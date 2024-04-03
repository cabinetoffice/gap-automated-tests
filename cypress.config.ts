import { defineConfig } from 'cypress';
import * as dayjs from 'dayjs';
import {
  TEST_V1_EXTERNAL_GRANT,
  TEST_V1_INTERNAL_GRANT,
  TEST_V2_EXTERNAL_GRANT,
  TEST_V2_INTERNAL_GRANT,
  EXPORT_BATCH,
} from './cypress/common/constants';
import {
  addAdminInTechSupportTable,
  addSpotlightBatch,
  addToRecentBatch,
  cleanupTestSpotlightSubmissions,
  createApiKeysData,
  createApiKeysInApiGatewayForTechnicalSupport,
  createApplyData,
  deleteAPIKeysFromAwsForTechSupport,
  deleteApiKeysData,
  deleteApplySchemes,
  deleteSpotlightBatch,
  deleteSpotlightSubmission,
  getExportedSubmissionUrlAndLocation,
  insertSubmissionAndExport,
  insertSubmissionsAndMQs,
  updateSpotlightSubmission,
  simulateMultipleApplicationFormEditors,
  deleteApplyData,
} from './cypress/seed/apply/service';
import { deleteFindData } from './cypress/seed/find';
import {
  addFailedOauthAudit,
  addSuccessOauthAudit,
  addTechSupportRoleToAdmin,
  createTestUsers,
  deleteTestUsers,
  removeTechSupportRoleFromAdmin,
} from './cypress/seed/user';
import {
  publishGrantAdverts,
  removeAdvertByName,
  unpublishAdvertByName,
  waitForAdvertToPublish,
} from './cypress/seed/contentful';
const xlsx = require('node-xlsx').default;
const fs = require('fs');
const decompress = require('decompress');
require('dotenv').config();

export default defineConfig({
  taskTimeout: 120000,
  e2e: {
    setupNodeEvents(on) {
      // implement node event listeners here
      on('task', {
        async addFailedOauthAudit() {
          await addFailedOauthAudit();
          return null;
        },
        async addSuccessOauthAudit() {
          await addSuccessOauthAudit();
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
          await deleteApplyData();
          await createApplyData({ publishedAds: true });

          return null;
        },
        async setUpApplyDataWithAds() {
          await deleteApplyData();
          await createApplyData({ publishedAds: false });
          await publishGrantAdverts();

          return null;
        },
        async waitForAdvertToPublish(name) {
          await waitForAdvertToPublish(name);

          return null;
        },
        async removeAdvertByName(name) {
          await removeAdvertByName(name);

          return null;
        },
        async unpublishAdvert(advertName) {
          await unpublishAdvertByName(advertName);

          return null;
        },
        async deleteSchemes() {
          await deleteApplySchemes();

          return null;
        },
        async simulateMultipleApplicationFormEditors() {
          await simulateMultipleApplicationFormEditors();

          return null;
        },
        async addTechSupportRoleToAdmin() {
          // we remove the tech support user in apply db in deleteApplyData
          await removeTechSupportRoleFromAdmin().then(async () => {
            await addTechSupportRoleToAdmin();
            await addAdminInTechSupportTable();
          });
          return null;
        },
        async setUpFindData() {
          await deleteFindData();

          return null;
        },
        async create11ApiKeys() {
          await deleteApiKeysData().then(async () => {
            await createApiKeysData();
          });

          return null;
        },
        async deleteAPIKeysFromAwsForTechSupport() {
          await deleteAPIKeysFromAwsForTechSupport();

          return null;
        },
        async createApiKeysInApiGatewayForTechnicalSupport() {
          await createApiKeysInApiGatewayForTechnicalSupport(1, 2);

          return null;
        },
        async insertSubmissionsAndMQs() {
          await insertSubmissionsAndMQs();

          return null;
        },
        async insertSubmissionAndExport() {
          await insertSubmissionAndExport();
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
            path + 'unzip/' + file.replace('.zip', ''),
          );
        },
        async getExportedSubmissionUrlAndLocation(schemeId: string) {
          return await getExportedSubmissionUrlAndLocation(schemeId);
        },
        log(message) {
          console.log(dayjs().format() + ' | ' + message);

          return null;
        },
        async ls(filePath = '/cypress/downloads') {
          const list = fs.readdirSync(__dirname + filePath);
          console.log(list);
          return `ls ${filePath}: ${JSON.stringify(list)}`;
        },
        table(message) {
          console.table(message);

          return null;
        },
      });
      require('cypress-mochawesome-reporter/plugin')(on);
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
      exportBatch: {
        ...EXPORT_BATCH,
      },
      awsRegion: process.env.AWS_API_GATEWAY_REGION,
      awsAccessKey: process.env.AWS_API_GATEWAY_ACCESS_KEY,
      awsSecretKey: process.env.AWS_API_GATEWAY_SECRET_KEY,
      awsApiGatewayUsagePlanId: process.env.AWS_API_GATEWAY_USAGE_PLAN_ID,
      awsEnvironment: process.env.AWS_ENVIRONMENT,
    },
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'mochawesome-report',
      reportFilename: '[status]_[datetime]_report',
      timestamp: 'yyyy-mm-ddTHH:MM:ssZ',
      charts: true,
      reportPageTitle: 'Find a Grant',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
      debug: true,
      html: true,
      json: false,
      overwrite: false,
    },
    baseUrl: process.env.APPLICATION_BASE_URL,
    viewportWidth: 1000,
    viewportHeight: process.env.HEADFUL_MODE === 'true' ? 1000 : 2000,
    experimentalRunAllSpecs: true,
  },
});
