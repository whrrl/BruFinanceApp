import {expect} from "chai";
import {
    deploy,
    deployImplementationContracts,
    PROXIES,
    SIGNERS,
    CONTRACTS,
    getProposalCounter,
    increaseProposalCounter,
    IMPLEMENTATION_CONTRACTS,
    nullAddr,
} from "../shared/deploy";
import {increaseTime} from "../shared/time";
describe("Exchange Contract Tests", async () => {
    before(async function () {
        await deploy();
        await deployImplementationContracts();
    });

    it("should fail as approver address is zero",async ()=>{
        await PROXIES.MultiSigProxy.createProposal(
            [],
            8,
            [nullAddr],
            [""]
        );
        await expect(
            PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(8, getProposalCounter())
        ).to.be.revertedWith("Invalid address");
        increaseProposalCounter();
    })

    it("should fail as approver address is zero",async ()=>{
        await PROXIES.MultiSigProxy.createProposal(
            [],
            9,
            [nullAddr],
            [""]
        );
        await expect(
            PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(9, getProposalCounter())
        ).to.be.revertedWith("Not approver");
        increaseProposalCounter();
    })

    it("should fail as approver address is zero",async ()=>{
        await PROXIES.MultiSigProxy.createProposal(
            [],
            9,
            [nullAddr],
            [""]
        );
        await expect(
            PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(9, getProposalCounter())
        ).to.be.revertedWith("Not approver");
        increaseProposalCounter();
    })

    it("should upgrade Multisig contract",async ()=>{
        await PROXIES.MultiSigProxy.createProposal([0], 15, [IMPLEMENTATION_CONTRACTS.MultiSigImplementationContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(15, getProposalCounter());
        increaseProposalCounter();
    })
    
    it("should not upgrade Multisig contract",async ()=>{
        await expect(PROXIES.MultiSigProxy.upgradeTo(IMPLEMENTATION_CONTRACTS.MultiSigImplementationContract.address)).to.be.revertedWith("Not authenticated")
    })
    
});
