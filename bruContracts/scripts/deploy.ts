import { ethers } from "hardhat";
import fs from 'fs';

export let CONSTANTS = {
    MINT_AMOUNT: "10000000000000000000000",
    PROPOSAL_COUNTER: 0,
    USDTAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    USDCAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
};
export function increaseProposalCounter() {
    CONSTANTS.PROPOSAL_COUNTER++;
}

export function getProposalCounter() {
    return CONSTANTS.PROPOSAL_COUNTER;
}

async function main() {
    const mintAmount = '100000000000000000000000'
    const [owner] = await ethers.getSigners()
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
    let UnclaimeCasflowFactory = await ethers.getContractFactory("UnClaimedCashFlowWallet");
    let NIImarginFactory = await ethers.getContractFactory("NIIMargin");
    let TestOracleFactory = await ethers.getContractFactory("TestOracle");

    // let treasury = await Treasury.deploy()
    // await treasury.deployed()

    var delayFunction = (interval: any) => {
        return new Promise(async (resolve) => {
            // const data = await sendToken();
            // setTimeout(resolve.bind(null), interval)
            // return resolve(
            setTimeout(() => {
                resolve(true);
                console.log("INteral end");
            }, interval);
            // );
        });
    };

    //USDT Contract
    // let TestTokenContract = await TestTokenFactory.attach(CONSTANTS.USDTAddress);  // Use this when deploying on mainnet
    let TestTokenContract = await TestTokenFactory.deploy(CONSTANTS.MINT_AMOUNT); // Use this when deploying on testnet
    await TestTokenContract.deployed();
    console.log("%c Line:55 🍉 TestTokenContract", "color:#ffdd4d", TestTokenContract.address); 

    // USDC Contract
    // let USDCTestTokenContract = await USDCTestTokenFactory.attach(CONSTANTS.USDCAddress); // Use this when deploying on mainnet
    let USDCTestTokenContract = await USDCTestTokenFactory.deploy(CONSTANTS.MINT_AMOUNT); // Use this when deploying on testnet
    await USDCTestTokenContract.deployed();
    console.log("%c Line:58 🍻 USDCTestTokenContract", "color:#e41a6a", USDCTestTokenContract.address);

    //Deploying Factory and its proxy
    let BruFactoryImplementation = await BruFactory.deploy();
    await BruFactoryImplementation.deployed();
    console.log("%c Line:63 🥚 BruFactoryImplementation", "color:#6ec1c2", BruFactoryImplementation.address);
    await delayFunction(100000);
    let BruFactoryProxy = await BruProxyFactory.deploy(BruFactoryImplementation.address);
    await BruFactoryProxy.deployed();
    console.log("%c Line:83 🍔 BruFactoryProxy", "color:#93c0a4", BruFactoryProxy.address);
    await delayFunction(100000);
    // let BruFactoryProxy = await ethers.getContractAt("BruFactory", CONSTANTS.BruFactoryProxy);
    // console.log("%c Line:88 🥪 BruFactoryProxy", "color:#2eafb0", BruFactoryProxy.address);

    //Deploying pool and its proxy

    let BruPoolImplementation = await BruPoolFactory.deploy();
    await BruPoolImplementation.deployed();
    console.log("%c Line:91 🥟 BruPoolImplementation", "color:#fca650", BruPoolImplementation.address);
    await delayFunction(100000);
    console.log("%c Line:97 🍿 CONSTANTS.BruPoolImplementation", "color:#ed9ec7", BruPoolImplementation.address);
    let BruPoolProxy = await BruProxyFactory.deploy(BruPoolImplementation.address);
    await BruPoolProxy.deployed();
    await delayFunction(100000);
    // let BruPoolProxy = await ethers.getContractAt("BruPool", CONSTANTS.BruPoolProxy);
    console.log("%c Line:95 🥚 BruPoolProxy", "color:#33a5ff", BruPoolProxy.address);

    let TokenVestingBruImplementation = await TokenVestingBruFactory.deploy();
    await TokenVestingBruImplementation.deployed();
    console.log("%c Line:101 🍇 TokenVestingBruImplementation", "color:#fca650", TokenVestingBruImplementation.address);
    await delayFunction(120000);
    let TokenVestingBruProxy = await BruProxyFactory.deploy(TokenVestingBruImplementation.address);
    await TokenVestingBruProxy.deployed();
    console.log("%c Line:105 🍐 TokenVestingBruProxy", "color:#465975", TokenVestingBruProxy.address);
    await delayFunction(100000);
    // let TokenVestingBruProxy = await ethers.getContractAt("VestingBurn", CONSTANTS.TokenVestingBruProxy);
    console.log("%c Line:115 🥕 TokenVestingBruProxy", "color:#2eafb0", TokenVestingBruProxy.address);

    //Deploying Wallets and their proxies

    let ReserveWalletImplementation = await ReserveWalletFactory.deploy();
    console.log("%c Line:120 🍿 ReserveWalletImplementation", "color:#42b983", ReserveWalletImplementation);
    await ReserveWalletImplementation.deployed();
    console.log("%c Line:113 🍡 ReserveWalletImplementation", "color:#fca650", ReserveWalletImplementation.address);
    await delayFunction(120000);
    let ReserveWalletProxy = await BruProxyFactory.deploy(ReserveWalletImplementation.address);
    await ReserveWalletProxy.deployed();
    console.log("%c Line:117 🍫 ReserveWalletProxy", "color:#6ec1c2", ReserveWalletProxy.address);
    // await delayFunction(100000);
    ReserveWalletProxy = await ethers.getContractAt("ReserveWallet", ReserveWalletProxy.address);
    let UnclaimedCashflowWalletImplementation = await UnclaimeCasflowFactory.deploy();
    await UnclaimedCashflowWalletImplementation.deployed();
    console.log("%c Line:122 🥑 UnclaimedCashflowWalletImplementation", "color:#b03734", UnclaimedCashflowWalletImplementation.address);
    await delayFunction(120000);
    let UnclaimedCashflowWalletProxy = await BruProxyFactory.deploy(UnclaimedCashflowWalletImplementation.address);
    await UnclaimedCashflowWalletProxy.deployed();
    console.log("%c Line:126 🍋 UnclaimedCashflowWalletProxy", "color:#ea7e5c", UnclaimedCashflowWalletProxy.address);
    // await delayFunction(100000);
    UnclaimedCashflowWalletProxy = await await ethers.getContractAt(
        "UnClaimedCashFlowWallet",
        UnclaimedCashflowWalletProxy.address
    );
    let NIImarginImplementation = await NIImarginFactory.deploy();
    await NIImarginImplementation.deployed();
    console.log("%c Line:134 🍭 NIImarginImplementation", "color:#b03734", NIImarginImplementation.address);
    await delayFunction(120000);
    let NIImarginProxy = await BruProxyFactory.deploy(NIImarginImplementation.address);
    await NIImarginProxy.deployed();
    console.log("%c Line:138 🌮 NIImarginProxy", "color:#3f7cff", NIImarginProxy.address);
    // await delayFunction(100000);
    NIImarginProxy = await ethers.getContractAt("NIIMargin", NIImarginProxy.address);
    //deploying BruOracle and its proxy
    let BruOracleImplementation = await BruOracleFactory.deploy();
    await BruOracleImplementation.deployed();
    console.log("%c Line:144 🍎 BruOracleImplementation", "color:#7f2b82", BruOracleImplementation.address);
    await delayFunction(120000);
    let BruOracleProxy = await BruProxyFactory.deploy(BruOracleImplementation.address);
    await BruOracleProxy.deployed();
    console.log("%c Line:148 🍊 BruOracleProxy", "color:#7f2b82", BruOracleProxy.address);
    // await delayFunction(100000);
    BruOracleProxy = await ethers.getContractAt("BruOracle", BruOracleProxy.address);

    //deploying bru rewards and its proxy

    let BruRewardsImplementation = await BruRewardsFactory.deploy();
    await BruRewardsImplementation.deployed();
    console.log("%c Line:156 🥝 BruRewardsImplementation", "color:#42b983", BruRewardsImplementation.address);
    await delayFunction(120000);
    let BruRewardsProxy = await BruProxyFactory.deploy(BruRewardsImplementation.address);
    await BruRewardsProxy.deployed();
    console.log("%c Line:160 🥕 BruRewardsProxy", "color:#465975", BruRewardsProxy.address);
    // await delayFunction(100000);
    BruRewardsProxy = await ethers.getContractAt("BruRewards", BruRewardsProxy.address);

    //Deploying BruPrice and its proxy
    let BruPriceImplementation = await BruPriceFactory.deploy();
    await BruPriceImplementation.deployed();
    console.log("%c Line:167 🧀 BruPriceImplementation", "color:#4fff4B", BruPriceImplementation.address);
    await delayFunction(120000);
    let BruPriceProxy = await BruProxyFactory.deploy(BruPriceImplementation.address);
    await BruPriceProxy.deployed();
    console.log("%c Line:171 🌮 BruPriceProxy", "color:#4fff4B", BruPriceProxy.address);
    // await delayFunction(100000);
    BruPriceProxy = await ethers.getContractAt("BruPrice", BruPriceProxy.address);
    //Deploying multisig and its proxy
    let MultiSigImplementation = await MultiSigFactory.deploy();
    await MultiSigImplementation.deployed();
    console.log("%c Line:177 🍭 MultiSigImplementation", "color:#42b983", MultiSigImplementation.address);
    await delayFunction(120000);

    let MultiSigProxy = await BruProxyFactory.deploy(MultiSigImplementation.address);
    await MultiSigProxy.deployed();
    console.log("%c Line:182 🍔 MultiSigProxy", "color:#6ec1c2", MultiSigProxy.address);
    let AssetTreasuryContract = await AssetTreasuryFactory.deploy(
        BruPoolProxy.address,
        owner.address,
        MultiSigProxy.address
    );
    await AssetTreasuryContract.deployed();
    console.log("%c Line:189 🍊 AssetTreasuryContract", "color:#ed9ec7", AssetTreasuryContract.address);
    await delayFunction(120000);
    // let TestOracleContract = await TestOracleFactory.deploy();
    // await TestOracleContract.deployed();

    let BruTokenContract = await BruTokenFactory.deploy(
        "BruToken",
        "BT",
        "250000000000000000000000000",
        TokenVestingBruProxy.address,
        MultiSigProxy.address,
        NIImarginProxy.address
    );
    await BruTokenContract.deployed();
    console.log("%c Line:203 🍢 BruTokenContract", "color:#ffdd4d", BruTokenContract.address);
    await delayFunction(120000);
    let PoolTokenContract = await PoolTokenFactory.deploy("BruBonds - IndiaAgro", "BondToken", MultiSigProxy.address);

    await PoolTokenContract.deployed();
    console.log("%c Line:208 🥪 PoolTokenContract", "color:#42b983", PoolTokenContract.address);
    await delayFunction(120000);
    let InterestTokenContract = await InterestTokenFactory.deploy(
        "InterestToken - IndiaAgro",
        "",
        MultiSigProxy.address
    );
    await InterestTokenContract.deployed();
    console.log("%c Line:216 🥐 InterestTokenContract", "color:#2eafb0", InterestTokenContract.address);
    await delayFunction(120000);
    MultiSigProxy = await ethers.getContractAt("MultiSig", MultiSigProxy.address);

    let BruRouterImplementation = await BruRouterFactory.deploy();
    await BruRouterImplementation.deployed();
    console.log("%c Line:222 🥃 BruRouterImplementation", "color:#2eafb0", BruRouterImplementation.address);
    await delayFunction(120000);
    let BruRouterProxy = await BruProxyFactory.deploy(BruRouterImplementation.address);
    await BruRouterProxy.deployed();
    console.log("%c Line:226 🍒 BruRouterProxy", "color:#fca650", BruRouterProxy.address);
    await delayFunction(120000);
    BruRouterProxy = await ethers.getContractAt("BruRouter", BruRouterProxy.address);

    let addresses = {
        TOKEN_ADDRESS: TestTokenContract.address,
        USDC_ADDRESS: USDCTestTokenContract.address,
        FACTORY_ADDRESS: BruFactoryProxy.address,
        ROUTER_ADDRESS: BruRouterProxy.address,
        MULTISIG_ADDRESS: MultiSigProxy.address,
        AssetTreasuryAddress: AssetTreasuryContract.address,
        PoolTokenAddress: PoolTokenContract.address,
        InterestTokenAddress: InterestTokenContract.address,
        BruOracleAddress: BruOracleProxy.address,
        BruTokenAddress: BruTokenContract.address,
        NIIMarginAddress: NIImarginProxy.address,
        BruRewardAddress: BruRewardsProxy.address,
        TokenVestingBruAddress: TokenVestingBruProxy.address,
        unClaimedWalletAddress: UnclaimedCashflowWalletProxy.address,
        bruPriceAddress: BruPriceProxy.address,
        reserveWalletAddress: ReserveWalletProxy.address,
    }
    console.log("%c Line:277 🌮 addresses", "color:#4fff4B", addresses);
    save(addresses)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

function save(addresses: Object) {
    fs.writeFileSync('./scripts/polygon/Address-Prod.json', JSON.stringify(addresses, null, '\t'))
}