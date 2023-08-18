import {expect} from "chai";
import {
    deploy,
    PROXIES,
    IMPLEMENTATION_CONTRACTS,
    SIGNERS,
    getProposalCounter,
    increaseProposalCounter,
    deployImplementationContracts,
} from "./../shared/deploy";

describe("NIIMargin Contract Tests", async () => {
    before(async function () {
        await deploy();
        await deployImplementationContracts();
    });

    it("should initialize NIIMargin Tests", async () => {
        expect(true).to.equals(true);
    });

    it("should upgrade NIIMagrin Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            [0],
            18,
            [IMPLEMENTATION_CONTRACTS.NIIMarginImplementationContract.address],
            [""]
        );
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(18, getProposalCounter());
        increaseProposalCounter();
    });

    it("should fail while upgrading NIIMargin contract", async () => {
        await expect(
            PROXIES.NIImarginProxy.upgradeTo(IMPLEMENTATION_CONTRACTS.NIIMarginImplementationContract.address)
        ).to.be.revertedWith("Only admin allowed");
    });
});
