import { ethers } from "hardhat";


async function main() {


    // We get the contract to deploy
    const [owner] = await ethers.getSigners()
    const mintAmount = '10000000000000000000000'
    const depositAmount = '300000000000000000000'
    // const withdrawmount = '100000000000000000000'
    const test = await ethers.getContractFactory("Sample")
    let t = await test.deploy()
    await t.deployed()
    console.log(t.address,"Sample contract address")
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});