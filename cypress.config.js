const { defineConfig } = require("cypress");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
module.exports = defineConfig({
  projectId: "fvxo5k",
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
    },
  },
  experimentalWebKitSupport: true,
  projectId: "eaw8oh",
  env:{
    allureAddAnalyticLabels:true
  }
});
