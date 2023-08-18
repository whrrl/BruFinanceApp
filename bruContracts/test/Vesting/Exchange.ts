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
} from "./../shared/deploy";
import {increaseTime} from "./../shared/time";
describe("Exchange Contract Tests", async () => {
    before(async function () {
        await deploy();
        await deployImplementationContracts();
    });

    it("should fail while user is exchaning tokens as exchange interval is not active", async () => {
        await expect(PROXIES.TokenVestingBruProxy.exchangeTokens("10000")).to.be.revertedWith(
            "Exchange interval has been completed"
        );
    });

    it("should faile while burning tokens as address is not allowed to burn", async () => {
        await expect(
            CONTRACTS.BruTokenContract.burn(SIGNERS.SignerA.address, "1000000000000000000")
        ).to.be.revertedWith("not allowed to burn");
    });

    

    it("should fail while starting exchange period as token price is zero", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            [0, "5", "1000000000000000000", "10000000000000000"],
            29,
            [CONTRACTS.TestTokenContract.address],
            [""]
        );
        await expect(
            PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(29, getProposalCounter())
        ).to.be.revertedWith("Exchange rate should be greater than zero");

        increaseProposalCounter();
    });

    it("should fail while starting exchange period as token address is invalid", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            ["100000000000000000", "5", "1000000000000000000", "10000000000000000"],
            29,
            [nullAddr],
            [""]
        );
        await expect(
            PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(29, getProposalCounter())
        ).to.be.revertedWith("invalid token address");
        increaseProposalCounter();
    });

    it("should start exchange period", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            ["100000000000000000", "5", "1000000000000000000", "10000000000000000"],
            29,
            [CONTRACTS.TestTokenContract.address],
            [""]
        );
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(29, getProposalCounter());
        increaseProposalCounter();
    });

    it("should fail while starting exchange period as previous exchange is active", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            ["100000000000000000", "5", "1000000000000000000", "10000000000000000"],
            29,
            [CONTRACTS.TestTokenContract.address],
            [""]
        );

        await expect(
            PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(29, getProposalCounter())
        ).to.be.revertedWith("Previous exchange is active");
        increaseProposalCounter();
    });

    it("should fail while user is exchanging tokens as user limit is reaached for exchanging", async () => {
        await expect(PROXIES.TokenVestingBruProxy.exchangeTokens("100000000000000001")).to.be.revertedWith(
            "User limit reached for exchanging tokens"
        );
    });

    it("should fail while user is exchanging tokens as interval limit is reaached for exchanging", async () => {
        await expect(PROXIES.TokenVestingBruProxy.exchangeTokens("10000000000000000001")).to.be.revertedWith(
            "Interval limit reached for exchanging tokens"
        );
    });

    

    it("should fail while user is exchaning tokens as exchange interval is not active", async () => {
        await increaseTime(86400*6)
        await expect(PROXIES.TokenVestingBruProxy.exchangeTokens("10000")).to.be.revertedWith(
            "Exchange interval has been completed"
        );
    });

    it("should fail while upgrading token vesting contract", async () => [
        await expect(
            PROXIES.TokenVestingBruProxy.upgradeTo(IMPLEMENTATION_CONTRACTS.TokenVestingImplementationContract.address)
        ).to.be.revertedWith("Only admin allowed"),
    ]);
});
