import { faker } from "@faker-js/faker";
import PersonalInformation from "../../page-object/user-management/personal-information.po";
import userPath from "../../support/constant/user-managment";
const localization = require(`../../fixtures/i18n/user-management/en.json`);

const personalInformation = new PersonalInformation();

describe("Navigation inside of the personal information page", () =>{

    beforeEach(()=>{

        cy.navigateToBaseURL(Cypress.env("URL"));

    });

    it("Verify that user can start editing it's personal information", ()=>{
        personalInformation.navigateByMenu();
        cy.verifyURLContains(userPath.path.me);
    });

    it("Verify that user can use back arrow to navigate inside of the personal information page", ()=>{ 
        personalInformation.navigateByLink();
        
        personalInformation.backArrow.click();
        cy.verifyURLContains(userPath.path.user);
        cy.verifyURLDoesntContain(userPath.path.me);
    });

    it("Verify that user can use cancel button to navigate inside of the personal information page", ()=>{ 
        personalInformation.navigateByLink();
        
        personalInformation.cancelButton.click();
        cy.verifyURLContains(userPath.path.user);
        cy.verifyURLDoesntContain(userPath.path.me);
    });
});

describe("Validation inside of the personal information page", () =>{

    beforeEach(()=>{

        cy.navigateToBaseURL(Cypress.env("URL"));
        personalInformation.navigateByLink();
        cy.wait(2500);
    });

    it("Verify that the 'Email' field is read-only", ()=>{
        personalInformation.emailInput.should("be.disabled");
    });

    it("Verify that the we can't save changes without the name field", ()=>{
        personalInformation.nameInput.clear();
        personalInformation.nameInputValidation.should("be.visible").should("contain.text",localization.fields.nameRequired);
    });

    it("Verify that current tenant is available inside of the tenant list", ()=>{

        cy.get('[class="ng-select-container"] [class="ng-placeholder"]').then((ele)=>{

            const currentTenant = ele.text();
            personalInformation.tableRow.contains(currentTenant).should("be.visible");
        });
    });
});

describe("Editing personal information", () =>{

    beforeEach(()=>{

        cy.navigateToBaseURL(Cypress.env("URL"));
        personalInformation.navigateByLink();
    });

    it("Verify that the we can edit the user's name", ()=>{
        const newName = faker.name.firstName();
        
        personalInformation.nameInput.clear().type(newName);
        personalInformation.saveButton.click();
        cy.verifyURLDoesntContain(userPath.path.me);//User is navigated back to the users page

        personalInformation.navigateByLink();
        personalInformation.nameInput.should("contain.value",newName);
        personalInformation.pageTitle.should("contain.text",newName);
    });
});

describe("Editing personal information", () =>{

    beforeEach(()=>{

        cy.navigateToBaseURL(Cypress.env("URL"));
        personalInformation.navigateByLink();
    });

    it("Verify that user can't change the password with new weak password", ()=>{
        const invalidPassword = "invalid";
        
        personalInformation.passwordInput.clear().type(invalidPassword);
        personalInformation.passwordConfirmationInput.clear().type(invalidPassword);

        personalInformation.passwordFeedbackMessage.should("contain.text","Please choose a valid password with min. 8 characters and no umlauts.");
        personalInformation.saveButton.should("be.disabled");
    });

    it("Verify that user can't change the password with mismatching password and password confirmation", ()=>{
        const invalidPassword = "Secure123!";
        const invalidPasswordConfirmation = "Secure123!#"
        
        personalInformation.passwordInput.clear().type(invalidPassword);
        personalInformation.passwordConfirmationInput.clear().type(invalidPasswordConfirmation);

        personalInformation.saveButton.should("be.disabled");
    });
});