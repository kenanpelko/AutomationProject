export default class Services {
  get serviceNumberText() {
    return cy.get('[class="service-header p-4"]');
  }

  get noServiceText() {
    return cy.get("[class*='ag-overlay-no-rows-wrapper'] div");
  }

  get addServiceButton() {
    return cy.get('[class="btn btn-primary"]');
  }

  get servicePopupAddButton() {
    return cy.get('[class="modal-footer pb-4"] [class="btn btn-primary"]');
  }

  get servicePopupCancelButton() {
    return cy.get('[class="modal-footer pb-4"] [class="btn btn-outline-secondary"]');
  }

  get servicePopupXbutton() {
    return cy.get('[class="material-icons mi-18"]');
  }
}
