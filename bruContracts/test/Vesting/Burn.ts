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
        await PROXIES.MultiSigProxy.connect(owner).approveTransfer(28, 7);
        await CONTRACTS.TestTokenContract.mint(PROXIES.BruPoolProxy.address, "125000000000000000000000000");
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
        let burnTokenAmount = ethers.utils.parseUnits("500000");
        await PROXIES.TokenVestingBruProxy.burnTokensFromCategory(1, burnTokenAmount);
        await expect(
            PROXIES.TokenVestingBruProxy.burnTokensFromCategory(1, "100000000000000000000000000")
        ).to.be.revertedWith("this category does not have enough tokens");

        await CONTRACTS.TestTokenContract.mint(PROXIES.BruPoolProxy.address, "30000000000000000000000000");
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

    it("claim dividend during the claim period", async function () {
        // setting category parameters category ID
        await PROXIES.TokenVestingBruProxy.createVestingScheduleForCategory(100000000000, 1, owner.address, 2);
        await increaseTime(68);
        let vestingScheduleId = PROXIES.TokenVestingBruProxy.getVestingIdAtIndex(2);
        await PROXIES.TokenVestingBruProxy.release(vestingScheduleId, 100000000000);
        await CONTRACTS.TestTokenContract.mint(PROXIES.NIImarginProxy.address, "125000000000000000000000000");
        let balanceofuser = await CONTRACTS.BruTokenContract.balanceOf(owner.address);
        await PROXIES.MultiSigProxy.createProposal([0], 38, [CONTRACTS.TestTokenContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(owner).approveTransfer(38, 8);
        let initialBalance = await CONTRACTS.TestTokenContract.balanceOf(owner.address);
        await PROXIES.NIImarginProxy.connect(owner).claimDividend();
        await expect(PROXIES.NIImarginProxy.connect(owner).claimDividend()).to.be.revertedWith("already claimed");
        let finalBalance = await CONTRACTS.TestTokenContract.balanceOf(owner.address);
        expect(parseInt(initialBalance, 10)).to.lessThan(parseInt(finalBalance, 10));
    });
    it("claim dividend after the claim period ended", async function () {
        await PROXIES.MultiSigProxy.createProposal([0], 39, [nullAddr], [""]);
        await PROXIES.MultiSigProxy.connect(owner).approveTransfer(39, 9);
        await PROXIES.MultiSigProxy.createProposal([0], 38, [CONTRACTS.TestTokenContract.address], [""]);
        await PROXIES.MultiSigProxy.connect(owner).approveTransfer(38, 10);
        await PROXIES.TokenVestingBruProxy.createVestingScheduleForCategory(100000000000, 1, owner.address, 2);
        await increaseTime(6800000000);
        let vestingScheduleId = PROXIES.TokenVestingBruProxy.getVestingIdAtIndex(3);
        await PROXIES.TokenVestingBruProxy.release(vestingScheduleId, 100000000000);
        let balanceofuser = await CONTRACTS.BruTokenContract.balanceOf(owner.address);
        await PROXIES.MultiSigProxy.createProposal([0], 39, [nullAddr], [""]);
        await PROXIES.MultiSigProxy.connect(owner).approveTransfer(39, 11);

        let initialBalance = await CONTRACTS.TestTokenContract.balanceOf(owner.address);
        // console.log(initialBalance, "dividend");

        await PROXIES.UnclaimedCashflowWalletProxy.connect(owner).claimUnClaimedDividend();
        let finalBalance = await CONTRACTS.TestTokenContract.balanceOf(owner.address);
        expect("10000000000014749794599").to.equal(finalBalance.toString());
    });
    it("Should revert for category 0", async function () {
        await expect(
            PROXIES.TokenVestingBruProxy.createVestingScheduleForCategory(100, 16615100, owner.address, 0)
        ).to.be.revertedWith("category passed as 0 or beneficiary does not belong to this category");
    });
    it("should return right values for getters", async function () {
        let count = await PROXIES.TokenVestingBruProxy.getVestingSchedulesCountByBeneficiary(owner.address);
        expect(4).to.equal(parseInt(count, 10));
        let vestingschedule = await PROXIES.TokenVestingBruProxy.getVestingScheduleByAddressAndIndex(owner.address, 2);
        expect("100000000000").to.equal(parseInt(vestingschedule.amountTotal, 10).toString());
        let totalVestedAmount = await PROXIES.TokenVestingBruProxy.getVestingSchedulesTotalAmount();
        expect("100000000000").to.equal(parseInt(totalVestedAmount, 10).toString());
        let AddressOfToken = await PROXIES.TokenVestingBruProxy.getToken();
        expect(AddressOfToken).to.equal(CONTRACTS.BruTokenContract.address);
        let categoryParams = await PROXIES.TokenVestingBruProxy.getCategoryParams(1);
        expect(categoryParams.categoryName).to.equal("trial");
        let vestingscheduleId = await PROXIES.TokenVestingBruProxy.getVestingIdAtIndex(1);
        let vestingschedulefromfunction = await PROXIES.TokenVestingBruProxy.getVestingSchedule(vestingscheduleId);
        expect(100000000000).to.equal(parseInt(vestingschedulefromfunction.amountTotal, 10));
    });
    it("Should add new address to category", async function () {
        await PROXIES.TokenVestingBruProxy.addAddressToCategory("0xC2517898ccb09017B6B844a25aF692BDc1E01CF6", 1);
        await expect(PROXIES.TokenVestingBruProxy.addAddressToCategory(nullAddr, 1)).to.be.revertedWith(
            "zero address not allowed"
        );

        let categoryDetails = await PROXIES.TokenVestingBruProxy.getCategoryParams(1);
        expect("0xC2517898ccb09017B6B844a25aF692BDc1E01CF6").to.equal(categoryDetails.memberAddresses[1]);
    });
    it("Should create new vesting schedule with customized params", async function () {
        await expect(
            PROXIES.TokenVestingBruProxy.createVestingSchedule(nullAddr, 16715100, 100, 1000, 1, true, "1321", 3)
        ).to.be.revertedWith("incorrect category/address");
        // console.log("difference");

        await expect(
            PROXIES.TokenVestingBruProxy.createVestingSchedule(owner.address, 16715100, 100, 1000, 1, true, "1321", 0)
        ).to.be.revertedWith("incorrect category/address");
        await PROXIES.TokenVestingBruProxy.createVestingSchedule(owner.address, 16715100, 100, 1000, 1, true, 1321, 1);
        let vestingschedule = await PROXIES.TokenVestingBruProxy.getVestingScheduleByAddressAndIndex(owner.address, 4);
        expect(parseInt(vestingschedule.amountTotal, 10)).to.equal(1321);
    });
    it("revoke a vesting schedule", async function () {
        let vestingscheduleId = await PROXIES.TokenVestingBruProxy.getVestingIdAtIndex(4);
        await expect(PROXIES.TokenVestingBruProxy.revoke(vestingscheduleId, 2)).to.be.revertedWith(
            "vesting schedule does not belong to this category"
        );
        await PROXIES.TokenVestingBruProxy.revoke(vestingscheduleId, 1);
        let vestingschedule = await PROXIES.TokenVestingBruProxy.getVestingScheduleByAddressAndIndex(owner.address, 4);
        expect(vestingschedule.revoked).to.equal(true);
        await expect(PROXIES.TokenVestingBruProxy.revoke(vestingscheduleId, 1)).to.be.revertedWithoutReason();
    });
    it("withdraw few funds to owenr address", async function () {
        let initialBalance = await CONTRACTS.BruTokenContract.balanceOf(owner.address);
        await PROXIES.TokenVestingBruProxy.withdraw("10000230");
        let finalBalance = await CONTRACTS.BruTokenContract.balanceOf(owner.address);
        expect(parseInt(finalBalance, 10) - parseInt(initialBalance, 10)).to.equal(10000230);
    });
    it("should pause functionality but still return releasable amount", async function () {
        await PROXIES.MultiSigProxy.createProposal([0], 34, [nullAddr], [""]);
        await PROXIES.MultiSigProxy.connect(owner).approveTransfer(34, 12);
        await expect(
            PROXIES.TokenVestingBruProxy.createVestingSchedule(addr1.address, 16715100, 100, 1000, 1, true, "1321", 1)
        ).to.be.revertedWith("Core functionalities disabled");
        let vestingscheduleId = await PROXIES.TokenVestingBruProxy.getVestingIdAtIndex(1);
        let amountreleasable = await PROXIES.TokenVestingBruProxy.computeReleasableAmount(vestingscheduleId);
        expect(parseInt(amountreleasable, 10).toString()).to.equal("100000000000");
        await PROXIES.MultiSigProxy.createProposal([0], 34, [nullAddr], [""]);
        await PROXIES.MultiSigProxy.connect(owner).approveTransfer(34, 13);
        await PROXIES.TokenVestingBruProxy.createVestingSchedule(
            addr1.address,
            16715100,
            16715100000,
            1000,
            1,
            true,
            1321,
            1
        );
        let vestingscheduleIdforcliffcheck = await PROXIES.TokenVestingBruProxy.getVestingIdAtIndex(5);
        let amountreleasablecliffcheck = await PROXIES.TokenVestingBruProxy.computeReleasableAmount(
            vestingscheduleIdforcliffcheck
        );
        expect(parseInt(amountreleasablecliffcheck, 10)).to.equal(0);
        await PROXIES.TokenVestingBruProxy.createVestingSchedule(
            addr1.address,
            currentTime(),
            1,
            112,
            1,
            true,
            "1312121212121212122",
            1
        );
        await increaseTime(56);
        let vestingscheduleIdForInBetweenCheck = await PROXIES.TokenVestingBruProxy.getVestingIdAtIndex(6);
        let amountreleasableForInBetweenCheck = await PROXIES.TokenVestingBruProxy.computeReleasableAmount(
            vestingscheduleIdForInBetweenCheck
        );
        expect(parseInt(amountreleasableForInBetweenCheck, 10)).to.lessThan(1312121212121212122);
        expect(parseInt(amountreleasableForInBetweenCheck, 10)).to.greaterThan(659642857142857100);
    });
    it("should issue new tokens not equal to burned tokens last quarter", async function () {
        await PROXIES.TokenVestingBruProxy.startQuarter();
        await PROXIES.TokenVestingBruProxy.recordTVL();
        let quarterIdSecondTime = await PROXIES.TokenVestingBruProxy.quarterId();
        // console.log(quarterIdSecondTime);
        let quarterTVLMappingSecondTime = await PROXIES.TokenVestingBruProxy.quarterTVLMapping(quarterIdSecondTime);
        // console.log(quarterTVLMappingSecondTime.initialQuarterBalance, "initial quarter balance");
        await increaseTime(7000000);
        await PROXIES.TokenVestingBruProxy.createVestingScheduleForCategory(100, currentTime(), owner.address, 2);
        await expect(
            PROXIES.TokenVestingBruProxy.createVestingScheduleForCategory(100, currentTime(), owner.address, 2)
        ).to.be.revertedWith("max limit for schedules reached");

        // let burnTokenAmountSecondTime = ethers.utils.parseUnits("50");
        await PROXIES.TokenVestingBruProxy.burnTokensFromCategory(1, "5000");
        await CONTRACTS.TestTokenContract.mint(PROXIES.BruPoolProxy.address, "30000000000000000000000000");
        await increaseTime(889229);
        let previousBalanceSecondTime = await CONTRACTS.BruTokenContract.balanceOf(
            PROXIES.TokenVestingBruProxy.address
        );
        await PROXIES.TokenVestingBruProxy.recordTVL();
        let quarterTVLMappingPostquarterSecondTime = await PROXIES.TokenVestingBruProxy.quarterTVLMapping(
            quarterIdSecondTime
        );
        // console.log(quarterTVLMappingPostquarterSecondTime.finalQuarterBalance, "final balance");
        let postBalanceSecondTime = await CONTRACTS.BruTokenContract.balanceOf(PROXIES.TokenVestingBruProxy.address);
        // console.log(parseInt(postBalanceSecondTime, 10).toString(), parseInt(previousBalanceSecondTime, 10).toString());
        // expect(parseInt(postBalanceSecondTime,10).toString()).to.equal();
    });
    it("include all require Fail cases", async function () {
        await expect(
            PROXIES.TokenVestingBruProxy.connect(addr1).setCategoryParams("trial", [owner.address], 0, 100, 1, true)
        ).to.be.revertedWith("only deployer allowed");
        await expect(PROXIES.TokenVestingBruProxy.connect(addr1).changePauseStatus()).to.be.revertedWith(
            "only admin allowed"
        );
        await PROXIES.MultiSigProxy.createProposal([1, 25], 28, [nullAddr], [""]);
        await expect(PROXIES.MultiSigProxy.connect(owner).approveTransfer(28, 14)).to.be.revertedWith(
            "distribution already added"
        );
        await PROXIES.TokenVestingBruProxy.connect(owner).setCategoryParams(
            "category 3",
            [addr1.address],
            0,
            100,
            1,
            true
        );
        await PROXIES.MultiSigProxy.createProposal([3, 60], 28, [nullAddr], [""]);
        await expect(PROXIES.MultiSigProxy.connect(owner).approveTransfer(28, 15)).to.be.revertedWith(
            "percentage not allowed"
        );
        await expect(PROXIES.TokenVestingBruProxy.getVestingIdAtIndex(13)).to.be.revertedWith(
            "TokenVesting: index out of bounds"
        );
        await expect(
            PROXIES.TokenVestingBruProxy.createVestingSchedule(
                addr1.address,
                16715100,
                100,
                1000,
                1,
                true,
                "1000000000000000000000000000",
                1
            )
        ).to.be.revertedWith("TokenVesting: cannot create vesting schedule because not sufficient tokens");
        await expect(
            PROXIES.TokenVestingBruProxy.createVestingSchedule(owner.address, 16715100, 100, 1000, 1, true, "10", 1)
        ).to.be.revertedWith("max limit for schedules reached");

        await expect(
            PROXIES.TokenVestingBruProxy.createVestingSchedule(
                addr1.address,
                16715100,
                100,
                1000,
                1,
                true,
                "100000000000000000000000000",
                1
            )
        ).to.be.revertedWith("insufficient balance");
        await expect(
            PROXIES.TokenVestingBruProxy.createVestingSchedule(addr1.address, 16715100, 100, 0, 1, true, "100000000", 1)
        ).to.be.revertedWith("TokenVesting: duration must be > 0");
        await expect(
            PROXIES.TokenVestingBruProxy.createVestingSchedule(addr1.address, 16715100, 100, 1000, 1, true, 0, 1)
        ).to.be.revertedWith("TokenVesting: amount must be > 0");
        await expect(
            PROXIES.TokenVestingBruProxy.createVestingSchedule(addr1.address, 16715100, 100, 1000, 0, true, "10000", 1)
        ).to.be.revertedWith("TokenVesting: slicePeriodSeconds must be >= 1");
        await PROXIES.TokenVestingBruProxy.createVestingSchedule(
            addr1.address,
            16715100,
            100,
            1000,
            1,
            false,
            "10000",
            1
        );
        let vestingscheduleId = await PROXIES.TokenVestingBruProxy.getVestingIdAtIndex(8);
        // console.log(vestingscheduleId,"Id");
        await expect(PROXIES.TokenVestingBruProxy.computeReleasableAmount("0x274996539fafc4b0887fdcfbe1c73bc1147c223b1ebedc6e4e8462a80701d2c7")).to.be.revertedWithoutReason();

        
        await expect(PROXIES.TokenVestingBruProxy.revoke(vestingscheduleId, 1)).to.be.revertedWith(
            "TokenVesting: vesting is not revocable"
        );
        await PROXIES.TokenVestingBruProxy.createVestingSchedule(
            addr1.address,
            currentTime(),
            1000,
            10000,
            1,
            true,
            "10000",
            1
        );
        let vestingscheduleIdSecond = await PROXIES.TokenVestingBruProxy.getVestingIdAtIndex(9);
        await expect(PROXIES.TokenVestingBruProxy.withdraw("131212121212112842626246212122")).to.be.revertedWith(
            "TokenVesting: not enough withdrawable funds"
        );
        await expect(
            PROXIES.TokenVestingBruProxy.connect(addr2).release(vestingscheduleIdSecond, "1000")
        ).to.be.revertedWith("TokenVesting: only beneficiary and owner can release vested tokens");
        await expect(PROXIES.TokenVestingBruProxy.release(vestingscheduleIdSecond, "1000")).to.be.revertedWith(
            "TokenVesting: cannot release tokens, not enough vested tokens"
        );
        await PROXIES.TokenVestingBruProxy.startQuarter();
        await expect(PROXIES.TokenVestingBruProxy.startQuarter()).to.be.revertedWithoutReason();
        for (var i = 0; i < 7; i++) {
            await PROXIES.TokenVestingBruProxy.connect(owner).setCategoryParams(
                "trial",
                [owner.address],
                0,
                100,
                1,
                true
            );
        }
        await expect(
            PROXIES.TokenVestingBruProxy.connect(owner).setCategoryParams("trial", [owner.address], 0, 100, 1, true)
        ).to.be.revertedWith("max categories reaches");
        await expect(PROXIES.TokenVestingBruProxy.distributeRewards(10)).to.be.revertedWith(
            "only BruRewards can access this"
        );
        await expect(PROXIES.UnclaimedCashflowWalletProxy.changeMaxAllowedUnClaimed(10)).to.be.revertedWith(
            "Can be used only by adminAddress"
        );
        await expect(PROXIES.BruPoolProxy.startRewards(10)).to.be.revertedWith("only rewards contract can access");
        await expect(CONTRACTS.BruTokenContract.enableMinting(owner.address)).to.be.revertedWith(
            "Can be used only by adminAddress"
        );
        await expect(CONTRACTS.BruTokenContract.createSnapshot()).to.be.revertedWith("usage restricted");
    });
    it("return balances Accordingly", async function () {
        await PROXIES.TokenVestingBruProxy.burnTokensFromCategory(1, "5000");
    });
    it("branching for wallets", async function () {
        await expect(PROXIES.NIImarginProxy.startClaimPeriod(CONTRACTS.TestTokenContract.address)).to.be.revertedWith(
            "Can be used only by adminAddress"
        );
        await expect(PROXIES.NIImarginProxy.setCashFlowClaimedMapping(1, owner.address, true)).to.be.revertedWith(
            "Only called by unclaimed wallet address"
        );
        let balanceOfNIIwallet = await PROXIES.NIImarginProxy.getBalance(CONTRACTS.BruTokenContract.address);
        expect(0).to.equal(parseInt(balanceOfNIIwallet, 10));
        await expect(
            PROXIES.NIImarginProxy.sendAmount(1000, CONTRACTS.TestTokenContract.address, owner.address)
        ).to.be.revertedWith("Only allowed by admin or pool or burn contract");
        // console.log(
        //     await CONTRACTS.TestTokenContract.balanceOf(PROXIES.ReserveWalletProxy.address),
        //     await CONTRACTS.TestTokenContract.balanceOf(PROXIES.NIImarginProxy.address)
        // );
        await PROXIES.MultiSigProxy.createProposal(
            ["100001212000000"],
            43,
            [CONTRACTS.TestTokenContract.address, addr1.address],
            [""]
        );
        await expect(PROXIES.MultiSigProxy.connect(addr6).approveTransfer(43, 16)).to.be.revertedWith(
            "only approver allowed"
        );
        await PROXIES.MultiSigProxy.connect(owner).approveTransfer(43, 16);
        await expect(PROXIES.MultiSigProxy.connect(addr1).approveTransfer(43, 16)).to.be.revertedWith(
            "Proposal already executed"
        );

        await PROXIES.MultiSigProxy.createProposal(
            ["88200000000000000000000000"],
            43,
            [CONTRACTS.TestTokenContract.address, owner.address],
            [""]
        );
        await expect(PROXIES.MultiSigProxy.connect(owner).approveTransfer(43, 17)).to.be.revertedWith(
            "currently we do not have enough balance"
        );
        await expect(PROXIES.NIImarginProxy.connect(owner).claimDividend()).to.be.revertedWith(
            "claim period ended try from different place"
        );
        let balanceOfReserveWallet = await PROXIES.ReserveWalletProxy.getBalance(CONTRACTS.BruTokenContract.address);
        let balanceOfUnclaimedWallet = await PROXIES.UnclaimedCashflowWalletProxy.getBalance(
            CONTRACTS.TestTokenContract.address
        );
        // console.log(balanceOfReserveWallet, balanceOfUnclaimedWallet);
        for (var i = 0; i < 60; i += 2) {
            await PROXIES.MultiSigProxy.createProposal([0], 38, [CONTRACTS.TestTokenContract.address], [""]);
            await PROXIES.MultiSigProxy.connect(owner).approveTransfer(38, 18 + i);

            await PROXIES.MultiSigProxy.createProposal([0], 39, [nullAddr], [""]);
            await PROXIES.MultiSigProxy.connect(owner).approveTransfer(39, 18 + i + 1);
        }
        // console.log(await PROXIES.NIImarginProxy.claimId(), "claimID");

        await PROXIES.UnclaimedCashflowWalletProxy.connect(owner).claimUnClaimedDividend();

        await expect(PROXIES.UnclaimedCashflowWalletProxy.connect(owner).claimUnClaimedDividend()).to.be.revertedWith(
            "come back later"
        );
    });
});
function typeOf(vestingscheduleId: any): any {
    throw new Error("Function not implemented.");
}

