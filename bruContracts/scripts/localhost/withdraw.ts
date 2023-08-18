
import { ethers } from "hardhat";
import fs from 'fs';
import { EtherscanProvider } from "@ethersproject/providers";


async function main() {


    // We get the contract to deploy
    const mintAmount = '100000000000000000000000'
    let depositAmount = '3000000000000000000000'
    const [owner] = await ethers.getSigners()
    // const accounts = await ethers.getSigners();
    // const deployer = accounts[0];

    const USDT = await ethers.getContractFactory("TestToken")
    const BruProxyFactory = await ethers.getContractFactory("BruProxy")
    const BruProxyPool = await ethers.getContractFactory("BruProxy")

    const Factory = await ethers.getContractFactory("BruFactory")
    const Router = await ethers.getContractFactory("BruRouter")
    let Pool = await ethers.getContractFactory("BruPool")
    let Treasury = await ethers.getContractFactory('AssetTreasury')
    let PoolToken = await ethers.getContractFactory('PoolToken')
    let InterestToken = await ethers.getContractFactory("InterestToken")

    // let treasury = await Treasury.deploy()
    // await treasury.deployed()

    let poolToken = await PoolToken.deploy("BruBonds - IndiaAgro", "BondToken");
    await poolToken.deployed()

    let interestToken = await InterestToken.deploy("InterestToken - IndiaAgro", "")
    await interestToken.deployed()

    console.log(poolToken.address)
    // console.log(interestToken.address)

    const usdt = await USDT.deploy(mintAmount)
    await usdt.deployed()
    console.log("usdt deployed",usdt.address);
    
    console.log(owner.address)
    const factory = await Factory.deploy()
    await factory.deployed()
    console.log("factory deployed",factory.address);
    

    const proxyFactory = await BruProxyFactory.deploy(factory.address)
    await proxyFactory.deployed()
    console.log("proxy factory",proxyFactory.address);
    

    const proxy = await ethers.getContractAt("BruFactory", proxyFactory.address)

    let pool = await Pool.deploy()
    await pool.deployed()
    console.log("pool Deployed",pool.address);
    

    let proxyPool = await BruProxyPool.deploy(pool.address)
    await proxyPool.deployed()
    await proxy.initialize()
    console.log("proxypool initialized",proxyPool.address);
    
    
    const proxyPool1 = await ethers.getContractAt("BruPool", proxyPool.address)
    let treasury = await Treasury.deploy(proxyPool.address)
    await treasury.deployed()
    console.log("treasury Deployed",treasury.address);
    
    await proxyPool1.initialize(owner.address,
        proxyFactory.address,
        poolToken.address,   
        interestToken.address,
        treasury.address,
        "IndiaAgro")
        
    await proxy.addPoolDetails("IndiaAgro", proxyPool.address, pool.address, poolToken.address, interestToken.address, treasury.address)

    const router = await Router.deploy(proxy.address);
    await router.deployed();
    console.log("router deployed",router.address);
    
    let poolDetails = await proxy.getPoolDetails(0);
    let agripool = await ethers.getContractAt("BruPool", poolDetails.proxyPoolAddress);
    //agripool.wait();
    console.log("reached before allow token");
    
    let k = await agripool.allowTokenAddress(usdt.address)
    await agripool.changeLockPeriod(1)
    await usdt.approve(poolDetails.proxyPoolAddress, mintAmount)
    console.log("Depositing 3000 tokens first time")
    await router.deposit(0, usdt.address, depositAmount)
    console.log("Depositing 3000 tokens second time")

    await router.deposit(0, usdt.address, depositAmount)

    let poolTokenBalance = await poolToken.balanceOf(owner.address)
    console.log("Bru Bond balance before withdrawal ", ethers.utils.formatUnits(poolTokenBalance, 18))
    let bonds = await agripool.getUserActiveBonds(owner.address)

    console.log("----------------Bond Array before withdrawal-----------------",)
    formatBonds(bonds)
    console.log("Withdrawing 3000 tokens")
    await router.withdraw(0, depositAmount)
    poolTokenBalance = await poolToken.balanceOf(owner.address)
    console.log("Bru Bond balance after withdrawal ", ethers.utils.formatUnits(poolTokenBalance, 18))
    let inactiveBonds = await agripool.getUserInactiveBonds(owner.address)
    console.log("----------------------Bond Array after withdrawal -----------------------")
    formatBonds(inactiveBonds)







    // await usdt.approve(proxyPoolAddress,depositAmount)
    // await router.deposit(0,usdt.address,depositAmount)
    // let result = await pool1.getBruTokenBalance(owner.address)
    // console.log("LP token balance",ethers.utils.formatEther(result.toString()))

}
function save(addresses: Object) {
    fs.writeFileSync('./scripts/localhost/Address.json', JSON.stringify(addresses, null, '\t'))
}

function formatBonds(bonds: any) {
    // console.log(bonds)

    for (let i of bonds) {
        console.log("Bond Amount", ethers.utils.formatUnits(i.bondAmount, 18))
        // console.log("Interest Rate", ethers.utils.formatUnits(i.interest, 18))
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
