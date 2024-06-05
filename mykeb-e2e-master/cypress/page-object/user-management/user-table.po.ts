import userPath from "../../support/constant/user-managment";
import { User } from "../../support/types/user";

export default class UserTable {
  get headerSearchUsers() {
    return cy.get('[class="search"] input');
  }
  get headerCreateNewUser() {
    return cy.get('lib-panel-header-actions [class="btn btn-primary"]');
  }
  get tableRow() {
    return cy.get("div lib-row");
  }
  get tableRowImage() {
    return cy.get('div lib-row [class="image"]');
  }
  get tableRowCell() {
    return cy.get("lib-cell");
  }
  get tableRowEmpty() {
    return cy.get('[class="table-row table-row-empty"]');
  }

  get tableNameSort() {
    return cy.get('[libheadersort="name"]',{timeout:60000});
  }

  get tableEmailSort() {
    return cy.get('[libheadersort="email"]');
  }

  get userManagementHeader() {
    return cy.get("lib-panel-header h2");
  }

  get headerAllUsers() {
    return cy.get("lib-panel-header .tab").eq(0);
  }

  get headerRolesAndRights() {
    return cy.get("lib-panel-header .tab").eq(1);
  }

  get modelEmailInput() {
    return cy.get('[id="email"]');
  }

  get modelRoleInput() {
    return cy.get('[labelforid="name"]');
  }

  get roleDropdownItem() {
    return cy.get('[class*="ng-option"]');
  }

  get inviteUserButton() {
    return cy.get('[class="modal-content"] [class="btn btn-primary"]');
  }

  get cancelButton() {
    return cy.get('[class="modal-content"] [class*="btn-outline-secondary"]');
  }

  get xButton() {
    return cy.get('[class="modal-header align-items-center"] button');
  }

  navigateToUsers() {
    cy.visit(Cypress.env("URL")+userPath.path.user);
    cy.verifyURLContains(userPath.path.user);
  }

  startCreatingNewUser() {
    this.headerCreateNewUser.click();
  }

  searchUser(query: string) {
    this.headerSearchUsers.should("be.enabled").clear().type(query);
  }

  openEditProfileUser(username: string) {
    cy.get(".table-cell").contains(username).parent().click();
  }

  verifyUserTableRow(user: User, index) {
    if (user.userName != undefined) {
      this.tableRow.eq(index).find("lib-cell").eq(1).should("contain.text", user.userName);
    }

    if (user.email != undefined) {
      this.tableRow.eq(index).find("lib-cell").eq(2).should("contain.text", user.email);
    }
    if (user.role !== undefined) {
      this.tableRow.eq(index).find("lib-cell").eq(3).should("contain.text", user.role);
    }
  }

  startEditingUser(user) {
    cy.wait(2000);
    cy.get('[class="table-cell"]',{timeout:60000}).contains(user).parents('[class="table-row"]').find('[class*="dropdown-toggle"]').click();
    cy.get('[class*="show"] [class*="dropdown-item"]').contains('Edit').click();
  }

  verifyUserExists(user) {
    cy.wait(2000);
    cy.get('[class="table-cell"]',{timeout:60000}).contains(user);
  }

  fillUserDetails(user: User) {
    if (user.email !== undefined) {
      this.modelEmailInput.clear().type(user.email);
    }
    if (user.role !== undefined) {
      this.modelRoleInput.click();
      this.roleDropdownItem.contains(user.role).click();
    }
  }

  clickInviteUser() {
    this.inviteUserButton.click();
    cy.wait(4000);
  }
}
