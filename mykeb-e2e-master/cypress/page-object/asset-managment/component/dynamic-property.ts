import ConfirmationModal from "./modal-confirmation.po";

export default class DynamicPropertyDetails extends ConfirmationModal {
  get wrapper() {
    return cy.get("app-property-modal");
  }

  get header() {
    return this.wrapper.find(".modal-title");
  }

  get nameField() {
    return this.wrapper.find("#propertyName");
  }

  get defaultValueField() {
    return this.wrapper.find("#value");
  }

  get keyField() {
    return this.wrapper.find("#key");
  }

  get typeDropdown() {
    return this.wrapper.find(".form-dropdown");
  }

  get closeButton() {
    return cy.get(".modal-header i");
  }

  get submitButton() {
    return cy.get('[class="modal-content"] [class="btn btn-primary"]');
  }

  get mandatoryCheckbox() {
    return cy.get('[formcontrolname="isRequired"] span.checkbox-tick');
  }
  get displayCheckbox() {
    return cy.get('[formcontrolname="display"] span.checkbox-tick');
  }

  addDynamicPropertyDetails(dynamicPropertie: any) {
    if (dynamicPropertie.propertyName !== undefined) {
      this.nameField.clear().type(dynamicPropertie.propertyName);
    }

    this.typeDropdown.click();
    cy.selectOptionFromDropdown("STRING");

    if (dynamicPropertie.key !== undefined) {
      this.keyField.clear().type(dynamicPropertie.key);
    }

    if (dynamicPropertie.defaultValue !== undefined) {
      this.defaultValueField.clear().type(dynamicPropertie.defaultValue);
    }
  }

  clickSubmitButton() {
    this.submitButton.click();
    cy.wait(2000);
  }

  editDynamicPropertyDetails() {
    this.nameField.type("EDITED");
    this.defaultValueField.type("EDITED");
    this.keyField.clear().type("EDITED");
    this.mandatoryCheckbox.click();
  }
}
