import { FunctionsConfig } from './functions-config';

export async function getConfig() {
  try {
    console.log('Get Firebase Functions configuration'.verbose);
    let config = await FunctionsConfig.reload();
    return config;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export function validateConfig(config) {
  if (!config.line || !config.line.access_token) {
    console.log('Functions configuration not found: line.access_token'.help);
    console.log(
      'Find your LINE channel access token and use with the following command'
        .help
    );
    console.log(
      `${'firebase functions:config:set line.access_token='.code}${
        '<channelAccessToken>'.prompt
      }`
    );
    process.exit(1);
  }
  return;
}

export function commandErrorHandler(error) {
  switch (error.name) {
    case 'UNKNOWN_OPTION':
      console.log(`Unknown option ${error.optionName.input}`.error);
      process.exit(1);
      break;
    default:
      console.log(error.toString().error);
      process.exit(1);
  }
}
