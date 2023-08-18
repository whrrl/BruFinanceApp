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
import {increaseTime} from "./../shared/time";

describe("BruPrice Contract Tests", async () => {
    before(async function () {
        await deploy();
        await deployImplementationContracts();
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
        nftId: "629def50f278e416bbd210ce",
        commodity: "SOYABEEN",
        commodityId: "5f5f0f5edeed643fcc3428ae",
        quantity: 9900,
        nftPrice: "200000000000000000000",
        pool: 0,
        dataHash: "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=",
    };

    it("should initialize BruPrice Tests", async () => {
        expect(true).to.equals(true);
    });

    it("should fail while initializing BruPrice initializer", async () => {
        await expect(
            PROXIES.BruPriceProxy.connect(SIGNERS.SignerA).initialize(PROXIES.MultiSigProxy.address)
        ).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("should mint Asset", async () => {
        await CONTRACTS.AssetTreasuryContract.mintNft(
            SIGNERS.SignerA.address,
            nftJson.nftId,
            nftJson.commodityId,
            nftJson.quantity,
            nftJson.nftPrice,
            nftJson.dataHash,
            JSON.stringify(nftJson)
        );

        await CONTRACTS.AssetTreasuryContract.mintNft(
            SIGNERS.SignerA.address,
            nftJson1.nftId,
            nftJson1.commodityId,
            nftJson1.quantity,
            nftJson1.nftPrice,
            nftJson1.dataHash,
            JSON.stringify(nftJson1)
        );
        let nftData = await PROXIES.BruPoolProxy.nft(nftJson.nftId);
        let nftData1 = await PROXIES.BruPoolProxy.nft(nftJson1.nftId);

        expect(nftData.quantity).to.equal(nftJson.quantity);
        expect(nftData1.quantity).to.equal(nftJson1.quantity);
    });

    it("should update price of commodity per KG in the contract", async () => {
        let assetValuePerKg = "10000000000000000000";
        await PROXIES.BruPriceProxy.updatePrice(nftJson.commodityId, assetValuePerKg);
        let assetValuePerKgFromContract = await PROXIES.BruPriceProxy.asset(nftJson.commodityId);
        expect(assetValuePerKg).to.be.equal(assetValuePerKgFromContract.toString());
    });

    it("should fail while updating price of commodity per KG in the contract", async () => {
        let assetValuePerKg = "10000000000000000000";
        await expect(
            PROXIES.BruPriceProxy.connect(SIGNERS.SignerB).updatePrice(nftJson.commodityId, assetValuePerKg)
        ).to.be.revertedWith("Only owner address is allowed");
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
        await increaseTime(2630000);
        let repayAmount = "20002000000000000000";
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, repayAmount);
        await PROXIES.BruRouterProxy.repay(0, nftJson.nftId, CONTRACTS.TestTokenContract.address, repayAmount);
        let result = await PROXIES.BruPoolProxy.borrowedNft(nftJson.nftId);
        expect(ethers.utils.formatUnits(result.borrowedAmount, 18)).to.equals("0.164383561643835616");
        let k = await CONTRACTS.TestTokenContract.balanceOf(PROXIES.NIImarginProxy.address);
        expect("0.166383561643835616").to.equals(ethers.utils.formatUnits(k, 18));
    });

    it("should upgrade the BruPrice Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            [0],
            44,
            [IMPLEMENTATION_CONTRACTS.BruPriceImplementationContract.address],
            [""]
        );
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(44, getProposalCounter());
        increaseProposalCounter();
    });

    it("should fail while upgrading BruPrice contract", async () => {
        await expect(
            PROXIES.BruPriceProxy.connect(SIGNERS.SignerA).upgradeTo(
                IMPLEMENTATION_CONTRACTS.BruPriceImplementationContract.address
            )
        ).to.be.revertedWith("Only admin allowed");
    });
});
