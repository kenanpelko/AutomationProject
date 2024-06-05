import { qase } from "cypress-qase-reporter/dist/mocha";
import { Asset } from "../../support/types/asset";
import AssetManagment from "../../page-object/asset-managment/asset-managment.po";
import AssetPool from "../../page-object/asset-managment/asset-pool";
import AssetDetails from "../../page-object/asset-managment/asset-details.po";
import ConfirmationModal from "../../page-object/asset-managment/component/modal-confirmation.po";
import AssetPoolAPI from "../../support/api/asset-managment/asset-pool";
import generateRandomAsset from "../../support/helpers/asset";
import constant from "../../support/constant/asset-managment";

const localization = require(`../../fixtures/i18n/asset-managment/en.json`);
const assetManagment = new AssetManagment();
const assetPool = new AssetPool();
const assetDetails = new AssetDetails();
const confirmationModal = new ConfirmationModal();
const assetPoolAPI = new AssetPoolAPI();

describe("Asset pool - Navigation and Page elements", () => {
  before(() => {
    cy.task("clearAssetList");
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetPool();
  });

  qase(
    230,
    it("Verify all elements are loaded on Asset pool page", () => {
      const asset: Asset = generateRandomAsset();
      cy.addAsset(asset);

      assetPool.tableHeaderName.should("contain.text", localization.assetPool.table.tableHeader.name);
      assetPool.tableHeaderType.should("contain.text", localization.assetPool.table.tableHeader.type);
      assetPool.tableHeaderId.should("contain.text", localization.assetPool.table.tableHeader.ID);
      assetPool.tableHeaderDocument.should("contain.text", localization.assetPool.table.tableHeader.documents);
      assetPool.tableHeaderCreatedAt.should("contain.text", localization.assetPool.table.tableHeader.createdUpdatedAt);
      assetPool.createNewAssetButton.should("contain.text", localization.menu.createNewAsset);

      assetManagment.menuItemAllocatedAssets.should("contain.text", localization.menu.allocatedAssets);
      assetManagment.menuItemAssetPool.should("contain.text", localization.menu.assetPool);
      assetManagment.menuItemAssetTypes.should("contain.text", localization.menu.assetTypes);
      assetManagment.menuItemSearch.should("have.attr", "placeholder", localization.menu.search);
    })
  );

  qase(
    244,
    it("Verify all elements are loaded in Create new asset form", () => {
      cy.verifyURLContains(constant.path.assetPool);
      assetPool.createNewAssetButton.click();
      cy.verifyURLContains(constant.path.assetNew);
      // Verify page elements
      assetDetails.createAssetButton.should("be.visible").and("be.disabled");
      assetDetails.cancelButton.should("be.visible");
      assetDetails.assetNameInput.should("be.visible");
      assetDetails.parentAssetInput.should("be.visible");
      assetDetails.assetTypeButton.should("be.visible");
      assetDetails.isa95TypeInput.should("be.visible");
      assetDetails.uploadImageButton.should("be.visible");
      assetDetails.assetAliasTitle.should("contain.text", localization.assetPool.createNewAsset.titles.assetAliases);
      assetDetails.addAliasButton.should("be.visible");
      assetDetails.dynamicPropertiesTitle.should("contain.text", localization.assetPool.createNewAsset.titles.dynamicProperties);
      assetDetails.documentsTitle.should("contain.text", localization.assetPool.createNewAsset.titles.documents);
      assetDetails.addDocumentButton.should("be.visible");
      assetDetails.assetHistoryTitle.should("contain.text", localization.assetPool.createNewAsset.titles.assetHistory);
    })
  );

  qase(
    232,
    it("Verify user can properly open and close Create new asset form (Via Cancel button)", () => {
      cy.verifyURLContains(constant.path.assetPool);
      assetPool.createNewAssetButton.click();
      cy.verifyURLContains(constant.path.assetNew);
      assetDetails.cancelButton.click(); //Reverting back data from the before each hook
      cy.verifyURLContains(constant.path.assetPool);
    })
  );
});

describe("Asset pool - Search", () => {
  const asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetPool();
  });

  qase(
    251,
    it("Verify Search feature is working on Asset pool page", () => {
      cy.addAsset(asset);
      //Existing asset
      assetManagment.searchAsset(asset.name);
      assetManagment.tableAssetName.should("contain", asset.name).and("have.length", 1);
      //Non existing asset
      assetManagment.searchAsset("DO NOT EXIST");
      assetManagment.tableAssetName.should("not.exist");
      assetManagment.verifyAssetTableIsEmpty();
    })
  );
});

describe("Asset pool - Menu option - Delete modal", () => {
  const asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAsset(asset);
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetPool();
    assetManagment.openAssetMenu(asset.name);
    assetManagment.dropdownDeleteOption.click();
    cy.wait(2000);
  });

  qase(
    255,
    it("Open Delete Asset via Menu popup and verify all elements are loaded", () => {
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.title.should("contain", "Delete asset?");
      confirmationModal.xButton.should("be.visible");
      confirmationModal.confirmationButton.should("be.visible");
    })
  );

  qase(
    256,
    it("Open Delete Asset via Menu popup and close with X button", () => {
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.xButton.click();
      confirmationModal.wrapper.should("not.exist");
    })
  );

  qase(
    257,
    it("Open Delete Asset via Menu popup and close with cancel button", () => {
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.cancelButton.click();
      confirmationModal.wrapper.should("not.exist");
    })
  );
});

describe("Asset pool - Delete asset from edit page - Delete modal", () => {
  const asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    assetPoolAPI.addAsset(asset);
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetPool();
    cy.task("getAsset").then((assetId) => {
      cy.wrap(assetId).as("assetId");
      cy.openAssetDetails("@assetId");
    });

    assetDetails.deleteAssetButton.click();
  });

  qase(
    263,
    it("Trigger delete Asset popup on Edit page and verify all elements", () => {
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.title.should("contain", "Delete asset?");
      confirmationModal.xButton.should("be.visible");
      confirmationModal.confirmationButton.should("be.visible");
    })
  );

  qase(
    264,
    it("Trigger delete Asset popup on Edit page and close it with X button", () => {
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.xButton.click();
      confirmationModal.wrapper.should("not.exist");
    })
  );

  qase(
    265,
    it("Trigger delete Asset popup on Edit page and close it with Cancel button", () => {
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.cancelButton.click();
      confirmationModal.wrapper.should("not.exist");
    })
  );
});

describe("Asset pool - Dropdown options", () => {
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetPool();
  });

  qase(
    250,
    it("Verify user can Delete Asset from Dropdown menu / Asset pool page", () => {
      const asset: Asset = generateRandomAsset();
      assetPoolAPI.addAsset(asset);
      assetManagment.searchAsset(asset.name);
      assetManagment.openAssetMenu(asset.name);
      assetManagment.dropdownDeleteOption.click();
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.confirmationButton.click();
      assetManagment.searchAsset(asset.name);
      assetManagment.tableAssetName.should("not.exist");
      assetManagment.verifyAssetTableIsEmpty();
    })
  );
});

describe("Asset pool - Delete from Edit page", () => {
  const asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAsset(asset);
    cy.navigateToAssetPool();
    cy.openAssetDetails("@assetId");
    cy.wait(2000);
  });

  qase(
    247,
    it("Verify user can delete Asset in Edit Asset page", () => {
      assetDetails.deleteAssetButton.click();
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.confirmationButton.click();
      cy.verifyURLContains(constant.path.assetPool);
      cy.reload();
      assetManagment.searchAsset(asset.name);
      assetManagment.tableAssetName.should("not.exist");
      assetManagment.verifyAssetTableIsEmpty();
    })
  );
});

describe("Asset pool - Duplicate inside of the asset table", () => {
  const asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAsset(asset);
  });

  beforeEach(() => {
    cy.navigateToAssetPool();
    cy.task("getAsset").then((assetId) => {
      cy.wrap(assetId).as("newId");
      cy.openAssetDetails("@newId");
    });
    cy.wait(2000);
  });

  qase(
    249,
    it("Verify user can Duplicate Asset from Dropdown menu / Asset pool page", () => {
      const asset: Asset = generateRandomAsset();
      assetPoolAPI.addAsset(asset);
      assetManagment.cancelButton.click();

      //Existing asset
      assetManagment.searchAsset(asset.name);
      assetManagment.cloneAssetFromTable(-1);
      assetManagment.searchAndVerifyAsset(asset.name, { veriyRow: -1 });
      assetManagment.searchAndVerifyAsset(asset.name, { veriyRow: -2 });
    })
  );
});

describe("Asset pool - Duplicate inside of the asset details", () => {
  const asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAsset(asset);
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetPool();
    cy.task("getAsset").then((assetId) => {
      cy.wrap(assetId).as("newId");
      cy.openAssetDetails("@newId");
    });
    cy.wait(2000);
  });

  qase(
    246,
    it("Verify user can clone Asset in Edit Asset page", () => {
      assetDetails.cloneButton.click();
      cy.wait(5000);
      //Making sure we have two assets with this given name
      assetManagment.searchAndVerifyAsset(asset.name, { veriyRow: -1 });
      assetManagment.searchAndVerifyAsset(asset.name, { veriyRow: -2 });
    })
  );
});

describe("Asset pool - Verify user can create new asset", () => {
  before(() => {
    cy.task("clearAssetList");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetPool();
  });

  qase(
    233,
    it("Verify user can Create new asset with only Mandatory data", () => {
      assetPool.createNewAssetButton.click();
      const newAsset: Asset = generateRandomAsset();
      const assetEssential: Asset = { name: newAsset.name, assetType: newAsset.assetType };
      cy.verifyURLContains(constant.path.assetNew);
      assetDetails.addAssetDetails(assetEssential);
      assetDetails.createAssetButton.should("be.enabled");
      assetDetails.createAssetButton.click().wait(3000);
      assetManagment.searchAsset(newAsset.name);
      cy.get(".table-body lib-row").contains(newAsset.name).should("be.visible").and("have.length", 1);
    })
  );
});

describe("Asset pool - Edit asset", () => {
  const asset: Asset = generateRandomAsset();
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAsset(asset);
    cy.navigateToAssetPool();
    cy.openAssetDetails("@assetId");
    cy.wait(2000);
  });

  qase(
    239,
    it("Verify user can edit Asset", () => {
      const assetEdited: Asset = generateRandomAsset();
      assetDetails.assetName.should("contain", asset.name);

      assetDetails.addAssetDetails({ name: assetEdited.name });
      assetDetails.createAssetButton.should("be.enabled");
      assetDetails.createAssetButton.click().wait(3000);
      assetManagment.searchAsset(assetEdited.name);
      cy.get(".table-body lib-row").contains(assetEdited.name).should("be.visible").and("have.length", 1);
      assetManagment.searchAsset(asset.name);
      assetManagment.verifyAssetTableIsEmpty();
    })
  );
});

after(() => {
  assetPoolAPI.deleteAllAssetTypes();
  assetPoolAPI.deleteAllUnallocatedAssets();
});

//   qase(
//     237,
//     it("Verify all changes saved in asset are properly shown in Asset history", () => {
//       const document: Document = generateRandomDocument();
//       const genericAssetType = localization.assetPool.createNewAsset.assetTypes.generic;
//       let assetHistory = [{ action: "CREATED" }];
//       //Name
//       assetManager.addAssetDetails({ name: `${asset.name} - edited` }); //Changing only the name
//       assetManager.editAssetAndVerify();
//       assetManager.searchAndStartEditingAsset(asset.name);
//       assetHistory.unshift({ action: "FIELD_UPDATED" });
//       console.log(assetHistory);
//       assetManager.verifyAssetHistory(assetHistory);

//       //TODO: Generate asset type before in the before hook
//       // //Asset type
//       // assetManager.addAssetDetails({ assetType: genericAssetType }); //Changing only the name
//       // assetManager.editAssetAndVerify();
//       // assetManager.searchAndStartEditingAsset(asset.name);
//       // assetHistory.unshift({ action: "FIELD_UPDATED" });
//       // assetManager.verifyAssetHistory(assetHistory);

//       //Image
//       assetManager.verifyImageDoesntExist();
//       assetManager.uploadImage("./../fixtures/images/demo.png");
//       assetManager.editAssetAndVerify();
//       assetManager.searchAndStartEditingAsset(asset.name);
//       assetHistory.unshift({ action: "FIELD_UPDATED" });
//       assetManager.verifyAssetHistory(assetHistory);

//       //Document
//       assetManager.addDocumentButton.click();
//       assetManager.uploadDocumentData(document);
//       assetManager.editAssetAndVerify();
//       assetManager.searchAndStartEditingAsset(asset.name);
//       assetHistory.unshift({ action: "COLLECTION_UPDATED" });
//       assetManager.verifyAssetHistory(assetHistory);
//     })
//   );

//   qase(
//     248,
//     xit("Verify user can navigate to User data via Created by link", () => {
//       let assetHistory = [{ action: "CREATED" }];
//       assetManager.verifyAssetHistory(assetHistory);

//       cy.get('app-asset-history [class*="table-body"] [class="table-row"] [role="button"]').eq(-1).click();

//       //TODO: Finish test case
//       //Behavior is still uknown, this feature has not been implemented
//     })
//   );

// describe("Asset pool - Edit asset", () => {
//     let asset: Asset = generateRandomAsset();
//     before(() => {
//         cy.navigateToBaseURL(Cypress.env('URL'));
//         cy.addAsset(asset);
//         cy.navigateToAssetPool();
//         cy.openAssetDetails('@assetId')
//         cy.wait(2000);
//     });