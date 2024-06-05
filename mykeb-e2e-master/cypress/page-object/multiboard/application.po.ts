import multiboardPath from '../../support/constant/multiboard-admin';
export default class Application {
    get createNewBtn() {
        return cy.get('app-multiboard-apps-list .card-page-header button');
    }

    get nameInputField() {
        return cy
            .get('app-multiboard-apps-details .card-page-body [formcontrolname="name"]')
            .find('input');
    }

    get nameInputFieldValidation() {
        return cy
            .get('app-multiboard-apps-details .card-page-body [class="text-danger"]')
    }

    get createBtn() {
        return cy.get('app-multiboard-apps-details .card-page-header button.btn-primary');
    }

    get newApplicationPanelBody() {
        return cy.get('app-multiboard-apps-details');
    }

    get listOfApplications() {
        return cy.get('app-multiboard-apps-list .container-scrollable');
    }

    get emptyListOfApps() {
        return cy.get('.table-row-empty');
    }

    get searchResult() {
        return this.listOfApplications.find('lib-row').eq(0);
    }

    get cancelBtn() {
        return cy.get(
            '[class="card-page-header"] [class="material-icons"]',
        );
    }

    get deleteBtnModal() {
        return cy.get('.modal-footer .btn-danger');
    }

    get searchField() {
        return cy.get('[placeholder="Search..."]');
    }

    get descriptionInputField() {
        return cy.get(
            'app-multiboard-apps-details [formcontrolname="description"]',
        );
    }

    deleteApplication(name: string) {
        cy.navigateToMultiboardAdmin();
        cy.wait(2000);
        
        this.deleteBtnFor(name);
        this.deleteBtnModal.click();
    }

    deleteBtnFor(name: string) {
        this.selectRow(name);
        cy.get("@applicationRow").find('[class="material-icons mi-26"]').click();
        cy.get('[class="dropdown"] [class="dropdown-item"]:nth-child(2)').click();
    }

    selectRow(name: string){
        cy.get('[class*="table-row"]')
        .contains(name)
        .parents('[class*="table-row"]')
        .as("applicationRow");
    }

    editBtnFor(name: string) {
            this.selectRow(name);
            cy.get("@applicationRow").find('[class="material-icons mi-26"]').click();
            cy.get('[class="dropdown"] [class="dropdown-item"]:nth-child(1)').click();
    }

    verifyThatUrlContainsAppId(alias: string) {
        cy.wait(alias)
            .then(response => {
                const { body } = response.response;
                const app = body.data;
                return app.id;
            })
            .then(appId => {
                cy.url().should('include', appId);
            });
    }

    deleteAppByAPI(id: string) {
        cy.task('getCookie').then(cookie => {
            cy.request({
                failOnStatusCode: false,
                method: 'DELETE',
                url:
                    Cypress.env('URL') + multiboardPath.endpoint.createNewApp + `/${id}`,
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    cookie: cookie,
                },
            });
        });
    }

    createAppByAPI(appName: string) {
        cy.request({
            method: 'POST',
            url: Cypress.env('URL') + multiboardPath.endpoint.createNewApp,
            body: {
                name: {
                    en: {
                        text: appName,
                        auto: false,
                    },
                },
                description: {},
                enabled: true,
                alias: '',
            },
        });
        cy.reload();
    }

    getAppsList() {
        cy.task('getCookie').then(cookie => {
            cy.request({
                failOnStatusCode: false,
                method: 'GET',
                url: Cypress.env('URL') + multiboardPath.endpoint.createNewApp,
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                    cookie: cookie,
                },
            }).then((data: any) => {
                expect(data.status).to.equal(200);
                cy.wrap(data.body.data).as('appsList');
            });
        });
    }

    deleteAppsList(appList, query = 'automatedApp_') {
        const filteredAppsList = appList.filter(apps => {

            let name: any = Object.values(apps.name)[0];//Taking the first available languag de or en
            return name.text.search(query) != -1;
        });

        filteredAppsList.forEach(app => {
            this.deleteAppByAPI(app.id);
        });
    }
}
