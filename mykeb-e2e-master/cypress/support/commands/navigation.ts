import assetConstant from "../constant/asset-managment";
import generalConstant from "../constant/general-settings";
import tenantPath from "../constant/tenant-settings";

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): void;
      navigateToBaseURL(url: string, uri?: string): void;
      navigateToMaintenanceManager(): void;
      navigateToAssetManager(): void;
      navigateToAssetTypes(): void;
      navigateToAllocatedAssets(): void;
      logout(): void;
      clearSessionStorage(): void;
      clearStorage(): void;
      clearStorageAndNavigate(url: string): void;
      navigateToAssetPool(): void;
      navigateToAssetType(): void;
      openAssetDetails(id: any): void;
      openAssetTypeDetails(id: any): void;
      navigateToHubSettings(): void;
      navigateToHomePage();
      navigateToTenants(): void;
    }
  }
}

// Login navigation commands
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit(Cypress.env("URL"));
  cy.get("#username").click({ force: true }).clear().type(email);
  cy.get("#password").click({ force: true }).clear().type(password);
  cy.get("#kc-login").click({ force: true });
});

Cypress.Commands.add("navigateToBaseURL", (url: any, uri?: any) => {
  cy.clearStorage();

  if (url === undefined) {
    url = Cypress.env("URL");
  }
  if (uri !== undefined) {
    url += uri;
  }

  if (url.toLowerCase().indexOf("localhost") === -1) {
    cy.visit(url);
    cy.login(Cypress.env("EMAIL"), Cypress.env("PASSWORD"));
  } else {
    cy.visit(url);
  }
});

Cypress.Commands.add("logout", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.reload();
});

Cypress.Commands.add("navigateToHubSettings", () => {
  cy.visit(Cypress.env("URL")+generalConstant.path.hubSettings);
  cy.verifyURLContains(generalConstant.path.hubSettings);
});

Cypress.Commands.add("navigateToHomePage", () => {
  cy.visit(Cypress.env("URL")+generalConstant.path.hubHome);
  cy.verifyURLContains(generalConstant.path.hubHome);
});

// Asset managment tabs
Cypress.Commands.add("navigateToAssetPool", () => {
  cy.visit(Cypress.env("URL")+assetConstant.path.assetManagerAssetPool);
  cy.verifyURLContains(assetConstant.path.assetManagerAssetPool);
});

Cypress.Commands.add("navigateToAssetType", () => {
  cy.visit(Cypress.env("URL")+assetConstant.path.assetManagerAssetTypes);
  cy.verifyURLContains(assetConstant.path.assetManagerAssetTypes);
});

Cypress.Commands.add("navigateToAllocatedAssets", () => {
  cy.visit(Cypress.env("URL")+assetConstant.path.assetManagerAllocatedAssets);
  cy.verifyURLContains(assetConstant.path.assetManagerAllocatedAssets);
});

Cypress.Commands.add("openAssetTypeDetails", (id: any) => {
  cy.get(id).then((id: any) => {
    cy.visit(Cypress.env("URL")+assetConstant.path.assetManagerAssetTypes + "/" + id);
    cy.wait(2000);
  });
});

Cypress.Commands.add("openAssetDetails", (id: any) => {
  cy.get(id).then((id: any) => {
    cy.visit(Cypress.env("URL")+assetConstant.path.assetManagerAsset + "/" + id);
    cy.wait(2000);
  });
});

//Clearing session storage
Cypress.Commands.add("clearSessionStorage", () => {
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

Cypress.Commands.add("clearStorage", () => {
  cy.clearSessionStorage();
  cy.clearLocalStorage();
});

Cypress.Commands.add("clearStorageAndNavigate", (url = "/") => {
  cy.clearStorage();
  cy.clearCookies();
  cy.visit(Cypress.env("URL")+url);
});

Cypress.Commands.add("navigateToTenants", () => {
  cy.visit(Cypress.env("URL")+tenantPath.path.tenants);
});
