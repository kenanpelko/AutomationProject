import tenantPath from "../../../support/constant/tenant-settings";
import { Tenant } from "../../types/tenant";
const baseUrl = Cypress.config().baseUrl;

export default class TenantAPI {
  addTenant(tenant: Tenant) {
    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: false,
        method: "POST",
        url: `${baseUrl}${tenantPath.endpoint.tenant}`,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          cookie: cookie,
        },
        body: {
          name: tenant.name,
        },
      }).then((data: any) => {
        expect(data.status).to.equal(201);
        cy.task("setTenant", data.body.data); //Tenant response
      });
    });
  }

  getTenantList() {
    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: false,
        method: "GET",
        url: `${baseUrl}${tenantPath.endpoint.tenantTree}`,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          cookie: cookie,
        },
      }).then((data: any) => {
        expect(data.status).to.equal(200);
        cy.task("setTenantList", data.body.data); //Tenant tree response data
      });
    });
  }

  deleteTenantList(tenantList, query = "automated_tenant") {
    const filteredTenantList = tenantList.filter((tenant) => {
      return tenant.name.search(query) != -1;
    });

    filteredTenantList.forEach((tenant) => {
      this.deleteTenant(tenant.id);
    });
  }

  deleteTenant(id: string) {
    cy.task("getCookie").then((cookie) => {
      cy.request({
        failOnStatusCode: false,
        method: "DELETE",
        url: `${baseUrl}${tenantPath.endpoint.tenant}/${id}`,
        headers: {
          "content-type": "application/json;charset=UTF-8",
          cookie: cookie,
        },
      });
    });
  }
}
