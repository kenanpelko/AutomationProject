const localization = require("../../fixtures/i18n/tenants/en.json");
const toastMessage = require("../../fixtures/i18n/toaster-messages/en.json");

export default class TenantSettings {
  get pageTitle() {
    return cy.get(".card-page-header .card-page-title");
  }

  get pageInstruction() {
    return cy.get(".card-page-body p");
  }

  get searchField() {
    return cy.get(".card-page-header .search .form-control");
  }

  get newTenantButton() {
    return cy.get(".card-page-header .btn-primary");
  }

  get tableDropdownButton() {
    return cy.get(".table-body .cdk-tree :nth-child(1) .dropdown-toggle.btn");
  }

  get switchToTenantButton() {
    return cy.get('[class="dropdown-menu show"] [class="dropdown-item"]:nth-child(1)');
  }

  get editTenantButton() {
    return cy.get('[class="dropdown-menu show"] [class="dropdown-item"]:nth-child(2)');
  }

  get createSubtenantButton() {
    return cy.get('[class="dropdown-menu show"] [class="dropdown-item"]:nth-child(3)');
  }

  get deleteTenantButton() {
    return cy.get('[class="dropdown-menu show"] [class="dropdown-item"]:nth-child(4)');
  }

  // New or edit tenant elemnets

  get cancelButton() {
    return cy.get('.card-page-header [role="button"]');
  }

  get saveChangesButton() {
    return cy.get(".card-page-header .btn-primary");
  }

  get tenantNameField() {
    return cy.get('.card-page-body [formcontrolname="name"]');
  }

  get deleteTenantFromEditPage() {
    return cy.get('[class="ml-auto d-flex align-items-center"] [class*="material-icons"]');
  }

  get parentTenantField() {
    return cy.get('.card-page-body [formcontrolname="parentId"]');
  }

  get tagsField() {
    return cy.get('.card-page-body [formcontrolname="tags"]');
  }

  get descriptionField() {
    return cy.get('.card-page-body [id="description"]');
  }

  // Tenant table titles

  get tableHeaderName() {
    return cy.get(".table-header .header-row :nth-child(1)");
  }

  get tableHeaderLastChanged() {
    return cy.get(".table-header .header-row :nth-child(2)");
  }

  get tableHeaderOwnedBy() {
    return cy.get(".table-header .header-row :nth-child(3)");
  }

  get emptyTableMessage() {
    return cy.get(".table-body-container .table-row-empty");
  }

  // Delete popup

  get deletePopupTitle() {
    return cy.get(".modal-body h4");
  }

  get deletePopupMessage() {
    return cy.get(".modal-body p");
  }

  get deletePopupCancelButton() {
    return cy.get(".modal-footer .btn-outline-secondary");
  }

  get deletePopupDeleteButton() {
    return cy.get(".modal-footer .btn-danger");
  }

  get deletePopupCloseButton() {
    return cy.get(".modal-header .btn");
  }

  // Tenants header dropdown

  get navbarTenantsDropdown() {
    return cy.get('[bindlabel="name"]');
  }

  get tenantsDropdownList() {
    return cy.get(".select-tenants .dropdown-menu");
  }

  // Toast message

  get toastErrorMessage() {
    return cy.get(".toast-top-right .toast-message");
  }

  // Functions

  searchTenants(query: string) {
    this.searchField.should("be.enabled").clear().type(query);
    cy.wait(3000); //waiting for table to re-load
  }

  populateTenantsMandatoryDetails(query: string) {
    this.tenantNameField.clear().should("be.enabled").clear().type(query);
  }

  verifyTenantsSearchResult(query: string) {
    cy.get(".card-page-body .table-cell .ml-4").contains(query).should("be.visible");
  }

  triggerDeletePopup() {
    this.tableDropdownButton.click();
    this.deleteTenantButton.should("contain.text", localization.buttons.delete).click();
  }

  triggerSwitchTenant() {
    this.tableDropdownButton.eq(-1).click();
    this.switchToTenantButton.should("contain.text", localization.buttons.switchToTenant).click();
  }

  findAutomatedUser(query: string) {
    this.tenantsDropdownList.find("dropdown-item").should("have.text", query).click();
  }

  verifyTableIsEmpty() {
    this.emptyTableMessage.should("be.visible").should("contain", localization.table.emptyTable);
  }

  triggerEditTenant() {
    this.tableDropdownButton.eq(-1).click();
    this.editTenantButton.should("contain.text", localization.buttons.edit).click();
  }

  verifyCorrectPageTitle() {
    this.pageTitle.should("contain", localization.titles.tenants);
  }

  verifyTenantActive(query: string) {
    this.navbarTenantsDropdown.should("contain", query);
  }

  verifyToastMessage() {
    this.toastErrorMessage.should("contain", toastMessage.fail.tenantOwnDelete);
  }

  activateDefaultTenant() {
    cy.navigateToTenants();
    this.searchField.clear().type("default");
    cy.wait(1000);
    this.triggerSwitchTenant();
  }
}
