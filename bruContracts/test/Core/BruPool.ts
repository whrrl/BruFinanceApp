import {ethers} from "hardhat";
import {expect} from "chai";
import {
    deploy,
    PROXIES,
    SIGNERS,
    CONTRACTS,
    IMPLEMENTATION_CONTRACTS,
    CONSTANTS,
    getProposalCounter,
    increaseProposalCounter,
    deployImplementationContracts,
} from "./../shared/deploy";
import {increaseTime} from "./../shared/time";

describe("BruPool Tests", async () => {
    before(async function () {
        await deploy();
        await deployImplementationContracts();
        await CONTRACTS.TestTokenContract.mint(PROXIES.ReserveWalletProxy.address, CONSTANTS.MINT_AMOUNT);
        await CONTRACTS.TestTokenContract.mint(SIGNERS.SignerB.address, CONSTANTS.MINT_AMOUNT);
    });
    it("Initialize tests", async () => {
        expect(true).to.equals(true);
    });

    it("Deposit 3000 tokens and Withdraw the matured bond ", async () => {
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, CONSTANTS.MINT_AMOUNT);

        await PROXIES.BruRouterProxy.deposit(0, CONTRACTS.TestTokenContract.address, CONSTANTS.DEPOSIT_AMOUNT);
        await expect(
            PROXIES.BruRouterProxy.deposit(0, CONTRACTS.BruTokenContract.address, CONSTANTS.DEPOSIT_AMOUNT)
        ).to.be.revertedWith("Token Address not allowed");
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, CONSTANTS.MINT_AMOUNT);

        await expect(PROXIES.BruRouterProxy.deposit(0, CONTRACTS.TestTokenContract.address, 0)).to.be.revertedWith(
            "Token Amount less than one"
        );
        await expect(
            PROXIES.BruRouterProxy.deposit(0, CONTRACTS.TestTokenContract.address, "100000000000000000000000")
        ).to.be.revertedWith("Insufficient Token Amount");

        let interestfeebalance = await CONTRACTS.TestTokenContract.balanceOf(PROXIES.NIImarginProxy.address);
        expect("0.3").to.equal(ethers.utils.formatUnits(interestfeebalance, 18));

        let poolTokenBalance = await CONTRACTS.PoolTokenContract.balanceOf(SIGNERS.SignerA.address);
        expect(Math.round(parseInt(ethers.utils.formatUnits(poolTokenBalance, 18)))).to.equals(3000);
        await expect(PROXIES.BruRouterProxy.withdraw(0, 0)).to.be.revertedWith("Bond has not matured yet");

        await increaseTime(432000);
        await PROXIES.BruRouterProxy.withdraw(0, 0);
        await expect(PROXIES.BruRouterProxy.withdraw(0, 0)).to.be.revertedWith("Bond already withdrawn");
        await expect(PROXIES.BruRouterProxy.withdraw(0, 1)).to.be.revertedWith("Bond does not exist");
        poolTokenBalance = await CONTRACTS.PoolTokenContract.balanceOf(SIGNERS.SignerA.address);
        expect(Math.round(parseInt(ethers.utils.formatUnits(poolTokenBalance, 18)))).to.equals(0);
    });

    it("Interest Example", async () => {
        await CONTRACTS.TestTokenContract.approve(PROXIES.BruPoolProxy.address, CONSTANTS.MINT_AMOUNT);
        await PROXIES.BruRouterProxy.deposit(0, CONTRACTS.TestTokenContract.address, CONSTANTS.DEPOSIT_AMOUNT);
        await increaseTime(172800);
        let latestBondId = await PROXIES.BruPoolProxy.userBondIds(SIGNERS.SignerA.address);
        await expect(PROXIES.BruPoolProxy.claimInterestOnBond(latestBondId.toString())).to.be.revertedWith(
            "Bond does not exist"
        );
        let interest = await CONTRACTS.InterestTokenContract.balanceOf(SIGNERS.SignerA.address);
        await increaseTime(172800);
        await PROXIES.BruPoolProxy.claimInterestOnBond(latestBondId.toString() - 1);
        interest = await CONTRACTS.InterestTokenContract.balanceOf(SIGNERS.SignerA.address);
        await increaseTime(172800);
        await PROXIES.BruPoolProxy.claimInterestOnBond(latestBondId.toString() - 1);
        await increaseTime(172800);
        await expect(PROXIES.BruPoolProxy.claimInterestOnBond(latestBondId.toString() - 1)).to.be.revertedWith(
            "Bond interest already claimed"
        );
        interest = await CONTRACTS.InterestTokenContract.balanceOf(SIGNERS.SignerA.address);
        let interestfeebalance = await CONTRACTS.TestTokenContract.balanceOf(PROXIES.NIImarginProxy.address);
        let ReserveWalletBalance = await CONTRACTS.TestTokenContract.balanceOf(PROXIES.ReserveWalletProxy.address);
        // expect("0.59994000599940006").to.equal(ethers.utils.formatUnits(interestfeebalance, 18));
        expect("3.287671232876712328").to.equal(ethers.utils.formatUnits(interest, 18));
        expect("10000.0").to.equal(ethers.utils.formatUnits(ReserveWalletBalance, 18));
    });

    it("should fail redeeming interest tokens due to user having zero tokens redeem", async () => {
        await expect(
            PROXIES.BruPoolProxy.redeemInterestToken(CONTRACTS.TestTokenContract.address, 0)
        ).to.be.revertedWith("Insufficient interest tokens to redeem");
    });

    it("should should redeem interest tokens", async () => {
        await PROXIES.BruPoolProxy.redeemInterestToken(CONTRACTS.TestTokenContract.address, "100000");
    });

    it("should fail while redeeming interest tokens due to incorrect token address", async () => {
        await expect(
            PROXIES.BruPoolProxy.redeemInterestToken(CONTRACTS.PoolTokenContract.address, "100")
        ).to.be.revertedWith("Token address not allowed for redeeming");
    });
    it("should not allow more than max allowed token addresses", async () => {
        for (var i = 0; i < 96; i++) {
            const wallet = ethers.Wallet.createRandom();
            await PROXIES.MultiSigProxy.createProposal([0], 7, [wallet.address], [""]);
            await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(7, getProposalCounter());
            increaseProposalCounter();
        }
        const wallet = ethers.Wallet.createRandom();
        await PROXIES.MultiSigProxy.createProposal([0], 7, [wallet.address], [""]);
        await expect(
            PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(7, getProposalCounter())
        ).to.revertedWith("Max limit reached");
        increaseProposalCounter();
    });
    it("should upgrade the BruPool Contract", async () => {
        await PROXIES.MultiSigProxy.createProposal(
            [0],
            14,
            [IMPLEMENTATION_CONTRACTS.BruPoolImplementationContract.address],
            [""]
        );
        await PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(14, getProposalCounter());
        increaseProposalCounter();
    });

    it("should fail while upgrading the BruPool contract", async () => {
        await expect(
            PROXIES.BruPoolProxy.connect(SIGNERS.SignerA).upgradeTo(
                IMPLEMENTATION_CONTRACTS.BruPoolImplementationContract.address
            )
        ).to.be.revertedWith("Only called by admin");
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
    it("should mint Asset", async () => {
        let mintTx = await CONTRACTS.AssetTreasuryContract.mintNft(
            SIGNERS.SignerC.address,
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

    it("should fail while locking the asset as asset is not minted", async () => {
        await expect(PROXIES.BruPoolProxy.lockAsset(SIGNERS.SignerD.address,nftJson.nftId)).to.be.revertedWith(
            "NFT does not exist"
        );
    });
    it("should fail while unlocking the asset as asset is not minted", async () => {
        await expect(PROXIES.BruPoolProxy.unlockAsset(SIGNERS.SignerD.address,nftJson.nftId)).to.be.revertedWith(
            "NFT does not exist"
        );
    });

    it("should lock asset to prevent borrowing", async () => {
        await PROXIES.BruPoolProxy.lockAsset(SIGNERS.SignerC.address,nftJson.nftId);
        expect(await PROXIES.BruPoolProxy.assetLocked(nftJson.nftId)).to.be.equal(true);
    });

    it("should unlock asset for allowing borrowing on it", async () => {
        await PROXIES.BruPoolProxy.unlockAsset(SIGNERS.SignerC.address,nftJson.nftId);
        expect(await PROXIES.BruPoolProxy.assetLocked(nftJson.nftId)).to.be.equal(false);
    });

    it("should fail while locking Asset", async () => {
        await expect(PROXIES.BruPoolProxy.connect(SIGNERS.SignerB).lockAsset(SIGNERS.SignerC.address,nftJson.nftId)).to.be.revertedWith(
            "only owner is authorized"
        );
    });
    it("should fail while unlocking Asset", async () => {
        await expect(PROXIES.BruPoolProxy.connect(SIGNERS.SignerB).unlockAsset(SIGNERS.SignerC.address,nftJson.nftId)).to.be.revertedWith(
            "only owner is authorized"
        );
    });
});
