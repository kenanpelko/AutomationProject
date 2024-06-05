import userPath from "../../support/constant/user-managment";
import { User } from "../../support/types/user";

export default class UserDetails {
  get pageTitle() {
    return cy.get('[class*="card-page-title"]');
  }

  get backArrow() {
    return cy.get('[class*="back-arrow"]');
  }

  get saveButton() {
    return cy.get('[class="card-page-header"] [class*="btn btn-primary"]');
  }

  get cancelButton() {
    return cy.get('a[href="#/users"]');
  }

  get nameInput() {
    return cy.get('[id="name"]');
  }

  get nameInputValidation() {
    return cy.get('[id="validationName"]');
  }

  get emailInput() {
    return cy.get('[id="email"]');
  }

  get roleText() {
    return cy.get('[class*="short-validation-control"]');
  }

  get roleDropdown() {
    return cy.get('[class*="role-select"]');
  }

  get roleDropdownElement() {
    return cy.get('[role="option"]');
  }

  get tableRow() {
    return cy.get("lib-row");
  }

  editUserDetails(user) {
    if (user.role !== undefined) {
      this.roleDropdown.click();
      this.roleDropdownElement.contains(user.role).click();
    }
  }

  verifyUserDetails(user) {

  }
}
