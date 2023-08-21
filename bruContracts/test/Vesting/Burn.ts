// import { Contract, ContractFactory } from "ethers";
import {should, expect, assert} from "chai";
import {ethers} from "hardhat";
import {deploy, SIGNERS, PROXIES,getProposalCounter,
    increaseProposalCounter, CONTRACTS, CONSTANTS} from "./../shared/deploy";
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
        await PROXIES.MultiSigProxy.connect(owner).approveTransfer(28, 6);
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
    it("Should revert for category 0", async function () {
        await expect(
            PROXIES.TokenVestingBruProxy.createVestingScheduleForCategory(100, 16615100, owner.address, 0)
        ).to.be.revertedWith("category passed as 0 or beneficiary does not belong to this category");
    });
    it("Should add new address to category", async function () {
        await PROXIES.TokenVestingBruProxy.addAddressToCategory("0xC2517898ccb09017B6B844a25aF692BDc1E01CF6", 1);
        await expect(PROXIES.TokenVestingBruProxy.addAddressToCategory(nullAddr, 1)).to.be.revertedWith(
            "zero address not allowed"
        );

        let categoryDetails = await PROXIES.TokenVestingBruProxy.getCategoryParams(1);
        expect("0xC2517898ccb09017B6B844a25aF692BDc1E01CF6").to.equal(categoryDetails.memberAddresses[1]);
    });
    it("withdraw few funds to owenr address", async function () {
        let initialBalance = await CONTRACTS.BruTokenContract.balanceOf(owner.address);
        await PROXIES.TokenVestingBruProxy.withdraw("10000230");
        let finalBalance = await CONTRACTS.BruTokenContract.balanceOf(owner.address);
        expect(parseInt(finalBalance, 10) - parseInt(initialBalance, 10)).to.equal(10000230);
    });
    it("return balances Accordingly", async function () {
        await PROXIES.TokenVestingBruProxy.burnTokensFromCategory(1, "5000");
    });
});
function typeOf(vestingscheduleId: any): any {
    throw new Error("Function not implemented.");
}

