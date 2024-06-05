// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands/commands";
import "./commands/navigation";
import "./navigation";
import "./commands/validation";
import "./commands/assertions";

// Request
import "./commands/request/document";
import "./commands/request/asset";

import "cypress-v10-preserve-cookie";

// Alternatively you can use CommonJS syntax:
// require('./commands')
