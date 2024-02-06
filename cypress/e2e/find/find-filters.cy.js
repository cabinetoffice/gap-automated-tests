import { signInToIntegrationSite } from "../../common/common";

describe("Sort search results", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    cy.task("setUpFindData");
    signInToIntegrationSite();
  });

  it("can apply and clear filters", () => {
    cy.get('[data-cy="cySearchGrantsBtn"]').click();

    const filters = {
      whoCanApply: [
        ["Personal / individual", "Personal / Individual"],
        ["Public sector", "Public Sector"],
        ["Private sector", "Private Sector"],
        ["Non profit", "Non-profit"],
        ["Local authority", "Local authority"],
      ],
      location: [
        "National",
        "England",
        "North East England",
        "North West England",
        "South East England",
        "South West England",
        "Midlands",
        "Scotland",
        "Wales",
        "Northern Ireland",
      ],
      howMuchCanYouGet: [
        // cy.get('[data-cy="cy£0 to £10,000Checkbox"]')
        ["£0 to £10,000", 10000],
        ["£10,001 to £50,000", 50000],
        ["£50,001 to £250,000", 250000],
        ["£250,001 to £1,000,000", 1000000],
        ["£1,000,001 to £5,000,000", 5000000],
        ["£5,000,000 plus", 5000000],
      ],
      dateAdded: [
        ["from", "2023"],
        ["to", "2030"],
      ],
    };

    // Who can apply
    filters.whoCanApply.forEach((filterOption, filterIndex) => {
      cy.get(`[data-cy="cy${filterOption[0]}Checkbox"]`).click();
      cy.get('[data-cy="cyApplyFilter"]').click();

      // Verify filter
      cy.get("body").then((body) => {
        if (body.find(".grants_list").length) {
          cy.get(".grants_list > :nth-child(1) > :nth-child(5)").contains(
            filterOption[1],
          );
        } else {
          cy.url().then((url) => {
            cy.wrap(url).should(
              "include",
              `fields.grantApplicantType.en-US=${filterIndex + 1}`,
            );
          });
        }
      });

      cy.get(".grants_list > :nth-child(1) > :nth-child(5)").contains(
        filterOption[1],
      );
      cy.get('[data-cy="cyCancelFilterTop"]').click();
    });

    // Location
    filters.location.forEach((filterOption, filterIndex) => {
      cy.get(`[data-cy="cy${filterOption}Checkbox"]`).click();
      cy.get('[data-cy="cyApplyFilter"]').click();

      // Verify filter
      cy.get("body").then((body) => {
        if (body.find(".grants_list").length) {
          cy.get(".grants_list > :nth-child(1) > :nth-child(3)").contains(
            filterOption,
          );
        } else {
          cy.url().then((url) => {
            cy.wrap(url).should(
              "include",
              `fields.grantLocation.en-US=${filterIndex + 1}`,
            );
          });
        }
      });

      cy.get('[data-cy="cyCancelFilterTop"]').click();
    });

    // How much you can get
    filters.howMuchCanYouGet.forEach((filterRange, filterIndex, filters) => {
      cy.get(`[data-cy="cy${filterRange[0]}Checkbox"]`).click();
      cy.get('[data-cy="cyApplyFilter"]').click();

      // Verify filter
      cy.get("body").then((body) => {
        if (body.find(".grants_list").length) {
          cy.get(".grants_list > :nth-child(1) > :nth-child(6)")
            .invoke("text")
            .then((text) => {
              // Extract values from advert listing
              const p1Index = text.indexOf("£");
              const s1Index = text.indexOf(" ", p1Index);
              const p2Index = text.indexOf("£", s1Index);
              const maxPriceText = text.slice(p2Index + 1).replace(",", "");

              const maxPrice = maxPriceText.includes("million")
                ? parseInt(parseFloat(maxPriceText) * 1000000)
                : parseInt(maxPriceText);

              if (filterIndex < filters.length - 1) {
                cy.wrap(maxPrice).should("be.lte", filterRange[1]);
              } else {
                cy.wrap(maxPrice).should("be.gte", filterRange[1]);
              }
            });
        } else {
          cy.url().then((url) => {
            cy.wrap(url).should(
              "include",
              `fields.grantMaximumAward.en-US=${filterIndex + 1}`,
            );
          });
        }
      });

      cy.get('[data-cy="cyCancelFilterTop"]').click();
    });

    // Date - manual entry
    filters.dateAdded.forEach((date) => {
      cy.get(`[data-cy="cyDateFilter-${date[0]}Day"]`).type("01");
      cy.get(`[data-cy="cyDateFilter-${date[0]}Month"]`).type("01");
      cy.get(`[data-cy="cyDateFilter-${date[0]}Year"]`).type(date[1]);
    });
    cy.get('[data-cy="cyApplyFilter"]').click();
    cy.get('[data-cy="cySearchDescription"]').contains(
      "Showing grants added between 1 January 2023 to 1 January 2030",
    );
    cy.get('.govuk-\\!-display-block > [data-module="govuk-button"]').click();
    cy.get('[data-cy="cySearchDescription"]').contains("Search grants");

    // Date - date picker
    cy.get('[data-cy="cyDatePicker-from"]').click();
    cy.get("#from-grid-label")
      .invoke("text")
      .then((monthYear) => {
        cy.get(
          '[data-cy="cyDatePicker-fromModal"] > .dates > tbody > :nth-child(1) > [tabindex="0"]',
        )
          .invoke("text")
          .then((day) => {
            const date = day + " " + monthYear;

            cy.get(
              '[data-cy="cyDatePicker-fromModal"] > .dates > tbody > :nth-child(2) > [tabindex="0"]',
            ).click();

            cy.get('[data-cy="cyDatePicker-to"]').click();
            cy.get(
              '[data-cy="cyDatePicker-toModal"] > .dates > tbody > :nth-child(2) > [tabindex="0"]',
            ).click();

            cy.get('[data-cy="cyApplyFilter"]').click();
            cy.get('[data-cy="cySearchDescription"]').contains(
              `Showing grants added between ${date} to ${date}`,
            );
          });
      });
    cy.get('[data-cy="cyCancelFilterBottom"]').click();
    cy.get('[data-cy="cySearchDescription"]').contains("Search grants");
  });
});
