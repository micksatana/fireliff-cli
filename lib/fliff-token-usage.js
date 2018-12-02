import { EOL } from 'os';
import './colors-set-theme';

export default [
    {
        header: 'Issue/Revoke access token '.help,
        content: `After channel ID and secret are configured. Issue a channel access token and save it.` + EOL + EOL +
            `fliff token --issue --save`.code + EOL + EOL +
            `In case you want to revoke an access token, you can run with --revoke option.` + EOL + EOL +
            `fliff token --revoke`.code
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'issue'.code,
                description: 'Issue a channel access token from pre-configured channel ID and secret'
            },
            {
                name: 'save'.code,
                description: 'Apply along with --issue option, the new access token will be replace in Functions configuration.'
            },
            {
                name: 'revoke'.code,
                typeLabel: '{underline accessToken}'.input,
                description: 'Revoke a channel access token.'
            }
        ]
    }
];
