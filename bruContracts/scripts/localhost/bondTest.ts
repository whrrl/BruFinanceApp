import { ethers } from "hardhat";

async function main() {
    // We get the contract to deploy
    const [owner, addr1] = await ethers.getSigners()
    const mintAmount = '10000000000000000000000'
    const depositAmount = '3000000000000000000000'
    const transferAmount = "2000000000000000000000"
    const USDT = await ethers.getContractFactory("TestToken")
    const BruProxyFactory = await ethers.getContractFactory("BruProxy")
    const Factory = await ethers.getContractFactory("BruFactory")
    const Router = await ethers.getContractFactory("BruRouter")
    let Pool = await ethers.getContractFactory("BruPool")
    let Treasury = await ethers.getContractFactory('AssetTreasury')
    let PoolToken = await ethers.getContractFactory('PoolToken')
    let InterestToken = await ethers.getContractFactory("InterestToken")

    let treasury = await Treasury.deploy()
    await treasury.deployed()

    let poolToken = await PoolToken.deploy("BruBonds - IndiaAgro", "BondToken");
    await poolToken.deployed()

    let interestToken = await InterestToken.deploy("InterestToken - IndiaAgro", "")
    await interestToken.deployed()

    const usdt = await USDT.deploy(mintAmount)
    await usdt.deployed()

    const factory = await Factory.deploy()
    await factory.deployed()

    const proxyFactory = await BruProxyFactory.deploy(factory.address)
    await proxyFactory.deployed()

    const proxy = await ethers.getContractAt("BruFactory", proxyFactory.address)

    let pool = await Pool.deploy()
    await pool.deployed()

    console.log({
        poolTokenAddress: poolToken.address,
        interestTokenAddress: interestToken.address,
        treasuryAddress: treasury.address
    })
    await proxy.initialize()
    await proxy.deployProxyPool("IndiaAgro", pool.address, poolToken.address, interestToken.address, treasury.address)
    const poolDetails = await proxy.getPoolDetails(0);
    await poolToken.setPoolAddress(poolDetails.proxyPoolAddress)
    const router = await Router.deploy(proxy.address)

    let address = await router.getPoolAddress(0)
    let agripool = await ethers.getContractAt("BruPool", poolDetails.proxyPoolAddress)
    await agripool.allowTokenAddress(usdt.address)
    await usdt.approve(poolDetails.proxyPoolAddress, mintAmount)
    await router.deposit(0, usdt.address, 0, depositAmount)
    await agripool.changeStableInterestRate(100);
    await agripool.addLockPeriod(86400);
    await router.deposit(0, usdt.address, 0, depositAmount)

    let poolTokenBalance = await poolToken.balanceOf(owner.address)
    console.log("Bru Bond balance", ethers.utils.formatUnits(poolTokenBalance, 18))
    poolTokenBalance = await poolToken.balanceOf(owner.address)
    console.log("Bru Bond balance", ethers.utils.formatUnits(poolTokenBalance, 18))
    let bonds = await agripool.getUserActiveBonds(owner.address)
    console.log("Before Transfer ")
    console.log("--------------------------Bonds of User 1 --------------------------")
    formatBonds(bonds)
    let balance = await poolToken.balanceOf(owner.address)
    console.log("Balance of user 1 before transfer",ethers.utils.formatUnits(balance, 18))
    // await poolToken.transfer(addr1.address, transferAmount)
    // console.log("\n Transfer of 2000 tokens \n")
    // bonds = await agripool.getUserActiveBonds(owner.address)
    // let bonds1 = await agripool.getUserActiveBonds(addr1.address)
    // console.log("\nAfter Transfer")
    // console.log("--------------------------Bonds of User 1 --------------------------")
    // formatBonds(bonds)
    // balance = await poolToken.balanceOf(owner.address)
    // console.log("Balance of user 1 after transfer",ethers.utils.formatUnits(balance, 18))
    // console.log("--------------------------Bonds of User 2 --------------------------")
    // formatBonds(bonds1)
    // balance = await poolToken.balanceOf(addr1.address)
    // console.log("Balance of user 2 after transfer",ethers.utils.formatUnits(balance, 18))
}
function formatBonds(bonds: any) {
    for (let i of bonds) {
        console.log("Bond Amount", ethers.utils.formatUnits(i.bondAmount, 18))
        console.log("Interest Rate", ethers.utils.formatUnits(i.interest, 18))
        console.log("Maturity period",ethers.utils.formatUnits(i.lockTimePeriod, 0))
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});