import { EOL } from 'os';
import './colors-set-theme';

export default [
    {
        header: 'Delete LIFF view'.help,
        content: `Delete using LIFF ID` + EOL + EOL +
            `fliff delete --id ${'<liffId>'.input}`.code + EOL + EOL +
            `Update using LIFF name` + EOL + EOL +
            `fliff delete --name ${'<viewName>'.input}`.code
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'id'.code,
                typeLabel: '{underline liffId}'.input,
                description: 'Target LIFF ID'
            },
            {
                name: 'name'.code,
                typeLabel: '{underline viewName}'.input,
                description: 'Target view name'
            }
        ]
    }
];
