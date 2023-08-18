import {ethers} from "hardhat";
import {expect, assert} from "chai";

import {deploy, PROXIES, SIGNERS, CONTRACTS, CONSTANTS, IMPLEMENTATION_CONTRACTS, getProposalCounter, increaseProposalCounter, deployImplementationContracts} from "./../shared/deploy";
import {increaseTime} from "./../shared/time";

describe("TestToken Contract Tests", async () => {
    before(async function () {
        await deploy();
    });

    it("should initialize BruPrice Tests", async () => {
        expect(true).to.equals(true);
    });

    it("should mint test tokens to a user address", async () => {
        await CONTRACTS.TestTokenContract.mint(SIGNERS.SignerA.address, CONSTANTS.MINT_AMOUNT);
    });

    it("should burn tokens to a user address", async () => {
        await CONTRACTS.TestTokenContract.burn(SIGNERS.SignerA.address, CONSTANTS.MINT_AMOUNT);
    });

    it("should set max approval for transfer for test token to a particular user address", async () => {
        await CONTRACTS.TestTokenContract.approveTokensForTransfer(SIGNERS.SignerB.address);
    });
});
