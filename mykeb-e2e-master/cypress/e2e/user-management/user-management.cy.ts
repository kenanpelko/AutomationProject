/*
TODO: Finish the registration flow; email flow;
*/
import "cypress-v10-preserve-cookie";
import { qase } from "cypress-qase-reporter/dist/mocha";
import PersonalInformation from "../../page-object/user-management/personal-information.po";
import UserTable from "../../page-object/user-management/user-table.po";
import UserAPI from "../../support/api/user-managment/user";
import constant from "../../support/constant/user-managment";
import generateRandomUser from "../../support/helpers/user";
import UserDetails from "../../page-object/user-management/user-details.po";
import userPath from "../../support/constant/user-managment";

const personalInformation = new PersonalInformation();
const userDetails = new UserDetails();
const userTable = new UserTable();
const userAPI = new UserAPI();

describe("Adding new user", () => {
  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.setAppLanguage("en_EN");
    cy.navigateToBaseURL(Cypress.env("URL"));
    userTable.navigateToUsers();
  });

  qase(
    303,
    it('Verify that  "Create a new user" working correctly', () => {
      const user = generateRandomUser();

      createNewUser(user);

      cy.reload(); //Veryfing user exists
      userTable.verifyUserExists(user.email);
    })
  );

  qase(
    318,
    it("Verify that all elements have been properly loaded on Create new user form", () => {
      cy.verifyURLContains(constant.path.user);

      userTable.headerCreateNewUser.click();
      userTable.modelRoleInput.should("be.visible").click();
      userTable.roleDropdownItem.should("be.visible");
      userTable.modelEmailInput.should("be.visible");
      userTable.inviteUserButton.should("be.visible");
      userTable.cancelButton.should("be.visible");
    })
  );

  qase(
    450,
    it("Verify that we can close the user creation form", () => {
      cy.verifyURLContains(constant.path.user);

      userTable.headerCreateNewUser.click();
      userTable.modelRoleInput.should("be.visible").click();
      userTable.cancelButton.click();
      userTable.modelRoleInput.should("not.exist");

      userTable.headerCreateNewUser.click();
      userTable.modelRoleInput.should("be.visible").click();
      userTable.xButton.click();
      userTable.modelRoleInput.should("not.exist");
    })
  );

    qase(
    355,
    it("Verify user can't create new user with already used email", () => {
      const user = generateRandomUser();

      //New user with new email address
      createNewUser(user);

      //New user with already existing email address
      createNewUser(user);
      cy.verifyToasterMessage("User has already access to this tenant");
    })
  );

  qase(
    355,
    it("Verify user can't create new user with already used email", () => {
      const user = generateRandomUser();

      //New user with new email address
      createNewUser(user);

      //New user with already existing email address
      createNewUser(user);
      cy.verifyToasterMessage("User has already access to this tenant");
    })
  );

  
  qase(
    343,
    it("Verify user can't create new user without populating all mandatory fields", () => {
      const user = generateRandomUser();

      userTable.startCreatingNewUser();
      userTable.inviteUserButton.should("be.disabled");

      userTable.modelEmailInput.clear().type(user.email);
      userTable.inviteUserButton.should("be.disabled");
    })
  );

  qase(
    346,
    it("Verify user can't create new user with invalid email address format", () => {
      const user = generateRandomUser({email:'invalid'});

      userTable.startCreatingNewUser();
      userTable.fillUserDetails(user);
      userTable.inviteUserButton.should("be.disabled");
    })
  );

  
  

});

describe("Editing the existing user", () => {
  const user = generateRandomUser();

  before(() => {
    cy.clearStorageAndNavigate("/");
    cy.setAppLanguage("en_EN");
    cy.navigateToBaseURL(Cypress.env("URL"));
    userTable.navigateToUsers();

    createNewUser(user);

    cy.reload(); //Veryfing user exists
    userTable.verifyUserExists(user.email);
  });

  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.setAppLanguage("en_EN");
    cy.navigateToBaseURL(Cypress.env("URL"));
    userTable.navigateToUsers();
  });

  qase(
    300,
    it('Verify that "view User profil" working correctly in All Users tab', () => {
      userTable.searchUser(user.email);
      userTable.startEditingUser(user.email);
      userDetails.verifyUserDetails(user);
    })
  );

  //Test case is disabled because of the translation issue;
  qase(
    448,
    xit("Verify that we can update user role and set it to 'Admin'", () => {
      const newRole = { role: "Admin" };

      //Veryfing user exists
      userTable.searchUser(user.email);
      userTable.startEditingUser(user.email);

      userDetails.editUserDetails(newRole);
      userDetails.saveButton.click();
      cy.verifyURLDoesntContain(userPath.path.user + "/"); //User is redirected back to the table

      userTable.startEditingUser(user.email);
      userDetails.verifyUserDetails(newRole);
    })
  );

  //Test case is disabled because of the translation issue;
  qase(
    447,
    xit("Verify that we can update user role and set it to 'User'", () => {
      const newRole = { role: "User" };

      //Veryfing user exists
      userTable.searchUser(user.email);
      userTable.startEditingUser(user.email);

      userDetails.editUserDetails(newRole);
      userDetails.saveButton.click();
      cy.verifyURLDoesntContain(userPath.path.user + "/"); //User is redirected back to the table

      userTable.startEditingUser(user.email);
      userDetails.verifyUserDetails(newRole);
    })
  );

  qase(
    449,
    it("Verify that admin can't update the email or username for other users", () => {
      userTable.searchUser(user.email);
      userTable.startEditingUser(user.email);

      userDetails.emailInput.should("be.disabled");
      userDetails.nameInput.should("be.disabled");
    })
  );
});

describe("Working with users table functionalities", () => {
  const user = generateRandomUser();
  user.userName = user.email.split("@")[0]; //This is how the app generates the default username
  before(() => {
    cy.clearStorageAndNavigate("/");
    cy.setAppLanguage("en_EN");
    cy.navigateToBaseURL(Cypress.env("URL"));
    userTable.navigateToUsers();

    createNewUser(user);

    cy.reload(); //Veryfing user exists
    userTable.verifyUserExists(user.email);
  });

  beforeEach(() => {
    cy.clearStorageAndNavigate("/");
    cy.setAppLanguage("en_EN");
    cy.navigateToBaseURL(Cypress.env("URL"));
    userTable.navigateToUsers();
  });

  qase(
    297,
    it("Verify that search box working correctly in All Users tab", () => {
      //Veryfing user exists
      userTable.searchUser(user.email);
      userTable.verifyUserExists(user.email);
      userTable.verifyUserTableRow(user, -1);

      userTable.searchUser("!invalidSearchQuery");
      cy.wait(2500);
      userTable.tableRowEmpty.should("exist");
    })
  );

  qase(
    317,
    it("Verify all elements have been properly loaded on All users page", () => {
      userTable.headerAllUsers.should("be.visible").should("contain.text", "All users");
      userTable.headerRolesAndRights.should("be.visible").should("contain.text", "Roles & Rights");
      userTable.headerSearchUsers.should("be.visible");
      userTable.headerCreateNewUser.should("be.visible");

      userTable.tableNameSort.should("be.visible",{timeout:60000});
      userTable.tableEmailSort.should("be.visible");
      userTable.tableRow.should("have.length.above", 1);
    })
  );

  qase(
    301,
    it('Verify that "Back option in view User profil" working correctly', () => {
      userTable.searchUser(user.email);
      userTable.startEditingUser(user.email);

      userDetails.backArrow.click();
      cy.verifyURLDoesntContain(userPath.path.user + "/"); //User is redirected back to the table
    })
  );

  qase(
    302,
    it('Verify that "Cancel option in view User profil" working correctly', () => {
      //Veryfing user exists
      userTable.searchUser(user.userName);
      userTable.startEditingUser(user.userName);

      userDetails.cancelButton.click();
    })
  );
});

function createNewUser(user) {
  userTable.startCreatingNewUser(); //Adding user
  userTable.fillUserDetails(user);
  userTable.clickInviteUser();
}
