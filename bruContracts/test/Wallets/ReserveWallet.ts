import {expect} from "chai";
import {
    deploy,
    PROXIES,
    SIGNERS,
    CONTRACTS,
    IMPLEMENTATION_CONTRACTS,
    getProposalCounter,
    increaseProposalCounter,
    deployImplementationContracts,
} from "./../shared/deploy";

describe("ReserveWallet Contract Tests", async () => {
    before(async function () {
        await deploy();
        await deployImplementationContracts();
    });

    it("should initialize ReserveWallet Tests", async () => {
        expect(true).to.equals(true);
    });

    it("should fail transferTo as invalid address is invoking it", async () => {
        await expect(
            PROXIES.ReserveWalletProxy.transferTo(
                SIGNERS.SignerA.address,
                "1000000000000000000",
                CONTRACTS.TestTokenContract.address
            )
        ).to.be.revertedWith("Can be used only by NIIwallet");
    });

    it("should fail transferTo due to invalid value", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            ["10000000000000000000000000000"],
            40,
            [SIGNERS.SignerA.address, CONTRACTS.TestTokenContract.address],
            [""]
        );
        await expect(
            PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(40, getProposalCounter())
        ).to.be.revertedWith("reserve does not have enough liquidity");
        increaseProposalCounter();
    });

    it("should upgrade ReserveWallet Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            [0],
            19,
            [IMPLEMENTATION_CONTRACTS.ReserveWalletImplementationContract.address],
            [""]
        );
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(19, getProposalCounter());
        increaseProposalCounter();
    });

    it("should fail while upgrading ReserveWallet contract", async () => {
        await expect(
            PROXIES.ReserveWalletProxy.upgradeTo(IMPLEMENTATION_CONTRACTS.ReserveWalletImplementationContract.address)
        ).to.be.revertedWith("Only admin allowed");
    });
});
