import {
  assert200,
  clickText,
  log,
  signInAsSuperAdmin,
  signInToIntegrationSite,
} from "../../common/common";
import { TASKS } from "./constants";

const { ADD_FAILED_OAUTH_AUDIT, ADD_SUCCESS_OAUTH_AUDIT } = TASKS;
describe("Super Admin", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Can reconnect to spotlight", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    log("Super Admin Reconnect Spotlight - Signing in as super admin");
    signInAsSuperAdmin();
    cy.task(ADD_FAILED_OAUTH_AUDIT);
    clickText("Integrations");
    log("Super Admin Reconnect Spotlight - Reconnecting to Spotlight");
    reconnectSpotlight();
    cy.task(ADD_SUCCESS_OAUTH_AUDIT);
    clickText("Integrations");
    cy.get("[data-cy='cy_table_row-for-Integration-row-0-cell-0']").contains(
      "Spotlight",
    );
    cy.get('[data-cy="cy_table_row-for-Status-row-0-cell-1"]');
    cy.get("[data-cy='cy_table_row-for-Status-row-0-cell-1']").contains(
      "Connected",
    );
  });
});

const reconnectSpotlight = () => {
  assert200(cy.contains("Reconnect"));
};
