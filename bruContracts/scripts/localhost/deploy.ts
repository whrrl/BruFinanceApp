
import { ethers } from "hardhat";
import fs from 'fs';
import { EtherscanProvider } from "@ethersproject/providers";


async function main() {


  // We get the contract to deploy
  const [owner, addr1] = await ethers.getSigners()
  const mintAmount = '10000000000000000000000'
  const depositAmount = '3000000000000000000000'
  const transferAmount = "2000000000000000000000"
  // const withdrawmount = '100000000000000000000'
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
  // await usdt.approve(poolDetails.proxyPoolAddress, mintAmount)
  // await router.deposit(0, usdt.address, 0, depositAmount)
  // await router.deposit(0, usdt.address, 0, depositAmount)

  // let poolTokenBalance = await poolToken.balanceOf(owner.address)
  // console.log("Bru Bond balance", ethers.utils.formatUnits(poolTokenBalance, 18))
  // await router.withdraw(0, depositAmount)
  // await router.deposit(0, usdt.address,0, depositAmount)
  // let poolTokenBalance = await poolToken.balanceOf(owner.address)
  // console.log("Bru Bond balance", ethers.utils.formatUnits(poolTokenBalance, 18))
  let bonds = await agripool.getUserActiveBonds(owner.address)
  // console.log("Before Transfer ")
  // console.log("--------------------------Bonds of User 1 --------------------------")
  formatBonds(bonds)
  // let balance = await poolToken.balanceOf(owner.address)
  // console.log("Balance of user 1 before transfer",ethers.utils.formatUnits(balance, 18))
  // await poolToken.transfer(addr1.address, transferAmount)
  // console.log("\n Transfer of 2000 tokens \n")
  // bonds = await agripool.getUserBonds(owner.address)
  // let bonds1 = await agripool.getUserBonds(addr1.address)
  // console.log("\nAfter Transfer")
  // console.log("--------------------------Bonds of User 1 --------------------------")
  // formatBonds(bonds)
  // balance = await poolToken.balanceOf(owner.address)
  // console.log("Balance of user 1 after transfer",ethers.utils.formatUnits(balance, 18))
  // console.log("--------------------------Bonds of User 2 --------------------------")
  // formatBonds(bonds1)
  // balance = await poolToken.balanceOf(addr1.address)
  // console.log("Balance of user 2 after transfer",ethers.utils.formatUnits(balance, 18))



  // console.log(poolArray.treasuryAddress, "treasury Address");
  // const agriPool = await ethers.getContractAt('BruPool', poolArray[0].proxyPoolAddress)
  // let rates = await agriPool.rates();
  // console.log(ethers.utils.formatUnits(rates.lend, 0))
  // console.log(ethers.utils.formatUnits(rates.borrow, 18))
  // //  let tokenAddress = await pool1.poolTokenAddress()
  // //  console.log(tokenAddress)
  // //  await pool1.allowTokenAddress(usdt.address)
  let addresses = {
    TOKEN_ADDRESS: usdt.address,
    FACTORY_ADDRESS: factory.address,
    ROUTER_ADDRESS: router.address
  }
  console.log("Addresses of contracts",addresses)
  // const poolAddress = router.getPoolAddress(0);
  //  const pool1 = await ethers.getContractAt('BruPool', poolAddress);
  //  usdt.mint(poolAddress,"1000000000000000000000000000");
  // const token = await ethers.getContractAt('BruPoolToken',tokenAddress)
  // const treasuryContract = await ethers.getContractAt('AssetTreasury',treasuryAddressArray[0].treasuryAddress);
  // var nftJson = { "nftId": "6272b4c8ad8c64b289b6516e", "commodity": "SOYABEEN", "commodityId": "5f5f0f5edeed643fcc3428af", "quantity": 9900, "nftPrice": 366300, "pool": 1, "dataHash": "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=" }
  // let mintResult = await treasuryContract.mintNft(owner.address, nftJson.nftId, nftJson.commodityId, nftJson.quantity, nftJson.nftPrice,nftJson.dataHash, JSON.stringify(nftJson));
  // let nftResult = await pool1.nft(nftJson.nftId);
  // var nftJson1 = { "nftId": "6272b4c8ad8c64b289b6516e1", "commodity": "SOYABEEN", "commodityId": "5f5f0f5edeed643fcc3428af", "quantity": 9900, "nftPrice": 366300, "pool": 1, "dataHash": "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=" }
  // let mintResult1 = await treasuryContract.mintNft(owner.address, nftJson.nftId, nftJson.commodityId, nftJson.quantity, nftJson.nftPrice,nftJson.dataHash, JSON.stringify(nftJson));
  // let nftResult1 = await pool1.nft(nftJson.nftId);
  // let Borrow = await router.borrow(0,
  //  "6272b4c8ad8c64b289b6516e",
  //   usdt.address,
  //   "100");
  // console.log("nft found   11",nftResult1);
  // let borrowResult = await pool1.borrowedNft(nftJson.nftId);
  // console.log(borrowResult,"borrowed result");







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
    console.log("Interest Rate", ethers.utils.formatUnits(i.interest, 18))
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

