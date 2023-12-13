import {
  signInToIntegrationSite,
  signInAsAdmin,
  clickText,
  clickBack,
  clickSaveAndContinue,
  assert200,
  log,
  validateXlsx,
  downloadFileFromLink,
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

  it.skip("Admin can create a new Grant with Advert and Application Form", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    log("Admin grant creation journey - Signing in as admin");
    signInAsAdmin();
    log("Admin grant creation journey - creating Grant");
    createGrant(GRANT_NAME);

    // create advert
    log("Admin grant creation journey - creating Advert Section 1");
    advertSection1(GRANT_NAME);
    log("Admin grant creation journey - creating Advert Section 2");
    advertSection2();
    log("Admin grant creation journey - creating Advert Section 3");
    advertSection3(true);
    log("Admin grant creation journey - creating Advert Section 4");
    advertSection4();
    log("Admin grant creation journey - creating Advert Section 5");
    advertSection5();

    log("Admin grant creation journey - publishing advert");
    publishAdvert(true);

    log("Admin grant creation journey - creating application form");
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

    downloadFileFromLink(
      cy.contains("Download due diligence information"),
      "required_checks.xlsx",
    );

    validateXlsx("/cypress/downloads/required_checks.xlsx", [
      [
        "00000010-0000-0000-0000-000000000000",
        "V2 External Limited company",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcode",
        "100",
        "67890",
        "12345",
        "Limited company",
        "",
      ],
    ]);
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

    downloadFileFromLink(
      cy.contains("download the information you need to run checks"),
      "spotlight_checks.zip",
    );

    cy.unzip({ path: "cypress/downloads/", file: "spotlight_checks.zip" });

    const timestamp = convertDateToString(Date.now());
    const filePath = "/cypress/downloads/unzip/spotlight_checks";

    const limitedCompanyFileName = `${filePath}/${timestamp}_GGIS_ID_2_Cypress__Test_Scheme_V2_Internal_ charities_and_companies.xlsx`;
    validateXlsx(limitedCompanyFileName, [
      [
        "00000011-0000-0000-0000-000000000000",
        "V2 Internal Limited company",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcode",
        "100",
        "67890",
        "12345",
        "",
      ],
    ]);

    const nonLimitedCompanyFileName = `${filePath}/${timestamp}_GGIS_ID_2_Cypress__Test_Scheme_V2_Internal_non_limited_companies.xlsx`;
    validateXlsx(nonLimitedCompanyFileName, [
      [
        "00000012-0000-0000-0000-000000000000",
        "V2 Internal Non-limited company",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcode",
        "100",
        "",
        "",
        "",
      ],
    ]);

    downloadFileFromLink(
      cy.contains("Download checks from applications"),
      "required_checks.xlsx",
    );

    validateXlsx("/cypress/downloads/required_checks.xlsx", [
      [
        "00000011-0000-0000-0000-000000000000",
        "V2 Internal Limited company",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcode",
        "100",
        "67890",
        "12345",
        "Limited company",
        "",
      ],
      [
        "00000012-0000-0000-0000-000000000000",
        "V2 Internal Non-limited company",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcode",
        "100",
        "",
        "",
        "Non-limited company",
        "",
      ],
      [
        "00000013-0000-0000-0000-000000000000",
        "V2 Internal Individual",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcode",
        "100",
        "",
        "",
        "I am applying as an Individual",
        "",
      ],
    ]);

    cy.contains("You have 2 applications in Spotlight.");

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
      "Due to a service outage, we cannot automatically send data to Spotlight at the moment. This affects 2 of your records.",
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

    downloadFileFromLink(
      cy.contains("Download required checks"),
      "required_checks.xlsx",
    );

    validateXlsx("/cypress/downloads/required_checks.xlsx", [
      [
        "00000010-0000-0000-0000-000000000000",
        "V1 Internal Limited company",
        "Address line 1, Address line 2",
        "Town",
        "County",
        "Postcode",
        "100",
        "",
        "",
        "",
      ],
    ]);
  });
});
