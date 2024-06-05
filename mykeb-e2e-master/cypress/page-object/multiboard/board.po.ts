export default class Board {
    get boardsPanel() {
      return cy.get('app-multiboard-apps-details app-board-table');
    }
  
    get createNewBoardBtn() {
      return cy.get('[class*="btn btn-outline-primary"]');
    }
  
    get boardNameInput() {
      return cy.get('[formcontrolname="name"]').find('input');
    }
    
    get boardNameError() {
      return cy.get('[for="name"]').parent().find('[class="text-danger"]')
    }
    get saveBoardBtn() {
      return cy.get('[class="d-flex"] [type="submit"]');
    }
  
    get backBtn() {
      return cy.get('.panel-header .btn-transparent');
    }
  
    get cancelBtn() {
      return cy.get('.panel-header .btn-link');
    }
  
    get deleteBoardBtn() {
      return this.boardsPanel.find('.btn-outline-danger');
    }
  
    get confirmDeleteBoard() {
      return cy.get('.btn-danger');
    }
  
    get editBoardBtn() {
      return cy.get('.content-scroll .btn-outline-primary');
    }
  
    get addMountpointBtn() {
      return cy.get('.panel-body .btn-outline-primary');
    }
  
    get mountpoint() {
      return cy.get('app-multiboard-board-mount-option');
    }
  
    get deleteMountpointBtn() {
      return this.mountpoint.find('.btn-outline-danger');
    }
  
    get tilesTab() {
      return cy.get('[class*="tabs"] [class*="tab"]').eq(1);
    }
  
    get addTileBtn() {
      return cy.get('app-tile-view-layout .multiboard-admin-ctrls button');
    }
  
    get tileStoreModal() {
      return cy.get('app-multiboard-tilestore-dialog');
    }

    get assetLinkTrashIcon(){
      return cy.get('[formarrayname="mounts"] [class="material-icons"]');
    }
  
    boardCounterFor(name: string) {
      return cy.contains(name).next().next().next();
    }
  }
  