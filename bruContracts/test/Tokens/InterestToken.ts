import {expect} from "chai";
import {deploy, SIGNERS, CONTRACTS} from "./../shared/deploy";

describe("Interest Token Contract Tests", async () => {
    before(async function () {
        await deploy();
    });

    it("should fail interest token change name", async () => {
        await expect(CONTRACTS.InterestTokenContract.changeName("RandomNameToken")).to.be.revertedWith("Only admin");
    });

    it("should fail interest token mint", async () => {
        await expect(CONTRACTS.InterestTokenContract.mint(SIGNERS.SignerA.address, "1000000000000000000")).to.be.revertedWith("Only Pool");
    });
});
