import { defineConfig } from "cypress";
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
  },
  env: {
    userDbUrl: process.env["CYPRESS_USERS_DATABASE_URL"],
    userDbName: process.env["CYPRESS_USERS_DATABASE_NAME"],
    applyDbUrl: process.env["CYPRESS_APPLY_DATABASE_URL"],
    applyDbName: process.env["CYPRESS_APPLY_DATABASE_NAME"],
  },
});
