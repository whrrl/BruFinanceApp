import {ethers} from "hardhat";
import {expect} from "chai";
import {
    deploy,
    PROXIES,
    SIGNERS,
    CONTRACTS,
    CONSTANTS,
    IMPLEMENTATION_CONTRACTS,
    getProposalCounter,
    increaseProposalCounter,
    deployImplementationContracts,
} from "./../shared/deploy";
import {increaseTime} from "../shared/time";
const {constants} = require("@openzeppelin/test-helpers");

describe("Incentive Tests", async () => {
    const poolIndex = 0;
    before(async function () {
        await deploy();
        await deployImplementationContracts();
        await PROXIES.MultiSigProxy.createProposal([1, 25], 28, [], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(28, getProposalCounter());
        increaseProposalCounter();
    });

    it("Initialize tests", async () => {
        expect(true).to.equals(true);
    });

    it("Change emission", async () => {
        const nullAddr = constants.ZERO_ADDRESS;
        let value = ethers.utils.parseUnits("3000");
        await PROXIES.MultiSigProxy.createProposal([value], 20, [nullAddr], [""]);
        await PROXIES.MultiSigProxy.approveTransfer(20, getProposalCounter());
        increaseProposalCounter();
        expect(ethers.utils.formatEther(await PROXIES.BruRewardsProxy.emission())).to.be.equal(
            ethers.utils.formatEther(value)
        );
    });

    it("should fail while changing values of emission", async () => {
        await expect(PROXIES.BruRewardsProxy.changeEmission("50000000000")).to.be.revertedWith(
            "Can be used only by admin"
        );
    });

    it("should get reward APY", async () => {
        let incentiveAPY = await PROXIES.BruRewardsProxy.getRewardAPY();
        //    console.log(ethers.utils.formatEther(incentiveAPY))
        expect(ethers.utils.formatEther(incentiveAPY)).to.be.equal("0.02628");
    });

    it("Change emission back to its original value", async () => {
        const nullAddr = constants.ZERO_ADDRESS;
        let value = ethers.utils.parseUnits("1000");
        await PROXIES.MultiSigProxy.createProposal([value], 20, [nullAddr], [""]);
        await PROXIES.MultiSigProxy.approveTransfer(20, getProposalCounter());
        increaseProposalCounter();
        expect(ethers.utils.formatEther(await PROXIES.BruRewardsProxy.emission())).to.be.equal(
            ethers.utils.formatEther(value)
        );
    });

    it("Starting rewards", async () => {
        const nullAddr = constants.ZERO_ADDRESS;
        let rates = await PROXIES.BruPoolProxy.rates();
        await PROXIES.MultiSigProxy.createProposal([0, "5"], 21, [nullAddr], [""]);
        await PROXIES.MultiSigProxy.approveTransfer(21, getProposalCounter());
        increaseProposalCounter();
        // let rewardIntervalStatus = await PROXIES.BruRewardsProxy.getRewardStatusForPool(0);
        let rewardIntervalStatus = await PROXIES.BruRewardsProxy.getRewardStatusForPool(0);
        expect(rewardIntervalStatus).to.equal(true);
    });

    it("should fail while starting rewards", async () => {
        const nullAddr = constants.ZERO_ADDRESS;
        await PROXIES.MultiSigProxy.createProposal([0, "5"], 21, [nullAddr], [""]);
        await expect(PROXIES.MultiSigProxy.approveTransfer(21, getProposalCounter())).to.be.revertedWith(
            "An interval is already active"
        );
        increaseProposalCounter();
    });

    it("should deposit while rewards are active", async () => {
        await CONTRACTS.TestTokenContract.mint(SIGNERS.SignerA.address, CONSTANTS.MINT_AMOUNT);
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, CONSTANTS.DEPOSIT_AMOUNT);
        await PROXIES.BruRouterProxy.deposit(0, CONTRACTS.TestTokenContract.address, CONSTANTS.DEPOSIT_AMOUNT);
        let balance = await CONTRACTS.BruTokenContract.balanceOf(SIGNERS.SignerA.address);
    });

    it("should borrow while rewards are active", async () => {
        var nftJson = {
            nftId: "629def50f278e416bbd210cd",
            commodity: "SOYABEEN",
            commodityId: "5f5f0f5edeed643fcc3428af",
            quantity: 9900,
            nftPrice: "200000000000000000000",
            pool: 0,
            dataHash: "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=",
        };
        await CONTRACTS.AssetTreasuryContract.mintNft(
            SIGNERS.SignerA.address,
            nftJson.nftId,
            nftJson.commodityId,
            nftJson.quantity,
            nftJson.nftPrice,
            nftJson.dataHash,
            JSON.stringify(nftJson)
        );

        let nftData = await PROXIES.BruPoolProxy.nft(nftJson.nftId);

        expect(nftData.quantity).to.equal(nftJson.quantity);
        let borrowAmount = "20000000000000000000";
        await CONTRACTS.TestTokenContract.mint(PROXIES.BruPoolProxy.address, CONSTANTS.MINT_AMOUNT);
        await PROXIES.BruRouterProxy.borrow(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, borrowAmount);
        let result = await PROXIES.BruPoolProxy.borrowedNft(nftJson.nftId);
        expect(ethers.utils.formatUnits(borrowAmount, 18)).to.equals(
            ethers.utils.formatUnits(result.borrowedAmount, 18)
        );
    });

    it("should get the latest rewards interval", async () => {
        let rewardsIntervalDetails = await PROXIES.BruRewardsProxy.getLatestRewardIntervalForPool(0);
        expect(rewardsIntervalDetails.isActive).to.be.eql(true);
    });

    it("should deposit while rewards are active", async () => {
        await CONTRACTS.TestTokenContract.mint(SIGNERS.SignerA.address, CONSTANTS.MINT_AMOUNT);
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, CONSTANTS.DEPOSIT_AMOUNT);
        await PROXIES.BruRouterProxy.deposit(0, CONTRACTS.TestTokenContract.address, CONSTANTS.DEPOSIT_AMOUNT);
    });

    it("should borrow while rewards are active", async () => {
        var nftJson = {
            nftId: "629def50f278e416bbd210ce",
            commodity: "SOYABEEN",
            commodityId: "5f5f0f5edeed643fcc3428af",
            quantity: 9900,
            nftPrice: "200000000000000000000",
            pool: 0,
            dataHash: "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=",
        };
        await CONTRACTS.AssetTreasuryContract.mintNft(
            SIGNERS.SignerB.address,
            nftJson.nftId,
            nftJson.commodityId,
            nftJson.quantity,
            nftJson.nftPrice,
            nftJson.dataHash,
            JSON.stringify(nftJson)
        );

        let nftData = await PROXIES.BruPoolProxy.nft(nftJson.nftId);

        expect(nftData.quantity).to.equal(nftJson.quantity);
        let borrowAmount = "20000000000000000000";
        await CONTRACTS.TestTokenContract.mint(PROXIES.BruPoolProxy.address, CONSTANTS.MINT_AMOUNT);
        await PROXIES.BruRouterProxy.connect(SIGNERS.SignerB).borrow(
            0,
            nftJson.nftId,
            CONTRACTS.TestTokenContract.address,
            borrowAmount
        );
        let result = await PROXIES.BruPoolProxy.borrowedNft(nftJson.nftId);
        expect(ethers.utils.formatUnits(borrowAmount, 18)).to.equals(
            ethers.utils.formatUnits(result.borrowedAmount, 18)
        );
    });

    it("should fail while updating balance in BruRewards contract", async () => {
        await expect(
            PROXIES.BruRewardsProxy.updateLendAmountInRewardsInterval(0, SIGNERS.SignerA.address, "5000000000000000000")
        ).to.be.revertedWith("Only pools can access");
    });

    it("should fail while stopping rewards as rewards interval is not over", async () => {
        const nullAddr = constants.ZERO_ADDRESS;
        await PROXIES.MultiSigProxy.createProposal([0], 22, [nullAddr], [""]);
        await expect(PROXIES.MultiSigProxy.approveTransfer(22, getProposalCounter())).to.be.revertedWith(
            "Rewards duration not completed"
        );
        increaseProposalCounter();
    });

    it("should fail while claiming rewards as rewards interval is active", async () => {
        await expect(PROXIES.BruRewardsProxy.claimRewards(0, 0)).to.be.revertedWith("Rewards interval does not exist");
    });

    it("should allow users to claim their rewards", async () => {
        await expect(PROXIES.BruRewardsProxy.claimRewards(0, 1)).to.be.revertedWith("Rewards duration not completed");
    });

    it("should fail while claiming rewards as rewards interval does not exist ", async () => {
        await expect(PROXIES.BruRewardsProxy.claimRewards(0, 2)).to.be.revertedWith("Rewards interval does not exist");
    });

    //failing due to distribute rewards in token vesting
    it("Stopping rewards", async () => {
        const nullAddr = constants.ZERO_ADDRESS;
        await PROXIES.TokenVestingBruProxy.connect(SIGNERS.SignerA).setCategoryParams(
            "trial",
            [SIGNERS.SignerA.address],
            0,
            1,
            1,
            true
        );
        // await PROXIES.MultiSigProxy.createProposal([0, 25], 28, [nullAddr], [""]);
        await increaseTime(86400 * 5);
        // await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(28, getProposalCounter());
        // increaseProposalCounter();
        await PROXIES.MultiSigProxy.createProposal([0], 22, [nullAddr], [""]);
        await PROXIES.MultiSigProxy.approveTransfer(22, getProposalCounter());
        increaseProposalCounter();
        let rewardIntervalStatus = await PROXIES.BruRewardsProxy.getRewardStatusForPool(0);
        expect(rewardIntervalStatus).to.equal(false);
    });

    it("should allow users to claim their rewards", async () => {
        await PROXIES.BruRewardsProxy.claimRewards(0, 1);
    });
    it("should allow users to claim their rewards", async () => {
        await expect(PROXIES.BruRewardsProxy.claimRewards(0, 1)).to.be.revertedWith("Rewards has already been claimed");
    });

    it("should fail while stopping rewards interval as interval is not active", async () => {
        const nullAddr = constants.ZERO_ADDRESS;
        await PROXIES.MultiSigProxy.createProposal([0], 22, [nullAddr], ["1"]);
        await expect(PROXIES.MultiSigProxy.approveTransfer(22, getProposalCounter())).to.be.revertedWith(
            "rewards should be active"
        );
        increaseProposalCounter();
    });

    it("should start exchange period", async () => {
        await CONTRACTS.TestTokenContract.mint(
            PROXIES.NIImarginProxy.address,
            "1000000000000000000000000000000000000000"
        );
        await PROXIES.MultiSigProxy.createProposal(
            ["100000000000000000", "5", "1000000000000000000", "10000000000000000"],
            29,
            [CONTRACTS.TestTokenContract.address],
            [""]
        );
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(29, getProposalCounter());
        increaseProposalCounter();
    });

    it("should initiate an exchange request from the user", async () => {
        await CONTRACTS.BruTokenContract.approve(PROXIES.TokenVestingBruProxy.address, "100000");
        await PROXIES.TokenVestingBruProxy.exchangeTokens("100000");
    });

   

    it("should upgrade BruRewards contract", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            [0],
            35,
            [IMPLEMENTATION_CONTRACTS.BruRewardsImplementationContract.address],
            [""]
        );
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(35, getProposalCounter());
        increaseProposalCounter();
    });

    it("should failing while upgrading BruRewards contract", async () => {
        await expect(
            PROXIES.BruRewardsProxy.connect(SIGNERS.SignerA).upgradeTo(
                IMPLEMENTATION_CONTRACTS.BruRewardsImplementationContract.address
            )
        ).to.be.revertedWith("Only admin allowed");
    });
});
