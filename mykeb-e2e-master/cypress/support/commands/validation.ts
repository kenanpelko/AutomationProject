declare namespace Cypress {
  interface Chainable {
    verifyURLContains(url: string): void;
    verifyURLDoesntContain(url: string): void;
  }
}

Cypress.Commands.add("verifyURLContains", (url: string) => {
  cy.url().should("contains", url);
});

Cypress.Commands.add("verifyURLDoesntContain", (url: string) => {
  cy.url().should("not.include", url);
});
