import "cypress-v10-preserve-cookie";
import { qase } from "cypress-qase-reporter/dist/mocha";
import { assetTypes } from "../../support/types/asset-type";
import { dynamicProperty } from "../../support/types/dynamic-properties";

import AssetManagment from "../../page-object/asset-managment/asset-managment.po";
import AssetTypesManagment from "../../page-object/asset-managment/asset-type-managment.po";
import AssetTypeDetails from "../../page-object/asset-managment/asset-type-details.po";
import ConfirmationModal from "../../page-object/asset-managment/component/modal-confirmation.po";
import DynamicPropertyDetails from "../../page-object/asset-managment/component/dynamic-property";

import generateRandomAssetType from "../../support/helpers/asset-type";
import generateRandomDynamicProperty from "../../support/helpers/dynamic-property";

import constant from "../../support/constant/asset-managment";
import AssetPoolAPI from "../../support/api/asset-managment/asset-pool";

const localization = require(`../../fixtures/i18n/asset-managment/en.json`);

const assetManager = new AssetManagment();
const assetTypesManagment = new AssetTypesManagment();
const assetTypeDetails = new AssetTypeDetails();
const confirmationModal = new ConfirmationModal();
const dynamicPropertyDetails = new DynamicPropertyDetails();
const assetPoolApi = new AssetPoolAPI();

describe("Asset type - Elements & Navigation", () => {
  const assetType: assetTypes = generateRandomAssetType();
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAssetType(assetType);
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetType();
  });

  qase(
    268,
    it("Verify all elements are loaded on Asset types page", () => {
      assetTypesManagment.tableHeaderName.should("contain.text", localization.assetTypes.table.tableHeader.name);
      assetTypesManagment.tableHeaderIsa95Type.should("contain.text", localization.assetTypes.table.tableHeader.isa95Type);
      assetTypesManagment.tableHeaderParentAssetType.should("contain.text", localization.assetTypes.table.tableHeader.parentAssetType);
      assetTypesManagment.tableHeaderLastChanged.should("contain.text", localization.assetTypes.table.tableHeader.lastChanged);

      assetManager.menuItemAllocatedAssets.should("contain.text", localization.menu.allocatedAssets);
      assetManager.menuItemAssetPool.should("contain.text", localization.menu.assetPool);
      assetManager.menuItemAssetTypes.should("contain.text", localization.menu.assetTypes);
      assetManager.menuItemSearch.should("have.attr", "placeholder", localization.menu.search);
      assetTypesManagment.createNewAssetTypeButton.should("contain.text", localization.menu.createNewAssetType);
    })
  );

  qase(
    272,
    it("Verify user can properly open and close Create new asset type form(Via Cancel button)", () => {
      cy.verifyURLContains(constant.path.assetTypes);
      assetTypesManagment.createNewAssetTypeButton.click();
      cy.verifyURLContains(constant.path.assetTypesNew);
      assetTypeDetails.cancelButton.should("be.visible").click();
      cy.verifyURLContains(constant.path.assetTypes);
      assetTypesManagment.createNewAssetTypeButton.should("be.visible");
    })
  );

  qase(
    271,
    it("Verify all elements are loaded in Create new asset type form", () => {
      cy.verifyURLContains(constant.path.assetTypes);

      assetTypesManagment.createNewAssetTypeButton.click();
      cy.wait(2000);

      assetTypeDetails.createAssetTypeButton.should("be.disabled");
      assetTypeDetails.cancelButton.should("be.visible");

      assetTypeDetails.title.should("be.visible");
      assetTypeDetails.name.should("be.visible");
      assetTypeDetails.parentAssetButton.should("be.visible");
      assetTypeDetails.isa95TypeInput.should("be.visible");
      assetTypeDetails.description.should("be.visible");
      assetTypeDetails.dynamicPropertiesTitle.should("be.visible");
      assetTypeDetails.assignedAssetsTitle.should("be.visible");
    })
  );

  qase(
    284,
    it("Verify user can open Edit Asset type page by clicking on Asset type in table", () => {
      assetTypesManagment.searchAssetType(assetType.assetTypeName);
      assetTypesManagment.openAssetTypeDetails(assetType.assetTypeName);
      assetTypeDetails.deleteAssetTypeButton.should("be.visible");
      assetTypeDetails.assetTitle.should("contain", assetType.assetTypeName);
    })
  );

  after(() => {
    assetPoolApi.deleteAllAssetTypes();
  });
});

describe("Asset type - Edit details - Delete modal", () => {
  const assetType: assetTypes = generateRandomAssetType();
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAssetType(assetType);
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetType();
    cy.task("getAssetType").then((assetTypeId) => {
      cy.wrap(assetTypeId).as("assetTypeNewId");
      cy.openAssetTypeDetails("@assetTypeNewId");
    });
  });

  qase(
    288,
    it("Open delete asset type popup on Edit asset type page and verify all elements)", () => {
      assetTypeDetails.deleteAssetTypeButton.click();
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.title.should("contain", "Delete asset type?");
      confirmationModal.xButton.should("be.visible");
      confirmationModal.confirmationButton.should("be.visible");
    })
  );

  qase(
    289,
    it("Open delete asset type popup on Edit asset type page and close it with X button)", () => {
      assetTypeDetails.deleteAssetTypeButton.click();
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.xButton.click();
      confirmationModal.wrapper.should("not.exist");
    })
  );

  qase(
    290,
    it("Open delete asset type popup on Edit asset type page and close it with cancel button", () => {
      assetTypeDetails.deleteAssetTypeButton.click();
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.cancelButton.click();
      confirmationModal.wrapper.should("not.exist");
    })
  );

  afterEach(() => {
    cy.reload().wait(3000);
  });

  after(() => {
    assetPoolApi.deleteAllAssetTypes();
  });
});

describe("Asset type - Delete asset type from edit page", () => {
  const assetType: assetTypes = generateRandomAssetType();
  before(() => {
    cy.task("clearAssetList");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAssetType(assetType);
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetType();
    cy.task("getAssetType").then((assetTypeId) => {
      cy.wrap(assetTypeId).as("assetTypeNewId");
      cy.openAssetTypeDetails("@assetTypeId");
    });
  });

  qase(
    281,
    it("Verify user can delete Asset type from Edit Asset type page)", () => {
      assetTypeDetails.deleteAssetTypeButton.click();
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.confirmationButton.click();
      cy.verifyURLContains(constant.path.assetManagerAssetTypes);
      assetTypesManagment.verifyAssetTypeExist(assetType.assetTypeName, false);
    })
  );

  after(() => {
    assetPoolApi.deleteAllAssetTypes();
  });
});

describe("Asset type - Search", () => {
  const assetType: assetTypes = generateRandomAssetType();
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAssetType(assetType);
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetType();
  });

  qase(
    270,
    it("Verify search engine is working on Asset Types page)", () => {
      assetTypesManagment.searchAssetType(assetType.assetTypeName);
      cy.wait(1000);
      assetTypesManagment.tableRow.should("have.length", 1);
      assetTypesManagment.verifyAssetTypeExist(assetType.assetTypeName, true);
    })
  );

  after(() => {
    assetPoolApi.deleteAllAssetTypes();
  });
});

describe("Asset type - Menu option - Delete modal", () => {
  const assetType: assetTypes = generateRandomAssetType();
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAssetType(assetType);
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetType();
    assetTypesManagment.openAssetTypeMenu(assetType.assetTypeName);
    assetTypesManagment.dropdownMenuDeleteButton.click();
  });

  qase(
    285,
    it("Open delete asset type via Menu and verify all elements)", () => {
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.title.should("contain", "Delete asset type?");
      confirmationModal.xButton.should("be.visible");
      confirmationModal.confirmationButton.should("be.visible");
    })
  );

  qase(
    287,
    it("Open delete asset type via Menu and close it with Cancel button", () => {
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.cancelButton.click();
      confirmationModal.wrapper.should("not.exist");
    })
  );

  qase(
    286,
    it("Open delete asset type via Menu and close it with X button", () => {
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.xButton.click();
      confirmationModal.wrapper.should("not.exist");
    })
  );

  afterEach(() => {
    cy.reload();
  });

  after(() => {
    assetPoolApi.deleteAllAssetTypes();
  });
});

describe("Asset type - Create new asset type", () => {

  before(() => {
    cy.task("clearAssetList");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetType();
  });

  qase(
    273,
    it("Verify user can create new Asset Type", () => {
      const assetType: assetTypes = generateRandomAssetType();
      assetTypesManagment.createNewAssetTypeButton.click();
      assetTypeDetails.addAssetTypeDetails(assetType);
      cy.wait(2000);
      assetTypeDetails.createAssetTypeButton.click().wait(2000);
      assetTypesManagment.searchAssetType(assetType.assetTypeName);
      assetTypesManagment.verifyAssetTypeExist(assetType.assetTypeName, true);
    })
  );
});

describe("Asset type - Edit asset type", () => {
  const assetType: assetTypes = generateRandomAssetType();
  before(() => {
    cy.task("clearAssetList");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAssetType(assetType);
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetType();
    cy.wait(5000);
  });

  qase(
    274,
    it("Verify user can open Edit Asset type details", () => {
      assetTypesManagment.searchAssetType(assetType.assetTypeName);
      assetTypesManagment.openAssetTypeDetails(assetType.assetTypeName);
      const newAssetTypes: assetTypes = generateRandomAssetType();
      assetTypeDetails.addAssetTypeDetails(newAssetTypes);
      cy.wait(2000);
      assetTypeDetails.createAssetTypeButton.click().wait(2000);
      assetTypesManagment.searchAssetType(newAssetTypes.assetTypeName);
      assetTypesManagment.verifyAssetTypeExist(newAssetTypes.assetTypeName, true);
    })
  );
});

describe("Asset type - Dynamic properties - Elements", () => {
  const assetType: assetTypes = generateRandomAssetType();
  const dynamicProperty: dynamicProperty = generateRandomDynamicProperty();
  before(() => {
    cy.task("clearAssetList");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAssetType(assetType);
    cy.addDynamicProperties("@assetTypeId", dynamicProperty);
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetType();
    cy.task("getAssetType").then((assetTypeId) => {
      cy.wrap(assetTypeId).as("assetTypeNewId");
      cy.openAssetTypeDetails("@assetTypeNewId");
    });
  });

  qase(
    292,
    it("Open Add dynamic property popup and verfy all elements", () => {
      assetTypeDetails.addNewPropertyBtn.click();
      cy.wait(2000);

      dynamicPropertyDetails.wrapper.should("be.visible");
      dynamicPropertyDetails.header.should("contain", "Add new property");
      dynamicPropertyDetails.nameField.should("be.visible");
      dynamicPropertyDetails.defaultValueField.should("be.visible");
      dynamicPropertyDetails.keyField.should("be.visible");
      dynamicPropertyDetails.typeDropdown.should("be.visible");
      dynamicPropertyDetails.submitButton.should("be.visible").and("be.disabled");
    })
  );

  qase(
    293,
    it("Open Add dynamic property popup and close it with X button", () => {
      assetTypeDetails.addNewPropertyBtn.click();
      cy.wait(2000);
      dynamicPropertyDetails.closeButton.click({ force: true });
      cy.wait(2000);
      dynamicPropertyDetails.wrapper.should("not.exist");
    })
  );
});

describe("Asset type - Dynamic properties - Delete popup", () => {
  const assetType: assetTypes = generateRandomAssetType();
  const dynamicProperty: dynamicProperty = generateRandomDynamicProperty();
  before(() => {
    cy.task("clearAssetList");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAssetType(assetType);
    cy.addDynamicProperties("@assetTypeId", dynamicProperty);
    cy.logout();
  });

  beforeEach(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToAssetType();
    cy.task("getAssetType").then((assetTypeId) => {
      cy.wrap(assetTypeId).as("assetTypeNewId");
      cy.openAssetTypeDetails("@assetTypeNewId");
    });
  });

  qase(
    294,
    it("Open Delete dynamic property popup and verify all elements", () => {
      assetTypeDetails.clickOnDeleteDynamicProperty(dynamicProperty.propertyName);
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.title.should("contain", "Delete property?");
      confirmationModal.xButton.should("be.visible");
      confirmationModal.confirmationButton.should("be.visible");
    })
  );

  qase(
    295,
    it("Open Delete dynamic property popup and close it with X button", () => {
      assetTypeDetails.clickOnDeleteDynamicProperty(dynamicProperty.propertyName);
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.xButton.click();
      confirmationModal.wrapper.should("not.exist");
    })
  );

  qase(
    296,
    it("Open Delete dynamic property popup and close it with cancel button", () => {
      assetTypeDetails.clickOnDeleteDynamicProperty(dynamicProperty.propertyName);
      confirmationModal.wrapper.should("be.visible");
      confirmationModal.cancelButton.click();
      confirmationModal.wrapper.should("not.exist");
    })
  );

  afterEach(() => {
    cy.reload().wait(2000);
  });
});

describe("Asset type - Dynamic properties - Create new dynamic properties", () => {
  const assetType: assetTypes = generateRandomAssetType();
  const dynamicProperty: dynamicProperty = generateRandomDynamicProperty();
  before(() => {
    cy.task("clearAssetList");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAssetType(assetType);
    cy.navigateToAssetType();
    cy.openAssetTypeDetails("@assetTypeId");
  });

  beforeEach(() => {
    cy.preserveCookieOnce("_oauth2_proxy", "_oauth2_proxy_0", "_oauth2_proxy_1");
  });

  qase(
    275,
    it("Verify user can Add new Dynamic properties", () => {
      assetTypeDetails.addNewPropertyBtn.click();
      cy.wait(2000);
      dynamicPropertyDetails.wrapper.should("be.visible");
      dynamicPropertyDetails.addDynamicPropertyDetails(dynamicProperty);
      dynamicPropertyDetails.submitButton.click();
      cy.wait(2000);
      assetTypeDetails.verifyDynamicProperty(dynamicProperty);
    })
  );
});

describe("Asset type - Dynamic properties - Edit dynamic properties", () => {
  const assetType: assetTypes = generateRandomAssetType();
  const dynamicProperty: dynamicProperty = generateRandomDynamicProperty();
  before(() => {
    cy.task("clearAssetList");
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.addAssetType(assetType);
    cy.addDynamicProperties("@assetTypeId", dynamicProperty);
    cy.navigateToAssetType();
    cy.openAssetTypeDetails("@assetTypeId");
  });

  beforeEach(() => {
    cy.preserveCookieOnce("_oauth2_proxy", "_oauth2_proxy_0", "_oauth2_proxy_1");
  });

  qase(
    276,
    it("Verify user can Edit existing Dynamic properties", () => {
      assetTypeDetails.verifyAssetTypeDetails(dynamicProperty);
      assetTypeDetails.clickOnEditDynamicProperty(dynamicProperty.propertyName);
      const newDynamicProperty: dynamicProperty = generateRandomDynamicProperty();
      cy.wait(2000);
      dynamicPropertyDetails.addDynamicPropertyDetails(newDynamicProperty);
      cy.wait(2000);
      dynamicPropertyDetails.submitButton.click();
      cy.wait(2000);
      assetTypeDetails.verifyDynamicProperty(newDynamicProperty);
    })
  );
});

after(() => {
  assetPoolApi.deleteAllAssetTypes();
});
