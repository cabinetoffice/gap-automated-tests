import { log } from "../../common/common";
import { getUUID } from "../../seed/apply/helper";

const apiGatewayUrl = Cypress.env("apiGatewayUrl");
const firstUserId = parseInt(Cypress.env("firstUserId"));

const submission0Id = getUUID(0, firstUserId);
const submission1Id = getUUID(1, firstUserId);
const submission2Id = getUUID(2, firstUserId);
const submission3Id = getUUID(3, firstUserId);
const apiKey =
  `CypressE2ETestTechSupport001${firstUserId}` +
  `CypressE2ETestTechSupport001${firstUserId}`;

describe("API Endpoint Test", () => {
  before(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    cy.task("createApiKeysInApiGatewayForTechnicalSupport");
    cy.task("insertSubmissionsAndMQs");
  });

  describe("/submissions", () => {
    const url = apiGatewayUrl + "/submissions";
    describe("non happy path", () => {
      it("Should return 403 status code when no Api Key has been passed", () => {
        log(`API Endpoint Test - ${url} - non happy path - no api key passed`);
        cy.request({
          method: "GET",
          url,
          headers: {},
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(403);
          expect(response.body.Message).to.equal(
            "User is not authorized to access this resource with an explicit deny",
          );
        });
      });

      it("Should return 403 status code when wrong Api Key has been passed", () => {
        log(
          `API Endpoint Test - ${url} - non happy path - wrong api key passed`,
        );

        cy.request({
          method: "GET",
          url,
          headers: {
            "x-api-key": "wrongApiKey",
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(403);
          expect(response.body.Message).to.equal(
            "User is not authorized to access this resource with an explicit deny",
          );
        });
      });
    });

    describe("happy path", () => {
      it("Should return 200 status code and validate response body", () => {
        log(
          `API Endpoint Test - ${url} - happy path - using apikey: ${apiKey} return 200 status code and validate response body `,
        );

        cy.request({
          method: "GET",
          url,
          headers: {
            "x-api-key": apiKey,
          },
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property("numberOfResults");
          expect(response.body.numberOfResults).to.equal(2);
          expect(response.body.applications).to.have.length(2);

          expect(response.body.applications[0].applicationFormName).to.equal(
            "Cypress - Test Application V2 Internal",
          );
          expect(response.body.applications[0].submissions).to.have.lengthOf(3);
          expect(
            response.body.applications[0].submissions[0].submissionId,
          ).to.equal(submission1Id);
          expect(
            response.body.applications[0].submissions[1].submissionId,
          ).to.equal(submission2Id);
          expect(
            response.body.applications[0].submissions[2].submissionId,
          ).to.equal(submission3Id);

          expect(response.body.applications[1].applicationFormName).to.equal(
            "Cypress - Test Application V1 Internal",
          );
          expect(response.body.applications[1].submissions).to.have.lengthOf(1);
          expect(
            response.body.applications[1].submissions[0].submissionId,
          ).to.equal(submission0Id);
        });
      });
    });
  });

  describe("/submissions/ggisReferenceNumber", () => {
    const url = apiGatewayUrl + "/submissions/GGIS_ID_2";
    describe("non happy path", () => {
      it("Should return 403 status code when no Api Key has been passed", () => {
        log(`API Endpoint Test - ${url} - non happy path - no api key passed`);

        cy.request({
          method: "GET",
          url,
          headers: {},
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(403);
          expect(response.body.Message).to.equal(
            "User is not authorized to access this resource with an explicit deny",
          );
        });
      });

      it("Should return 403 status code when wrong Api Key has been passed", () => {
        log(
          `API Endpoint Test - ${url} - non happy path - wrong api key passed`,
        );

        cy.request({
          method: "GET",
          url,
          headers: {
            "x-api-key": "wrongApiKey",
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(403);
          expect(response.body.Message).to.equal(
            "User is not authorized to access this resource with an explicit deny",
          );
        });
      });
    });

    describe("happy path", () => {
      describe("multiple submissions", () => {
        it("Should return 200 status code and validate response body", () => {
          log(
            `API Endpoint Test - ${url} - happy path - multiple submission - using apikey: ${apiKey} return 200 status code and validate response body`,
          );

          cy.request({
            method: "GET",
            url,
            headers: {
              "x-api-key": apiKey,
            },
          }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("numberOfResults");
            expect(response.body.numberOfResults).to.equal(1);
            expect(response.body.applications).to.have.length(1);
            expect(response.body.applications[0].applicationFormName).to.equal(
              "Cypress - Test Application V2 Internal",
            );
            expect(response.body.applications[0].submissions).to.have.lengthOf(
              3,
            );
            expect(
              response.body.applications[0].submissions[0].submissionId,
            ).to.equal(submission1Id);
            expect(
              response.body.applications[0].submissions[1].submissionId,
            ).to.equal(submission2Id);
            expect(
              response.body.applications[0].submissions[2].submissionId,
            ).to.equal(submission3Id);
          });
        });
      });

      describe("single submissions", () => {
        it("Should return 200 status code and validate response body", () => {
          const url = apiGatewayUrl + "/submissions/GGIS_ID_1";
          log(
            `API Endpoint Test - ${url} - happy path - single submission - using apikey: ${apiKey} return 200 status code and validate response body`,
          );

          cy.request({
            method: "GET",
            url,
            headers: {
              "x-api-key": apiKey,
            },
          }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("numberOfResults");
            expect(response.body.numberOfResults).to.equal(1);
            expect(response.body.applications).to.have.length(1);
            expect(response.body.applications[0].applicationFormName).to.equal(
              "Cypress - Test Application V1 Internal",
            );
            expect(response.body.applications[0].submissions).to.have.lengthOf(
              1,
            );
            expect(
              response.body.applications[0].submissions[0].submissionId,
            ).to.equal(submission0Id);
          });
        });
      });
    });
  });
});
