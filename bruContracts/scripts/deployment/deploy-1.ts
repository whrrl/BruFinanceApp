

import { ethers } from "hardhat";
import fs from 'fs';

async function main() {
    const mintAmount = '100000000000000000000000'
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

    let poolToken = await PoolToken.deploy("BruBonds - IndiaAgro", "BruBonds - IndiaAgro");
    await poolToken.deployed()

    let interestToken = await InterestToken.deploy("InterestToken - IndiaAgro", "InterestToken - IndiaAgro")
    await interestToken.deployed()

    console.log(poolToken.address)
    // console.log(interestToken.address)

    const usdt = await USDT.deploy(mintAmount)
    await usdt.deployed()

    console.log(owner.address)
    const factory = await Factory.deploy()
    await factory.deployed()

    const proxyFactory = await BruProxyFactory.deploy(factory.address)
    await proxyFactory.deployed()

    const proxy = await ethers.getContractAt("BruFactory", proxyFactory.address)

    let pool = await Pool.deploy()
    await pool.deployed()

    

    let proxyPool = await BruProxyPool.deploy(pool.address)
    await proxyPool.deployed()

    const multisig = await ethers.getContractFactory("multiSig");
    const arr = [owner.address];
    const multisigContract = await multisig.deploy(proxyPool.address,proxyFactory.address,arr,1);
    await multisigContract.deployed();

    console.log("multisig contract address",multisigContract.address);
    
    await proxy.initialize(multisigContract.address);
    
    const proxyPool1 = await ethers.getContractAt("BruPool", proxyPool.address)
    let treasury = await Treasury.deploy(proxyPool.address)
    await treasury.deployed()
    await proxyPool1.initialize(multisigContract.address,
        proxyFactory.address,
        poolToken.address,
        interestToken.address,
        treasury.address,
        "IndiaAgro")
        
    await proxy.addPoolDetails("IndiaAgro", proxyPool.address, pool.address, poolToken.address, interestToken.address, treasury.address)

    let addresses = {
        TOKEN_ADDRESS: usdt.address,
        FACTORY_ADDRESS: proxy.address,
    }
    console.log({
        poolName: "IndiaAgro",
        poolTokenAddress: poolToken.address,
        interestTokenAddress: interestToken.address,
        proxyPoolAddress: proxyPool.address,
        implementationPoolAddress: pool.address,
        treasuryAddress: treasury.address
    })
    console.log(addresses)
     save(addresses)
   
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

function save(addresses: Object) {
    fs.writeFileSync('./scripts/deployment/Address.json', JSON.stringify(addresses, null, '\t'))
}