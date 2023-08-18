import {ethers} from "hardhat";
import {expect} from "chai";
import {increaseTime} from "./../shared/time";
import {deploy, PROXIES, SIGNERS, CONTRACTS, CONSTANTS} from "./../shared/deploy";

describe("BorrowPrice Tests", async () => {
    before(async function () {
        await deploy();
    });

    it("Initialize tests", async () => {
        expect(true).to.equals(true);
    });

    var nftJson = {
        nftId: "629def50f278e416bbd210cd",
        commodity: "SOYABEEN",
        commodityId: "5f5f0f5edeed643fcc3428af",
        quantity: 9900,
        nftPrice: "200000000000000000000",
        pool: 0,
        dataHash: "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=",
    };
    // this test case checks if  the nft is minted correctly or not
    it("should mint Asset", async () => {
        let mintTx = await CONTRACTS.AssetTreasuryContract.mintNft(
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
    });
    //  this test case checks when we try to borrow amount if the neccessary details are stored or not
    it("Borrow against Asset", async () => {
        let borrowAmount = "20000000000000000000";
        await CONTRACTS.TestTokenContract.mint(PROXIES.BruPoolProxy.address, CONSTANTS.MINT_AMOUNT);
        await PROXIES.BruRouterProxy.borrow(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, borrowAmount);
        let result = await PROXIES.BruPoolProxy.borrowedNft(nftJson.nftId);
        expect(ethers.utils.formatUnits(borrowAmount, 18)).to.equals(
            ethers.utils.formatUnits(result.borrowedAmount, 18)
        );
    });
    // this test case checks when we return the complete borrow amount some part is shared to the interest wallet i.e interest payment and platform fees so the borrow amount is not 0 as
    it("Repay complete loan amount", async () => {
        let repayAmount = "20002000000000000000";
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, repayAmount);
        await PROXIES.BruRouterProxy.repay(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, repayAmount);
    });

    it("Borrow against Asset", async () => {
        let borrowAmount = "20000000000000000000";
        await CONTRACTS.TestTokenContract.mint(PROXIES.BruPoolProxy.address, CONSTANTS.MINT_AMOUNT);
        await PROXIES.BruRouterProxy.borrow(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, borrowAmount);
        let result = await PROXIES.BruPoolProxy.borrowedNft(nftJson.nftId);
        expect(ethers.utils.formatUnits(borrowAmount, 18)).to.equals(
            ethers.utils.formatUnits(result.borrowedAmount, 18)
        );
    });
    // this test case checks when we return the complete borrow amount some part is shared to the interest wallet i.e interest payment and platform fees so the borrow amount is not 0 as
    it("Repay complete loan amount", async () => {
        increaseTime(86400*15)
        let repayAmount = await PROXIES.BruPoolProxy.getRepaymentAmount(nftJson.nftId);
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, repayAmount);
        await PROXIES.BruRouterProxy.repay(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, repayAmount);
        let nftDetails  = await PROXIES.BruPoolProxy.borrowedNft(nftJson.nftId)
        expect(parseInt(ethers.utils.formatUnits(nftDetails.borrowedAmount, 18))).to.equals(0);
    });


});
