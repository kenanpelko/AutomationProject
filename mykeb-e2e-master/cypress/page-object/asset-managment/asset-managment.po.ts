import { Alias } from "../../support/types/alias";
import { Document } from "../../support/types/document";

import constants from "../../support/constant/asset-managment";
import AssetPoolAPI from "../../support/api/asset-managment/asset-pool";

const assetPoolAPI = new AssetPoolAPI();
const localization = require(`../../fixtures/i18n/asset-managment/en.json`);

export default class AssetManagment {
  // Tabs. Menu items
  get menuItemAllocatedAssets() {
    return cy.get("lib-panel-header .tab").eq(0);
  }
  get menuItemAssetPool() {
    return cy.get("lib-panel-header .tab").eq(1);
  }
  get menuItemAssetTypes() {
    return cy.get("lib-panel-header .tab").eq(2);
  }
  get menuItemMaps() {
    return cy.get("lib-panel-header .tab").eq(3);
  }
  get menuItemSearch() {
    return cy.get('[class="search"] input');
  }
  get createNewAssetButton() {
    return cy.get('[class="panel-header-actions"] [class="btn btn-primary"]');
  }
  get tableRow() {
    return cy.get(".table-body lib-row ");
  }
  get tableAssetName() {
    return this.tableRow.find(".table-cell:nth-child(1)");
  }
  get dropdownDeleteOption() {
    return cy.get(".dropdown .dropdown-menu .dropdown-item").contains("Delete");
  }
  get dropdownDuplicateOption() {
    return cy.get(".dropdown .dropdown-menu .dropdown-item").contains("Duplicate");
  }
  get cancelButton() {
    return cy.get('[class="font-weight-bold a-button"]');
  }
  get parentAssetInput() {
    return cy.get('app-asset-details-form [class="form-control"]').eq(1);
  }
  get deallocateAssetButton() {
    return cy.get("lib-panel-header button").contains("Deallocate");
  }
  get threeDots() {
    return cy.get('lib-cell [class="dropdown-toggle btn btn-transparent btn-icon"]');
  }

  get threeDots() {
    return cy.get('[class*="table-cell"] [class="dropdown-toggle btn btn-transparent btn-icon"]');
  }

  verifyAssetTableIsEmpty(){
   cy.get('[class*="table-row-empty"]').should("exist"); 
  }

  changeAssetTab(tabIndex = 0) {
    cy.get('[class="tabs"] .tab').eq(tabIndex).click();
  }

  openCreateNewAssetTab() {
    this.createNewAssetButton.click();
    cy.verifyURLContains(constants.path.assetNew);
  }

  openAssetMenu(query: string) {
    this.searchAsset(query);
    this.tableRow.contains(query).parents(".table-body").find(".table-row .actions > div > button").click();
  }

  addAlias(alias) {
    this.aliasInput.type(alias.name);
    this.typeDropdownElement.click();
    cy.get('[class*="ng-option"]').contains(alias.type).click();
    this.descriptionTextArea.type(alias.description);

    this.aliasSubmitButton.should("be.enabled").click();
  }

  verifyAliasRow(alias: Alias, index = -1) {
    cy.wait(2500);
    this.aliasTableRow.should("be.visible");
    if (index !== -1) index += 1;

    const qrCode = localization.assetPool.createNewAsset.aliasTypes.qrCode;
    this.aliasTableRow.eq(index).find('[class="table-cell"]').eq(0).should("contain.text", alias.name);
    if (alias.type == qrCode) {
      this.aliasTableRow.eq(index).find('[class="table-cell"] [role="button"]').eq(0).should("contain.text", alias.name);
    }
  }

  verifyAliasList(aliasList) {
    aliasList.forEach((ele, index) => {
      this.verifyAliasRow(ele, index);
    });
  }

  

  startEditingAsset(index = -1) {
    this.threeDots.eq(index).click();
    cy.get('[x-placement="bottom-right"] [tabindex="0"]').click();
  }

  deleteAssetFromTable(index = -1) {
    cy.intercept("DELETE", constants.services.assetsId).as("deleteAsset");

    this.threeDots.eq(index).click();
    cy.get('button[class*="text-danger"]').click();
    this.deleteAssetPopupButton.should("be.visible").click();

    cy.wait("@deleteAsset").then((data: any) => {
      expect(data.response.statusCode).to.equal(200);
      cy.wait(2000);
    });
  }
  cloneAssetFromTable(index = -1) {
    cy.intercept("POST", constants.services.assetClone).as("assetClone");

    this.threeDots.eq(index).click();
    cy.get('div[class*="show"] button').eq(-2).click();

    cy.wait("@assetClone").then((data: any) => {
      expect(data.response.statusCode).to.equal(201);
      cy.wait(2000);
    });
  }

  uploadDocumentData(document) {
    if (document.documentLocation !== undefined) {
      cy.get('app-document-modal [class="btn btn-block btn-outline-secondary"] [type="file"]').attachFile(document.documentLocation);
      cy.wait(1500);
      cy.get("app-document-modal p").then((ele) => {
        const text = ele.text();
        cy.wrap(text).as("documentId");
      });
    }

    if (document.type !== undefined) {
      cy.get('[id="documentType"]').clear().type(document.type);
    }

    if (document.description !== undefined) {
      cy.get('[id="documentDescription"]').clear().type(document.description);
    }

    cy.get('app-document-modal [class*="btn-primary"]').click();
  }

  verifyDocumentRow(document: Document, index = -1) {
    if (index !== -1) index += 1;
    cy.wait(2000);
    if (document.description !== undefined) {
      cy.get(" app-asset-documents lib-row").eq(index).find("lib-cell").eq(0).should("contain.text", document.description);
    }

    if (document.type !== undefined) {
      cy.get(" app-asset-documents lib-row").eq(index).find("lib-cell").eq(1).should("contain.text", document.type);
    }
  }

  verifyDocumentList(documentList) {
    documentList.forEach((ele, index) => {
      this.verifyDocumentRow(ele, index);
    });
  }

  startEditingDocument(index = 0) {
    cy.get('app-asset-documents  [class*="dropdown-toggle"]').eq(index).click();
    cy.get('app-asset-documents [class="btn-group show dropdown"] [ngbdropdownitem]').eq(0).click();
  }

  deleteDocument(index = 0) {
    cy.get('app-asset-documents [class*="dropdown-toggle"]').eq(index).click();
    cy.get('app-asset-documents [class="btn-group show dropdown"] [ngbdropdownitem]').eq(1).click();
  }

  searchAsset(query: string) {
    this.menuItemSearch.should("be.enabled").clear().type(query);
  }
  verifyAssetRow(query, config = { veriyRow: -1 }) {
    this.tableRow.eq(config.veriyRow).find('[class="table-cell"]').eq(0).should("contain.text", query);
  }
  searchAndVerifyAsset(query, config = { veriyRow: -1 }) {
    this.searchAsset(query);
    this.verifyAssetRow(query, config);
  }

  searchAndStartEditingAsset(assetName) {
    this.searchAsset(assetName);
    this.startEditingAsset();
  }

  verifyAssetHistoryRow(history, index = -1) {
    cy.get('app-asset-history [class*="table-body"] [class="table-row"]').as("historyRow");

    if (history.dateTime !== undefined) 
    if (history.action !== undefined) {
      cy.get("@historyRow").eq(index).find("lib-cell").eq(1).should("contain.text", history.action);
    }
    else (history.createdBy !== undefined)
  }

  verifyAssetHistory(history) {
    history.forEach((ele, index) => {
      this.verifyAssetHistoryRow(ele, index);
    });
  }

  editDynamicProperty(name, index = 0) {
    this.dynamicPropertyEditButton.eq(index).click();
    this.dynamicPropertyInput.eq(index).clear().type(name);
    this.dynamicPropertiesTitle.click(); //clicking away from the field
  }

  verifyDynamicProperty(name, index = 0) {
    this.dynamicPropertyInput.eq(index).should("be.disabled").should("have.value", name);
  }

  deleteAsset() {
    cy.intercept("DELETE", constants.services.assetsId).as("deleteAsset");

    this.deleteAssetButton.click();
    this.deleteAssetPopupButton.should("be.visible").click();

    cy.wait("@deleteAsset").then((data: any) => {
      expect(data.response.statusCode).to.equal(200);
      cy.wait(2000);
    });
  }

  allocateAssetToRoot(index = 0) {
    cy.get("app-asset-hierarchy-dropdown").eq(index).click();
    cy.get('[class*="form-dropdown-menu"] [class="cdk-tree"]').eq(-1).find('[class="asset-name"]').eq(0).should("contain.text", "Root").click({ force: true });
  }

  allocatedAssetIsDisabled(index = 0) {
    cy.get("app-asset-hierarchy-dropdown button").eq(index).should("be.disabled");
  }

  //TODO: Refactor - function prone to failures
  allocateAsset(assetName, parentsToExpand, dropDownIndex) {
    cy.get("app-asset-hierarchy-dropdown").eq(dropDownIndex).click();
    parentsToExpand.forEach((parent) => {
      cy.wait(1000);
      cy.get('[class*="form-dropdown-menu"] [class="cdk-tree"]')
        .eq(-1)
        .find('[class="hierarchy-node"]')
        .contains(parent)
        .parent()
        .find("button")
        .invoke("attr", "class")
        .then((ele: any) => {
          if (ele.search("expanded") == -1) {
            cy.get('[class*="form-dropdown-menu"] [class="cdk-tree"]').eq(-1).find('[class="hierarchy-node"]').contains(parent).parent().find("button").click();
          }
        });
    });

    cy.wait(2000);
    cy.get('[class*="form-dropdown-menu"] [class="cdk-tree"]').eq(-1).find('[class="hierarchy-node"] [class="asset-name"]').contains(assetName).click();
  }

  allocatedAssetTableAction(config = { action: undefined, index: -1 }) {
    if (config.action == "edit") {
      this.threeDots.eq(config.index).click();
      cy.get('div[class*="show"] button').eq(1).click();
      cy.url().should("include", "/assets");
    }

    if (config.action == "clone") {
      cy.intercept("POST", constants.services.assetClone).as("assetClone");

      this.threeDots.eq(config.index).click();
      cy.get('div[class*="show"] button').eq(-3).click();

      cy.wait("@assetClone").then((data: any) => {
        expect(data.response.statusCode).to.equal(201);
        cy.wait(2000);
      });
    }

    if (config.action == "delete") {
      cy.intercept("DELETE", constants.services.assetsId).as("deleteAsset");

      this.threeDots.eq(config.index).click();
      cy.get('button[class*="text-danger"]').click();
      this.deleteAssetPopupButton.should("be.visible").click();

      cy.wait("@deleteAsset").then((data: any) => {
        expect(data.response.statusCode).to.equal(200);
        cy.wait(2000);
      });
    }

    if (config.action == "deallocate") {
      cy.intercept("POST", `**/${constants.services.transform}`).as("transformAsset");

      this.threeDots.eq(config.index).click();
      cy.get('div[class*="show"] button').eq(-1).click();
      cy.get('[class="btn btn-danger"]').click();
      cy.wait("@transformAsset").then((data: any) => {
        expect(data.response.statusCode).to.equal(201);
        cy.wait(2000);
      });
    }

    if (config.action == "trydeallocate") {
      this.threeDots.eq(config.index).click();
      cy.get('div[class*="show"] button').eq(-2).click();

      cy.get("lib-modal-message").should("contain.text", "This action cannot be completed because the asset contains one or more children");
    }

    if (config.action == "createSubAsset") {
      this.threeDots.eq(config.index).click();
      cy.get('div[class*="show"] button').eq(3).click();
      cy.url().should("include", "/assets/new?parentId=");
    }
  }

  getAllocatedAssetIndex(name) {
    cy.get('[class="table-body"]').should("be.visible");
    cy.get('lib-loader').should("not.exist");
    
    cy.get("[class='name-column']").each(($ele, index) => {
      if ($ele.text().search(name) != -1) {
        cy.wrap(index).as("allocatedAssetIndex");
        return;
      }
    });
  }

  expandAllocatedAssetTree(index) {
    cy.get("lib-tree-toggle-cell > button").eq(index).click();
  }

  verifyAssetIsVisible(name) {
    cy.get("[class='name-column']").contains(name).parent().scrollIntoView().should("be.visible");
  }
  verifyAssetIsNotVisible(name) {
    cy.get("[class='name-column']").contains(name).should("not.exist");
  }

  closeInvalidActionPopup() {
    cy.get('[class="modal-content"]').as("invalidAction").should("be.visible");
    cy.get('[class="modal-content"] [class="btn btn-secondary"]').should("be.visible").click();
    cy.get("@invalidAction").should("not.be.visible");
  }
  CloseWithXInvalidActionPopup() {
    cy.get('[class="modal-content"]').as("invalidAction").should("be.visible");
    cy.get('[class*="modal-header"] button').should("be.visible").click();
    cy.get("@invalidAction").should("not.be.visible");
  }

  navigateToAllocatedAssets() {
    cy.visit(Cypress.env("URL")+constants.path.assetManagerAllocatedAssets);
    cy.verifyURLContains(constants.path.assetManagerAllocatedAssets);
  }

  /*
Allocating assets
*/

  addAndAllocateAssets(toCreateAssetList) {
    toCreateAssetList.forEach((asset) => {
      assetPoolAPI.addAsset(asset);
      cy.wait(2500);
    });
    cy.task("getAssetList").then((assetList: []) => {
      const assetListIds = assetList.slice(toCreateAssetList.length * -1); //Taking the back of the array
      assetPoolAPI.allocateAsset({ id: assetListIds[0] });
      for (let i = 1; i < toCreateAssetList.length; i++) {
        assetPoolAPI.allocateAsset({
          id: assetListIds[i],
          childOf: assetListIds[i - 1],
        });
      }
    });
    cy.wait(5000);
  }

  /*
  Example use:
        
      asset3.children = [asset4];
      asset1.children = [asset2, asset3];
      recursiveAddAssetChildren(asset1);

      This will create tree of allocated assets such as:

      asset1
        asset2
        asset3
          asset4
  */

  recursiveAddAssetChildren(data: any, parent?) {
    //Creating new asset and assiging it to the parent which was created in the previous recursive loop
    assetPoolAPI.addAsset(data);
    cy.task("getAsset").then((asset) => {
      cy.wait(2500);
      if (parent == null) {
        assetPoolAPI.allocateAsset({
          id: asset,
        });
      } else {
        assetPoolAPI.allocateAsset({
          id: asset,
          childOf: parent,
        });
      }
    });

    if (data.children != undefined) {
      cy.task("getAsset").then((newParentUpdated) => {
        parent = newParentUpdated;

        //Calling this function recursivly for all the children
        data.children.forEach((child) => {
          console.log("before recursive -> ", parent);
          this.recursiveAddAssetChildren(child, parent);
        });
      });
    }
    return;
  }
}
