import {
  signInToIntegrationSite,
  signInAsAdmin,
  clickText,
  clickBack,
  clickSaveAndContinue,
  assert200,
  log,
} from "../../common/common";
import {
  publishAdvert,
  applicationForm,
  createGrant,
  advertSection1,
  advertSection2,
  advertSection3,
  advertSection4,
  advertSection5,
  convertDateToString,
} from "./helper";
import { GRANT_NAME, TASKS, SPOTLIGHT_SUBMISSION_STATUS } from "./constants";

const {
  UPDATE_SPOTLIGHT_SUBMISSION_STATUS,
  ADD_SPOTLIGHT_BATCH,
  ADD_SUBMISSION_TO_MOST_RECENT_BATCH,
  CLEANUP_TEST_SPOTLIGHT_SUBMISSIONS,
} = TASKS;

const { SENT, SEND_ERROR, GGIS_ERROR, VALIDATION_ERROR } =
  SPOTLIGHT_SUBMISSION_STATUS;

describe("Create a Grant", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("can create a new Grant and create advert", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    createGrant(GRANT_NAME);

    // create advert
    advertSection1(GRANT_NAME);
    advertSection2();
    advertSection3(true);
    advertSection4();
    advertSection5();

    publishAdvert(true);

    applicationForm();
  });

  it("V2 External - Download due diligence data", () => {
    // Populate data instead of completing journey
    cy.task("insertSubmissionsAndMQs");

    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    // View grant and get due diligence data
    cy.get('[data-cy="cy_SchemeListButton"]').click();
    cy.get(
      '[data-cy="cy_linkToScheme_Cypress - Test Scheme V2 External"]',
    ).click();
    cy.get(".govuk-button--secondary").click();

    // Check download link works
    assert200(cy.get(":nth-child(4) > .govuk-link"));

    cy.contains("Download due diligence information")
      .invoke("attr", "href")
      .then((url) => {
        log(Cypress.env("postLoginBaseUrl") + url);
        cy.downloadFile(
          Cypress.env("postLoginBaseUrl") + url,
          "cypress/downloads",
          "required_checks.xlsx",
        );
      });

    cy.parseXlsx("/cypress/downloads/required_checks.xlsx").then((jsonData) => {
      const data = [
        "MyOrg",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcod",
        "100",
        "67890",
        "12345",
        "Limited company",
      ];
      expect(jsonData[0].data[1]).to.include.members(data);
    });
  });

  it("Can access and use 'Manage Due Diligence Checks' (spotlight)", () => {
    // Populate data instead of completing journey
    cy.task("insertSubmissionsAndMQs");

    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, SENT);

    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    cy.get('[data-cy="cy_SchemeListButton"]').click();
    cy.get(
      "[data-cy='cy_linkToScheme_Cypress - Test Scheme V2 Internal']",
    ).click();

    clickText("Manage due diligence checks");

    // due diligence downloads
    assert200(cy.get(":nth-child(4) > .govuk-link"));
    assert200(cy.get(":nth-child(6) > .govuk-link"));

    // cy.contains("Log in to Spotlight")
    //   .invoke("attr", "href")
    //   .then(url => {
    //     expect(url).to.equal('https://cabinetoffice-spotlight.force.com/s/login/');
    //   });

    cy.contains("download the information you need to run checks")
      .invoke("attr", "href")
      .then((url) => {
        log(Cypress.env("postLoginBaseUrl") + url);
        cy.downloadFile(
          Cypress.env("postLoginBaseUrl") + url,
          "cypress/downloads",
          "spotlight_checks.zip",
        );
      });

    cy.unzip({ path: "cypress/downloads/", file: "spotlight_checks.zip" });

    cy.parseXlsx(
      `/cypress/downloads/unzip/spotlight_checks/${convertDateToString(
        Date.now(),
      )}_GGIS_ID_2_Cypress__Test_Scheme_V2_Internal_ charities_and_companies.xlsx`,
    ).then((jsonData) => {
      const data = [
        "MyOrg",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcod",
        "100",
        "67890",
        "12345",
      ];
      expect(jsonData[0].data[1]).to.include.members(data);
    });

    cy.contains("Download checks from applications")
      .invoke("attr", "href")
      .then((url) => {
        log(Cypress.env("postLoginBaseUrl") + url);
        cy.downloadFile(
          Cypress.env("postLoginBaseUrl") + url,
          "cypress/downloads",
          "required_checks.xlsx",
        );
      });

    cy.parseXlsx("/cypress/downloads/required_checks.xlsx").then((jsonData) => {
      const data = [
        "MyOrg",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcod",
        "100",
        "67890",
        "12345",
        "Limited company",
      ];
      expect(jsonData[0].data[1]).to.include.members(data);
    });

    cy.contains("You have 1 application in Spotlight.");

    // Check error message
    clickBack();

    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, GGIS_ERROR);

    cy.task(ADD_SPOTLIGHT_BATCH);
    cy.task(ADD_SUBMISSION_TO_MOST_RECENT_BATCH);

    clickText("Manage due diligence checks");

    cy.contains(
      "Spotlight did not recognise the GGIS reference number for your grant.",
    );

    clickText("Check that your grant reference number is correct.");

    cy.get('[data-cy="cy-ggisReference-text-input"]').clear();

    cy.get('[data-cy="cy-ggisReference-text-input"]').type("GGIS_ID_NEW");

    clickSaveAndContinue();

    cy.get(
      '[data-cy="cy_summaryListValue_GGIS Scheme Reference Number"]',
    ).contains("GGIS_ID_NEW");

    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, SEND_ERROR);
    clickText("Manage due diligence checks");
    cy.contains(
      "Due to a service outage, we cannot automatically send data to Spotlight at the moment. This affects 1 of your records.",
    );
    clickBack();
    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, VALIDATION_ERROR);
    clickText("Manage due diligence checks");
    cy.debug();
    cy.contains("We can't send your data to Spotlight");
    cy.task(CLEANUP_TEST_SPOTLIGHT_SUBMISSIONS);
  });

  it("V1 Internal - Download Due Diligence Data", () => {
    // Populate data instead of completing journey
    cy.task("insertSubmissionsAndMQs");

    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    // View V1 internal grant
    cy.get('[data-cy="cy_SchemeListButton"]').click();
    cy.get(
      '[data-cy="cy_linkToScheme_Cypress - Test Scheme V1 Internal"]',
    ).click();

    // Check download link works
    assert200(
      cy.get(
        '[data-cy="cy_Scheme-details-page-button-Download required checks"]',
      ),
    );

    cy.contains("Download required checks")
      .invoke("attr", "href")
      .then((url) => {
        log(Cypress.env("postLoginBaseUrl") + url);
        cy.downloadFile(
          Cypress.env("postLoginBaseUrl") + url,
          "cypress/downloads",
          "required_checks.xlsx",
        );
      });

    cy.parseXlsx("/cypress/downloads/required_checks.xlsx").then((jsonData) => {
      const data = [
        "My First Org",
        "Address line 1, Address line 2",
        "Town",
        "County",
        "Postcode",
        "100",
      ];
      expect(jsonData[0].data[1]).to.include.members(data);
    });
  });
});
