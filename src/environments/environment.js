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
      name: 'Polygon Mumbai Test Net',
      tokens: {
        USDT: {
          name: 'USDT',
          address: '0x4D644C68B4bbaE2795A91E768E69FDdef346FA40',
        },
        USDC: {
          name: 'USDC',
          address: '0x6660E482CD59E6a86bAf7807D0ad8f03c38224d5',
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
      name: 'Polygon Main Net',
      tokens: {
        USDT: {
          name: 'USDT',
          address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        },
        USDC: {
          name: 'USDC',
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
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
      name: 'Linea test network',
      tokens: {
        USDT: {
          name: 'USDT',
          address: '0xF16007DE4145ec6152e4c8c467A984b647fd8908',
        },
        USDC: {
          name: 'USDC',
          address: '0x956EaD2636dfD58D7215E6A415eD4e3E21430fDd',
        },
      },
      TokenAddress: '0xF16007DE4145ec6152e4c8c467A984b647fd8908',
      USDCTokenAddress: '0x956EaD2636dfD58D7215E6A415eD4e3E21430fDd',
      factoryAddress: '0x4756516A799Efde91B8A09845547F1dD17Bcf4D0',
      RouterAddress: '0x34c4388EB6e5a856eE22a5A612f8fbffD6d70e78',
      PoolAddress: '0x61154B0C73717DF854B20a56a53BdBfa3B37a810',
    },
  },

  // cryptoComparePriceURL: 'https://min-api.cryptocompare.com/data/price',
  // googleClientId:
  //   '602242376186-qsqghv1gcni9j1bvpu3f5fshafho7dco.apps.googleusercontent.com',
  // facebookClientId: '258151686411272',
  // // RouterAddress : '0xa3c552c713A68BA2E7e8838fb4C2D13cABDBfD03',
  // RouterABI: RouterArtifact.abi,
  // PoolABI: PoolArtifact.abi,
  // TreasuryABI: TreasuryArtifact.abi,
  // TokenABI: TokenArtifact.abi,
  // USDCABI: USDCArtifact.abi,
  // // PoolTokenABI: PoolTokenArtifact.abi,
  // // TokenAddress: '0xdAD510AcEEcfD4beBCF3F55e8b96f1043C0EaA5E',
  // // factoryAddress: '0x46d6003EF5d28B6CD414328cb4B809c9b53F52cc',
  // // RouterAddress: '0xC1709088bca13d4cD774432A2451dc6006FAC48e',
  TokenAddress: '0x4D644C68B4bbaE2795A91E768E69FDdef346FA40',
  USDCTokenAddress: '0x6660E482CD59E6a86bAf7807D0ad8f03c38224d5',
  factoryAddress: '0x39eFbB935301929b721DE4477538d5d91be548Dd',
  RouterAddress: '0xdB853019Ad6a35bADb30B1Bd94E716725ba06CDb',
  PoolAddress: '0xe31c23cF66EaB6d11097d694cD8011a057c58416',

  // // TokenAddress: '0x08E4c2AD1b5dA34bBec08036c709AFA0906E8Ea4',
  // // factoryAddress: '0xD41872Fa1E624440A809268bD30b0321Ddef4873',
  // // RouterAddress: '0xF1012aA62542a7325F96b189B020F650d1d942eB',
  // // TokenAddress:"0x5B9042a9a3207b9dbED0D4E52384890048922760",
  // // factoryAddress:'0x8c5233519393124F0DF5023afCA090B150af7eA8',
  // factoryABI: FactoryArtifact.abi,
  // ABI,
  // lendingContractAddress: '0x6FFa0968A6A2851f76b8294E99C223E715829B44',
  // tokenContractAddress: '0xF4D75B801a5213dbBD8211BB2adf760816dd3e0c',
  // bTokenAddress: '0x25B32f1bCe3842Ae3D8e7DDf344e6e9498f01A7c',
  // borrowContractAddress: '0xd73C1AeE2326B02669b64813725EA5FfEFa0adb2',
  // lendingABI: LABI,
  // iercABI: IERC20.abi,
  // bTokenABI: BToken,
  // borrowABI: BABI,
};

// {
// 	"TOKEN_ADDRESS": "0xdAD510AcEEcfD4beBCF3F55e8b96f1043C0EaA5E",
// 	"FACTORY_ADDRESS": "0x46d6003EF5d28B6CD414328cb4B809c9b53F52cc",
// 	"ROUTER_ADDRESS": "0xC1709088bca13d4cD774432A2451dc6006FAC48e"
// }

// {
// 	"TOKEN_ADDRESS": "0x58373acDf01b97D0CD4e63576ca62D09F4B44994",
// 	"FACTORY_ADDRESS": "0xA6Ac1ffe08dC13Feb3212974FD109396b1137A43",
// 	"ROUTER_ADDRESS": "0x555e00a736cd3696A53D606D82E26341F63901d8"
// }
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
