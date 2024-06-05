export default class AppPackages{

   get appPackageButton(){
    return cy.get('[class="tabs"] a').eq(0);
   }
   
    get packageNumberText(){
    return cy.get('[class="package-list-header p-4"] div:last-child');
   } 

   get noPackageText(){
    return cy.get("[class*='ag-overlay-no-rows-wrapper'] div");
   }

   get addPackageButton(){
    return cy.get('[class="btn btn-primary"]');
   }

   get packagePopupAddButton(){
    return cy.get('[class="modal-footer pb-4"] [class="btn btn-primary"]');
   }

   get packagePopupCancelButton(){
    return cy.get('[class="modal-footer pb-4"] [class="btn btn-outline-secondary"]');
   }

   get packagePopupXbutton(){
    return cy.get('[class="material-icons mi-18"]');
   }

}