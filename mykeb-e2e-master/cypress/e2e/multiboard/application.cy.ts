import { faker } from '@faker-js/faker';
import { qase } from 'cypress-qase-reporter/dist/mocha';
import multiboardPath from '../../support/constant/multiboard-admin';
import Application from '../../page-object/multiboard/application.po';
import Board from '../../page-object/multiboard/board.po';

const application = new Application();
const board = new Board();
let appName: any;

describe('Application actions', () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.navigateToMultiboardAdmin();
  });

  qase(
    224,
    it('Verify that user is able to create new application', () => {
      appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createNewBtn.click();
      application.nameInputField.type(appName);
      cy.intercept('POST', multiboardPath.endpoint.createNewApp).as(
        'app-created',
      );
      application.createBtn.click();
      application.verifyThatUrlContainsAppId('@app-created');
      board.boardsPanel.should('exist');
    }),
  );

  qase(
    225,
    it('Verify that created application appears in list of applications', () => {
      appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      application.listOfApplications.should('contain', appName);
    }),
  );

  qase(
    240,
    it('Verify that user is able to find application by full name using search', () => {
      appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      application.searchField.type(appName);
      application.searchResult.should('contain', appName);
      application.emptyListOfApps.should('not.exist');
    }),
  );

  qase(
    241,
    it('Verify that user is able to find application by part of name using search', () => {
      appName = `automatedApp_${faker.datatype.number().toString()}`;
      const partAppName = appName.split('automatedApp_').join('');
      application.createAppByAPI(appName);
      application.searchField.type(partAppName);
      application.searchResult.should('contain', appName);
      application.emptyListOfApps.should('not.exist');
    }),
  );

  afterEach(() => {
    application.getAppsList();
    cy.get('@appsList').then((list: any) => {
      application.deleteAppsList(list);
    });
  });
});

describe('Edited apps', () => {
  appName = faker.lorem.words(2);
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.navigateToMultiboardAdmin();
  });

  qase(
    227,
    it('Verify that user is able to Edit application by click on "Edit" icon', () => {
      application.createAppByAPI(appName);
      application.listOfApplications.should('contain', appName);
      application.editBtnFor(appName);
      application.nameInputField
        .click()
        .clear()
        .type(appName + 123);
      application.descriptionInputField.type(appName + 46);
      application.createBtn.click();
      cy.wait(1000);
      cy.navigateToMultiboardAdmin();
      application.listOfApplications
        .should('contain', appName + 123)
        .and('contain', appName + 46);
    }),
  );

  qase(
    234,
    it('Verify that user is able to Edit application by click on it', () => {
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      application.nameInputField
        .click()
        .clear()
        .type(appName + 123);
      application.descriptionInputField.type(appName + 46);
      application.createBtn.click();
      cy.wait(1000);
      cy.navigateToMultiboardAdmin();
      application.listOfApplications
        .should('contain', appName + 123)
        .and('contain', appName + 46);
    }),
  );

});

describe('Application elements', () => {
  appName = faker.lorem.words(2);
  before(() => {
    cy.navigateToBaseURL(Cypress.env('URL'));
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.navigateToMultiboardAdmin();
  });

  qase(
    223,
    it('Verify that user directed on "app/new" page by click on "Create new" button', () => {
      application.createNewBtn.click();
      cy.verifyURLContains('app/new');
      application.newApplicationPanelBody.should('be.visible');
    }),
  );

  qase(
    226,
    it('Verify that user is able to delete application by click on "Delete" icon', () => {
      application.createAppByAPI(appName);
      application.listOfApplications.should('contain', appName);
      application.deleteBtnFor(appName);
      application.deleteBtnModal.click();
      cy.navigateToMultiboardAdmin();
      cy.reload();
      application.listOfApplications.should('not.contain', appName);
    }),
  );

  qase(
    233,
    it('Verify that user is able to return on "Applications overview" page by click "back arrow" button', () => {
      application.createNewBtn.click();
      cy.verifyURLContains('app/new');
      application.cancelBtn.click();
      cy.verifyURLContains(multiboardPath.path.multiboardAdmin);
    }),
  );

  qase(
    239,
    it('Verify that empty "name" field leads to validation', () => {
      application.createNewBtn.click();
      cy.verifyURLContains('app/new');
      application.nameInputField.should('be.empty');
      application.createBtn.click();
      cy.fixture('i18n/multiboard/en').then(text => {
        application.nameInputFieldValidation.should("contain.text",text.multiboard.appNameEmpty);
      });
    }),
  );
});
