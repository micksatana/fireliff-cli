import { EOL } from 'os';
import './colors-set-theme';

export default [
  {
    header: 'Init LIFF project'.help,
    content:
      'Initialize project structure' +
      EOL +
      EOL +
      'fliff init'.code +
      EOL +
      EOL +
      `This command should be run first time under Firebase project root folder which containing ${
        'firebase.json'.code
      }` +
      EOL +
      EOL +
      'After run successfully, you will get a web-views LIFF project folder. This sub-project is a boilerplate with Parcel Bundler. You can change directory into web-views and run npm run dev to start LIFF App development.',
  },
];
