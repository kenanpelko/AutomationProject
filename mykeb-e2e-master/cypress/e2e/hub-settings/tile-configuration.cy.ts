import "cypress-v10-preserve-cookie";
import { qase } from "cypress-qase-reporter/dist/mocha";
import generateRandomTile from "../../support/helpers/tile";
import TileConfiguration from "../../page-object/hub-settings/tile-configuration.po";
import TileAPI from "../../support/api/hub-settings/tile-configuration";
import generalSettingsPath from "../../support/constant/general-settings";

const localization = require(`../../fixtures/i18n/hub-settings/en.json`);
const tileConfiguration = new TileConfiguration();
const tileAPI = new TileAPI();

const defaultTileId = -1;
const image1Url = "./../fixtures/images/cat.jpg";

describe("Working with tile configuration inside of the hub settings", () => {
  beforeEach(() => {
    cy.clearStorage();
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToHubSettings();
    tileConfiguration.navigateToTileConfiguration();
  });

  qase(
    378,
    it('Verify that user is able to save created tile by click on "Save changes" button', () => {
      const tile = generateRandomTile();

      tileConfiguration.addTileButton.click();
      tileConfiguration.updateTileDetails(tile);
      tileConfiguration.saveChanges();
      cy.reload();
      tileConfiguration.navigateToTileConfiguration();
      tileConfiguration.verifyTileDetails(tile);
    })
  );

  qase(
    380,
    it('Verify that user is able to delete created tile by click on "Delete" button', () => {
      const tile = generateRandomTile();
      tileAPI.addTile(tile);

      cy.reload();
      tileConfiguration.navigateToTileConfiguration();
      tileConfiguration.verifyTileDetails(tile);
      tileConfiguration.deleteTile();
      tileConfiguration.tileTitle.contains(tile.tileName).should("not.exist");
    })
  );

  qase(
    387,
    it("Verify that default 'Tile color' of new tile is set on white '#ffffff'", () => {
      tileConfiguration.addTileButton.click();
      tileConfiguration.tileColorInput.eq(-1).should("have.value", "#ffffff");
    })
  );

  qase(
    388,
    it("Verify that default 'Tile text color' of new tile is set on black '#000000'", () => {
      tileConfiguration.addTileButton.click();
      tileConfiguration.tileTextColor.eq(-1).should("have.value", "#000000");
    })
  );

  qase(
    379,
    it("Verify that user is able to leave 'Hub settings' page by click on 'Cancel' button", () => {
      cy.verifyURLContains(generalSettingsPath.path.hubSettings);
      tileConfiguration.cancelButton.click();
      cy.url().should("not.include", generalSettingsPath.path.hubSettings);
      cy.verifyURLContains(generalSettingsPath.path.hubHome);
    })
  );
});

describe("Tile validation", () => {
  beforeEach(() => {
    cy.clearStorage();
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToHubSettings();
    tileConfiguration.navigateToTileConfiguration();
  });
  qase(
    385,
    it("Verify that empty 'Tile name' field leads to the validation", () => {
      tileConfiguration.tileNameErrorField.should("not.exist");
      tileConfiguration.tileNameInput.eq(defaultTileId).clear();
      tileConfiguration.tileNameErrorField.should("exist");
    })
  );

  qase(
    386,
    it("Verify that empty 'App url' field leads to the validation", () => {
      tileConfiguration.appUrlErrorField.should("not.exist");
      tileConfiguration.appUrlInput.eq(defaultTileId).clear();
      tileConfiguration.appUrlErrorField.should("exist");
    })
  );

  qase(
    395,
    it("Verify that empty 'Tile color' field leads to the validation", () => {
      tileConfiguration.tileColorErrorField.should("not.exist");
      tileConfiguration.tileColorInput.eq(defaultTileId).clear();
      tileConfiguration.tileColorErrorField.should("exist");
    })
  );

  qase(
    396,
    it("Verify that empty 'Tile text color' field leads to the validation", () => {
      tileConfiguration.tileColorErrorField.should("not.exist");
      tileConfiguration.tileColorInput.eq(defaultTileId).clear();
      tileConfiguration.tileColorErrorField.should("exist");
    })
  );
});

describe("Editing the tile settings", () => {
  const tile = generateRandomTile();
  const tileIndex = -1;
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    tileAPI.addTile(tile);
    cy.logout();
  });

  beforeEach(() => {
    cy.clearStorage();
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToHubSettings();
    tileConfiguration.navigateToTileConfiguration();
  });

  qase(
    393,
    it('Verify that "Description" text visible on tile under tile name', () => {
      tileConfiguration.tileDescription.eq(tileIndex).should("contain.text", tile.desc);
    })
  );

  qase(
    384,
    it("Verify that entered 'Tile name' displays on tile icon", () => {
      tileConfiguration.tileTitle.eq(tileIndex).should("contain.text", tile.tileName);
    })
  );

  qase(
    394,
    it('Verify that user is able to hide tile by click "Eye" icon', () => {
      tileConfiguration.cancelButton.click();
      tileConfiguration.verifyHomeCardExists(tile.tileName);
      tileConfiguration.verifyHomeCardUrlIsCorrect(tile.tileName, tile.appUrl);
    })
  );

  qase(
    403,
    it('Verify that created tile appears in "Choose an app:" menu', () => {
      tileConfiguration.visibilityControlImage.eq(tileIndex).click();
      tileConfiguration.visibilityControlImage.eq(tileIndex).should("contain.text", "visibility_off");
      tileConfiguration.saveChanges();

      tileConfiguration.cancelButton.click();
      tileConfiguration.verifyHomeCardDoesntExists(tile.tileName);
    })
  );

  qase(
    377,
    it("Verify that user is able to add new tile", () => {
      tileConfiguration.getAllTiles();
      cy.get("@tileList").then((originalTiles: any) => {
        cy.wait(2500);
        tileConfiguration.addTileButton.click();
        tileConfiguration.getAllTiles();

        //Veryfing that new tile is added
        cy.get("@tileList").then((newTiles: any) => {
          expect(originalTiles.length + 1).to.equal(newTiles.length);
        });
      });
    })
  );

  qase(
    397,
    it('Verify that "Integrated view" can be selected by click on checkbox', () => {
      const newTile = { integratedView: true };

      tileConfiguration.updateTileDetails(newTile);
      tileConfiguration.saveChanges();
      cy.reload();
      tileConfiguration.navigateToTileConfiguration();
      tileConfiguration.verifyTileDetails(newTile);
    })
  );
});

describe("Working with tile ordering", () => {
  beforeEach(() => {
    cy.clearStorage();
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToHubSettings();
    tileConfiguration.navigateToTileConfiguration();
  });

  qase(
    382,
    it("Verify that first tile doesn't have 'Up arrow' button", () => {
      tileConfiguration.arrowUpImage.eq(0).should("not.be.visible");
    })
  );

  qase(
    383,
    it("Verify that last tile doesn't have 'Down arrow' button", () => {
      tileConfiguration.arrowDownImage.eq(-1).should("not.be.visible");
    })
  );

  qase(
    381,
    it("Verify that user is able to move tile by click 'up arrow' button", () => {
      tileConfiguration.getAllTiles();
      cy.get("@tileList").then((originalTiles: any) => {
        //Swapping array elements - new ordering is required after clicking on the arrow
        const tmp: string = originalTiles[0];
        originalTiles[0] = originalTiles[1];
        originalTiles[1] = tmp;

        cy.wait(2500);
        tileConfiguration.arrowUpImage.eq(1).click();
        tileConfiguration.saveChanges();
        cy.reload();
        tileConfiguration.navigateToTileConfiguration();
        tileConfiguration.getAllTiles();

        //Veryfing that tiles are re-ordered
        cy.get("@tileList").then((newTiles: any) => {
          expect(originalTiles.length).to.equal(newTiles.length);
          originalTiles.forEach((ele, index) => {
            expect(ele).to.equal(newTiles[index]);
          });
        });
      });
    })
  );

  qase(
    404,
    it("Verify that user is able to move tile by click 'down arrow' button", () => {
      tileConfiguration.getAllTiles();
      cy.get("@tileList").then((originalTiles: any) => {
        //Swapping array elements - new ordering is required after clicking on the arrow
        const tmp: string = originalTiles[0];
        originalTiles[0] = originalTiles[1];
        originalTiles[1] = tmp;

        cy.wait(2500);
        tileConfiguration.arrowDownImage.eq(0).click();
        tileConfiguration.saveChanges();
        cy.reload();
        tileConfiguration.navigateToTileConfiguration();
        tileConfiguration.getAllTiles();

        //Veryfing that tiles are re-ordered
        cy.get("@tileList").then((newTiles: any) => {
          expect(originalTiles.length).to.equal(newTiles.length);
          originalTiles.forEach((ele, index) => {
            expect(ele).to.equal(newTiles[index]);
          });
        });
      });
    })
  );
});

describe("File management", () => {
  const tile = generateRandomTile();
  const tileIndex = -1;
  before(() => {
    cy.navigateToBaseURL(Cypress.env("URL"));
    tileAPI.addTile(tile);
    cy.logout();
  });

  beforeEach(() => {
    cy.clearStorage();
    cy.navigateToBaseURL(Cypress.env("URL"));
    cy.navigateToHubSettings();
    tileConfiguration.navigateToTileConfiguration();
  });

  qase(
    391,
    it('Verify that user is able to upload tile picture by click on "Upload file" button', () => {
      tileConfiguration.uploadImage(image1Url);
      tileConfiguration.saveChanges();
      tileConfiguration.tileUploadFileButton.eq(tileIndex).should("contain.text", localization.buttons.deleteFile);
      cy.reload();

      cy.get("@imageUrl").then((imageUrl) => {
        tileConfiguration.verifyImageExistsOnHomeCard(imageUrl);
        tileConfiguration.navigateToTileConfiguration();
        tileConfiguration.verifyImageExists(imageUrl);
      });
    })
  );

  qase(
    392,
    it('Verify that user is able to delete tile picture by click on "Delete file" button', () => {
      tileConfiguration.uploadImage(image1Url);
      tileConfiguration.saveChanges();

      tileConfiguration.tileUploadFileButton.eq(tileIndex).click(); //Same Id exists for both delete and upload buttons
      tileConfiguration.saveChanges();

      cy.reload();
      tileConfiguration.navigateToTileConfiguration();
      tileConfiguration.verifyImageDoesntExist();
      tileConfiguration.tileUploadFileButton.eq(tileIndex).should("contain.text", localization.buttons.uploadFile);
    })
  );
});

after(() => {
  tileAPI.getTileList();
  cy.get("@tileList").then((list: any) => {
    tileAPI.deleteTileList(list);
  });
});
