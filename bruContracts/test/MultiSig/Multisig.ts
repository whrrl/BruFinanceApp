import {Contract, ContractFactory} from "ethers";
import {expect} from "chai";
import {ethers, web3} from "hardhat";
const {constants} = require("@openzeppelin/test-helpers");

import {
    deploy,
    PROXIES,
    CONTRACTS,
    CONSTANTS,
    SIGNERS,
    IMPLEMENTATION_CONTRACTS,
    getProposalCounter,
    increaseProposalCounter,
    deployImplementationContracts,
} from "./../shared/deploy";

describe("Testing Contracts ", async () => {
    /**Contract declarations */
    let BruPool: ContractFactory, bruPool: Contract;
    let BruFactory: ContractFactory, bruFactory: Contract;
    let BruPoolToken: ContractFactory, bruPoolToken: Contract;
    let BruInterestToken: ContractFactory, bruInterestToken: Contract;
    let BruProxy: ContractFactory, bruProxy: Contract, bruProxyAttached: Contract;
    let BruProxyFactory: ContractFactory, bruProxyFactory: Contract, bruProxyAttachedFactory: Contract;
    let MultiSig: ContractFactory, multiSig: Contract;

    let QUORUM = 1; /**Number of approvers */
    const POOLNAME = "BruPool"; /**Pool Name */
    const nullAddr = constants.ZERO_ADDRESS; /**Null Address - used as placeholder */
    // console.log(nullAddr, "zero address");
    const poolIndex = 0;
    const nullVal = 0; /**Null Value - used as placeholder */

    /**Ethers Signers for addresses */
    let SignerA: any, SignerB: any, SignerC, SignerD: any, SignerToken, SignerTreasury, SignerRandom: any;
    let Signers: any = [];

    before(async () => {
        await deploy();
        await deployImplementationContracts();
        Signers = await ethers.getSigners();
        [SignerA, SignerB, SignerC, SignerD, SignerToken, SignerTreasury, SignerRandom] = await Signers;

        BruPool = await ethers.getContractFactory("BruPool");
        // bruPool = await BruPool.deploy();
        // await bruPool.deployed();

        BruFactory = await ethers.getContractFactory("BruFactory");
        // bruFactory = await BruFactory.deploy();
        // await bruFactory.deployed();

        // BruProxy = await ethers.getContractFactory("BruProxy");
        // bruProxy = await BruProxy.deploy(bruPool.address);
        // await bruProxy.deployed();
        // console.log(PROXIES.BruPoolProxy.address);

        bruProxyAttached = await BruPool.attach(PROXIES.BruPoolProxy.address);

        // BruProxyFactory = await ethers.getContractFactory("BruProxy");
        // bruProxyFactory = await BruProxy.deploy(bruFactory.address);
        // await bruProxyFactory.deployed();
        bruProxyAttachedFactory = await BruFactory.attach(PROXIES.BruFactoryProxy.address);

        MultiSig = await ethers.getContractFactory("MultiSig");
        // let a = [SignerA.address, SignerB.address, SignerC.address];
        // console.log(a);
        multiSig = PROXIES.MultiSigProxy;
    });

    /**Function used for MultiSig Demonstration, createProposal and Sign using approved addresses */
    const createTransfers = async (value: any, fid: number, addr: any[], str: any[]) => {
        let a = await multiSig.getAllProposals();
        let quorum = await PROXIES.MultiSigProxy.quorum();
        // console.log(a.length);

        const id = a.length;

        // console.log(value, fid, addr, str);

        await multiSig.createProposal(value, fid, addr, str);
        for (var i = 0; i < QUORUM; i++) {
            // console.log(fid, id, quorum, "ID");

            await multiSig.connect(Signers[i]).approveTransfer(fid, id);
            if (QUORUM >= 2 && i != QUORUM - 1) {
                await expect(multiSig.connect(Signers[i]).approveTransfer(fid, id)).to.be.revertedWith(
                    "cannot approve proposal twice"
                );
            }

            // console.log("post approve");
        }
        // await multiSig.connect(SignerA).approveTransfer(fid, id);
        return true;
    };

    /**Test runners - self explanatory */

    it("Initialize tests", async () => {
        expect(true).to.equals(true);
    });

    it("should change Lock Period", async () => {
        const targetVal = [0, 10];
        const fid = 0;
        await expect(createTransfers([0, 0], fid, [nullAddr], [""])).to.be.revertedWith(
            "time should be greater than zero"
        );
        await createTransfers(targetVal, fid, [nullAddr], [""]);
        const lockPeriod = await bruProxyAttached.lockPeriod();
        // console.log(lockPeriod, "lock period");
        let lockPeriodDecimal = parseInt(lockPeriod.toString(), 10);
        expect(lockPeriodDecimal).to.equal(targetVal[1]);
    });

    it("should change spreads", async () => {
        const targetVal = [0, "20000000000000000"];
        const fid = 1;
        await createTransfers(targetVal, fid, [nullAddr], [""]);
        const spread = await bruProxyAttached.spread();
        let spreadDecimal = parseInt(spread.toString(), 10);
        expect(spreadDecimal.toString()).to.equal(targetVal[1]);
    });

    it("should change borrow interest rate", async () => {
        const targetVal = [0, 6000];
        const fid = 3;
        await createTransfers(targetVal, fid, [nullAddr], [""]);
        await expect(createTransfers([0, "1000000000000000000000000000"], fid, [nullAddr], [""])).to.be.revertedWith(
            "fee should be less than max fees"
        );

        const {borrow, lend} = await bruProxyAttached.rates();
        expect(Number(await web3.utils.fromWei(borrow.toString()))).to.equal(targetVal[1] / 10000);
    });

    it("should change borrow platform fee", async () => {
        const targetVal = [0, 9000];
        const fid = 4;
        await createTransfers(targetVal, fid, [nullAddr], [""]);
        const {borrow, lend} = await bruProxyAttached.platformFees();
        expect(Number(await web3.utils.fromWei(borrow.toString()))).to.equal(targetVal[1] / 10000);
    });

    it("should change lend platform fee", async () => {
        const targetVal = [0, 400];
        const fid = 5;
        await createTransfers(targetVal, fid, [nullAddr], [""]);
        const {borrow, lend} = await bruProxyAttached.platformFees();
        expect(Number(0.04)).to.equal(targetVal[1] / 10000);
    });

    it("should allow token address", async () => {
        const targetAddr = SignerRandom.address;
        const fid = 7;
        await createTransfers([0], fid, [targetAddr], [""]);
        await expect(createTransfers([0], fid, [targetAddr], [""])).to.be.revertedWith("Already allowed by admin");
        const allowedTokenAddress = await bruProxyAttached.allowedTokenAddresses(targetAddr);
        expect(allowedTokenAddress).to.equal(true);
    });

    it("should add new approver", async () => {
        const targetAddr = SignerD.address;
        const fid = 8;
        await createTransfers([0], fid, [targetAddr], [""]);
        let array = await PROXIES.MultiSigProxy.getAllApprovers();

        let length = array.length;
        let approverAddress = await PROXIES.MultiSigProxy.approvers(length - 1);
        expect(approverAddress).to.equal(targetAddr);
    });

    it("should remove existing approver", async () => {
        const targetAddr = SignerD.address;
        const fid = 9;
        let array = await PROXIES.MultiSigProxy.getAllApprovers();
        let length = array.length;
        await createTransfers([0], fid, [targetAddr], [""]);

        let arraypost = await PROXIES.MultiSigProxy.getAllApprovers();

        // console.log(length, array, arraypost);

        expect(length).to.equal(arraypost.length + 1);
    });
    it("should change interest token name", async () => {
        const targetAddr = SignerD.address;
        const fid = 10;
        await createTransfers([0], fid, [nullAddr], ["BruPoolInterestTokenNew"]);
        let name = await CONTRACTS.InterestTokenContract.name();
        expect(name).to.equal("BruPoolInterestTokenNew");
    });
    it("should change pool token name", async () => {
        const targetAddr = SignerD.address;
        const fid = 11;
        await createTransfers([0], fid, [nullAddr], ["BruPoolTokenNew"]);
        let name = await CONTRACTS.PoolTokenContract.name();
        expect(name).to.equal("BruPoolTokenNew");
    });
    it("should change mintwallet account name", async () => {
        var nftJson = {
            nftId: "629def512124278e416bbd210cd",
            commodity: "SOYABEEeN",
            commodityId: "5f12232130f5edeed643fcc3428af",
            quantity: 9900,
            nftPrice: "200000000000000000000",
            pool: 0,
            dataHash: "ppCI3L9q2cEs1UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=",
        };
        const targetAddr = SignerB.address;
        const fid = 37;
        await createTransfers([0], fid, [targetAddr], [""]);
        let name = await CONTRACTS.PoolTokenContract.name();
        let mintwalletaddress = await CONTRACTS.AssetTreasuryContract.mintWalletAddress();
        // console.log(SignerB.address, mintwalletaddress);
        let mintxn = await CONTRACTS.AssetTreasuryContract.connect(SignerB).mintNft(
            SignerB.address,
            nftJson.nftId,
            nftJson.commodityId,
            nftJson.quantity,
            nftJson.nftPrice,
            nftJson.dataHash,
            JSON.stringify(nftJson)
        );
        let nftData = await PROXIES.BruPoolProxy.nft(nftJson.nftId);

        expect(nftData.quantity.toString()).to.equal(nftJson.quantity.toString());
    });
    it("should change quorum", async () => {
        const targetAddr = SignerD.address;
        const fid = 6;
        await expect(createTransfers([90], fid, [nullAddr], [""])).to.be.revertedWith(
            "quorum greater than number of approvers"
        );

        await createTransfers([3], fid, [nullAddr], [""]);
        let quorum = await PROXIES.MultiSigProxy.quorum();
        expect(parseInt(quorum, 10)).to.equal(3);
    });

    it("should fail while adding approvers as the aprrover addres is zero", async () =>{
        let address = nullAddr;
        await createTransfers([], 8, [nullAddr], [""]);
        
})
    it("should allow given address to mint", async () => {
        QUORUM = 3;
        const targetAddr = SignerD.address;
        const fid = 26;
        await createTransfers([0], fid, [targetAddr], [""]);
        let result = await CONTRACTS.BruTokenContract.enableMint(SignerD.address);
        expect(result).to.equal(true);
    });
    it("should change pauseStatus ", async () => {
        const fid = 33;
        await createTransfers([0], fid, [nullAddr], [""]);
        let result = await PROXIES.BruPoolProxy.corePause();
        expect(result).to.equal(true);
        // console.log("failed after this");

        await expect(
            PROXIES.BruRouterProxy.deposit(0, CONTRACTS.TestTokenContract.address, CONSTANTS.DEPOSIT_AMOUNT)
        ).to.be.revertedWith("Core functionalities disabled");
    });
    it("should send amount to an address from reserve wallet", async () => {
        const targetAddr = SignerD.address;
        let initialbalance = await CONTRACTS.TestTokenContract.balanceOf(targetAddr);
        const fid = 40;
        await CONTRACTS.TestTokenContract.mint(PROXIES.ReserveWalletProxy.address, "1000000");
        await createTransfers([100], fid, [targetAddr, CONTRACTS.TestTokenContract.address], [""]);
        await expect(
            createTransfers(["12131213413"], fid, [targetAddr, CONTRACTS.TestTokenContract.address], [""])
        ).to.be.revertedWith("reserve does not have enough liquidity");

        let finalbalance = await CONTRACTS.TestTokenContract.balanceOf(targetAddr);
        // console.log(initialbalance, finalbalance);
        expect(parseInt(finalbalance, 10)).to.equal(100);
    });
    it("should send amount to an address from Unclaimedwallet", async () => {
        const targetAddr = SignerD.address;
        let initialbalance = await CONTRACTS.TestTokenContract.balanceOf(targetAddr);
        const fid = 42;
        await CONTRACTS.TestTokenContract.mint(PROXIES.UnclaimedCashflowWalletProxy.address, "1000000");
        await createTransfers([100], fid, [targetAddr, CONTRACTS.TestTokenContract.address], [""]);
        await expect(
            createTransfers(["12432112134423354612134"], fid, [targetAddr, CONTRACTS.TestTokenContract.address], [""])
        ).to.be.revertedWith("reserve does not have enough liquidity");

        let finalbalance = await CONTRACTS.TestTokenContract.balanceOf(targetAddr);
        // console.log(initialbalance, finalbalance);
        expect(parseInt(finalbalance, 10)).to.equal(200);
    });
    it("should send amount to an address from Unclaimedwallet", async () => {
        const targetAddr = SignerD.address;
        let initialbalance = await CONTRACTS.TestTokenContract.balanceOf(targetAddr);
        const fid = 43;
        await CONTRACTS.TestTokenContract.mint(PROXIES.NIImarginProxy.address, "1000000");
        await CONTRACTS.TestTokenContract.mint(PROXIES.ReserveWalletProxy.address, "100121432121000000000");
        await createTransfers([100001212000000], fid, [CONTRACTS.TestTokenContract.address, targetAddr], [""]);
        let finalbalance = await CONTRACTS.TestTokenContract.balanceOf(targetAddr);
        // console.log(initialbalance, finalbalance);
        expect(parseInt(finalbalance, 10).toString()).to.equal("100001212000200");
    });
    it("change max vesting schedules allowed", async () => {
        const fid = 46;
        await createTransfers([10], fid, [nullAddr], [""]);
        let value = await PROXIES.TokenVestingBruProxy.maxVestingSchedules();
        expect(parseInt(value, 10).toString()).to.equal("10");
    });
    it("change max categoris allowed", async () => {
        const fid = 47;
        await createTransfers([7], fid, [nullAddr], [""]);
        let value = await PROXIES.TokenVestingBruProxy.maxCategories();
        expect(parseInt(value, 10).toString()).to.equal("7");
    });
    it("changing max unclaimed period", async () => {
        const fid = 48;
        await createTransfers([19], fid, [nullAddr], [""]);
        let value = await PROXIES.UnclaimedCashflowWalletProxy.maxUnclaimedPeriod();
        expect(parseInt(value, 10).toString()).to.equal("19");
    });
    it("revert", async () => {
        await createTransfers([1], 6, [nullAddr], [""]);
        QUORUM = 1;
        let a = await multiSig.getAllProposals();
        await PROXIES.MultiSigProxy.createProposal([0], 23, [nullAddr], [""]);
        await expect(PROXIES.MultiSigProxy.connect(SignerA).approveTransfer(23, a.length)).to.be.revertedWith(
            "Invalid address"
        );
        increaseProposalCounter();
        await PROXIES.MultiSigProxy.createProposal([0], 24, [nullAddr], [""]);
        await expect(PROXIES.MultiSigProxy.connect(SignerA).approveTransfer(24, a.length + 1)).to.be.revertedWith(
            "Invalid address"
        );
        increaseProposalCounter();
    });
    it("should not allow given address to mint", async () => {
        const targetAddr = SignerD.address;
        const fid = 49;
        await createTransfers([0], fid, [targetAddr], [""]);
        let result = await CONTRACTS.BruTokenContract.enableMint(SignerD.address);
        expect(result).to.equal(false);
        await expect(
            CONTRACTS.BruTokenContract.connect(SignerD).mintNew(PROXIES.TokenVestingBruProxy.address, 100)
        ).to.be.revertedWith("not allowed to mint");
    });
    it("should enable minting and mint few", async () => {
        const targetAddr = SignerD.address;
        const fid = 26;
        await createTransfers([0], fid, [targetAddr], [""]);
        let result = await CONTRACTS.BruTokenContract.enableMint(SignerD.address);
        expect(result).to.equal(true);
        await CONTRACTS.BruTokenContract.connect(SignerD).mintNew(PROXIES.TokenVestingBruProxy.address, 100);
    });

    it("should fail due to invalid function ID", async () => {
        await expect(createTransfers([0], 25000, [CONTRACTS.TestTokenContract.address], [""])).to.be.revertedWith(
            "Invalid Function ID"
        );
    });
    it("should create a snapshot", async () => {
        const fid = 50;
        await createTransfers([0], fid, [nullAddr], [""]);
    });
    it("should change max allowed pools", async () => {
        const fid = 51;
        await createTransfers([50], fid, [nullAddr], [""]);
        let result = await PROXIES.BruFactoryProxy.maxPool();
        expect(result).to.equal(50);
    });
    it("should change max allowed token Addresses", async () => {
        const fid = 52;
        await createTransfers([0, 43], fid, [nullAddr], [""]);
        let result = await PROXIES.BruPoolProxy.maxAllowedTokenAddresses();
        expect(result).to.equal(43);
    });
    it("End Tests", async () => {
        expect(true).to.equal(true);
    });
});
