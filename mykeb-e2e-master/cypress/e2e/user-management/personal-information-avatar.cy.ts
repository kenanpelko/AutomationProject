import { faker } from "@faker-js/faker";
import PersonalInformation from "../../page-object/user-management/personal-information.po";
import userPath from "../../support/constant/user-managment";
const localization = require(`../../fixtures/i18n/user-management/en.json`);

const personalInformation = new PersonalInformation();
const imageRequest = "**/service/file/v1/file";

const demo = "images/demo.png";
const demo1 = "images/demo1.png";

describe("Editing personal information", () => {
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    personalInformation.navigateByLink();
  });

  it("Add new image", () => {
    cy.intercept("POST", imageRequest).as("imageRequest");
    personalInformation.imageInput.attachFile(demo);
    cy.wait("@imageRequest").then((data: any) => {
      const imageId = data.response.body.data.id;

      expect(data.response.statusCode).to.equal(201);
      cy.get(`[src*='${imageId}']`).should("be.visible");

      personalInformation.saveButton.click();
      cy.verifyURLDoesntContain(userPath.path.me); //User is navigated back to the users page

      //Navigating back to personal settings and veryfing changes after the save
      personalInformation.navigateByLink();
      cy.get(`[src*='${imageId}']`).should("be.visible");
    });
  });

  it("Replace existing image", () => {
    //Uploading first image
    cy.intercept("POST", imageRequest).as("imageRequest");
    personalInformation.imageInput.attachFile(demo);
    cy.wait("@imageRequest").then((data: any) => {
      expect(data.response.statusCode).to.equal(201);
    });

    //Uploading second image
    cy.intercept("POST", imageRequest).as("imageRequest");
    personalInformation.imageInput.attachFile(demo1);
    cy.wait("@imageRequest").then((data: any) => {
      const imageId = data.response.body.data.id;
      expect(data.response.statusCode).to.equal(201);
      cy.get(`[src*='${imageId}']`).should("be.visible");
      personalInformation.saveButton.click();

      cy.verifyURLDoesntContain(userPath.path.me);
      personalInformation.navigateByLink();
      cy.get(`[src*='${imageId}']`).should("be.visible");
    });
  });
});
