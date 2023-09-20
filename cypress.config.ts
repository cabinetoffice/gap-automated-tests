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
    },
  },
});
