export default {
  path: {
    assetManagerAssetPool: "/asset-manager/#/asset-pool",
    assetManagerAllocatedAssets: "/asset-manager/#/allocated-assets",
    assetPool: "/asset-pool",
    assetNew: "/assets/new",
    assetManagerAssetTypes: "/asset-manager/#/asset-types",
    assetManagerAsset: "/asset-manager/#/assets",
    assetTypes: "/asset-types",
    assetTypesNew: "/asset-types/new",
  },
  services: {
    assets: "/service/asset/v1/assets",
    tree: "/service/asset/v1/tree",
    unassigned: "/service/asset/v1/assets/unassigned",
    assetTypes: "/service/asset/v1/asset-types",
    assetsId: "**/service/asset/v1/assets/**",
    assetTypesId: "**/service/asset/v1/asset-types/**",
    machines: "/maintenance-angular/#/machines",
    assetClone: "**/service/asset/v1/assets/clone/**",
    transform: "/service/asset/v1/tree/transform",
    property: "/service/asset/v1/properties/asset-type/",
  }
};
