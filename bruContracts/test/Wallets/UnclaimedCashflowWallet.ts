import {expect} from "chai";
import {
    deploy,
    PROXIES,
    SIGNERS,
    IMPLEMENTATION_CONTRACTS,
    getProposalCounter,
    increaseProposalCounter,
    deployImplementationContracts,
} from "./../shared/deploy";

describe("UnclaimedCashflowWallet Contract Tests", async () => {
    before(async function () {
        await deploy();
        await deployImplementationContracts();
    });

    it("should initialize UnclaimedCashflowWallet Tests", async () => {
        expect(true).to.equals(true);
    });

    it("should upgrade Unclaimed Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            [0],
            41,
            [IMPLEMENTATION_CONTRACTS.UnclaimedCashflowWalletImplementationContract.address],
            [""]
        );
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(41, getProposalCounter());
        increaseProposalCounter();
    });

    it("should fail while upgrading UnclaimedCashflowWallet contract", async () => {
        await expect(
            PROXIES.UnclaimedCashflowWalletProxy.upgradeTo(
                IMPLEMENTATION_CONTRACTS.UnclaimedCashflowWalletImplementationContract.address
            )
        ).to.be.revertedWith("Only admin allowed");
    });
});
