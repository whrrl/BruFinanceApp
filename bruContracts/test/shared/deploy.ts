import {ethers} from "hardhat";
import {Contract, ContractFactory} from "ethers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import Debug from "debug";
const {constants} = require("@openzeppelin/test-helpers");
const debug = Debug("script:main")
interface Factories {
    TestTokenFactory: ContractFactory;
    BruPoolFactory: ContractFactory;
    BruFactory: ContractFactory;
    BruPriceFactory: ContractFactory;
}
interface Proxies {
    BruFactoryProxy: Contract;
    BruPoolProxy: Contract;
    MultiSigProxy: Contract;
    BruRouterProxy: Contract;
    NIImarginProxy: Contract;
    ReserveWalletProxy: Contract;
    UnclaimedCashflowWalletProxy: Contract;
    TokenVestingBruProxy: Contract;
    BruRewardsProxy: Contract;
    BruPriceProxy: Contract;
    BruOracleProxy: Contract;
}

interface Signers {
    SignerA: SignerWithAddress;
    SignerB: SignerWithAddress;
    SignerC: SignerWithAddress;
    SignerD: SignerWithAddress;
    SignerToken: SignerWithAddress;
    SignerTreasury: SignerWithAddress;
    SignerRandom: SignerWithAddress;
}

interface ImplementationContracts {
    BruFactoryImplementationContract: Contract;
    BruPoolImplementationContract: Contract;
    BruRouterImplementationContract: Contract;
    BruRewardsImplementationContract: Contract;
    BruOracleImplementationContract: Contract;

    MultiSigImplementationContract: Contract;
    TokenVestingImplementationContract: Contract;
    ReserveWalletImplementationContract: Contract;
    UnclaimedCashflowWalletImplementationContract: Contract;
    NIIMarginImplementationContract: Contract;
    BruPriceImplementationContract: Contract;
}

interface Contracts {
    BruTokenContract: Contract;
    TestTokenContract: Contract;
    PoolTokenContract: Contract;
    InterestTokenContract: Contract;
    AssetTreasuryContract: Contract;
    TestOracleContract: Contract;
	USDCTestToken: Contract;
}

export let CONSTANTS = {
    MINT_AMOUNT: "10000000000000000000000",
    DEPOSIT_AMOUNT: "3000300000000000000000",
    TRANSFER_AMOUNT: "2000000000000000000000",
    PROPOSAL_COUNTER: 0,
};
export const nullAddr = constants.ZERO_ADDRESS;
export let FACTORIES: Factories;

export let CONTRACTS: Contracts;

export let IMPLEMENTATION_CONTRACTS: ImplementationContracts;

export let PROXIES: Proxies;

export let SIGNERS: Signers;

export function increaseProposalCounter() {
    CONSTANTS.PROPOSAL_COUNTER++;
}

export function getProposalCounter() {
    return CONSTANTS.PROPOSAL_COUNTER;
}

export async function deploy() {
    CONSTANTS.PROPOSAL_COUNTER = 0;
    let SignerA: SignerWithAddress,
        SignerB: SignerWithAddress,
        SignerC: SignerWithAddress,
        SignerD: SignerWithAddress,
        SignerToken: SignerWithAddress,
        SignerTreasury: SignerWithAddress,
        SignerRandom: SignerWithAddress;
    let BruTokenFactory = await ethers.getContractFactory("Token");
    let TestTokenFactory = await ethers.getContractFactory("TestToken");
	let USDCTokenFactory = await ethers.getContractFactory("USDCTestToken")
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

    FACTORIES = {BruFactory, BruPoolFactory, TestTokenFactory, BruPriceFactory};

    [SignerA, SignerB, SignerC, SignerD, SignerToken, SignerTreasury, SignerRandom] = await ethers.getSigners();
    const QUORUM = 1;

    SIGNERS = {
        SignerA,
        SignerB,
        SignerC,
        SignerD,
        SignerToken,
        SignerTreasury,
        SignerRandom,
    };

    debug("started test");

    let TestTokenContract = await TestTokenFactory.deploy(CONSTANTS.MINT_AMOUNT);
    await TestTokenContract.deployed();
    debug(`Deployed Test Token Contract with ${TestTokenContract.address}`);

	let USDCTestToken = await USDCTokenFactory.deploy(CONSTANTS.MINT_AMOUNT);
	await USDCTestToken.deployed();
	debug(`Deployed USDC Test Token Contract with ${USDCTestToken.address})`);

    //Deploying Factory and its proxy
    let BruFactoryImplementation = await BruFactory.deploy();
    await BruFactoryImplementation.deployed();

    let BruFactoryProxy = await BruProxyFactory.deploy(BruFactoryImplementation.address);
    await BruFactoryProxy.deployed();

    BruFactoryProxy = await ethers.getContractAt("BruFactory", BruFactoryProxy.address);
    debug(`Deployed Bru Factory Contract with ${BruFactoryProxy.address}`);

    //Deploying pool and its proxy

    let BruPoolImplementation = await BruPoolFactory.deploy();
    await BruPoolImplementation.deployed();

    let BruPoolProxy = await BruProxyFactory.deploy(BruPoolImplementation.address);
    await BruPoolProxy.deployed();

    BruPoolProxy = await ethers.getContractAt("BruPool", BruPoolProxy.address);

    let TokenVestingBruImplementation = await TokenVestingBruFactory.deploy();
    await TokenVestingBruImplementation.deployed();

    let TokenVestingBruProxy = await BruProxyFactory.deploy(TokenVestingBruImplementation.address);
    await TokenVestingBruProxy.deployed();

    TokenVestingBruProxy = await ethers.getContractAt("VestingBurn", TokenVestingBruProxy.address);

    //Deploying Wallets and their proxies

    let ReserveWalletImplementation = await ReserveWalletFactory.deploy();
    await ReserveWalletImplementation.deployed();

    let ReserveWalletProxy = await BruProxyFactory.deploy(ReserveWalletImplementation.address);
    await ReserveWalletProxy.deployed();

    ReserveWalletProxy = await ethers.getContractAt("ReserveWallet", ReserveWalletProxy.address);
    let UnclaimedCashflowWalletImplementation = await UnclaimeCasflowFactory.deploy();
    await UnclaimedCashflowWalletImplementation.deployed();
    let UnclaimedCashflowWalletProxy = await BruProxyFactory.deploy(UnclaimedCashflowWalletImplementation.address);
    await UnclaimedCashflowWalletProxy.deployed();

    UnclaimedCashflowWalletProxy = await await ethers.getContractAt(
        "UnClaimedCashFlowWallet",
        UnclaimedCashflowWalletProxy.address
    );
    let NIImarginImplementation = await NIImarginFactory.deploy();
    await NIImarginImplementation.deployed();

    let NIImarginProxy = await BruProxyFactory.deploy(NIImarginImplementation.address);
    await NIImarginProxy.deployed();

    NIImarginProxy = await ethers.getContractAt("NIIMargin", NIImarginProxy.address);
    //deploying BruOracle and its proxy
    let BruOracleImplementation = await BruOracleFactory.deploy();
    await BruOracleImplementation.deployed();

    let BruOracleProxy = await BruProxyFactory.deploy(BruOracleImplementation.address);
    await BruOracleProxy.deployed();

    BruOracleProxy = await ethers.getContractAt("BruOracle", BruOracleProxy.address);

    //deploying bru rewards and its proxy

    let BruRewardsImplementation = await BruRewardsFactory.deploy();
    await BruRewardsImplementation.deployed();

    let BruRewardsProxy = await BruProxyFactory.deploy(BruRewardsImplementation.address);
    await BruRewardsProxy.deployed();

    BruRewardsProxy = await ethers.getContractAt("BruRewards", BruRewardsProxy.address);

    //Deploying BruPrice and its proxy
    let BruPriceImplementation = await BruPriceFactory.deploy();
    await BruPriceImplementation.deployed();

    let BruPriceProxy = await BruProxyFactory.deploy(BruPriceImplementation.address);
    await BruPriceProxy.deployed();

    BruPriceProxy = await ethers.getContractAt("BruPrice", BruPriceProxy.address);
    //Deploying multisig and its proxy
    let MultiSigImplementation = await MultiSigFactory.deploy();
    await MultiSigImplementation.deployed();

    let MultiSigProxy = await BruProxyFactory.deploy(MultiSigImplementation.address);
    await MultiSigProxy.deployed();
    let AssetTreasuryContract = await AssetTreasuryFactory.deploy(
        BruPoolProxy.address,
        SignerA.address,
        MultiSigProxy.address
    );
    await AssetTreasuryContract.deployed();

    let TestOracleContract = await TestOracleFactory.deploy();
    await TestOracleContract.deployed();

    await expect(AssetTreasuryFactory.deploy(nullAddr, SignerA.address, MultiSigProxy.address)).to.be.revertedWith(
        "zero address not allowed"
    );
    await expect(
        BruTokenFactory.deploy(
            "BruToken",
            "BT",
            "250000000000000000000000000",
            nullAddr,
            MultiSigProxy.address,
            NIImarginProxy.address
        )
    ).to.be.revertedWith("Invalid address");
    let BruTokenContract = await BruTokenFactory.deploy(
        "BruToken",
        "BT",
        "250000000000000000000000000",
        TokenVestingBruProxy.address,
        MultiSigProxy.address,
        NIImarginProxy.address
    );
    await BruTokenContract.deployed();
    debug("token contracts deployed");
    await expect(PoolTokenFactory.deploy("BruBonds - IndiaAgro", "BondToken", nullAddr)).to.be.revertedWith(
        "Invalid address"
    );
    let PoolTokenContract = await PoolTokenFactory.deploy("BruBonds - IndiaAgro", "BondToken", MultiSigProxy.address);

    await PoolTokenContract.deployed();
    debug(`Deployed Pool Token Contract with ${PoolTokenContract.address}`);
    debug("multiSig proxy", MultiSigProxy.address);

    await expect(InterestTokenFactory.deploy("InterestToken - IndiaAgro", "", nullAddr)).to.be.revertedWith(
        "Invalid address"
    );
    let InterestTokenContract = await InterestTokenFactory.deploy(
        "InterestToken - IndiaAgro",
        "",
        MultiSigProxy.address
    );
    await InterestTokenContract.deployed();
    debug(`Deployed Interest Token Contract with ${InterestTokenContract.address}`);

    MultiSigProxy = await ethers.getContractAt("MultiSig", MultiSigProxy.address);

    let BruRouterImplementation = await BruRouterFactory.deploy();
    await BruRouterImplementation.deployed();

    let BruRouterProxy = await BruProxyFactory.deploy(BruRouterImplementation.address);
    await BruRouterProxy.deployed();

    BruRouterProxy = await ethers.getContractAt("BruRouter", BruRouterProxy.address);
    debug("orute address", BruRouterProxy.address);

    //Initializiing Proxies
    await MultiSigProxy.connect(SignerA).initialize({
        factoryAddress: BruFactoryProxy.address,
        quorum: QUORUM,
        approvers: [SignerA.address, SignerB.address, SignerC.address, SignerD.address],
        routerAddress: BruRouterProxy.address,
        reserveWalletAddress: ReserveWalletProxy.address,
        NIIWalletAddress: NIImarginProxy.address,
        burnVestingAddress: TokenVestingBruProxy.address,
        rewardsAddress: BruRewardsProxy.address,
        oracleAddress: BruOracleProxy.address,
        tokenAddress: BruTokenContract.address,
        treasuryAddress: AssetTreasuryContract.address,
        unClaimedWalletAddress: UnclaimedCashflowWalletProxy.address,
        bruPriceAddress: BruPriceProxy.address,
    });
    await expect(
        TokenVestingBruProxy.connect(SignerA).initialize(
            BruTokenContract.address,
            MultiSigProxy.address,
            NIImarginProxy.address,
            BruRewardsProxy.address,
            nullAddr,
            BruOracleProxy.address
        )
    ).to.be.revertedWith("Invalid Address");

    await TokenVestingBruProxy.connect(SignerA).initialize(
        BruTokenContract.address,
        MultiSigProxy.address,
        NIImarginProxy.address,
        BruRewardsProxy.address,
        BruFactoryProxy.address,
        BruOracleProxy.address
    );
    debug("token contracts deployed");
    await expect(ReserveWalletProxy.connect(SignerA).initialize(nullAddr, NIImarginProxy.address)).to.be.revertedWith(
        "Invalid Address"
    );
    await ReserveWalletProxy.connect(SignerA).initialize(MultiSigProxy.address, NIImarginProxy.address);
    await expect(
        UnclaimedCashflowWalletProxy.connect(SignerA).initialize(
            MultiSigProxy.address,
            NIImarginProxy.address,
            BruTokenContract.address,
            nullAddr
        )
    ).to.be.revertedWith("Invalid Address");

    await UnclaimedCashflowWalletProxy.connect(SignerA).initialize(
        MultiSigProxy.address,
        NIImarginProxy.address,
        BruTokenContract.address,
        TestTokenContract.address
    );
    await expect(
        NIImarginProxy.connect(SignerA).initialize(
            ReserveWalletProxy.address,
            MultiSigProxy.address,
            BruPoolProxy.address,
            TokenVestingBruProxy.address,
            BruTokenContract.address,
            TestTokenContract.address,
            nullAddr
        )
    ).to.be.revertedWith("Invalid Address");
    await NIImarginProxy.connect(SignerA).initialize(
        ReserveWalletProxy.address,
        MultiSigProxy.address,
        BruPoolProxy.address,
        TokenVestingBruProxy.address,
        BruTokenContract.address,
        TestTokenContract.address,
        UnclaimedCashflowWalletProxy.address
    );
    await expect(BruOracleProxy.connect(SignerA).initialize(nullAddr)).to.be.revertedWith("zero address not allowed");
    await BruOracleProxy.connect(SignerA).initialize(MultiSigProxy.address);
    await expect(
        BruRewardsProxy.connect(SignerA).initialize(
            MultiSigProxy.address,
            nullAddr,
            BruTokenContract.address,
            TokenVestingBruProxy.address,
            BruOracleProxy.address
        )
    ).to.be.revertedWith("Invalid Address");
    await BruRewardsProxy.connect(SignerA).initialize(
        MultiSigProxy.address,
        BruFactoryProxy.address,
        BruTokenContract.address,
        TokenVestingBruProxy.address,
        BruOracleProxy.address
    );
    await expect(BruPriceProxy.connect(SignerA).initialize(nullAddr)).to.be.revertedWith("incorrect address");
    await BruPriceProxy.connect(SignerA).initialize(MultiSigProxy.address);
    await expect(BruFactoryProxy.connect(SignerA).initialize(nullAddr, nullAddr)).to.be.revertedWith(
        "zero address not allowed"
    );
    await BruFactoryProxy.connect(SignerA).initialize(MultiSigProxy.address, BruTokenContract.address);

    debug("token contracts after NII", BruRouterProxy.addresss);
    await expect(
        BruPoolProxy.connect(SignerA).initialize(
            0,
            BruRouterProxy.address,
            nullAddr,
            BruFactoryProxy.address,
            PoolTokenContract.address,
            InterestTokenContract.address,
            AssetTreasuryContract.address,
            "IndiaAgro",
            NIImarginProxy.address,
            BruRewardsProxy.address,
            BruPriceProxy.address
        )
    ).to.be.revertedWith("Invalid Address");
    await BruPoolProxy.connect(SignerA).initialize(
        0,
        BruRouterProxy.address,
        MultiSigProxy.address,
        BruFactoryProxy.address,
        PoolTokenContract.address,
        InterestTokenContract.address,
        AssetTreasuryContract.address,
        "IndiaAgro",
        NIImarginProxy.address,
        BruRewardsProxy.address,
        BruPriceProxy.address
    );

    await MultiSigProxy.createProposal(
        [0],
        32,
        [
            BruPoolProxy.address,
            BruPoolImplementation.address,
            PoolTokenContract.address,
            InterestTokenContract.address,
            AssetTreasuryContract.address,
        ],
        ["IndiaAgro"]
    );

    await MultiSigProxy.connect(SignerA).approveTransfer(32, getProposalCounter());
    increaseProposalCounter();

    debug("token contracts after NII");

    //Deploying router proxy and its implementation
    await expect(BruRouterProxy.connect(SignerA).initialize(nullAddr, MultiSigProxy.address)).to.be.revertedWith(
        "wrong address passed"
    );
    await BruRouterProxy.connect(SignerA).initialize(BruFactoryProxy.address, MultiSigProxy.address);
    await MultiSigProxy.createProposal([0], 7, [TestTokenContract.address], [""]);

	
    await MultiSigProxy.connect(SignerA).approveTransfer(7, getProposalCounter());
    increaseProposalCounter();
	// creating a proposal to allow USDC token
	await MultiSigProxy.createProposal([0], 7, [USDCTestToken.address], [""]);
	debug("proposal created for uSDC test token");
	await MultiSigProxy.connect(SignerA).approveTransfer(7, getProposalCounter());
	 increaseProposalCounter();
	debug("allowing USDC Token address in the pool");
    debug("proposal counter", getProposalCounter());
    debug("Allowing token address in the pool");
    await MultiSigProxy.createProposal([0], 23, [BruPoolProxy.address], [""]);
    await MultiSigProxy.connect(SignerA).approveTransfer(23, getProposalCounter());
    increaseProposalCounter();
    debug("setting address in contracts");
    await MultiSigProxy.createProposal([0], 24, [BruPoolProxy.address], [""]);
    await MultiSigProxy.connect(SignerA).approveTransfer(24, getProposalCounter());
    increaseProposalCounter();
    debug("setting address in contracts", getProposalCounter());
    

    //Adding Proxy to global
    PROXIES = {
        BruFactoryProxy,
        BruPoolProxy,
        MultiSigProxy,
        BruRouterProxy,
        NIImarginProxy,
        ReserveWalletProxy,
        UnclaimedCashflowWalletProxy,
        TokenVestingBruProxy,
        BruRewardsProxy,
        BruPriceProxy,
        BruOracleProxy,
    };

    //Adding Contracts to global
    CONTRACTS = {
        BruTokenContract,
        TestTokenContract,
        PoolTokenContract,
        InterestTokenContract,
        AssetTreasuryContract,
        TestOracleContract,
		USDCTestToken
		
    };
    // debug(CONTRACTS,PROXIES,"contracts");
    debug(
        "Factory:",
        PROXIES.BruFactoryProxy.address,
        "POOL",
        PROXIES.BruPoolProxy.address,
        "ROUTER",
        PROXIES.BruRouterProxy.address,
        "BruRewards",
        PROXIES.BruRewardsProxy.address,
        "BRUORACLE",
        PROXIES.BruOracleProxy.address,
        "Multisig",
        PROXIES.MultiSigProxy.address,
        "VESTING",
        PROXIES.TokenVestingBruProxy.address,
        "Reserve",
        PROXIES.ReserveWalletProxy.address,
        "unclaimed wallet",
        PROXIES.UnclaimedCashflowWalletProxy.address,
        "NII margin",
        PROXIES.NIImarginProxy.address,
        "Bru price",
        PROXIES.BruPriceProxy.address,
        "BRU token",
        CONTRACTS.BruTokenContract.address,
        "test ttoken",
        CONTRACTS.TestTokenContract.address,
        "Pool token",
        CONTRACTS.PoolTokenContract.address,
        "interest token",
        CONTRACTS.InterestTokenContract.address
    );
}

export async function deployImplementationContracts() {
    let BruFactory = await ethers.getContractFactory("BruFactory");
    let BruPoolFactory = await ethers.getContractFactory("BruPool");
    let BruRouterFactory = await ethers.getContractFactory("BruRouter");
    let BruRewardsFactory = await ethers.getContractFactory("BruRewards");
    let BruOracleFactory = await ethers.getContractFactory("BruOracle");
    let BruPriceFactory = await ethers.getContractFactory("BruPrice");

    let MultiSigFactory = await ethers.getContractFactory("MultiSig");

    let TokenVestingBruFactory = await ethers.getContractFactory("VestingBurn");

    let ReserveWalletFactory = await ethers.getContractFactory("ReserveWallet");
    let UnclaimeCasflowFactory = await ethers.getContractFactory("UnClaimedCashFlowWallet");
    let NIImarginFactory = await ethers.getContractFactory("NIIMargin");

    let BruFactoryImplementationContract = await BruFactory.deploy();
    await BruFactoryImplementationContract.deployed();

    let BruPoolImplementationContract = await BruPoolFactory.deploy();
    await BruPoolImplementationContract.deployed();

    let BruRouterImplementationContract = await BruRouterFactory.deploy();
    await BruRouterImplementationContract.deployed();

    let BruRewardsImplementationContract = await BruRewardsFactory.deploy();
    await BruRewardsImplementationContract.deployed();

    let BruOracleImplementationContract = await BruOracleFactory.deploy();
    await BruOracleImplementationContract.deployed();

    let MultiSigImplementationContract = await MultiSigFactory.deploy();
    await MultiSigImplementationContract.deployed();

    let TokenVestingImplementationContract = await TokenVestingBruFactory.deploy();
    await TokenVestingImplementationContract.deployed();

    let ReserveWalletImplementationContract = await ReserveWalletFactory.deploy();
    await ReserveWalletImplementationContract.deployed();

    let UnclaimedCashflowWalletImplementationContract = await UnclaimeCasflowFactory.deploy();
    await UnclaimedCashflowWalletImplementationContract.deployed();

    let NIIMarginImplementationContract = await NIImarginFactory.deploy();
    await NIIMarginImplementationContract.deployed();

    let BruPriceImplementationContract = await BruPriceFactory.deploy();
    await BruPriceImplementationContract.deployed();

    IMPLEMENTATION_CONTRACTS = {
        BruFactoryImplementationContract,
        BruPoolImplementationContract,
        BruRouterImplementationContract,
        BruRewardsImplementationContract,
        BruOracleImplementationContract,
        MultiSigImplementationContract,
        TokenVestingImplementationContract,
        ReserveWalletImplementationContract,
        UnclaimedCashflowWalletImplementationContract,
        NIIMarginImplementationContract,
        BruPriceImplementationContract,
    };
}
