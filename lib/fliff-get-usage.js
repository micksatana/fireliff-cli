import { EOL } from 'os';
import './colors-set-theme';

export default [
  {
    header: 'Get LIFF view'.help,
    content:
      `List LIFF apps` +
      EOL +
      EOL +
      `fliff get`.code +
      EOL +
      EOL +
      `List LIFF apps with description and Bluetooth® Low Energy (BLE) flag` +
      EOL +
      EOL +
      `fliff get --detail`.code,
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'detail'.code,
        description:
          'Apply this option will display description and Bluetooth® Low Energy (BLE) flag',
      },
    ],
  },
];
