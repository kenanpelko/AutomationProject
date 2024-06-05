import constant from "../../support/constant/asset-managment";

export default class AssetDetails {
  get createAssetButton() {
    return cy.get('lib-panel-header-actions [class="btn btn-primary"]');
  }

  get deallocateAssetButton() {
    return cy.get("lib-panel-header button").contains("Deallocate");
  }

  get assetTypeButton() {
    return cy.get("button.btn-outline-secondary");
  }

  get assetName() {
    return cy.get("app-asset-details .panel-header h2");
  }

  get aliasTableRow() {
    return cy.get("app-asset-aliases lib-row");
  }

  get aliasTableCell() {
    return cy.get("app-asset-aliases lib-row lib-cell");
  }

  get addDocumentButton() {
    return cy.get('app-asset-documents [class="panel-header-actions"] button');
  }

  get cancelButton() {
    return cy.get("a.a-button");
  }

  get cloneButton() {
    return cy.get(".panel-header-actions>button>i").first();
  }

  get assetAliasTitle() {
    return cy.get("app-asset-aliases h4");
  }

  get dynamicPropertiesTitle() {
    return cy.get("app-asset-dynamic-properties h4");
  }

  get documentsTitle() {
    return cy.get("app-asset-documents h4");
  }

  get assetHistoryTitle() {
    return cy.get("app-asset-history h4");
  }

  get dynamicPropertyEditButton() {
    return cy.get('app-asset-dynamic-properties [role="button"]');
  }

  get dynamicPropertyInput() {
    return cy.get("app-asset-dynamic-properties input");
  }

  get deleteAssetButton() {
    return cy.get('[class="btn btn-outline-secondary"]');
  }

  get addAliasButton() {
    return cy.get('[formcontrolname="aliases"] button');
  }

  // Input fields
  get assetNameInput() {
    return cy.get('[id="name"]');
  }

  get parentAssetInput() {
    return cy.get('app-asset-details-form [class="form-control"]').eq(1);
  }

  get assetTypeDropdownElement() {
    return cy.get('app-asset-details-form [class*="dropdown-item"]');
  }

  get isa95TypeInput() {
    return cy.get('app-asset-details-form [class="form-control"]').eq(2);
  }

  get descriptionInput() {
    return cy.get('[id="description"]');
  }

  get uploadImageButton() {
    return cy.get("button[uploadbutton]");
  }

  get uploadImageInput() {
    return cy.get("button[uploadbutton] input");
  }

  get imageContainer() {
    return cy.get('.panel-body-container [class*="image-container"]');
  }

  get deleteImageButton() {
    return cy.get('app-asset-details-form [class*="btn-transparent btn-icon"]');
  }

  addAssetDetails(asset: any) {
    if (asset.name !== undefined) {
      this.assetNameInput.clear().type(asset.name);
    }

    if (asset.description !== undefined) {
      this.descriptionInput.clear().type(asset.description);
    }
    if (asset.assetType !== undefined) {
      this.assetTypeButton.click();
      this.assetTypeDropdownElement
      cy.get('.form-dropdown-menu > :nth-child(1)').click();
    }
  }

  clickCreateNewAssetAndVerify() {
    cy.intercept("POST", constant.services.assets).as("createNewAsset");

    this.createAssetButton.click();

    cy.wait("@createNewAsset").then((data: any) => {
      const assetId = data.response.body.data.id;
      cy.task("setAssetList", assetId);
      expect(data.response.statusCode).to.equal(201);
      cy.wait(2000);
    });
  }

  addNewAssetFlow(asset: any) {
    this.addAssetDetails(asset);
    this.clickCreateNewAssetAndVerify();
  }

  editAssetAndVerify() {
    cy.intercept("PATCH", constant.services.assetsId).as("updateAsset");
  
    this.createAssetButton.click();
  
    cy.wait("@updateAsset").then((data: any) => {
      expect(data.response.statusCode).to.equal(200);
      cy.wait(2000);
    });
  }

  uploadImage(imageUrl: string, config = { verify: true }) {
    this.uploadImageInput.attachFile(imageUrl);
    if (config.verify === true) {
      this.verifyImageExists();
    }
  }

  verifyImageExists() {
    this.imageContainer.should("not.have.class", "empty");
    this.imageContainer.should("not.have.attr", "style", 'style="background-image: url("");"');
    this.imageContainer.invoke("attr", "style").then((ele) => {
      cy.wrap(ele).as("imageUrl");
    });
  }

  verifyImageDoesntExist() {
    this.imageContainer.should("have.class", "empty");
    this.imageContainer.should("have.attr", "style", 'background-image: url("");');
  }

  verifyAssetDetails(asset: any) {
    if (asset.name !== undefined) {
      this.assetNameInput.should("have.value", asset.name);
    }

    if (asset.description !== undefined) {
      this.descriptionInput.should("have.value", asset.description);
    }
    if (asset.assetType !== undefined) {
      this.assetTypeButton.should("have.text", asset.assetType.name);
    }
  }
}

