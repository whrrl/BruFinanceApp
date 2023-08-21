export const environment = {
  production: false,
  // baseURL: 'http://localhost:5056',
  baseURL: 'https://betabackend.bru.finance',
  supportedNetwork: [137, 80001, 59140],
  InfuraKey: 'b75ffec8191348e8a87319d4dfcd74da',
  contracts: {
    80001: {
      InfuraUrl:
        'https://polygon-mumbai.infura.io/v3/b75ffec8191348e8a87319d4dfcd74da',
      InfuraName: 'maticmum',
      name: 'Polygon Mumbai Testnet',
      explorerUrl: "https://mumbai.polygonscan.com/tx/",
      tokens: {
        USDT: {
          name: 'USDT',
          address: '0x4D644C68B4bbaE2795A91E768E69FDdef346FA40',
          decimal: 18
        },
        USDC: {
          name: 'USDC',
          address: '0x6660E482CD59E6a86bAf7807D0ad8f03c38224d5',
          decimal: 18
        },
      },
      TokenAddress: '0x4D644C68B4bbaE2795A91E768E69FDdef346FA40',
      USDCTokenAddress: '0x6660E482CD59E6a86bAf7807D0ad8f03c38224d5',
      factoryAddress: '0x39eFbB935301929b721DE4477538d5d91be548Dd',
      RouterAddress: '0xdB853019Ad6a35bADb30B1Bd94E716725ba06CDb',
      PoolAddress: '0xe31c23cF66EaB6d11097d694cD8011a057c58416',
    },
    137: {
      InfuraUrl:
        'https://polygon-mainnet.infura.io/v3/b75ffec8191348e8a87319d4dfcd74da',
      InfuraName: 'matic',
      name: 'Polygon Mainnet',
      explorerUrl: "https://polygonscan.com/tx/",
      tokens: {
        USDT: {
          name: 'USDT',
          address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimal: 6
        },
        USDC: {
          name: 'USDC',
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimal: 6
        },
      },
      TokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      USDCTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      factoryAddress: '0xED79b078dFeF6618A1eA456720Fa4CD3c4E43209',
      RouterAddress: '0xe8BF2801a3e457FE141407a3b39F47fDE83B376f',
      PoolAddress: '0xc345e8f86E7EFbCB2cC4302b2dE116E4EBB727bA',
    },
    59140: {
      InfuraUrl:
        'https://linea-goerli.infura.io/v3/b75ffec8191348e8a87319d4dfcd74da',
      InfuraName: 'linea-goerli',
      name: 'Linea Goerli Testnet',
      explorerUrl: "https://explorer.goerli.linea.build/tx/",
      tokens: {
        USDT: {
          name: 'USDT',
          address: '0xF16007DE4145ec6152e4c8c467A984b647fd8908',
          decimal: 18
        },
        USDC: {
          name: 'USDC',
          address: '0x956EaD2636dfD58D7215E6A415eD4e3E21430fDd',
          decimal: 18
        },
      },
      TokenAddress: '0xF16007DE4145ec6152e4c8c467A984b647fd8908',
      USDCTokenAddress: '0x956EaD2636dfD58D7215E6A415eD4e3E21430fDd',
      factoryAddress: '0x4756516A799Efde91B8A09845547F1dD17Bcf4D0',
      RouterAddress: '0x34c4388EB6e5a856eE22a5A612f8fbffD6d70e78',
      PoolAddress: '0x61154B0C73717DF854B20a56a53BdBfa3B37a810',
    },
  },


  TokenAddress: '0x4D644C68B4bbaE2795A91E768E69FDdef346FA40',
  USDCTokenAddress: '0x6660E482CD59E6a86bAf7807D0ad8f03c38224d5',
  factoryAddress: '0x39eFbB935301929b721DE4477538d5d91be548Dd',
  RouterAddress: '0xdB853019Ad6a35bADb30B1Bd94E716725ba06CDb',
  PoolAddress: '0xe31c23cF66EaB6d11097d694cD8011a057c58416',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
