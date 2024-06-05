import constat from "../../constant/asset-managment";

declare global {
  namespace Cypress {
    interface Chainable {
      addAsset(asset: any): void;
      addAssetType(asset: any): void;
      addDynamicProperties(assetId: any, dynamicProperty: any): void;
      assetTransform(asset: any): void;
    }
  }
}

Cypress.Commands.add("addAsset", (asset: any) => {
  // Adding new asset type in case we didn't provide one inside of the asset
  cy.addAssetType(asset.assetType);
  cy.get("@assetTypeId").then((assetTypeId) => {
    asset.assetType.id = assetTypeId;

    cy.request({
      method: "POST",
      url: `${Cypress.env("URL")}${constat.services.assets}`,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: {
        assetType: assetTypeId,
        aliases: [],
        documents: [],
        imageId: null,
        description: "test",
        name: {
          en_EN: asset.name,
          de_DE: asset.name,
        },
      },
    }).then((data: any) => {
      expect(data.status).to.equal(201);
      const value = data.body.data.id;
      cy.wrap(value).as("assetId");
      cy.reload().wait(2000);
      cy.task("setAssetList", value);
      cy.task("setAsset", value);
    });
  });
});

Cypress.Commands.add("addAssetType", (asset: any) => {
  cy.request({
    failOnStatusCode: false,
    method: "POST",
    url: `${Cypress.env("URL")}${constat.services.assetTypes}`,
    body: {
      name: {
        en_EN: asset.assetTypeName,
        de_DE: asset.assetTypeName,
      },
      equipmentType: "NONE",
      extendsType: null,
      description: asset.assetTypeName,
    },
  }).then((data: any) => {
    expect(data.status).to.equal(201);
    const value = data.body.data.id;
    cy.wrap(value).as("assetTypeId");
    cy.task("setAssetType", value);
    cy.task("setAssetTypeList", value);
  });
});

Cypress.Commands.add("addDynamicProperties", (assetId: any, dynamicProperty: any) => {
  cy.get(assetId).then((id: any) => {
    cy.request({
      method: "POST",
      url: `${Cypress.env("URL")}${constat.services.property}/${id}`,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: {
        display: true,
        isHidden: false,
        isRequired: false,
        key: "asdas",
        name: { en_EN: dynamicProperty.propertyName },
        position: 0,
        type: "STRING",
        value: "121",
      },
    }).then((data: any) => {
      expect(data.status).to.equal(201);
      const value = data.body.data.id;
    });
  });
});

Cypress.Commands.add("assetTransform", (asset: any) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("URL")}${constat.services.transform}`,
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: {
      actions: [asset],
    },
  }).then((data: any) => {
    // expect(data.status).to.equal(201);
    // let value = data.body.data.id;
    // cy.wrap(value).as('assetId');
    cy.reload().wait(2000);
    //      cy.task("setAssetList", value);
  });
});
