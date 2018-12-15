import './colors-set-theme';

export default [
    {
        header: 'Get product ID and PSDI by device ID'.help,
        content: `things get:product --device ${'<deviceId>'.input}`.code
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'device'.code,
                typeLabel: '-d'.code,
                description: 'Device ID'
            }
        ]
    },
    {
        header: 'Get device information by device ID and user ID'.help,
        content: `things get:device --device ${'<deviceId>'.input} --user ${'<userId>'.input}`.code
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'device'.code,
                typeLabel: '-d'.code,
                description: 'Device ID'
            },
            {
                name: 'user'.code,
                typeLabel: '-u'.code,
                description: 'User ID'
            }
        ]
    },
    {
        header: 'Get device information by product ID and user ID'.help,
        content: `things get:device --product ${'<product>'.input} --user ${'<userId>'.input}`.code
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'product'.code,
                typeLabel: '-p'.code,
                description: 'Product ID'
            },
            {
                name: 'user'.code,
                typeLabel: '-u'.code,
                description: 'User ID'
            }
        ]
    },
    {
        header: 'Get trial product information'.help,
        content: `things get:trial`.code
    }
];
