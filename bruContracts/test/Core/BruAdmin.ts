import {expect, should} from "chai";
import {
    deploy,
    nullAddr,
    PROXIES,
    SIGNERS,
    CONTRACTS,
    getProposalCounter,
    increaseProposalCounter,
    deployImplementationContracts,
} from "./../shared/deploy";

describe("BruAdmin Contract Tests", async () => {
    before(async function () {
        await deploy();
    });

    it("should initialize BruAdmin Tests", async () => {
        expect(true).to.equals(true);
    });

    it("should fail while adding token to the pool as it is given a zero address",async()=>{
        await PROXIES.MultiSigProxy.createProposal([0], 7, [nullAddr], [""]);
        await expect(PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(7, getProposalCounter())).to.be.revertedWith("Invalid Address");
        increaseProposalCounter();
    })

    it("should disable token address in the pool", async () => {
        await PROXIES.MultiSigProxy.createProposal([0], 45, [CONTRACTS.TestTokenContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(45, getProposalCounter());
        increaseProposalCounter();
        await PROXIES.MultiSigProxy.createProposal([0], 45, [CONTRACTS.TestTokenContract.address], [""]);
        await expect(
            PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(45, getProposalCounter())
        ).to.be.revertedWith("Not allowed by the admin");
        increaseProposalCounter();

        await PROXIES.MultiSigProxy.createProposal([0], 7, [CONTRACTS.TestTokenContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(7, getProposalCounter());
        increaseProposalCounter();
        await PROXIES.MultiSigProxy.createProposal([0], 7, [CONTRACTS.PoolTokenContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(7, getProposalCounter());
        increaseProposalCounter();
        await PROXIES.MultiSigProxy.createProposal([0], 7, [CONTRACTS.BruTokenContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(7, getProposalCounter());
        increaseProposalCounter();
        await PROXIES.MultiSigProxy.createProposal([0], 7, [CONTRACTS.InterestTokenContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(7, getProposalCounter());
        increaseProposalCounter();
        await PROXIES.MultiSigProxy.createProposal([0], 45, [CONTRACTS.BruTokenContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(45, getProposalCounter());
        increaseProposalCounter();
    });

    it("should fail while starting pool borrow interest rate as admin address is not intiating it ", async () => {
        await expect(PROXIES.BruPoolProxy.changeBorrowInterestRate("300000000000")).to.be.revertedWith(
            "Can be used only by admin"
        );
    });

    it("should fail while starting rewards period as it not the rewards contract initiating it", async () => {
        await expect(PROXIES.BruPoolProxy.startRewards("100000000000")).to.be.revertedWith(
            "only rewards contract can access"
        );
    });

    it("should fail while starting pool rewards apy ", async () => {
        await expect(
            PROXIES.BruPoolProxy.mintNft(1, "1", "1", "20000", "300000000000", "test", "test")
        ).to.be.revertedWith("only treasury allowed");
    });

    
});
