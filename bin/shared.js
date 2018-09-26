"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValidatedConfig = getValidatedConfig;

var _functionsConfig = require("./functions-config");

async function getValidatedConfig() {
  try {
    console.log('Get Firebase Functions configuration'.verbose);
    let config = await _functionsConfig.FunctionsConfig.get();

    if (!config.line || !config.line.access_token) {
      console.log('Functions configuration not found: line.access_token'.help);
      console.log('Find your LINE channel access token and use with the following command'.help);
      console.log(`${'firebase functions:config:set line.access_token='.code}${'<channelAccessToken>'.prompt}`);
      process.exit(1);
    }

    return config;
  } catch (error) {
    console.log('Failed to get configuration'.error);
    console.log('Suggestions:'.info);
    console.log(`Run ${'firebase init'.code} to start a project directory in the current folder.`.verbose);
    console.log(`Run ${'firebase use --add'.code} to set active project.`.verbose);
    process.exit(1);
  }
}

;
//# sourceMappingURL=shared.js.map