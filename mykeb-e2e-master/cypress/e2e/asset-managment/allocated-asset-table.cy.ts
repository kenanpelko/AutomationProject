import "cypress-file-upload";
import { qase } from "cypress-qase-reporter/dist/mocha";
import { Asset } from "../../support/types/asset";
import AssetManagment from "../../page-object/asset-managment/asset-managment.po";
import AssetPoolAPI from "../../support/api/asset-managment/asset-pool";
import generateRandomAsset from "../../support/helpers/asset";

const assetManagment = new AssetManagment();
const assetPoolAPI = new AssetPoolAPI();

describe("Verify child asset can be sent to Root", () => {
  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAllocatedAssets();
  });

  qase(
    218,
    it("Verify child asset can be sent to Root", () => {
      const asset: Asset = generateRandomAsset();
      const asset1: Asset = generateRandomAsset();
      asset.children = [asset1];
      assetManagment.recursiveAddAssetChildren(asset);
      cy.reload();

      assetManagment.getAllocatedAssetIndex(asset.name);
      cy.get("@allocatedAssetIndex").then((i: any) => {
        assetManagment.expandAllocatedAssetTree(i);
        assetManagment.allocateAssetToRoot(i + 1);

        assetManagment.searchAsset(asset.name);
        assetManagment.allocatedAssetTableAction({ action: "edit", index: 0 });
        assetManagment.parentAssetInput.should("contain.value", "None");
      });
    })
  );
});

describe("Verify parent asset field will be shown in Edit child asset form", () => {
  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAllocatedAssets();
  });

  qase(
    220,
    it("Verify parent asset field will be shown in Edit child asset form", () => {
      const asset: Asset = generateRandomAsset();
      const asset1: Asset = generateRandomAsset();
      asset.children = [asset1];
      assetManagment.recursiveAddAssetChildren(asset);
      cy.reload();

      assetManagment.searchAsset(asset1.name);
      assetManagment.allocatedAssetTableAction({ action: "edit", index: 0 });
      assetManagment.parentAssetInput.should("contain.value", asset.name);
    })
  );
});

describe("Verify child asset can change from one parent asset to another", () => {
  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAllocatedAssets();
  });

  qase(
    217,
    it("Verify child asset can change from one parent asset to another", () => {
      const asset: Asset = generateRandomAsset();
      const asset1: Asset = generateRandomAsset();
      const asset2: Asset = generateRandomAsset();
      const asset3: Asset = generateRandomAsset();
      asset.children = [asset1];
      asset2.children = [asset3];
      assetManagment.recursiveAddAssetChildren(asset);
      assetManagment.recursiveAddAssetChildren(asset2);
      cy.reload();

      assetManagment.getAllocatedAssetIndex(asset.name);
      cy.get("@allocatedAssetIndex").then((i: any) => {
        assetManagment.expandAllocatedAssetTree(i);
        assetManagment.allocateAsset(asset2.name, ["Root"], i + 1); //Child

        assetManagment.searchAsset(asset1.name);
        assetManagment.allocatedAssetTableAction({ action: "edit", index: 0 });
        assetManagment.parentAssetInput.should("contain.value", asset2.name);
      });
    })
  );

  qase(
    434,
    it("Verify child asset can change from one parent asset to Root", () => {
      const asset: Asset = generateRandomAsset();
      const asset2: Asset = generateRandomAsset();
      asset.children = [asset2];
      assetManagment.recursiveAddAssetChildren(asset);
      cy.reload();

      cy.wait(10000);
      assetManagment.getAllocatedAssetIndex(asset.name);
      cy.get("@allocatedAssetIndex").then((i: any) => {
        assetManagment.expandAllocatedAssetTree(i);
        assetManagment.allocateAsset("Root", ["Root"], i + 1); //Child

        assetManagment.searchAsset(asset2.name);
        assetManagment.allocatedAssetTableAction({ action: "edit", index: 0 });
        assetManagment.parentAssetInput.should("contain.value", "None");
      });
    })
  );
});

describe("Verify change parent asset is disabled if there is only one asset on page", () => {
  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAllocatedAssets();
    assetPoolAPI.deleteAllAllocatedAssets();
  });

  qase(
    227,
    it("Verify change parent asset is disabled if there is only one asset on page", () => {
      const asset: Asset = generateRandomAsset();
      const asset1: Asset = generateRandomAsset();
      asset.children = [asset1];
      assetManagment.recursiveAddAssetChildren(asset);
      cy.reload();
      assetManagment.allocatedAssetIsDisabled();
    })
  );
});

describe("Verify child asset can contain it's own children assets", () => {
  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAllocatedAssets();
  });

  qase(
    216,
    it("Verify child asset can contain it's own children assets", () => {
      const asset: Asset = generateRandomAsset();
      const asset1: Asset = generateRandomAsset();
      const asset2: Asset = generateRandomAsset();
      asset.children = [asset1];
      asset1.children = [asset2];
      assetManagment.recursiveAddAssetChildren(asset);
      cy.reload();

      assetManagment.getAllocatedAssetIndex(asset.name);
      cy.get("@allocatedAssetIndex").then((i: any) => {
        assetManagment.expandAllocatedAssetTree(i);

        assetManagment.searchAsset(asset1.name);
        assetManagment.allocatedAssetTableAction({ action: "edit", index: 0 });
        assetManagment.parentAssetInput.should("contain.value", asset.name);

        assetManagment.cancelButton.click();
        assetManagment.searchAsset(asset2.name);
        assetManagment.allocatedAssetTableAction({ action: "edit", index: 0 });
        assetManagment.parentAssetInput.should("contain.value", asset1.name);
      });
    })
  );
});

describe("Verify user can Deallocate asset via edit form", () => {
  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAllocatedAssets();
  });

  qase(
    223,
    it("Verify user can Deallocate asset via edit form", () => {
      const asset: Asset = generateRandomAsset();
      assetManagment.recursiveAddAssetChildren(asset);
      cy.reload();

      assetManagment.searchAsset(asset.name);
      assetManagment.allocatedAssetTableAction({ action: "edit", index: 0 });

      cy.loaderShouldNotBeVisible();
      assetManagment.deallocateAssetButton.should("be.visible").click();
      cy.wait(3000);
      assetManagment.menuItemAllocatedAssets.click();

      assetManagment.searchAsset(asset.name);
      assetManagment.verifyAssetTableIsEmpty();
    })
  );
});

after(() => {
  assetPoolAPI.deleteAllAllocatedAssets();
  assetPoolAPI.deleteAllAssetTypes();
});
