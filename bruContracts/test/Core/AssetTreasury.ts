import {expect} from "chai";
import {
    deploy,
    PROXIES,
    SIGNERS,
    CONTRACTS,
    CONSTANTS,
    nullAddr,
    increaseProposalCounter,
    getProposalCounter,
} from "./../shared/deploy";

describe("AssetTreasury Contract Tests", async () => {
    before(async function () {
        await deploy();
        await CONTRACTS.TestTokenContract.mint(PROXIES.ReserveWalletProxy.address, CONSTANTS.MINT_AMOUNT);
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

    it("should initialize Tests", async () => {
        expect(true).to.equals(true);
    });

    // this test case checks if  the nft is minted correctly or not
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
        let nftData = await PROXIES.BruPoolProxy.nft(nftJson.nftId);
        expect(nftData.quantity).to.equal(nftJson.quantity);
    });

    it("should fail the minting of asset", async () => {
        await expect(
            CONTRACTS.AssetTreasuryContract.connect(SIGNERS.SignerB).mintNft(
                SIGNERS.SignerA.address,
                nftJson.nftId,
                nftJson.commodityId,
                nftJson.quantity,
                nftJson.nftPrice,
                nftJson.dataHash,
                JSON.stringify(nftJson)
            )
        ).to.be.revertedWith("Can be used only by mint wallet address");
    });

    // it("should mint wallet address",async () =>{
    //     await PROXIES.MultiSigProxy.
    // })
    it("should fail while changing mint wallet address due to zero address", async () => {
        await PROXIES.MultiSigProxy.createProposal([0], 37, [nullAddr], [""]);
        await expect(
            PROXIES.MultiSigProxy.connect(SIGNERS.SignerA).approveTransfer(37, getProposalCounter())
        ).to.be.revertedWith("invalid address");
        increaseProposalCounter();
    });

    it("should thow error while changing mint wallet address", async () => {
        await expect(
            CONTRACTS.AssetTreasuryContract.connect(SIGNERS.SignerA).changeMintWalletAddress(SIGNERS.SignerB.address)
        ).to.be.revertedWith("Can be used only by admin");
    });
});
