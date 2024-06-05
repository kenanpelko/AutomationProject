## 📝 Table of Contents

- [Quick start](#quick)
- [About](#about)
- [Tech](#tech)
- [Run the tests](#tests)
- [Reports](#reports)
- [Authors](#authors)

## 💨 Quick start <a name = "quick"></a>

Cypress requires Node.js v14.x or higher in order to run.

```
$ git clone https://gitlab.elunic.software/tarik.pelko/mykeb-e2e.git
$ npm install
$ npm TEST
```

## 🧐 About <a name = "about"></a>

Cypress E2E tests are written as automation tests for KEB made by the Elunic team.

## 🏁 Tech <a name = "tech"></a>

Automation E2E tests uses a few npm packages to work properly

- [Cypress](https://www.cypress.io/) - Framework
- [Typescript](https://www.typescriptlang.org/) - Programming language
- [QASE-Reporting](https://github.com/qase-tms/qase-javascript/tree/master/qase-cypress) - Reporting tool

## Run the tests <a name = "tests"></a>

In order to start test run please use the following command:

```
npm run test
```

This command will execute all Cypress tests and push test results to the QASE.io

For debugging and coding new tests please use the Cypress dashboard which can be opened by running the following command:

```
npm run open:dashboard

```

If you want to excute tests in other browser then you need to add flag --browser with desired browser name. For example:

```
npm test -- --browser=firefox
```

## ✍️ Reports <a name = "reports"></a>

For reporting, we are using the QASE.io web application. Once the test run is completed all results will be pushed to the KEB repository in the QASE.io web application. If there is a need to combine automation and manual test cases then before the automation test run please specify the ID of the desired test run using the environment variable QASE_RUN_ID. Also, the test run name can be set using the QASE_RUN_NAME env variable.

QASE configuration can be found in the cypress.config.ts file:

```
 reporterOptions: {
            "apiToken": process.env.QASE_TOKEN,
            "projectCode": 'KEB',
            "logging": true,
            "runComplete": true
        },
```

## Authors <a name = "authors"></a>

Elunic QA team
