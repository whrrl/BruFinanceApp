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

    it("should set commodity price per KG in BruPrice Contract", async () => {
        let assetValuePerKg = "10000000000000000000";
        await PROXIES.BruPriceProxy.updatePrice(nftJson.commodityId, assetValuePerKg);
        let assetValuePerKgFromContract = await PROXIES.BruPriceProxy.asset(nftJson.commodityId);
        expect(assetValuePerKg).to.be.equal(assetValuePerKgFromContract.toString());
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
    it("Repay Loan", async () => {
        await increaseTime(26301000);
        let repayAmount = "20002000000000000000";
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, repayAmount);
        await PROXIES.BruRouterProxy.repay(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, repayAmount);
        let result = await PROXIES.BruPoolProxy.borrowedNft(nftJson.nftId);
        expect(ethers.utils.formatUnits(result.borrowedAmount, 18)).to.equals("1.665753424657534246");
        let k = await CONTRACTS.TestTokenContract.balanceOf(PROXIES.NIImarginProxy.address);
        expect("1.667753424657534246").to.equals(ethers.utils.formatUnits(k, 18));
    });

    it("Repay Loan", async () => {
        await increaseTime(26301000);
        let repayAmount = "200000000000000000000000000000";
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, repayAmount);
        await expect(PROXIES.BruRouterProxy.repay(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, repayAmount)).to.be.revertedWith("amount greater than borrowed");
      
    });
});
