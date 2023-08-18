import {expect} from "chai";
import {
    deploy,
    PROXIES,
    SIGNERS,
    nullAddr,
    CONTRACTS,
    IMPLEMENTATION_CONTRACTS,
    getProposalCounter,
    increaseProposalCounter,
    deployImplementationContracts,
} from "./../shared/deploy";

describe("BruFactory Contract Tests", async () => {
    before(async function () {
        await deploy();
        await deployImplementationContracts();
    });

    it("should initialize BruFactory Tests", async () => {
        expect(true).to.equals(true);
    });

    it("should fail while initializing BruFactory initializer", async () => {
        await expect(
            PROXIES.BruFactoryProxy.connect(SIGNERS.SignerA).initialize(
                PROXIES.MultiSigProxy.address,
                CONTRACTS.BruTokenContract.address
            )
        ).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("should fail while adding pool details in the BruFactory contract", async () => {
        await expect(
            PROXIES.BruFactoryProxy.addPoolDetails(
                "IndiaAgro-Test",
                PROXIES.BruPoolProxy.address,
                IMPLEMENTATION_CONTRACTS.BruPoolImplementationContract.address,
                CONTRACTS.PoolTokenContract.address,
                CONTRACTS.InterestTokenContract.address,
                CONTRACTS.AssetTreasuryContract.address
            )
        ).to.be.revertedWith("Can be used only by admin");
    });

    it("should fail while initializing as zero address is not passed", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            [0],
            32,
            [
                IMPLEMENTATION_CONTRACTS.BruPoolImplementationContract.address,
                IMPLEMENTATION_CONTRACTS.BruPoolImplementationContract.address,
                CONTRACTS.PoolTokenContract.address,
                CONTRACTS.InterestTokenContract.address,
                nullAddr,
            ],
            ["IndiaAgro"]
        );

        await expect(
            PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(32, getProposalCounter())
        ).to.be.revertedWith("incorrect address");
        increaseProposalCounter();
    });

    it("should show pool details from BruFactory contract", async () => {
        let proxyPoolAddress = await PROXIES.BruFactoryProxy.getPoolAddress(0);
    });

    it("should fail while showing pool details from BruFactory contract", async () => {
        await expect(PROXIES.BruFactoryProxy.getPoolAddress(3)).to.be.revertedWith("Pool does not exist");
    });

    it("should upgrade the BruFactory Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            [0],
            13,
            [IMPLEMENTATION_CONTRACTS.BruFactoryImplementationContract.address],
            [""]
        );
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(13, getProposalCounter());
        increaseProposalCounter();
    });
    it("should revert if more than max allowed pools are added", async () => {
        for (var i = 0; i < 98; i++) {
            await PROXIES.MultiSigProxy.createProposal(
                [0],
                32,
                [
                    IMPLEMENTATION_CONTRACTS.BruPoolImplementationContract.address,
                    IMPLEMENTATION_CONTRACTS.BruPoolImplementationContract.address,
                    CONTRACTS.PoolTokenContract.address,
                    CONTRACTS.InterestTokenContract.address,
                    CONTRACTS.AssetTreasuryContract.address,
                ],
                ["IndiaAgro"]
            );
        PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(32, getProposalCounter())
        increaseProposalCounter();

        }
        await PROXIES.MultiSigProxy.createProposal(
            [0],
            32,
            [
                IMPLEMENTATION_CONTRACTS.BruPoolImplementationContract.address,
                IMPLEMENTATION_CONTRACTS.BruPoolImplementationContract.address,
                CONTRACTS.PoolTokenContract.address,
                CONTRACTS.InterestTokenContract.address,
                CONTRACTS.AssetTreasuryContract.address,
            ],
            ["IndiaAgro"]
        );
    await expect(PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(32, getProposalCounter())).to.be.revertedWith("Max pool limit reached");
    increaseProposalCounter();
    });

    it("should fail while upgrading the BruFactory contract", async () => {
        await expect(
            PROXIES.BruFactoryProxy.connect(SIGNERS.SignerA).upgradeTo(
                IMPLEMENTATION_CONTRACTS.BruFactoryImplementationContract.address
            )
        ).to.be.revertedWith("Can be used only by admin");
    });
});
