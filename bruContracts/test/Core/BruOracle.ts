import {expect, assert} from "chai";
import {
    deploy,
    PROXIES,
    CONTRACTS,
    SIGNERS,
    IMPLEMENTATION_CONTRACTS,
    getProposalCounter,
    increaseProposalCounter,
    deployImplementationContracts,
} from "./../shared/deploy";

describe("BruOracle Contract Tests", async () => {
    before(async function () {
        await deploy();
        await deployImplementationContracts();
    });

    it("should initialize BruOracle Tests", async () => {
        expect(true).to.equals(true);
    });

    it("should fail while initializing BruOracle initializer", async () => {
        await expect(
            PROXIES.BruOracleProxy.connect(SIGNERS.SignerA).initialize(PROXIES.MultiSigProxy.address)
        ).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("should set the price of BruToken in the BruOracle contract", async () => {
        let bruTokenPrice = "200000000000000000000";
        await PROXIES.MultiSigProxy.createProposal([bruTokenPrice], 25, [], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(25, getProposalCounter());
        increaseProposalCounter();
        let bruTokenPriceFromContract = await PROXIES.BruOracleProxy.getBruTokenPrice();
        expect(bruTokenPrice).to.be.equals(bruTokenPriceFromContract.toString());
    });

    it("should set the price feed of given Token in the BruOracle contract", async () => {
        await PROXIES.MultiSigProxy.createProposal([], 53, [CONTRACTS.TestTokenContract.address, CONTRACTS.TestOracleContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(53, getProposalCounter());
        increaseProposalCounter();
        let priceFeed = await PROXIES.BruOracleProxy.priceFeeds(CONTRACTS.TestTokenContract.address);
        expect(CONTRACTS.TestOracleContract.address).to.be.equals(priceFeed);
    });

    it("should fail while setting price of BruToken in the BruOracle contract", async () => {
        let bruTokenPrice = "200000000000000000000";
        await expect(
            PROXIES.BruOracleProxy.connect(SIGNERS.SignerA).setBruTokenPrice(bruTokenPrice)
        ).to.be.revertedWith("Can be used only by admin");
    });

    it("should fail while setting pricefeed in the BruOracle contract", async () => {
        await expect(
            PROXIES.BruOracleProxy.connect(SIGNERS.SignerA).setPriceFeedForToken(CONTRACTS.TestTokenContract.address, CONTRACTS.TestOracleContract.address)
        ).to.be.revertedWith("Can be used only by admin");
    });

    it("should fetch USDT price from oracle ", async () => {
        let price = await PROXIES.BruOracleProxy.getLatestPriceOfTokenInUSD(CONTRACTS.TestTokenContract.address);
    });

    it("should upgrade the BruOracle Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            [0],
            36,
            [IMPLEMENTATION_CONTRACTS.BruOracleImplementationContract.address],
            [""]
        );
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(36, getProposalCounter());
        increaseProposalCounter();
    });

    it("should fail while upgrading the BruOracle contract", async () => {
        await expect(
            PROXIES.BruOracleProxy.connect(SIGNERS.SignerA).upgradeTo(
                IMPLEMENTATION_CONTRACTS.BruOracleImplementationContract.address
            )
        ).to.be.revertedWith("Can be used only by admin");
    });
});
