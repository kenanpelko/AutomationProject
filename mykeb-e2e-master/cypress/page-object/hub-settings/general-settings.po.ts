export default class GeneralSettings {
  get uploadLogoBtn() {
    return cy.get(".settings-content app-button .btn.primary").first();
  }

  get inputLogo() {
    return cy.get('[class="d-flex flex-column py-4"] [type="file"]').eq(0);
  }

  get deleteLogoButton() {
    return cy.get('[class="d-flex flex-column py-4"] [class="btn btn-outline-primary"]').eq(0);
  }

  get logo() {
    return cy.get("a > .logo");
  }

  get saveChangesButton() {
    return cy.get('[class*="actions"] [class="btn btn-primary"]').wait(2000);
  }

  get lightWelcomeTextCheckbox() {
    return cy.get('.settings-content.general [type="checkbox"]');
  }

  get backgroundImageOrVideoInput() {
    return cy.get('[class="d-flex flex-column py-4"] [type="file"]').eq(1);
  }

  get deleteBackgroundButton() {
    return cy.get('[class="d-flex flex-column py-4"] .btn-outline-primary');
  }

  saveAndReload() {
    cy.wait(2000);
    this.saveChangesButton.click();
    cy.reload();
  }

  deleteLogo() {
    this.deleteLogoButton.click();
    this.saveChangesButton.click();
    cy.wait(2000);
  }

  returnBackgroundImage(path: string) {
    cy.navigateToHubSettings();
    this.backgroundImageOrVideoInput.selectFile(path, { force: true });
    cy.wait(2000);
    this.saveChangesButton.click({ force: true });
  }
}
