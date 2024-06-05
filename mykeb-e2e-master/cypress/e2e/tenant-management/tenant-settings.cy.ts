import "cypress-v10-preserve-cookie";
import { qase } from "cypress-qase-reporter/dist/mocha";
import generateRandomTenant from "../../support/helpers/tenant";
import TenantSettings from "../../page-object/tenant-management/tenant-settings.po";
import TenantAPI from "../../support/api/tenant-settings/tenant";
import tenantPath from "../../support/constant/tenant-settings";
import homePath from "../../support/constant/general-settings";
import { Tenant } from "../../support/types/tenant";

const tenantSettings = new TenantSettings();
const tenantAPI = new TenantAPI();

describe("Navigation and loading", () => {
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL")); //When we visit the baseUrl and login we will have all required cookies for the API to work
    cy.navigateToTenants();
  });

  qase(
    419,
    it("Verify Tenants page is loading all elements", () => {
      //page elements
      tenantSettings.pageTitle.should("be.visible");
      tenantSettings.pageInstruction.should("be.visible");
      tenantSettings.searchField.should("be.visible");
      tenantSettings.newTenantButton.should("be.visible");
      //table elements
      tenantSettings.tableHeaderName.should("be.visible");
      tenantSettings.tableHeaderLastChanged.should("be.visible");
      tenantSettings.tableHeaderOwnedBy.should("be.visible");
    })
  );

  qase(
    420,
    it("Verify user is able to open New Tenant page and close it via Cancel button", () => {
      tenantSettings.newTenantButton.should("be.visible").click();
      cy.verifyURLContains(tenantPath.path.tenantCreateNew);
      tenantSettings.cancelButton.should("be.visible").click();
      cy.verifyURLContains(tenantPath.path.tenants);
    })
  );

  qase(
    421,
    it("Verify New tenant form is loading properly", () => {
      tenantSettings.newTenantButton.should("be.visible").click();
      tenantSettings.cancelButton.should("be.visible");
      tenantSettings.saveChangesButton.should("be.visible");
      tenantSettings.tenantNameField.should("be.visible");
      tenantSettings.tagsField.should("be.visible");
      tenantSettings.parentTenantField.should("be.visible");
      tenantSettings.descriptionField.should("be.visible");
    })
  );
});

describe("Create and search", () => {
  const newTenant: Tenant = generateRandomTenant();
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToTenants();
    tenantAPI.getTenantList();
  });

  qase(
    422,
    it("Verify user is able to create new tenant", () => {
      tenantSettings.newTenantButton.should("be.visible").click();
      tenantSettings.populateTenantsMandatoryDetails(newTenant.name);
      tenantSettings.saveChangesButton.click();
      tenantSettings.searchTenants(newTenant.name);
      tenantSettings.verifyTenantsSearchResult(newTenant.name);
    })
  );

  qase(
    423,
    it("Verify user is able to search tenants via Search bar", () => {
      tenantSettings.newTenantButton.should("be.visible").click();
      tenantSettings.populateTenantsMandatoryDetails(newTenant.name);
      tenantSettings.saveChangesButton.click();
      tenantSettings.searchTenants(newTenant.name);
      tenantSettings.verifyTenantsSearchResult(newTenant.name);
    })
  );
});

describe("Delete function", () => {
  const newTenant: Tenant = generateRandomTenant();
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToTenants();
    tenantAPI.addTenant(newTenant);
    cy.reload();
    tenantSettings.searchTenants(newTenant.name);
    cy.wait(2000);
  });

  qase(
    433,
    it("Verify all elements are loaded on Delete popup", () => {
      tenantSettings.triggerDeletePopup();
      tenantSettings.deletePopupTitle.should("be.visible");
      tenantSettings.deletePopupMessage.should("be.visible");
      tenantSettings.deletePopupCancelButton.should("be.visible");
      tenantSettings.deletePopupCloseButton.should("be.visible");
      tenantSettings.deletePopupDeleteButton.should("be.visible");
    })
  );

  qase(
    431,
    it("Verify user can open Delete popup and close it via X button", () => {
      tenantSettings.triggerDeletePopup();
      tenantSettings.deletePopupTitle.should("be.visible");
      tenantSettings.deletePopupCloseButton.should("be.visible").click();
      tenantSettings.deletePopupTitle.should("not.exist");
    })
  );

  qase(
    432,
    it("Verify user is able to open Delete popup and close it via Cancel button", () => {
      tenantSettings.triggerDeletePopup();
      tenantSettings.deletePopupTitle.should("be.visible");
      tenantSettings.deletePopupCancelButton.should("be.visible").click();
      tenantSettings.deletePopupTitle.should("not.exist");
    })
  );

  qase(
    424,
    it("Verify user is able to Delete Tenant from main page", () => {
      const deleteTenant: Tenant = generateRandomTenant();
      tenantAPI.addTenant(deleteTenant);
      cy.reload();
      tenantSettings.searchTenants(deleteTenant.name);

      tenantSettings.triggerDeletePopup();
      tenantSettings.deletePopupTitle.should("be.visible");
      tenantSettings.deletePopupDeleteButton.should("be.visible").click();
      tenantSettings.searchTenants(deleteTenant.name);
      tenantSettings.verifyTableIsEmpty();
    })
  );
});

describe("Edit page functions", () => {
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToTenants();
  });

  qase(
    427,
    it("Verify user is able to navigate to Edit tenant page and close it via Cancel button", () => {
      const newTenant: Tenant = generateRandomTenant();
      tenantAPI.addTenant(newTenant);
      cy.reload();
      tenantSettings.searchTenants(newTenant.name);

      tenantSettings.triggerEditTenant();
      tenantSettings.pageTitle.should("contain", newTenant.name);
      tenantSettings.cancelButton.click();
      tenantSettings.verifyCorrectPageTitle();
    })
  );

  qase(
    428,
    it("Verify user is able to successfully Edit tenant", () => {
      const newTenant: Tenant = generateRandomTenant();
      const editTenant: Tenant = generateRandomTenant();
      tenantAPI.addTenant(newTenant);
      cy.reload();
      tenantSettings.searchTenants(newTenant.name);

      tenantSettings.triggerEditTenant();
      tenantSettings.pageTitle.should("contain", newTenant.name);
      tenantSettings.populateTenantsMandatoryDetails(editTenant.name);
      tenantSettings.saveChangesButton.click();
      tenantSettings.searchTenants(newTenant.name);
      tenantSettings.verifyTableIsEmpty(); //Verify old name can't be located
      tenantSettings.searchTenants(editTenant.name);
      tenantSettings.verifyTenantsSearchResult(editTenant.name); //Verify new name is now shown
    })
  );

  qase(
    429,
    it("Verify user is able to Delete tenant from edit page", () => {
      const newTenant: Tenant = generateRandomTenant();
      tenantAPI.addTenant(newTenant);
      cy.reload();
      tenantSettings.searchTenants(newTenant.name);

      tenantSettings.triggerEditTenant();
      tenantSettings.pageTitle.should("contain", newTenant.name);
      tenantSettings.deleteTenantFromEditPage.click();
      tenantSettings.deletePopupDeleteButton.click();
      tenantSettings.searchTenants(newTenant.name);
      tenantSettings.verifyTableIsEmpty(); //Verify deleted tenant can't be located
    })
  );
});

describe("Switching tenants", () => {
  const newTenant: Tenant = generateRandomTenant();
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToTenants();
    tenantAPI.addTenant(newTenant);
    cy.reload();
    tenantSettings.searchTenants(newTenant.name);
    cy.wait(2000);
  });

  qase(
    425,
    it("Verify by clicking on Tenant user is navigated to home screen", () => {
      tenantSettings.triggerSwitchTenant();
      cy.verifyURLContains(homePath.path.hubHome);
      tenantSettings.activateDefaultTenant();
    })
  );

  qase(
    426,
    it("Verify after switcing tenant current tenant is displayed in dropdown in header", () => {
      tenantSettings.triggerSwitchTenant();
      cy.wait(1000);
      tenantSettings.verifyTenantActive(newTenant.name);
      tenantSettings.activateDefaultTenant();
    })
  );

  qase(
    430,
    it("Verify user is unable to delete tenant that is currently logged in", () => {
      tenantSettings.triggerSwitchTenant();
      cy.wait(1000);
      cy.navigateToTenants();
      tenantSettings.searchTenants(newTenant.name);
      cy.wait(1000);
      tenantSettings.triggerDeletePopup();
      tenantSettings.deletePopupDeleteButton.click();
      tenantSettings.verifyToastMessage();
      tenantSettings.activateDefaultTenant();
    })
  );
});

//Deleting all automated tenants
afterEach(() => {
  tenantAPI.getTenantList(); //This function is setting the variable tenantList
  cy.task("getTenantList").then((list: any) => {
    console.log(list);
    tenantAPI.deleteTenantList(list); //By default we delete all the tenants with the name starting with "automated_tenant", If you want to change this update the query parameter inside of this function
  });
});
