import {ethers} from "hardhat";
import {expect} from "chai";
import {increaseTime} from "./../shared/time";
import {deploy, PROXIES, CONTRACTS, CONSTANTS} from "./../shared/deploy";

describe("Borrow Tests", async () => {
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
    var nftJson1 = {
        nftId: "629def50f278esdds416bbd210cd",
        commodity: "SOYABEEN",
        commodityId: "5f5f0f5edeed643fcc3428af",
        quantity: 9900,
        nftPrice: "200000000000000000000",
        pool: 0,
        dataHash: "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=",
    };
    // this test case checks if  the nft is minted correctly or not
    it("Mint Asset", async () => {
        const [owner, addr1] = await ethers.getSigners();

        let mintTx = await CONTRACTS.AssetTreasuryContract.mintNft(
            owner.address,
            nftJson.nftId,
            nftJson.commodityId,
            nftJson.quantity,
            nftJson.nftPrice,
            nftJson.dataHash,
            JSON.stringify(nftJson)
        );
        await expect(
            CONTRACTS.AssetTreasuryContract.mintNft(
                owner.address,
                nftJson.nftId,
                nftJson.commodityId,
                nftJson.quantity,
                nftJson.nftPrice,
                nftJson.dataHash,
                JSON.stringify(nftJson)
            )
        ).to.be.revertedWith("minted already");

        let nftData = await PROXIES.BruPoolProxy.nft(nftJson.nftId);
        expect(nftData.quantity).to.equal(nftJson.quantity);
    });
    //  this test case checks when we try to borrow amount if the neccessary details are stored or not
    it("Borrow against Asset", async () => {
        const [owner] = await ethers.getSigners();
        let borrowAmount = "20000000000000000000";
        await CONTRACTS.TestTokenContract.mint(PROXIES.BruPoolProxy.address, CONSTANTS.MINT_AMOUNT);
        await PROXIES.BruRouterProxy.borrow(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, borrowAmount);
        await expect(
            PROXIES.BruPoolProxy.borrow(owner.address, nftJson.nftId, CONTRACTS.TestTokenContract.address, borrowAmount)
        ).to.be.revertedWith("only router contract can accesss this");
        let result = await PROXIES.BruPoolProxy.borrowedNft(nftJson.nftId);
        expect(ethers.utils.formatUnits(borrowAmount, 18)).to.equals(
            ethers.utils.formatUnits(result.borrowedAmount, 18)
        );
    });
    // this test case checks when we return the complete borrow amount some part is shared to the interest wallet i.e interest payment and platform fees so the borrow amount is not 0 as
    it("Repay Loan", async () => {
        await increaseTime(2592000);
        let repayAmount = "20002000000000000000";
        let details = await PROXIES.BruPoolProxy.totalExpense(nftJson.nftId);
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, 10);
        await PROXIES.BruRouterProxy.repay(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, 10);
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, repayAmount);
        await PROXIES.BruRouterProxy.repay(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, repayAmount);
        let result = await PROXIES.BruPoolProxy.borrowedNft(nftJson.nftId);
        expect(ethers.utils.formatUnits(result.borrowedAmount, 18)).to.equals("0.164383561643835607");
        let k = await CONTRACTS.TestTokenContract.balanceOf(PROXIES.NIImarginProxy.address);
        expect("0.166383561643835617").to.equals(ethers.utils.formatUnits(k, 18));
    });
    it("Repay Loan amount", async () => {
        const [owner] = await ethers.getSigners();
        await CONTRACTS.TestTokenContract.mint(owner.address, "200000000000000000000000000000");

        let result = await PROXIES.BruPoolProxy.borrowedNft(nftJson.nftId);
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, "2000000020000001");
        await PROXIES.BruRouterProxy.repay(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, "2000000020000001");

        // let k = await CONTRACTS.TestTokenContract.balanceOf(PROXIES.NIImarginProxy.address);
        //expect("0.166383361663833617").to.equals(ethers.utils.formatUnits(k, 18));
    });

    it("should do complete repay on a borrowed asset",async () =>{
        const [] = await ethers.getSigners()
    })
    it("Core branching cases", async () => {
        const [owner, addr1] = await ethers.getSigners();

        // borrow cases
        await expect(
            PROXIES.BruRouterProxy.connect(addr1).borrow(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, 100)
        ).to.be.revertedWith("NFT does not exist");
        await expect(
            PROXIES.BruRouterProxy.borrow(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, 100)
        ).to.be.revertedWith("Already borrowed on this NFT");
        let mintTx = await CONTRACTS.AssetTreasuryContract.mintNft(
            owner.address,
            nftJson1.nftId,
            nftJson1.commodityId,
            nftJson1.quantity,
            nftJson1.nftPrice,
            nftJson1.dataHash,
            JSON.stringify(nftJson1)
        );
        await expect(
            PROXIES.BruRouterProxy.borrow(0, nftJson1.nftId, CONTRACTS.BruTokenContract.address, 100)
        ).to.be.revertedWith("Token Address not allowed");
        await expect(
            PROXIES.BruRouterProxy.borrow(
                0,
                nftJson1.nftId,
                CONTRACTS.TestTokenContract.address,
                "1000000000000000000000000000000000"
            )
        ).to.be.revertedWith("Pool does not have enough liquidity");
        await expect(
            PROXIES.BruRouterProxy.borrow(
                0,
                nftJson1.nftId,
                CONTRACTS.TestTokenContract.address,
                "200000000000000000000"
            )
        ).to.be.revertedWith("Collateral provided is less for specified token amount");
        //repay cases
        await expect(
            PROXIES.BruRouterProxy.connect(addr1).repay(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, 10)
        ).to.be.revertedWith("NFT does not exist");
        await expect(
            PROXIES.BruRouterProxy.repay(0, nftJson1.nftId, CONTRACTS.TestTokenContract.address, 10)
        ).to.be.revertedWith("This NFT is not borrowed");
        await expect(
            PROXIES.BruRouterProxy.repay(0, nftJson.nftId, CONTRACTS.BruTokenContract.address, 10)
        ).to.be.revertedWith("token does not match the token borrowed");
    });
});
