import { faker } from "@faker-js/faker";
import { merge } from "merge-anything";
import { Tenant } from "../types/tenant";

export default function generateRandomTenant(overrides = undefined) {
  const newTenant: Tenant = {
    name: `automated_tenant - ${faker.datatype.number().toString()}`,
  };
  if (overrides != undefined) {
    return merge(newTenant, overrides);
  } else return newTenant;
}
