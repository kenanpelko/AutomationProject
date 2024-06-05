import userPath from "../../support/constant/user-managment";
import { User } from "../../support/types/user";

export default class PersonalInformation {

    get pageTitle(){
        return cy.get('[class*="card-page-title"]');
    }

    get backArrow(){
        return cy.get('[class*="back-arrow"]');
    }

    get saveButton(){
        return cy.get('[class="card-page-header"] [class*="btn btn-primary"]');
    }

    get cancelButton(){
        return cy.get('a[href="#/users"]')
    }

    get nameInput(){
        return cy.get('[id="name"]');
    }

    get nameInputValidation(){
        return cy.get('[id="validationName"]');
    }

    get emailInput(){
        return cy.get('[id="email"]');
    }

    get roleText(){
        return cy.get('[class*="short-validation-control"]');
    }

    get tableRow(){
        return cy.get('lib-row')
    }

    get passwordInput(){
        return cy.get('[formcontrolname="password"]');
    }
    
    get passwordConfirmationInput(){
        return cy.get('[formcontrolname="confirmPassword"]');
    }

    get passwordFeedbackMessage(){
        return cy.get('[class="invalid-feedback"]');
    }

    get replaceImageButton(){
        return cy.get('[class="btn btn-primary"]');
    }

    get image(){
        return cy.get('[class="image-wrapper"] img');
    }

    get imageInput(){
        return cy.get('[type="file"]');
    }

    navigateByLink(){
        cy.visit(Cypress.env("URL")+userPath.path.me);
        cy.verifyURLContains(userPath.path.me);
        cy.wait(2500);
    }
    navigateByMenu(){
        cy.get('[class="navbar p-0"] [class="dropdown-toggle btn btn-transparent btn-icon"]').click();
        cy.get('[class*="current-user-name"]').click();
    }



    

}