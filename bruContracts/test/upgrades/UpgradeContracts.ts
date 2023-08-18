import {should, expect, assert} from "chai";
import {deploy, PROXIES, SIGNERS, CONTRACTS, IMPLEMENTATION_CONTRACTS, getProposalCounter, increaseProposalCounter, deployImplementationContracts} from "../shared/deploy";

describe("Upgrade Tests", async () => {
    before(async () => {
        await deploy();
        await deployImplementationContracts();
    });

    it("Should always pass", async () => {
        expect(true).equals(true);
    });

    it("should upgrade BruRouter Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal([0], 12, [IMPLEMENTATION_CONTRACTS.BruRouterImplementationContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(12, getProposalCounter());
        increaseProposalCounter();
    });

    it("should upgrade BruPool Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal([0], 14, [IMPLEMENTATION_CONTRACTS.BruPoolImplementationContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(14, getProposalCounter());
        increaseProposalCounter();
    });


    it("should upgrade BruRewards Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal([0], 35, [IMPLEMENTATION_CONTRACTS.BruRewardsImplementationContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(35, getProposalCounter());
        increaseProposalCounter();
    });

    it("should upgrade MultiSig Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal([0], 15, [IMPLEMENTATION_CONTRACTS.MultiSigImplementationContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(15, getProposalCounter());
        increaseProposalCounter();
    });
    it("should upgrade TokenVesting Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal([0], 16, [IMPLEMENTATION_CONTRACTS.TokenVestingImplementationContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(16, getProposalCounter());
        increaseProposalCounter();
    });



});
