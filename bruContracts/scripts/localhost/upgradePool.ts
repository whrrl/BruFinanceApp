
import { ethers } from "hardhat";
import fs from 'fs';

const addresses = JSON.parse(fs.readFileSync('./scripts/localhost/Address.json').toString())

async function main() {
    const [owner] = await ethers.getSigners()
    const Pool = await ethers.getContractFactory('BruPool')
    const pool = await Pool.deploy();
    await pool.deployed()
    const factory = await ethers.getContractAt('BruFactory',addresses['FACTORY_ADDRESS'])
    await factory.upgradeImplementationContractAddress(0,pool.address)
  
}




main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
