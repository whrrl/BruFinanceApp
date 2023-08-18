// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import API from '../../contract_details/btoken.json';
// import * as ABI from '../../contract_details/btoken.json';
// import LABI from '../../contract_details/Lending.json';
// import BABI from '../../contract_details/Borrow.json';
// import IERC20 from '../../upgradeable-contract/artifacts/contracts/tokens/TestToken.sol/TestToken.json';
// import BToken from '../../contract_details/BToken1.json';
// import RouterArtifact from '../../upgradeable-contract/artifacts/contracts/BruRouter.sol/BruRouter.json';
// import PoolArtifact from '../../upgradeable-contract/artifacts/contracts/core/BruPool.sol/BruPool.json';
// import TreasuryArtifact from '../../upgradeable-contract/artifacts/contracts/core/AssetTreasury.sol/AssetTreasury.json';
// import PoolTokenArtifact from '../../upgradeable-contract/artifacts/contracts/tokens/PoolToken.sol/PoolToken.json';
// import FactoryArtifact from '../../upgradeable-contract/artifacts/contracts/core/BruFactory.sol/BruFactory.json';
// import TokenArtifact from '../../upgradeable-contract/artifacts/contracts/tokens/TestToken.sol/TestToken.json';
// import USDCArtifact from '../../upgradeable-contract/artifacts/contracts/tokens/USDCTestToken.sol/USDCoin.json';

export const environment = {
  production: false,
  // baseURL: 'http://localhost:5056',
  baseURL: 'https://betabackend.bru.finance',
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
  TokenAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  USDCTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  // factoryAddress: '0x85f7162728F8723CF269B04C7354843AFcBE4B9E',
  RouterAddress: '0x140e6167692Ad75A4Fb795E5e6098B2F28f8A909',
  PoolAddress: '0xc345e8f86E7EFbCB2cC4302b2dE116E4EBB727bA',

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

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import API from '../../contract_details/btoken.json';
// import * as ABI from '../../contract_details/btoken.json';
// import LABI from '../../contract_details/Lending.json';
// import BABI from '../../contract_details/Borrow.json';
// import IERC20 from '../../upgradeable-contract/artifacts/contracts/tokens/TestToken.sol/TestToken.json';
// import BToken from '../../contract_details/BToken1.json';
// import RouterArtifact from '../../upgradeable-contract/artifacts/contracts/BruRouter.sol/BruRouter.json';
// import PoolArtifact from '../../upgradeable-contract/artifacts/contracts/core/BruPool.sol/BruPool.json';
// import TreasuryArtifact from '../../upgradeable-contract/artifacts/contracts/core/AssetTreasury.sol/AssetTreasury.json';
// import PoolTokenArtifact from '../../upgradeable-contract/artifacts/contracts/tokens/PoolToken.sol/PoolToken.json';
// import FactoryArtifact from '../../upgradeable-contract/artifacts/contracts/core/BruFactory.sol/BruFactory.json';
// import TokenArtifact from '../../upgradeable-contract/artifacts/contracts/tokens/TestToken.sol/TestToken.json';
// import USDCArtifact from '../../upgradeable-contract/artifacts/contracts/tokens/USDCTestToken.sol/USDCoin.json';
