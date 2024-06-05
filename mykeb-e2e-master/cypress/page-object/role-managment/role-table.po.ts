import { Role } from "../../support/types/role";
import rolePath from "../../support/constant/role-managment";
export default class RoleTable {
  get headerCreateNewRole() {
    return cy.get('lib-panel-header-actions [class="btn btn-primary"]');
  }

  get tableRow() {
    return cy.get("div lib-row");
  }

  get tableRowCell() {
    return cy.get("lib-cell");
  }

  get tableTrashIcon() {
    return cy.get('[src="assets/icons/delete.svg"]');
  }

  get tableNameSort() {
    return cy.get('[libheadersort="name"]');
  }

  get tableDropDownItem() {
    return cy.get('[class="text-right dropdown-menu show"] [class="dropdown-item"]');
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

  get editButton() {
    return cy.get('[class="text-right dropdown-menu show"] [class="dropdown-item"]').eq(0);
  }

  get deleteButton() {
    return cy.get('[class="text-right dropdown-menu show"] [class="dropdown-item"]').eq(1);
  }

  get popupTrashbinIcon() {
    return cy.get('[class="btn btn-danger"]');
  }

  get searchInput(){
    return cy.get('[class="search"] input');
  }

  navigateToRoles() {
    cy.setAppLanguage("en_EN");
    cy.visit(Cypress.env("URL")+rolePath.path.roles);
    cy.setAppLanguage("en_EN");
    cy.reload();
    cy.verifyURLContains(rolePath.path.roles);
  }

  startCreatingNewRole() {
    this.headerCreateNewRole.click();
    cy.url().should("include", "/user/#/roles/");
  }

  verifyUserTableRow(role: Role, index) {
    if (role.name != undefined) {
      this.tableRow.eq(index).find("lib-cell").eq(0).should("contain.text", role.name);
    }
  }

  findRoleByName(name){
    cy.verifyTableIsLoaded();
    this.tableRow.contains(name).should("exist");
  }

  startEditingRole(index, role = undefined) {
    cy.wait(2000);
    this.tableRow.eq(index).find("i").click();
    this.editButton.click();
    if (role != undefined) {
      cy.get('[class*="card-page-title"]').should("contain.text", role);
    }
  }

  startEditingRoleByName(name: string) {
    cy.wait(2000);
    this.tableRow.contains(name).parents("lib-row").find("i").click();
    this.editButton.click();
    cy.get('[class*="card-page-title"]').should("contain.text", name);
  }

  startDeletingRoleByName(name: string) {
    cy.wait(2000);
    this.tableRow.contains(name).parents("lib-row").find("i").click();
  }

  deleteRoleByName(name: string) {
    cy.wait(2000);
    this.tableRow.contains(name).find('[src="assets/icons/delete.svg"]').parent().click();
    cy.get('[class*="card-page-title"]').should("contain.text", name);
  }

  verifyRoleDoesntExist(name: string) {
    cy.wait(2000);
    this.tableRow.contains(name).should("not.exist");
  }

  deleteRole() {
    cy.intercept("DELETE", rolePath.endpoint.roleIdentity).as("deleteRole");
    cy.wait(2500);
    this.deleteButton.should("be.enabled").click();
    this.popupTrashbinIcon.click();
    cy.wait("@deleteRole").then((data: any) => {
      expect(data.response.statusCode).to.equal(204);
      cy.url().should("not.include", "/user/#/roles/").should("include", "/user/#/roles");
    });
  }

  searchRole(query){
    this.searchInput.clear().type(query);
  }
}
