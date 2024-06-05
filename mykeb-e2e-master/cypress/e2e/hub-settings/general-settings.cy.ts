import { qase } from "cypress-qase-reporter/dist/mocha";
import generalSettingsPath from "../../support/constant/general-settings";
import GeneralSettings from "../../page-object/hub-settings/general-settings.po";
import HomePage from "../../page-object/home.po";

const generalSettings = new GeneralSettings();
const home = new HomePage();

describe("General settings - Logo actions", () => {
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToHubSettings();
  });

  qase(
    361,
    it('Verify that user is able to upload logo by click "Upload file" button', () => {
      generalSettings.inputLogo.selectFile("cypress/fixtures/images/cat.jpg", { force: true });
      generalSettings.saveChangesButton.click();
      cy.fixture("i18n/toaster-messages/en").then((text) => {
        cy.verifySuccessToasterMessage(text.success.changesSaved);
      });
      cy.reloadPage();
      generalSettings.logo.should("not.have.attr", "src", "assets/images/logo.svg");
      generalSettings.deleteLogo();
    })
  );

  qase(
    362,
    it('Verify that "Delete file" button appears after user uploaded file', () => {
      generalSettings.inputLogo.selectFile("cypress/fixtures/images/cat.jpg", { force: true });
      cy.wait(2000);
      generalSettings.deleteLogoButton.should("be.visible");
    })
  );

  qase(
    363,
    it('Verify that user is able to delete logo by click on "Delete file" button', () => {
      generalSettings.inputLogo.selectFile("cypress/fixtures/images/cat.jpg", { force: true });
      generalSettings.saveChangesButton.click();
      cy.fixture("i18n/toaster-messages/en").then((text) => {
        cy.verifySuccessToasterMessage(text.success.changesSaved);
      });
      cy.reloadPage();
      generalSettings.logo.should("not.have.attr", "src", "assets/images/logo.svg");
      generalSettings.deleteLogoButton.click();
      generalSettings.saveChangesButton.click();
      cy.reloadPage();
      generalSettings.logo.should("have.attr", "src", "assets/images/logo.svg");
    })
  );
});

describe("General settings - Welcome text checkbox", () => {
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToHubSettings();
  });

  qase(
    368,
    it('Verify that selected "Light welcome text?" leads to light welcome text on hub/home page', () => {
      generalSettings.lightWelcomeTextCheckbox.check({ force: true });
      generalSettings.saveChangesButton.click();
      cy.fixture("i18n/toaster-messages/en").then((text) => {
        cy.verifySuccessToasterMessage(text.success.changesSaved);
      });
      cy.navigateToHomePage();
      home.welcomeText.should("have.attr", "style", "color: rgb(255, 255, 255);");
    })
  );

  qase(
    369,
    it('Verify that not selected "Light welcome text?" leads to dark welcome text on hub/home page', () => {
      generalSettings.lightWelcomeTextCheckbox.uncheck({ force: true });
      generalSettings.saveChangesButton.click();
      cy.fixture("i18n/toaster-messages/en").then((text) => {
        cy.verifySuccessToasterMessage(text.success.changesSaved);
      });
      cy.navigateToHomePage();
      home.welcomeText.should("have.attr", "style", "color: rgb(0, 0, 0);");
    })
  );
});

describe("General settings - background actions", () => {
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToHubSettings();
  });

  qase(
    370,
    it('Verify that user is able to upload background image by click on "Upload file" button', () => {
      generalSettings.backgroundImageOrVideoInput.selectFile("cypress/fixtures/images/cat.jpg", { force: true });
      cy.intercept("POST", Cypress.env("URL") + generalSettingsPath.endpoint.general).as("imageID");
      generalSettings.saveChangesButton.click();
      cy.fixture("i18n/toaster-messages/en").then((text) => {
        cy.verifySuccessToasterMessage(text.success.changesSaved);
      });
      cy.navigateToHomePage();
      home.verifyBackgroundImage("@imageID");
      generalSettings.returnBackgroundImage("cypress/fixtures/images/background.jpg");
    })
  );

  qase(
    371,
    it('Verify that user is able to delete background image by click on "Delete file" button', () => {
      generalSettings.deleteBackgroundButton.click();
      generalSettings.saveChangesButton.click();
      cy.fixture("i18n/toaster-messages/en").then((text) => {
        cy.verifySuccessToasterMessage(text.success.changesSaved);
      });
      cy.navigateToHomePage();
      home.homeBackground.should("have.attr", "style", 'background-image: url("");');
      generalSettings.returnBackgroundImage("cypress/fixtures/images/background.jpg");
    })
  );

  qase(
    372,
    it('Verify that "Delete file" button appears after user uploaded background image', () => {
      generalSettings.deleteBackgroundButton.click();
      generalSettings.backgroundImageOrVideoInput.selectFile("cypress/fixtures/images/background.jpg", { force: true });
      generalSettings.deleteBackgroundButton.should("exist").and("be.visible");
    })
  );

  qase(
    373,
    it('Verify that user is able to upload video as background by click "Upload file" button', () => {
      generalSettings.backgroundImageOrVideoInput.selectFile("cypress/fixtures/images/video.mp4", { force: true });
      cy.wait(2000);
      generalSettings.saveChangesButton.click();
      cy.fixture("i18n/toaster-messages/en").then((text) => {
        cy.verifySuccessToasterMessage(text.success.changesSaved);
      });
      cy.navigateToHomePage();
      home.videoBg.should("exist");
      generalSettings.returnBackgroundImage("cypress/fixtures/images/background.jpg");
    })
  );

  qase(
    374,
    it('Verify that user is able to delete video from background by click "Delete file" button', () => {
      generalSettings.backgroundImageOrVideoInput.selectFile("cypress/fixtures/images/video.mp4", { force: true });
      cy.wait(2000);
      generalSettings.saveChangesButton.click();
      cy.fixture("i18n/toaster-messages/en").then((text) => {
        cy.verifySuccessToasterMessage(text.success.changesSaved);
        cy.navigateToHomePage();
        home.videoBg.should("exist");
        cy.navigateToHubSettings();
        generalSettings.deleteBackgroundButton.click();
        generalSettings.saveChangesButton.click();
        cy.verifySuccessToasterMessage(text.success.changesSaved);
      });
      cy.navigateToHomePage();
      home.videoBg.should("not.exist");
      generalSettings.returnBackgroundImage("cypress/fixtures/images/background.jpg");
    })
  );
});
