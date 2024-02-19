const apiGatewayUrl = Cypress.env("apiGatewayUrl");
const firstUserId = Cypress.env("firstUserId");
describe("API Endpoint Test", () => {
  it("Should return 403 status code when no Api Key has been passed", () => {
    cy.request({
      method: "GET",
      url: apiGatewayUrl,
      headers: {},
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(403);
      console.log(response.body);
      expect(response.body.Message).to.equal(
        "User is not authorized to access this resource with an explicit deny",
      );
    });
  });

  it("Should return 200 status code and validate response body", () => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    cy.task("createApiKeysInApiGatewayForTechnicalSupport");
    const apiKey =
      `CypressE2ETestTechSupport001${firstUserId}` +
      `CypressE2ETestTechSupport001${firstUserId}`;

    cy.request({
      method: "GET",
      url: apiGatewayUrl,
      headers: {
        "x-api-key": apiKey,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      console.log(response.body);
    });
  });
});
