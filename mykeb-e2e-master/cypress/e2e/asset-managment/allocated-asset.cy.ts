import "cypress-file-upload";
import { qase } from "cypress-qase-reporter/dist/mocha";
import AssetManagment from "../../page-object/asset-managment/asset-managment.po";
import ConfirmationModal from "../../page-object/asset-managment/component/modal-confirmation.po";
import AssetPoolAPI from "../../support/api/asset-managment/asset-pool";
import generateRandomAsset from "../../support/helpers/asset";
import { Asset } from "../../support/types/asset";

const localization = require(`../../fixtures/i18n/asset-managment/en.json`);
const assetManagment = new AssetManagment();
const confirmationModal = new ConfirmationModal();
const assetPoolAPI = new AssetPoolAPI();

describe("Allocated assets - Clone asset", () => {
  const asset: Asset = generateRandomAsset();
  before(() => {
    cy.task("clearAssetList");
  });

  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAllocatedAssets();
    cy.addAsset(asset);
    cy.get("@assetId").then((id) => {
      cy.assetTransform({ id: id, type: "childOf" });
    });
  });

  qase(
    202,
    it("Verify user can Duplicate Asset from Dropdown menu / Allocated Asset page", () => {
      assetManagment.openAssetMenu(asset.name);
      assetManagment.dropdownDuplicateOption.click();
      cy.wait(2000);
      assetManagment.searchAsset(asset.name);
      cy.get(".table-body lib-row").contains(asset.name).should("be.visible");
      cy.get(".table-body lib-row").should("have.length", 2);
    })
  );
});

describe("Allocated assets - Delete asset", () => {
  const asset: Asset = generateRandomAsset();
  before(() => {
    cy.task("clearAssetList");
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAllocatedAssets();
    cy.addAsset(asset);
    cy.get("@assetId").then((id) => {
      cy.assetTransform({ id: id, type: "childOf" });
    });
  });

  qase(
    201,
    it("Verify user can delete Asset in Edit Asset page", () => {
      assetManagment.openAssetMenu(asset.name);
      assetManagment.dropdownDeleteOption.click();
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.confirmationButton.click();
      cy.wait(2000);
      assetManagment.searchAsset(asset.name);
      assetManagment.verifyAssetTableIsEmpty();
    })
  );
});

describe("Allocated assets - Search asset", () => {
  const asset: Asset = generateRandomAsset();
  before(() => {
    cy.task("clearAssetList");
  });

  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAllocatedAssets();
    cy.addAsset(asset);
    cy.get("@assetId").then((id) => {
      cy.assetTransform({ id: id, type: "childOf" });
    });
  });

  qase(
    204,
    it("Verify Search feature is working on Allocated assets page", () => {
      assetManagment.searchAsset(asset.name);
      cy.get(".table-body lib-row").contains(asset.name).should("be.visible").and("have.length", 1);
      cy.wait(2000);
      assetManagment.searchAsset("No asset found");
      assetManagment.verifyAssetTableIsEmpty();
    })
  );
});

describe("Allocated asset - deallocate asset", () => {
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    assetManagment.navigateToAllocatedAssets();
  });

  after(() => {
    assetPoolAPI.deleteAllAllocatedAssets();
    assetPoolAPI.deleteAllAssetTypes();
  });

  qase(
    212,
    it("Verify user can Deallocate asset via dropdown menu", () => {
      const asset: Asset = generateRandomAsset();
      assetManagment.addAndAllocateAssets([asset]);
      cy.reload();

      assetManagment.searchAndVerifyAsset(asset.name);
      assetManagment.allocatedAssetTableAction({
        action: "deallocate",
        index: -1,
      });
      assetManagment.searchAsset(asset.name);
      assetManagment.tableRow.should("contain.text", localization.assetPool.table.noAssetFound);
    })
  );

  qase(
    213,
    it("Verify user can't deallocate asset that contains children", () => {
      const asset: Asset = generateRandomAsset();
      const asset1: Asset = generateRandomAsset();
      assetManagment.addAndAllocateAssets([asset, asset1]);
      cy.reload();

      assetManagment.getAllocatedAssetIndex(asset.name);
      cy.get("@allocatedAssetIndex").then((i: any) => {
        assetManagment.allocatedAssetTableAction({
          action: "trydeallocate",
          index: i,
        });
      });
    })
  );

  qase(
    214,
    it("Verify Invalid action (Deallocate asset) can be closed via Close button", () => {
      const asset: Asset = generateRandomAsset();
      const asset1: Asset = generateRandomAsset();
      assetManagment.addAndAllocateAssets([asset, asset1]);
      cy.reload();

      assetManagment.getAllocatedAssetIndex(asset.name);
      cy.get("@allocatedAssetIndex").then((i: any) => {
        assetManagment.allocatedAssetTableAction({
          action: "trydeallocate",
          index: i,
        });
      });
      assetManagment.closeInvalidActionPopup();
    })
  );

  qase(
    215,
    it("Verify Invalid action (Deallocate asset) can be closed via X button", () => {
      const asset: Asset = generateRandomAsset();
      const asset1: Asset = generateRandomAsset();
      assetManagment.addAndAllocateAssets([asset, asset1]);
      cy.reload();

      assetManagment.getAllocatedAssetIndex(asset.name);
      cy.get("@allocatedAssetIndex").then((i: any) => {
        assetManagment.allocatedAssetTableAction({
          action: "trydeallocate",
          index: i,
        });
      });
      assetManagment.CloseWithXInvalidActionPopup();
    })
  );
});

describe("Allocated asset - expanding elements", () => {
  before(() => {
    cy.task("clearAssetList");
  });
  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    assetManagment.navigateToAllocatedAssets();
  });

  after(() => {
    assetPoolAPI.deleteAllAllocatedAssets();
    assetPoolAPI.deleteAllAssetTypes();
  });

  qase(
    206,
    it("Verify user is able to expand Parent Asset", () => {
      const asset: Asset = generateRandomAsset();
      const asset1: Asset = generateRandomAsset();
      assetManagment.addAndAllocateAssets([asset, asset1]);

      cy.reload();
      assetManagment.getAllocatedAssetIndex(asset.name);
      cy.get("@allocatedAssetIndex").then((i: any) => {
        assetManagment.verifyAssetIsNotVisible(asset1.name);
        assetManagment.expandAllocatedAssetTree(i);
        assetManagment.verifyAssetIsVisible(asset1.name);
      });
    })
  );

  qase(
    207,
    it("Verify user is able to collapse Parent Asset", () => {
      const asset: Asset = generateRandomAsset();
      const asset1: Asset = generateRandomAsset();
      assetManagment.addAndAllocateAssets([asset, asset1]);

      cy.reload();
      assetManagment.getAllocatedAssetIndex(asset.name);
      cy.get("@allocatedAssetIndex").then((i: any) => {
        assetManagment.verifyAssetIsNotVisible(asset1.name);
        assetManagment.expandAllocatedAssetTree(i);
        assetManagment.verifyAssetIsVisible(asset1.name);
        assetManagment.expandAllocatedAssetTree(i);
        assetManagment.verifyAssetIsNotVisible(asset1.name);
      });
    })
  );
});

after(() => {
  assetPoolAPI.deleteAllAllocatedAssets();
  assetPoolAPI.deleteAllAssetTypes();
});
