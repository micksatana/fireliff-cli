import './colors-set-theme';

export default [
  {
    header: 'Create trial product information'.help,
    content: `things create:trial --liff ${'<liffId>'.input} --product ${
      '<productName>'.input
    }`.code,
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'liff'.code,
        typeLabel: '-l'.code,
        description: 'LIFF ID',
      },
      {
        name: 'name'.code,
        typeLabel: '-n'.code,
        description: 'Product name',
      },
    ],
  },
];
