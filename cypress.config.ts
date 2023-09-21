import { defineConfig } from "cypress";
import { createTestUsers, deleteTestUsers } from "./cypress/seed/user";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        setUpUser() {
          deleteTestUsers();
          // await createTestUsers();
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
