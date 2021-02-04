import './colors-set-theme';

export default [
  {
    header: 'Delete trial product information'.help,
    content: `things delete:trial --product ${'<productId>'.input}`.code,
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'product'.code,
        typeLabel: '-p'.code,
        description: 'Product ID',
      },
    ],
  },
];
