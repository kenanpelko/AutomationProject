const multiboardPath = require('../support/constant/multiboard-admin');

declare namespace Cypress {
  interface Chainable {
    navigateToAssetManager(): void;
    navigateToMultiboardAdmin(): void;
  }
}

Cypress.Commands.add("navigateToAssetManager", () => {
  cy.visit(Cypress.env("URL")+"/asset-manager/#/asset-pool");
});

Cypress.Commands.add('navigateToMultiboardAdmin', () => {
  cy.visit(Cypress.env("URL")+'/condition-monitoring/#/multiboard/admin');
  cy.verifyURLContains('/condition-monitoring/#/multiboard/admin');
});
