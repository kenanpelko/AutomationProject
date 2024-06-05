import constat from "../../constant/asset-managment";
import { Asset } from "../../types/asset";
const baseUrl = Cypress.config().baseUrl;

export default class AssetPoolAPI {
  deleteAsset(id) {
    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: false,
        method: "DELETE",
        url: `${baseUrl}${constat.services.assets}/${id}`,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          cookie: cookie,
        },
      }).then((res) => {});
    });
  }

  addAsset(asset: Asset) {
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
  }

  allocateAsset(assetData) {
    const body = {
      actions: [
        {
          id: assetData.id,
          type: "childOf",
        },
      ],
    };

    if (assetData.childOf != undefined) {
      //@ts-ignore
      body.actions[0].childOf = assetData.childOf;
    }

    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: true,
        method: "POST",
        url: `${baseUrl}${constat.services.transform}`,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          cookie: cookie,
        },
        body,
      }).then((data: any) => {
        expect(data.status).to.equal(201);
      });
    });
  }

  deleteAllAllocatedAssets() {
    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: false,
        method: "GET",
        url: `${baseUrl}${constat.services.tree}`,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          cookie: cookie,
        },
      }).then((tree: any) => {
        const data = tree.body.data;
        data.forEach((ele) => {
          this.recursiveDeleteAllocatedAssetChildren([ele]);
        });
      });
    });
  }

  recursiveDeleteAllocatedAssetChildren(data) {
    data.forEach((ele) => {
      if (ele.children.length > 0) {
        this.recursiveDeleteAllocatedAssetChildren(data[0].children);
      }
    });
    this.deleteAsset(data[0].id);
    return;
  }

  deleteAllUnallocatedAssets() {
    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: false,
        method: "GET",
        url: `${baseUrl}${constat.services.unassigned}`,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          cookie: cookie,
        },
      }).then((res: any) => {
        const data = res.body.data;
        data.forEach((ele) => {
          this.deleteAsset(ele.id);
        });
      });
    });
  }

  deleteAssetType(id) {
    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: false,
        method: "DELETE",
        url: `${baseUrl}${constat.services.assetTypes}/${id}`,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          cookie: cookie,
        },
      });
    });
  }

  //buildIn:false
  deleteAllAssetTypes(nameToDelete = "AssetType") {
    //Some asset types can't be deleted if they have assets assigned to them
    this.deleteAllAllocatedAssets();
    this.deleteAllUnallocatedAssets();

    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: false,
        method: "GET",
        url: `${baseUrl}${constat.services.assetTypes}`,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          cookie: cookie,
        },
      }).then((res: any) => {
        const data = res.body.data;
        data.forEach((ele) => {
          if (ele.name.en_EN !== undefined) {
            if (ele.isBuiltIn == false && ele.name.en_EN.search(nameToDelete) != -1) {
              this.deleteAssetType(ele.id);
            }
          }
        });
      });
    });
  }
}
