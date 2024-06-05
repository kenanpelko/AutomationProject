import constants from "../../support/constant/asset-managment";

export default class AssetTypesManager {
  get wrapper() {
    return cy.get("app-asset-tabs-outlet");
  }
  get createNewAssetTypeButton() {
    return this.wrapper.find("lib-panel-header-actions button");
  }
  get deleteAssetTypeButton() {
    return cy.get('button[class*="mi-26"]');
  }
  get tableRow() {
    return this.wrapper.find(".table-body lib-row.table-row");
  }
  get dropdownToggle() {
    return cy.get("lib-cell i");
  }
  get dropdownMenuDeleteButton() {
    return cy.get("lib-cell>div>div>button").last();
  }
  get firstTableRow() {
    return cy.get("div .table-row");
  }
  get firstTableRowAssetTypeName() {
    return cy.get("div .table-row span");
  }
  get menuItemSearch() {
    return this.wrapper.find('[class="search"] input');
  }

  //Table headers
  get tableHeaderName() {
    return cy.get('[libheadersort="name"]');
  }
  get tableHeaderIsa95Type() {
    return cy.get('[libheadersort="equipmentType"]');
  }
  get tableHeaderParentAssetType() {
    return cy.get('[libheadersort="extendsType.name"]');
  }
  get tableHeaderLastChanged() {
    return cy.get('[libheadersort="updatedAt"]');
  }

  //#Actions and Functions
  navigateToAssetTypes() {
    cy.visit(Cypress.env("URL")+constants.path.assetManagerAssetTypes);
    cy.verifyURLContains(constants.path.assetTypes);
  }

  openCreateNewAssetTypeTab() {
    cy.wait(1000); //detached element
    this.createNewAssetTypeButton.click();
    cy.verifyURLContains(constants.path.assetTypesNew);
  }

  clickCreateNewAssetTypeAndVerify() {
    cy.intercept("POST", constants.services.assetTypes).as("createNewAssetType");

    cy.wait(1000); //detached element
    this.createNewAssetTypeButton.click();

    cy.wait("@createNewAssetType").then((data: any) => {
      const assetTypeId = data.response.body.data.id;
      cy.task("setAssetTypeList", assetTypeId);
      expect(data.response.statusCode).to.equal(201);
      cy.wait(2000);
    });
  }

  startEditingAssetType() {
    cy.get(":nth-child(1) > .p-0 > .btn-group > .dropdown-toggle > .material-icons").click();
    cy.get(':nth-child(1) > .p-0 > .btn-group > .text-right > [tabindex="0"]').click();
  }

  searchAssetType(query: string) {
    this.menuItemSearch.click({ force: true }).clear().type(query);
  }

  openAssetTypeMenu(query: string) {
    this.searchAssetType(query);
    this.tableRow.contains(query).parents(".table-body").find(".table-row .dropdown > button").click();
  }

  openAssetTypeDetails(query: string) {
    this.searchAssetType(query);
    this.tableRow.contains(query).parents(".table-body").find(".table-row").click();
  }

  searchAndStartEditingAssetType(assetTypeName) {
    this.searchAssetType(assetTypeName);
    this.startEditingAssetType();
  }

  // openDeleteAssetTypesFromMenu() {
  //   this.dropdownToggle.click();
  //   this.dropdownMenuDeleteButton.click();
  // }

  verifyAssetTypeExist(assetTypeName: any, exist: boolean) {
    if (exist == true) {
      this.tableRow.contains(assetTypeName).should("be.visible");
    } else {
      this.tableRow.contains(assetTypeName).should("not.exist");
    }
  }
}
