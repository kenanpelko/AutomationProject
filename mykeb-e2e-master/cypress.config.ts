const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "./.env") });
import { defineConfig } from "cypress";

let assetList = [];
let assetTypeList = [];
const dynamicPropertyList = [];
let cookie = null;
let asset = null;
let assetType = null;

let tenant = null;
let tenantList = null;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env.baseUrl = process.env.URL;
      config.env.URL = process.env.URL;
      config.env.EMAIL = process.env.E2E_USERNAME;
      config.env.PASSWORD = process.env.E2E_PASSWORD;
      config.env.LANGUAGE = process.env.E2E_LANGUAGE;

      on("task", {
        getAssetList: () => {
          return assetList;
        },
        setAssetList: (val) => {
          assetList.push(val);
          return null;
        },
        clearAssetList: () => {
          assetList = [];
          return null;
        },
        getAssetTypeList: () => {
          return assetTypeList;
        },
        setAssetTypeList: (val) => {
          assetTypeList.push(val);
          return null;
        },
        clearAssetTypeList: () => {
          assetTypeList = [];
          return null;
        },
        setDynamicPropertyList: (val) => {
          dynamicPropertyList.push(val);
          return null;
        },

        getCookie: () => {
          return cookie;
        },
        setCookie: (val) => {
          cookie = val;
          return null;
        },

        getAsset: () => {
          return asset;
        },
        setAsset: (val) => {
          asset = val;
          return null;
        },
        getAssetType: () => {
          return assetType;
        },
        setAssetType: (val) => {
          assetType = val;
          return null;
        },

        getTenant() {
          return tenant;
        },
        setTenant(val) {
          tenant = val;
          return null;
        },
        getTenantList() {
          return tenantList;
        },
        setTenantList(val) {
          tenantList = val;
          return null;
        },
      });
      return config;
    },
    retries: 2,
    baseUrl: process.env.URL,
    viewportHeight: 768,
    viewportWidth: 1366,
    defaultCommandTimeout: 30000,
    requestTimeout: 30000,
    reporter: "cypress-qase-reporter",
    reporterOptions: {
      apiToken: process.env.E2E_QASE_TOKEN,
      projectCode: "KEB",
      logging: true,
      runComplete: true,
    },
  },
});
