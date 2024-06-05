import { faker } from "@faker-js/faker";
import { qase } from "cypress-qase-reporter/dist/mocha";
import ConfirmationModal from "../../page-object/asset-managment/component/modal-confirmation.po";
import Application from "../../page-object/multiboard/application.po";
import Board from "../../page-object/multiboard/board.po";

const application = new Application();
const board = new Board();
const confirmationModal = new ConfirmationModal();

describe("CRUD operations for board", () => {
  const boardName = faker.lorem.words(2);
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.navigateToMultiboardAdmin();
  });

  qase(
    228,
    it('Verify that user is able to create Board by click "Create New" button', () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      board.boardNameInput.type(boardName);
      board.saveBoardBtn.click();
      cy.wait(2000);
      cy.navigateToMultiboardAdmin();
      cy.wait(2000);
      cy.contains(appName).click();
      board.boardsPanel.should("contain", boardName);
    })
  );

  qase(
    229,
    it('Verify that user directed on "Create new board" page by click "Create New" button', () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      cy.verifyURLContains("/board/new");
    })
  );

  qase(
    231,
    xit('Verify that user is able to delete board by click "Delete" icon', () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      board.boardNameInput.type(boardName);
      board.saveBoardBtn.click();
      cy.wait(2000);
      cy.navigateToMultiboardAdmin();
      cy.wait(2000);
      cy.contains(appName).click();
      cy.wait(2000);
      cy.contains(boardName).click();
      board.deleteBoardBtn.click();
      board.confirmDeleteBoard.click();
      cy.contains(boardName).should("not.exist");
    })
  );

  qase(
    232,
    it('Verify that user is able to edit created board by click "Edit" icon', () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      board.boardNameInput.type(boardName);
      board.saveBoardBtn.click();
      cy.wait(2000);
      cy.navigateToMultiboardAdmin();
      cy.wait(2000);
      cy.contains(appName).click();
      cy.wait(2000);
      cy.contains(boardName).click();
      board.boardNameInput
        .click()
        .clear()
        .type(boardName + 123);
      board.saveBoardBtn.click();
      board.boardsPanel.should("contain", boardName + 123);
    })
  );

  qase(
    235,
    xit('Verify that user is able to add mountpoint by click "Add mountpoint" button', () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      board.boardNameInput.type(boardName);
      board.saveBoardBtn.click();
      cy.wait(2000);
      cy.contains(boardName).click();
      board.addMountpointBtn.click();
      board.mountpoint.should("exist").and("be.visible");
    })
  );

  qase(
    236,
    xit('Verify that user is able to delete mountpoint by click "Delete" icon', () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      board.boardNameInput.type(boardName);
      board.saveBoardBtn.click();
      cy.wait(2000);
      cy.navigateToMultiboardAdmin();
      cy.contains(appName).click();
      board.editBoardBtn.click();
      board.addMountpointBtn.click();
      board.mountpoint.should("exist").and("be.visible");
      board.deleteMountpointBtn.click();
      board.mountpoint.should("not.exist");
    })
  );

  qase(
    237,
    it('Verify that created board appears in "Boards" list', () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      board.boardNameInput.type(boardName);
      board.saveBoardBtn.click();
      cy.wait(2000);
      board.boardsPanel.should("contain", boardName);
    })
  );

  qase(
    238,
    it('Verify that user is able to return on "Application Details" page by click "Cancel" button on "Create new board" section', () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      cy.verifyURLContains("/board/new");
      board.cancelBtn.click();
      cy.url().should("not.contain", "/board/new");
    })
  );

  afterEach(() => {
    application.getAppsList();
    cy.get("@appsList").then((list: any) => {
      application.deleteAppsList(list);
    });
  });
});

describe("Board elements", () => {
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.navigateToMultiboardAdmin();
  });

  qase(
    242,
    it("Verify that empty board name leads to validation", () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      board.boardNameInput.should("be.empty");
      board.saveBoardBtn.click();
      cy.fixture("i18n/multiboard/en").then((text) => {
        cy.verifyToasterMessage(text.multiboard.boardNameRequired);
      });
    })
  );

  qase(
    243,
    it('Verify that "Add new tile" modal is opening by click on "Add tile" button', () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      board.tilesTab.click();
      board.addTileBtn.click();
      board.tileStoreModal.should("exist").and("be.visible");
    })
  );

  qase(
    244,
    it('Verify that user is able to close "Add new tile" modal by click on "X" icon', () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      board.tilesTab.click();
      board.addTileBtn.click();
      board.tileStoreModal.should("exist").and("be.visible");

      confirmationModal.xButton.click();
      board.tileStoreModal.should("not.exist");
    })
  );

  qase(
    245,
    it('Verify that user is able to close "Add new tile" modal by click on "Close" button', () => {
      const appName = `automatedApp_${faker.datatype.number().toString()}`;
      application.createAppByAPI(appName);
      cy.contains(appName).click();
      board.createNewBoardBtn.click();
      board.tilesTab.click();
      board.addTileBtn.click();
      board.tileStoreModal.should("exist").and("be.visible");

      confirmationModal.cancelButton.click();
      board.tileStoreModal.should("not.exist");
    })
  );

  afterEach(() => {
    application.getAppsList();
    cy.get("@appsList").then((list: any) => {
      application.deleteAppsList(list);
    });
  });
});
