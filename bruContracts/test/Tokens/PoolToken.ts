import {expect} from "chai";
import {deploy, SIGNERS, CONTRACTS} from "./../shared/deploy";

describe("PoolToken Contract Tests", async () => {
    before(async function () {
        await deploy();
    });

    it("should fail pool token change name", async () => {
        await expect(CONTRACTS.PoolTokenContract.changeName("RandomNameToken")).to.be.revertedWith("Only admin");
    });

    it("should fail pool token mint", async () => {
        await expect(CONTRACTS.PoolTokenContract.mint(SIGNERS.SignerA.address, "1000000000000000000")).to.be.revertedWith("Only Pool");
    });
});
