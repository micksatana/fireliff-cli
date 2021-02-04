import { EOL } from 'os';
import './colors-set-theme';

export default [
  {
    header: 'Update LIFF view'.help,
    content:
      `Update using LIFF ID` +
      EOL +
      EOL +
      `fliff update --id ${'<liffId>'.input} --type ${
        '<viewType>'.input
      } --url ${'<viewUrl>'.input}`.code +
      EOL +
      EOL +
      `Update using LIFF name` +
      EOL +
      EOL +
      `fliff update --name ${'<viewName>'.input} --type ${
        '<viewType>'.input
      } --url ${'<viewUrl>'.input}`.code +
      EOL +
      EOL +
      `To update Bluetooth® Low Energy (BLE) flag` +
      EOL +
      EOL +
      `fliff update --id ${'<liffId>'.input} --ble ${'<true|false>'.input}`
        .code,
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'id'.code,
        typeLabel: '{underline liffId}'.input,
        description: 'Target LIFF ID',
      },
      {
        name: 'name'.code,
        typeLabel: '{underline viewName}'.input,
        description: 'Target view name',
      },
      {
        name: 'url'.code,
        typeLabel: '{underline viewUrl}'.input,
        description: 'View URL to be updated',
      },
      {
        name: 'type'.code,
        typeLabel: '{underline viewType}'.input,
        description: 'View type to be updated',
      },
      {
        name: 'ble'.code,
        typeLabel: '{underline BLE}'.input,
        description: 'Bluetooth® Low Energy (BLE)',
      },
    ],
  },
];
