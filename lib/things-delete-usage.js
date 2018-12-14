import './colors-set-theme';

export default [
    {
        header: 'Delete trial product information'.help,
        content: `things delete:trial --id ${'<productId>'.input}`.code
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'id'.code,
                description: 'Product ID'
            }
        ]
    }
];
