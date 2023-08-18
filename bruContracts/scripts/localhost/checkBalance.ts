
import { ethers, upgrades,web3 } from "hardhat";
import fs from 'fs';

const addresses = JSON.parse(fs.readFileSync('./scripts/localhost/Address.json').toString())


async function main() {
  const [owner] = await ethers.getSigners()
  let token = await ethers.getContractAt("USDT",addresses['TOKEN_ADDRESS'])
  let router = await ethers.getContractAt("BruRouter",addresses['ROUTER_ADDRESS'])
  let poolAddress = await router.getPoolAddress(0)
  console.log(poolAddress)
  const pool = await ethers.getContractAt("BruPool",poolAddress)
  let balance  = await pool.getWithdrawableBalance(owner.address, token.address)
   await router.withdraw(0, token.address,web3.utils.toWei('30'))
  console.log(balance,"withdrawble balance")
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
