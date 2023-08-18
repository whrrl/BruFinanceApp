# BruFinanceApp

# Introduction of [Brú Finance](https://bru.finance/)

Brú is solving these problems of the DeFi lending ecosystem by creating a decentralized tokenized bond market that connects liquidity providers (lenders) in the developed world with high yield accruing emerging market debt, secured by real-world assets like commodities, equities, gold, inventory, receivables, etc. Brú Finance is currently live on the Polygon mainnet, and to make the platform multi-chain supportive we will use infura RPC service. The liquidity providers(lenders) connect to the platform via a mobile app wherein we are using Wallet Connect for interaction. We will be adding Metamask SDK to connect the wallet in our mobile application. 
Our web app is live on : [https://bru.finance/](https://bru.finance/)

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!


<!-- for clear watchman -->

watchman shutdown-server

# Smart Contracts Interaction
  
#### Compile smart contracts

```bash

npx hardhat compile

```

#### Test smart contracts

```bash

npx hardhat test

```

#### Test smart contracts coverage

```bash

npx hardhat coverage

```

### Smart contract Deployment

Create a .env file in the root directory and add the following variables


- PRIVATE_KEY = ""

- ETHERSCAN_API_KEY = ""

- INFURA_KEY = ""

  

Supported networks for deployment

-  `localhost`

-  `goerli`

-  `mumbai`

-  `polygon`

-  `linea-goerli`

##### Deploying Mech Token Smart Contract On `Linea-Goerli` Testnet

```bash

npx hardhat run --network linea scripts/deploy.js

```

####  Transaction on Linea :

- [Deposit tx1](https://explorer.goerli.linea.build/tx/0xbe33dc2b4d973b2f0be50ec3d5161a34c8eaf31566b9d4b6033ae93f5a1c3b5a)
- [Deposit tx2](https://explorer.goerli.linea.build/tx/0x75c960b13729ecaf26ee9e12c9830b8ff84def4a583afdbb4f45bc0286fef126)

#### Deployed Contracts on Linea-Goerli:

- [TestTokenContract](https://explorer.goerli.linea.build/address/0xF16007DE4145ec6152e4c8c467A984b647fd8908)
- [USDCTestTokenContract](https://explorer.goerli.linea.build/address/0x956EaD2636dfD58D7215E6A415eD4e3E21430fDd)
- [BruFactoryImplementation](https://explorer.goerli.linea.build/address/0x6d990Ddc7a045672B24335e5eD5C0f1887fa1a27)
- [BruFactoryProxy](https://explorer.goerli.linea.build/address/0x4756516A799Efde91B8A09845547F1dD17Bcf4D0)
- [BruPoolImplementation](https://explorer.goerli.linea.build/address/0x37a95523ac7B686C1e5aaccBfAa2BDC9e64d8A06)
- [BruPoolImplementation](https://explorer.goerli.linea.build/address/0x37a95523ac7B686C1e5aaccBfAa2BDC9e64d8A06)
- [BruPoolProxy](https://explorer.goerli.linea.build/address/0x61154B0C73717DF854B20a56a53BdBfa3B37a810)
- [TokenVestingBruImplementation](https://explorer.goerli.linea.build/address/0x794cdbcbbC008E4f6020ca97B5A55FF8F4B1fDa3)
- [TokenVestingBruProxy](https://explorer.goerli.linea.build/address/0x9DaDf0cA46B280E888755FCD4c758a9151311f9b)
- [ReserveWalletImplementation](https://explorer.goerli.linea.build/address/0x6F9be12F8270F65dA4Ee945462ef9784282e06d2)
- [ReserveWalletProxy](https://explorer.goerli.linea.build/address/0x2DED869DB19De0A8EeD1cAA3EA7fE914affad3Ff)
- [UnclaimedCashflowWalletImplementation](https://explorer.goerli.linea.build/address/0x1E00D8560032d0DdcA08e6B09de00C172953dfd7)
- [UnclaimedCashflowWalletProxy](https://explorer.goerli.linea.build/address/0x19DACeC8Fab4a79dE02EAC2CA25980e301A5E343)
- [NIImarginImplementation](https://explorer.goerli.linea.build/address/0xd3E92131D9cAF63A6dA931Bd400d75ec318B770a)
- [NIImarginProxy](https://explorer.goerli.linea.build/address/0x4C96a7877077C89d71d32FC2a69c00373b1B4140)
- [BruOracleImplementation](https://explorer.goerli.linea.build/address/0xC0efFe7d7EC49c745901C095460fDE638FCc8A0A)
- [BruOracleProxy](https://explorer.goerli.linea.build/address/0xa9681644F5386375d9a5e4d9f10c30Cb5808a9f8)
- [BruRewardsImplementation](https://explorer.goerli.linea.build/address/0x02a0bdC56d1Df1b85371a6F37bE949e43B04BDA3)
- [BruRewardsProxy](https://explorer.goerli.linea.build/address/0x60294325E8Ad813C52ae665D8096374AC8d1E4C7)
- [BruPriceImplementation](https://explorer.goerli.linea.build/address/0xB58541c83fefF7a5a1F6bc040F454482bD932c6A)
- [BruPriceProxy](https://explorer.goerli.linea.build/address/0xf55924841599E582cB8fC74bA27De916CcC408C0)
- [MultiSigImplementation](https://explorer.goerli.linea.build/address/0x6DE4C580A698Bb254b2e3Aa73DF54f2B299239D2)
- [MultiSigProxy](https://explorer.goerli.linea.build/address/0x58301B92435d6E0fa0EB32B4efa875965af2421D)
- [AssetTreasuryContract](https://explorer.goerli.linea.build/address/0x2AcfE181433B0Bb82640c591aa93009CE430F5d7)
- [BruTokenContract](https://explorer.goerli.linea.build/address/0xcD3E478ae2224A6a6b529CF1b304d34b66840756)
- [PoolTokenContract](https://explorer.goerli.linea.build/address/0x85f7162728F8723CF269B04C7354843AFcBE4B9E)
- [InterestTokenContract](https://explorer.goerli.linea.build/address/0x9d5B3Ce19A7162D09BC80A80e897FbC3a1C12c2d)
- [BruRouterImplementation](https://explorer.goerli.linea.build/address/0x97335040cd74C9ABeEE75d29de14288588046A4f)
- [BruRouterProxy](https://explorer.goerli.linea.build/address/0x34c4388EB6e5a856eE22a5A612f8fbffD6d70e78)

#### Deployed Contracts on Polygon Mainnet

- [TestTokenContract](https://polygonscan.com/address/0xc2132D05D31c914a87C6611C10748AEb04B58e8F)
- [USDCTestTokenContract](https://polygonscan.com/address/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174)
- [BruFactoryProxy](https://polygonscan.com/address/0xED79b078dFeF6618A1eA456720Fa4CD3c4E43209)
- [CONSTANTS.BruPoolImplementation](https://polygonscan.com/address/0x19D7eC826f2D8faf61C1F30c0ab53dF8990C0B13)
- [BruPoolProxy](https://polygonscan.com/address/0xc345e8f86E7EFbCB2cC4302b2dE116E4EBB727bA)
- [TokenVestingBruImplementation](https://polygonscan.com/address/0x7dE2B05614C05Dc612a98D4f7A797330D3765634)
- [TokenVestingBruProxy](https://polygonscan.com/address/0xcC4344B60eE6cEf277f8a80eC606C0826153EdED)
- [ReserveWalletImplementation](https://polygonscan.com/address/0x0ac6BD5436A6C91427112bFbF011cc22B9125F5d)
- [ReserveWalletProxy](https://polygonscan.com/address/0xb4b7709825fEbbd9B1850d041d05033c70163f0a)
- [UnclaimedCashflowWalletImplementation](https://polygonscan.com/address/0xFC91917F653Fe04E2F646777FfE88c9B542a8594)
- [UnclaimedCashflowWalletProxy](https://polygonscan.com/address/0xb3a39B494453C975E7bA6aba22c40353D47D94D9)
- [NIImarginImplementation](https://polygonscan.com/address/0xa57fb8779Ec01c8c50Ee04feb6292af942BFe7f9)
- [NIImarginProxy](https://polygonscan.com/address/0x7d87092054BE3B012A86eeD47DC5F61726ed3aC2)
- [BruOracleImplementation](https://polygonscan.com/address/0xAcf710ab6B62F3fA42Ce2b83dE93091c23C17460)
- [BruOracleProxy](https://polygonscan.com/address/0x471D1AB3e34772C9060824F3435E4a7fb816fa30)
- [BruRewardsImplementation](https://polygonscan.com/address/0x2627caA3b3C36C5688025dDbB310b04AC853bCB7)
- [BruRewardsProxy](https://polygonscan.com/address/0x5e1377eCC1C94d41fA9c79aF12E7578afCd1e59D)
- [BruPriceImplementation](https://polygonscan.com/address/0x31c1F6BC689b32c723845388554Df633Da0fcB4D)
- [BruPriceProxy](https://polygonscan.com/address/0x0aCA2eCcfe360324cAB13AE7D8f9a6540e8968DD)
- [MultiSigImplementation](https://polygonscan.com/address/0xa6550e4992eB36ff1992E54A5E167B741C22CE78)
- [MultiSigProxy](https://polygonscan.com/address/0x3b8935B7a6c0053599B50fD932ADa6BAd985942c)
- [AssetTreasuryContract](https://polygonscan.com/address/0xf0c8CE0aE6c3EBbD2b057cD85bbF4045344DA02B)
- [BruTokenContract](https://polygonscan.com/address/0x3739Dd329f3067e440C3c2E7c92e873F50E8405c)
- [PoolTokenContract](https://polygonscan.com/address/0x3a6A3D35d0F39E9B2aAD7B3721c406CDA658DADE)
- [InterestTokenContract](https://polygonscan.com/address/0x4F64b41F66aafB29696C65Fe2d4de2b23B1ea9Df)
- [BruRouterImplementation](https://polygonscan.com/address/0xB4560D68a09D1551c48850e0d7E1e863ECf3ae73)
- [BruRouterProxy](https://polygonscan.com/address/0xe8BF2801a3e457FE141407a3b39F47fDE83B376f)