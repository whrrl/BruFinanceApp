import {should, expect, assert} from "chai";
import {ethers} from "hardhat";
import {deploy, SIGNERS, PROXIES,getProposalCounter,
    increaseProposalCounter, CONTRACTS, CONSTANTS} from "./../shared/deploy-2";
import {increaseTime, currentTime} from "./../shared/time";
const {constants} = require("@openzeppelin/test-helpers");

describe("Burn Mechanism", async () => {
    const nullAddr = constants.ZERO_ADDRESS;
    let owner: any;
    let addr1: any;
    let addr2: any;
    let addr3: any;
    let addr4: any;
    let addr5: any;
    let addr6: any;
    let addrs: any;

    before(async () => {
        [owner, addr1, addr2, addr3, addr4, addr5, addr6, ...addrs] = await ethers.getSigners();
        await deploy();
        await PROXIES.MultiSigProxy.createProposal([], 53, [CONTRACTS.TestTokenContract.address, CONTRACTS.TestOracleContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(53, getProposalCounter());
        increaseProposalCounter();
    });

    it("Should always pass", async () => {
        expect(true).equals(true);
    });

    
    it("Should vest tokens  for a given category", async function () {
        await PROXIES.TokenVestingBruProxy.connect(owner).setCategoryParams("trial", [owner.address], 0, 100, 1, true);
        await PROXIES.MultiSigProxy.createProposal([1, 25], 28, [nullAddr], [""]);
        await PROXIES.MultiSigProxy.connect(owner).approveTransfer(28, 5);
        await PROXIES.TokenVestingBruProxy.createVestingScheduleForCategory(100, 16615100, owner.address, 1);
        increaseTime(100);
        let vestingScheduleId = await PROXIES.TokenVestingBruProxy.getVestingIdAtIndex(0);
        await PROXIES.TokenVestingBruProxy.release(vestingScheduleId, 100);
        let balance = await CONTRACTS.BruTokenContract.balanceOf(owner.address);
        expect(parseInt(balance, 10)).to.equals(100);
    });

    it("should burn 5000 tokens from category", async () => {
        let tokenAmountInCategory = await PROXIES.TokenVestingBruProxy.distributionMapping(1);
        let burnTokenAmount = ethers.utils.parseUnits("5000");
        await PROXIES.TokenVestingBruProxy.burnTokensFromCategory(1, burnTokenAmount);
        let tokenAmountAfterBurn = await PROXIES.TokenVestingBruProxy.distributionMapping(1);
        tokenAmountInCategory = ethers.utils.formatEther(tokenAmountInCategory.tokenAmountleft);
        tokenAmountAfterBurn = ethers.utils.formatEther(tokenAmountAfterBurn.tokenAmountleft);
        expect(Math.round(tokenAmountInCategory)).to.be.equal(Math.round(tokenAmountAfterBurn) + 5000);
    });

    it("issue new tokens according  to TVL ", async function () {
        
        await PROXIES.TokenVestingBruProxy.connect(owner).setCategoryParams(
            "trial",
            [owner.address],
            0,
            31556926,
            1,
            true
        );
        await PROXIES.MultiSigProxy.createProposal([2, 25], 28, [nullAddr], [""]);
        await PROXIES.MultiSigProxy.connect(owner).approveTransfer(28, 6);
        await CONTRACTS.TestTokenContract.mint(PROXIES.BruPoolProxy.address, "125000000000000000000000000000000000000");
        await PROXIES.TokenVestingBruProxy.startQuarter();
        await PROXIES.TokenVestingBruProxy.recordTVL();
        let quarterId = await PROXIES.TokenVestingBruProxy.quarterId();
        // console.log(quarterId);
        let quarterTVLMapping = await PROXIES.TokenVestingBruProxy.quarterTVLMapping(quarterId);
        // console.log(quarterTVLMapping.initialQuarterBalance, "initial quarter balance");
        await increaseTime(7000000);
        await PROXIES.TokenVestingBruProxy.createVestingScheduleForCategory(
            100000000000,
            currentTime(),
            owner.address,
            2
        );
        let burnTokenAmount = ethers.utils.parseUnits("0.001");
        await PROXIES.TokenVestingBruProxy.burnTokensFromCategory(1, burnTokenAmount);
        await expect(
            PROXIES.TokenVestingBruProxy.burnTokensFromCategory(1, "100000000000000000000000000")
        ).to.be.revertedWith("this category does not have enough tokens");

        await CONTRACTS.TestTokenContract.mint(PROXIES.BruPoolProxy.address, "3000000000000000000000000000000000000000000000000000000");
        await increaseTime(889229);
        let previousBalance = await CONTRACTS.BruTokenContract.balanceOf(PROXIES.TokenVestingBruProxy.address);
        await PROXIES.TokenVestingBruProxy.recordTVL();
        await expect(PROXIES.TokenVestingBruProxy.recordTVL()).to.be.revertedWith("3 months have not passed yet");
        let quarterTVLMappingPostquarter = await PROXIES.TokenVestingBruProxy.quarterTVLMapping(quarterId);
        // console.log(quarterTVLMappingPostquarter.finalQuarterBalance, "final balance");
        let postBalance = await CONTRACTS.BruTokenContract.balanceOf(PROXIES.TokenVestingBruProxy.address);
        // console.log(previousBalance, postBalance);
        await increaseTime(8891229);
        await expect(PROXIES.TokenVestingBruProxy.recordTVL()).to.be.revertedWith("TVL already recorded for this quater");
    });
})
