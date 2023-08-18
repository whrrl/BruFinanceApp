import { ethers } from "hardhat";
import fs from "fs";

export let CONSTANTS = {
  PROPOSAL_COUNTER: 0,
  USDTAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  USDCAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  BruFactoryImplementation: "0xC5cDB0cB6197470F9FA52E4bD6c09927010F43A3",
  BruFactoryProxy: "0xED79b078dFeF6618A1eA456720Fa4CD3c4E43209",
  BruPoolImplementation: "0x19D7eC826f2D8faf61C1F30c0ab53dF8990C0B13",
  BruPoolProxy: "0xc345e8f86E7EFbCB2cC4302b2dE116E4EBB727bA",
  TokenVestingBruImplementation: "0x7dE2B05614C05Dc612a98D4f7A797330D3765634",
  TokenVestingBruProxy: "0xcC4344B60eE6cEf277f8a80eC606C0826153EdED",
  ReserveWalletProxy: "0xb4b7709825fEbbd9B1850d041d05033c70163f0a",
  UnclaimedCashflowWalletImplementation:
    "0xFC91917F653Fe04E2F646777FfE88c9B542a8594",
  UnclaimedCashflowWalletProxy: "0xb3a39B494453C975E7bA6aba22c40353D47D94D9",
  NIImarginImplementation: "0xa57fb8779Ec01c8c50Ee04feb6292af942BFe7f9",
  NIImarginProxy: "0x7d87092054BE3B012A86eeD47DC5F61726ed3aC2",
  BruOracleImplementation: "0xAcf710ab6B62F3fA42Ce2b83dE93091c23C17460",
  BruOracleProxy: "0x471D1AB3e34772C9060824F3435E4a7fb816fa30",
  BruRewardsImplementation: "0x2627caA3b3C36C5688025dDbB310b04AC853bCB7",
  BruRewardsProxy: "0x5e1377eCC1C94d41fA9c79aF12E7578afCd1e59D",
  BruPriceImplementation: "0x31c1F6BC689b32c723845388554Df633Da0fcB4D",
  BruPriceProxy: "0x0aCA2eCcfe360324cAB13AE7D8f9a6540e8968DD",
  MultiSigImplementation: "0xa6550e4992eB36ff1992E54A5E167B741C22CE78",
  MultiSigProxy: "0x3b8935B7a6c0053599B50fD932ADa6BAd985942c",
  AssetTreasuryContract: "0xf0c8CE0aE6c3EBbD2b057cD85bbF4045344DA02B",
  BruTokenContract: "0x3739Dd329f3067e440C3c2E7c92e873F50E8405c",
  PoolTokenContract: "0x3a6A3D35d0F39E9B2aAD7B3721c406CDA658DADE",
  InterestTokenContract: "0x4F64b41F66aafB29696C65Fe2d4de2b23B1ea9Df",
  BruRouterImplementation: "0xB4560D68a09D1551c48850e0d7E1e863ECf3ae73",
  BruRouterProxy: "0xe8BF2801a3e457FE141407a3b39F47fDE83B376f",
};
export function increaseProposalCounter() {
  CONSTANTS.PROPOSAL_COUNTER++;
}

export function getProposalCounter() {
  return CONSTANTS.PROPOSAL_COUNTER;
}

async function main() {
  const mintAmount = "100000000000000000000000";
  const [owner] = await ethers.getSigners();
  console.log("%c Line:21 🍉 owner", "color:#465975", owner.address);
  const QUORUM = 1;
  // const accounts = await ethers.getSigners();
  // const deployer = accounts[0];

  let BruTokenFactory = await ethers.getContractFactory("Token");
  let TestTokenFactory = await ethers.getContractFactory("TestToken");
  let USDCTestTokenFactory = await ethers.getContractFactory("USDCTestToken");
  let PoolTokenFactory = await ethers.getContractFactory("PoolToken");
  let InterestTokenFactory = await ethers.getContractFactory("InterestToken");

  let BruProxyFactory = await ethers.getContractFactory("BruProxy");

  let BruFactory = await ethers.getContractFactory("BruFactory");
  let BruPoolFactory = await ethers.getContractFactory("BruPool");
  let BruRouterFactory = await ethers.getContractFactory("BruRouter");
  let BruRewardsFactory = await ethers.getContractFactory("BruRewards");
  let BruOracleFactory = await ethers.getContractFactory("BruOracle");
  let BruPriceFactory = await ethers.getContractFactory("BruPrice");

  let AssetTreasuryFactory = await ethers.getContractFactory("AssetTreasury");
  let MultiSigFactory = await ethers.getContractFactory("MultiSig");

  let TokenVestingBruFactory = await ethers.getContractFactory("VestingBurn");

  let ReserveWalletFactory = await ethers.getContractFactory("ReserveWallet");
  let UnclaimeCasflowFactory = await ethers.getContractFactory(
    "UnClaimedCashFlowWallet"
  );
  let NIImarginFactory = await ethers.getContractFactory("NIIMargin");
  let TestOracleFactory = await ethers.getContractFactory("TestOracle");

  let MultiSigProxy = await MultiSigFactory.attach(
    "0x3b8935B7a6c0053599B50fD932ADa6BAd985942c"
  );
  console.log(
    "%c Line:77 🍆 MultiSigProxy",
    "color:#6ec1c2",
    MultiSigProxy.address
  );
  let TokenVestingBruProxy = await TokenVestingBruFactory.attach(
    CONSTANTS.TokenVestingBruProxy
  );
  console.log(
    "%c Line:79 🍕 TokenVestingBruProxy",
    "color:#7f2b82",
    TokenVestingBruProxy.address
  );

  let ReserveWalletProxy = await ReserveWalletFactory.attach(
    CONSTANTS.ReserveWalletProxy
  );
  console.log(
    "%c Line:82 🍊 ReserveWalletProxy",
    "color:#93c0a4",
    ReserveWalletProxy.address
  );

  let NIImarginProxy = await NIImarginFactory.attach(CONSTANTS.NIImarginProxy);
  console.log(
    "%c Line:85 🍷 NIImarginProxy",
    "color:#f5ce50",
    NIImarginProxy.address
  );

  let UnclaimedCashflowWalletProxy = await UnclaimeCasflowFactory.attach(
    CONSTANTS.UnclaimedCashflowWalletProxy
  );
  console.log(
    "%c Line:88 🍕 UnclaimedCashflowWalletProxy",
    "color:#2eafb0",
    UnclaimedCashflowWalletProxy.address
  );

  let BruPoolProxy = await BruPoolFactory.attach(CONSTANTS.BruPoolProxy);
  console.log(
    "%c Line:91 🥓 BruPoolProxy",
    "color:#ea7e5c",
    BruPoolProxy.address
  );

  let BruRewardsProxy = await BruRewardsFactory.attach(
    CONSTANTS.BruRewardsProxy
  );
  console.log(
    "%c Line:94 🥥 BruRewardsProxy",
    "color:#465975",
    BruRewardsProxy.address
  );

  let BruPriceProxy = await BruPriceFactory.attach(CONSTANTS.BruPriceProxy);
  console.log(
    "%c Line:97 🍉 BruPriceProxy",
    "color:#e41a6a",
    BruPriceProxy.address
  );

  let BruFactoryProxy = await BruFactory.attach(CONSTANTS.BruFactoryProxy);
  console.log(
    "%c Line:100 🥓 BruFactoryProxy",
    "color:#33a5ff",
    BruFactoryProxy.address
  );

  let BruRouterProxy = await BruRouterFactory.attach(CONSTANTS.BruRouterProxy);
  console.log(
    "%c Line:103 🌰 BruRouterProxy",
    "color:#7f2b82",
    BruRouterProxy.address
  );

  try {
    const gasPrice = ethers.utils.parseUnits("100", "gwei");
    let tx = await MultiSigProxy.initialize(
      {
        factoryAddress: CONSTANTS.BruFactoryProxy,
        quorum: 1,
        approvers: [owner.address],
        routerAddress: CONSTANTS.BruRouterProxy,
        reserveWalletAddress: CONSTANTS.ReserveWalletProxy,
        NIIWalletAddress: CONSTANTS.NIImarginProxy,
        burnVestingAddress: CONSTANTS.TokenVestingBruProxy,
        rewardsAddress: CONSTANTS.BruRewardsProxy,
        oracleAddress: CONSTANTS.BruOracleProxy,
        tokenAddress: CONSTANTS.BruTokenContract,
        treasuryAddress: CONSTANTS.AssetTreasuryContract,
        unClaimedWalletAddress: CONSTANTS.UnclaimedCashflowWalletProxy,
        bruPriceAddress: CONSTANTS.BruPriceProxy,
      },
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:232 🍐 tx", "color:#7f2b82", tx);

    let tx1 = await TokenVestingBruProxy.connect(owner).initialize(
      CONSTANTS.BruTokenContract,
      MultiSigProxy.address,
      CONSTANTS.NIImarginProxy,
      CONSTANTS.BruRewardsProxy,
      CONSTANTS.BruFactoryProxy,
      CONSTANTS.BruOracleProxy,
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:249 🍧 tx1", "color:#e41a6a", tx1);

    let tx2 = await ReserveWalletProxy.connect(owner).initialize(
      MultiSigProxy.address,
      NIImarginProxy.address,
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:258 🍔 tx2", "color:#3f7cff", tx2);

    let tx3 = await UnclaimedCashflowWalletProxy.connect(owner).initialize(
      MultiSigProxy.address,
      NIImarginProxy.address,
      CONSTANTS.BruTokenContract,
      CONSTANTS.USDTAddress,
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:261 🍊 tx3", "color:#2eafb0", tx3);

    let tx4 = await NIImarginProxy.connect(owner).initialize(
      ReserveWalletProxy.address,
      MultiSigProxy.address,
      BruPoolProxy.address,
      TokenVestingBruProxy.address,
      CONSTANTS.BruTokenContract,
      CONSTANTS.USDTAddress,
      UnclaimedCashflowWalletProxy.address,
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:268 🍞 tx4", "color:#33a5ff", tx4);

    let tx6 = await BruRewardsProxy.connect(owner).initialize(
      MultiSigProxy.address,
      CONSTANTS.BruFactoryProxy,
      CONSTANTS.BruTokenContract,
      TokenVestingBruProxy.address,
      CONSTANTS.BruOracleProxy,
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:280 🍕 tx6", "color:#465975", tx6);

    let tx7 = await BruPriceProxy.connect(owner).initialize(
      MultiSigProxy.address,
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:289 🥝 tx7", "color:#ffdd4d", tx7);

    let tx8 = await BruFactoryProxy.connect(owner).initialize(
      MultiSigProxy.address,
      CONSTANTS.BruTokenContract,
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:291 🍒 tx8", "color:#b03734", tx8);

    let tx9 = await BruPoolProxy.connect(owner).initialize(
      0,
      CONSTANTS.BruRouterProxy,
      MultiSigProxy.address,
      BruFactoryProxy.address,
      CONSTANTS.PoolTokenContract,
      CONSTANTS.InterestTokenContract,
      CONSTANTS.AssetTreasuryContract,
      "IndiaAgro",
      NIImarginProxy.address,
      BruRewardsProxy.address,
      BruPriceProxy.address,
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:295 🥥 tx9", "color:#ea7e5c", tx9);

    let tx10 = await BruRouterProxy.connect(owner).initialize(
      BruFactoryProxy.address,
      MultiSigProxy.address,
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:188 🍰 tx10", "color:#b03734", tx10);

    let prop32 = await MultiSigProxy.createProposal(
      [0],
      32,
      [
        BruPoolProxy.address,
        CONSTANTS.BruPoolImplementation,
        CONSTANTS.PoolTokenContract,
        CONSTANTS.InterestTokenContract,
        CONSTANTS.AssetTreasuryContract,
      ],
      ["IndiaAgro"],
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:191 🌮 prop32", "color:#42b983", prop32);

    let app32 = await MultiSigProxy.connect(owner).approveTransfer(32, 0, {
      gasPrice: gasPrice,
      gasLimit: 1000000,
    });
    console.log("%c Line:205 🍆 app32", "color:#4fff4B", app32);
    increaseProposalCounter();

    let usdt7 = await MultiSigProxy.createProposal(
      [0],
      7,
      [CONSTANTS.USDTAddress],
      [""],
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:209 🌽 usdt7", "color:#b03734", usdt7);
    let usdtapp7 = await MultiSigProxy.connect(owner).approveTransfer(7, 1, {
      gasPrice: gasPrice,
      gasLimit: 1000000,
    });
    console.log("%c Line:211 🍋 usdtapp7", "color:#fca650", usdtapp7);
    increaseProposalCounter();
    let usdc7 = await MultiSigProxy.createProposal(
      [0],
      7,
      [CONSTANTS.USDCAddress],
      [""],
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:214 🍔 usdc7", "color:#4fff4B", usdc7);
    let usdcapp7 = await MultiSigProxy.connect(owner).approveTransfer(7, 2, {
      gasPrice: gasPrice,
      gasLimit: 1000000,
    });
    console.log("%c Line:216 🥝 usdcapp7", "color:#ffdd4d", usdcapp7);
    increaseProposalCounter();
    let prop23 = await MultiSigProxy.createProposal(
      [0],
      23,
      [BruPoolProxy.address],
      [""],
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:219 🥥 prop23", "color:#ed9ec7", prop23);
    let app23 = await MultiSigProxy.connect(owner).approveTransfer(23, 3, {
      gasPrice: gasPrice,
      gasLimit: 1000000,
    });
    console.log("%c Line:221 🍿 app23", "color:#2eafb0", app23);
    increaseProposalCounter();
    let prop24 = await MultiSigProxy.createProposal(
      [0],
      24,
      [BruPoolProxy.address],
      [""],
      { gasPrice: gasPrice, gasLimit: 1000000 }
    );
    console.log("%c Line:224 🍆 prop24", "color:#42b983", prop24);
    let app24 = await MultiSigProxy.connect(owner).approveTransfer(24, 4, {
      gasPrice: gasPrice,
      gasLimit: 1000000,
    });
    console.log("%c Line:226 🥚 app24", "color:#33a5ff", app24);
    increaseProposalCounter();
  } catch (e) {
    console.log("%c Line:98 🧀 e", "color:#3f7cff", e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
