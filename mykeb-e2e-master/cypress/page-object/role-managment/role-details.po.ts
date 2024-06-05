import rolePath from "../../support/constant/role-managment";
import { Role } from "../../support/types/role";

export default class RoleDetails {
  //#region selectors
  get roleInput() {
    return cy.get('input[id="roleName"]');
  }
  get roleAssignRight() {
    return cy.get("app-role-detail-page .column");
  }
  get headerText() {
    return cy.get('[class*="card-page-title"]');
  }
  get headerCancelButton() {
    return cy.get('[href="#/roles"]');
  }
  get headerBackButton() {
    return cy.get('[class*="back-arrow"]');
  }
  get headerSaveButton() {
    return cy.get('[class*="btn btn-primary"]');
  }
  //#endregion selectors

  updateRoleDetails(role: Role) {
    if (role.name != undefined) {
      this.roleInput.clear().type(role.name);
    }

    role.assignedRights.forEach((ele: any) => {
      this.roleAssignRight.contains(ele.description["en-EN"].split(" ")[1]).parent().find('[type="checkbox"]').check({ force: true });
    });
  }

  uncheckAllRoles() {
    this.roleAssignRight.find('[type="checkbox"]').each((ele: any) => {
      cy.get(ele).uncheck({ force: true });
    });
  }

  verifyRoleDetails(role: Role) {
    if (role.name != undefined) {
      this.roleInput.should("have.value", role.name);
    }

    role.assignedRights.forEach((ele: any) => {
      this.roleAssignRight.contains(ele.description["en-EN"].split(" ")[1]).parent().find('[type="checkbox"]').should("be.checked");
    });
  }

  clickCancelButton() {
    cy.url().should("include", "/user/#/roles/");
    this.headerCancelButton.click();
    cy.url().should("not.include", "/user/#/roles/").should("include", "/user/#/roles");
  }

  clickBackButton() {
    cy.url().should("include", "/user/#/roles/");
    this.headerBackButton.click();
    cy.url().should("not.include", "/user/#/roles/").should("include", "/user/#/roles");
  }

  clickSaveButton() {
    cy.intercept("POST", rolePath.endpoint.roles).as("createRole");
    this.headerSaveButton.should("be.enabled").click();

    cy.wait("@createRole").then((data: any) => {
      expect(data.response.statusCode).to.equal(201);
      cy.url().should("not.include", "/user/#/roles/").should("include", "/user/#/roles");
    });
  }

  editRole() {
    cy.intercept("PUT", rolePath.endpoint.roleIdentity).as("createRole");
    this.headerSaveButton.should("be.enabled").click();

    cy.wait("@createRole").then((data: any) => {
      expect(data.response.statusCode).to.equal(200);
      cy.url().should("not.include", "/user/#/roles/").should("include", "/user/#/roles");
    });
  }
}
