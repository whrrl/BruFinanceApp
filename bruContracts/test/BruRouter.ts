import {expect} from "chai";
import {
    deploy,
    PROXIES,
    SIGNERS,
    IMPLEMENTATION_CONTRACTS,
    getProposalCounter,
    increaseProposalCounter,
    deployImplementationContracts,
} from "./shared/deploy";

describe("BruRouter Contract Tests", async () => {
    before(async function () {
        await deploy();
        await deployImplementationContracts();
    });

    it("should initialize BruOracle Tests", async () => {
        expect(true).to.equals(true);
    });

    it("should fail while initializing BruRouter initializer", async () => {
        await expect(
            PROXIES.BruRouterProxy.connect(SIGNERS.SignerA).initialize(
                PROXIES.BruFactoryProxy.address,
                PROXIES.MultiSigProxy.address
            )
        ).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("should get proxy pool address by index from BruRouter contract", async () => {
        await PROXIES.BruRouterProxy.getPoolAddress(0);
    });

    it("should get pool details by index from BruRouter contract", async () => {
        await PROXIES.BruRouterProxy.getPoolDetails(0);
    });

    it("should all the pool details from BruRouter contract", async () => {
        let poolDetails = await PROXIES.BruRouterProxy.getAllPoolDetails();
        expect(poolDetails.length).greaterThan(0);
    });

    it("should upgrade BruRouter Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            [0],
            12,
            [IMPLEMENTATION_CONTRACTS.BruRouterImplementationContract.address],
            [""]
        );
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(12, getProposalCounter());
        increaseProposalCounter();
    });

    it("should fail while upgrading the BruRouter contract", async () => {
        await expect(
            PROXIES.BruRouterProxy.connect(SIGNERS.SignerA).upgradeTo(
                IMPLEMENTATION_CONTRACTS.BruRouterImplementationContract.address
            )
        ).to.be.revertedWith("Only admin allowed");
    });
});
