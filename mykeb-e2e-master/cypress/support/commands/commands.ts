import "cypress-file-upload";

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string, storeCookies?: boolean): void;
      verifyURLContains(verifyURLContains: any): void;
      clearSessionStorage(): void;
      clearStorage(): void;
      selectOptionFromDropdown(option: string): void;
      clearStorageAndNavigate(url: string): void;
      loaderShouldNotBeVisible(): void;
      preserveCookiesAndNavigate(): void;
      preserveCookies(): void;
      setAppLanguage(language: string): void;
      verifyLanding(language: string): void;
      verifyHomePageIsLoaded(): void;
      verifyTableIsLoaded(): void;
      verifyTableIsEmpty(): void;
    }
  }
}

Cypress.Commands.add("login", (email?: string, password?: string) => {
  cy.intercept("**/service/hub/general").as("general");

  if (email === undefined || password === undefined) {
    email = Cypress.env("EMAIL");
    password = Cypress.env("PASSWORD");
  }
  cy.get("#username").clear().type(email);
  cy.get("#password").clear().type(password);
  cy.get("#kc-login").click();

  cy.wait("@general").then((data: any) => {
    cy.task("setCookie", data.request.headers.cookie);
  });
});

Cypress.Commands.add("verifyURLContains", (text: string) => {
  cy.url().should("include", text);
});

Cypress.Commands.add("clearSessionStorage", () => {
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

Cypress.Commands.add("clearStorage", () => {
  cy.clearSessionStorage();
  cy.clearLocalStorage();
});

Cypress.Commands.add("selectOptionFromDropdown", (option: string) => {
  cy.get(".form-dropdown-menu").find("button").contains(option).click();
});

Cypress.Commands.add("clearStorageAndNavigate", (url = "/") => {
  cy.clearStorage();
  cy.clearCookies();
  cy.visit(url);
});

Cypress.Commands.add("loaderShouldNotBeVisible", () => {
  cy.get("lib-loader").should("not.exist");
});

Cypress.Commands.add("preserveCookiesAndNavigate", () => {
  cy.preserveCookieOnce("_oauth2_proxy", "_oauth2_proxy_0", "_oauth2_proxy_1");
  cy.visit("/");
});

Cypress.Commands.add('preserveCookies', () => { 
  cy.preserveCookieOnce("_oauth2_proxy", "_oauth2_proxy_0", "_oauth2_proxy_1");
});

Cypress.Commands.add("setAppLanguage", (language: string) => {
  cy.window().then((win: any) => {
    win.localStorage.setItem("sf_language", language);
  });
});

Cypress.Commands.add("verifyLanding", (language: string) => {
  cy.window().then((win: any) => {
    win.localStorage.setItem("sf_language", language);
  });
});

Cypress.Commands.add("verifyHomePageIsLoaded", () => {
  cy.url().should("include", "/hub/#/");
  cy.get('[class*="title"]').should("be.visible");
  cy.get('[class*="services"]').should("be.visible");
});

Cypress.Commands.add("verifyTableIsLoaded", () => {
  cy.get('[class="table-row"]').should("exist");
});
Cypress.Commands.add("verifyTableIsEmpty", () => {
  cy.get('[class="table-row"]').should("not.exist");
});




