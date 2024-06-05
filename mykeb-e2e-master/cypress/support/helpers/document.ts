import { faker } from "@faker-js/faker";
import { merge } from "merge-anything";
import { Document } from "../types/document";

export default function generateRandomDocument(overrides = undefined) {
  const newDocument: Document = {
    type: faker.datatype.number().toString(),
    description: faker.lorem.paragraph(),
    documentLocation: "../../fixtures/documents/text.txt",
  };

  if (overrides != undefined) {
    return merge(newDocument, overrides);
  } else return newDocument;
}
