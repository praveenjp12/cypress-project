const { defineConfig } = require("cypress");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
import { configureAllureAdapterPlugins } from '@mmisty/cypress-allure-adapter/plugins';
module.exports = defineConfig({
  screenshotsFolder: 'cypress/screenshots',
  allureResultsPath: 'allure-results',
  screenshotOnRunFailure: true,
  videoUploadOnPasses: false,
  animationDistanceThreshold: 5,
  downloadsFolder: 'cypress/downloads',
  responseTimeout: 30000,
  testingType: 'e2e',
  trashAssetsBeforeRuns: false,
  videoCompression: 15,
  videosFolder: 'cypress/videos',
  watchForFileChanges: true,
  modifyObstructiveCode: false,
  video: true,
  record: false,
  e2e: {
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      const reporter = configureAllureAdapterPlugins(on, config);
         
      // after that you can use allure to make operations on cypress start,
      // or on before run start
      on('before:run', details => {
         reporter?.writeEnvironmentInfo({
            info: {
               Browser: Cypress.browser.name ,
               TEST_TAGS: Cypress.env('TEST_TAGS'),
               TEST_STAGE: Cypress.env('TEST_STAGE'),
            },
         });
      });
      // implement node event listeners here
    },
  },
  experimentalWebKitSupport: true,
  projectId: "eaw8oh",
  env:{
    allureAddAnalyticLabels: true
  }
});