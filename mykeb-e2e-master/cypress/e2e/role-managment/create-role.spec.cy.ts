import "cypress-v10-preserve-cookie";
import { qase } from "cypress-qase-reporter/dist/mocha";
import RoleTable from "../../page-object/role-managment/role-table.po";
import RoleAPI from "../../support/api/role-managment/role";
import { roles } from "../../fixtures/roles/roles.json";
import UserTable from "../../page-object/user-management/user-table.po"

const userTable = new UserTable();
const roleTable = new RoleTable();
const roleAPI = new RoleAPI();

describe("Roles - UI validation", () => {
  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.setAppLanguage("en_EN");
    cy.navigateToBaseURL(Cypress.env("URL"));
    roleTable.navigateToRoles();
  });

  qase(
    323,
    it("Verify that all roles are visible inside of the role management", () => {
      roles.forEach((role) => {
        roleTable.findRoleByName(role.name);
      });
    })
  );

  qase(
    444,
    it("Search for valid role inside of the roles table", () => {
      let user = roles.filter((ele) => {
        return ele.name == "User";
      })[0];

      roleTable.searchRole(user.name);
      roleTable.verifyUserTableRow(user, 1); //0 is header
    })
  );

  qase(
    445,
    it("Search for invalid role inside of the roles table", () => {
      let user = roles.filter((ele) => {
        return ele.name == "User";
      })[0];

      roleTable.searchRole("Invalid request");
      cy.verifyTableIsEmpty();
    })
  );

  qase(
    446,
    it("Verify all roles are visible inside of the user management", () => {
      userTable.navigateToUsers();
      userTable.startCreatingNewUser();

      cy.wait(2000);
      cy.get('[class="modal-content"] [class="ng-select-container"]').click();
      roles.forEach((role)=>{
        cy.get('[class*="ng-option"]').contains(role.name).should("exist");
      });
    })
  );
});

after(() => {
  roleAPI.getRoleList();
  cy.get("@roleList").then((list: any) => {
    roleAPI.deleteRoleList(list);
  });
});
