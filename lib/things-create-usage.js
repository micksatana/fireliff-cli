import './colors-set-theme';

export default [
    {
        header: 'Create trial product information'.help,
        content: `things create:trial --liff ${'<liffId>'.input} --product ${'<productName>'.input}`.code
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'liff'.code,
                description: 'LIFF ID'
            },
            {
                name: 'product'.code,
                typeLabel: '-p'.code,
                description: 'Product name'
            }
        ]
    }
];
