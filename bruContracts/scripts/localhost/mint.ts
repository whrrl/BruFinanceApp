import { ethers, web3 } from 'hardhat';

async function main() {
  const tokenAddress = '0x44413b5cBB8b9CA5e7A46162C1F94953284e14F6';
  const [owner] = await ethers.getSigners();
  //const nftPrice = '10000000000000000000000'
  const router = await ethers.getContractAt(
    'BruRouter',
    '0x9dab7d2022C110717d081C46E7a8DC20018E1179'
  );
  const usdt = await ethers.getContractAt('TestToken', tokenAddress);
  const factory = await ethers.getContractAt(
    'BruFactory',
    '0x9Dd5ac5f8C869C68164D8f75419A619A4C86A941'
  );
  const treasury = await ethers.getContractAt(
    'AssetTreasury',
    '0x670AA3510d4178CFd9661Db2827D709E9eEfaDFF'
  );
  const depositAmount = '1000000000000000';

  const poolAddress = await router.getPoolAddress(0);
  const poolC = await ethers.getContractAt('BruPool', poolAddress);
  console.log(poolAddress, 'pool address');
  let poolmint = await usdt.mint(poolAddress, '1000000000000000000000');
  var nftJson = {
    nftId: '629def50f278e416bbd210cd',
    commodity: 'SOYABEEN',
    commodityId: '5f5f0f5edeed643fcc3428af',
    quantity: 9900,
    nftPrice: 366300,
    pool: 1,
    dataHash: 'ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=',
  };
//   let mintTx = await treasury.mintNft(
//     owner.address,
//     nftJson.nftId,
//     nftJson.commodityId,
//     nftJson.quantity,
//     nftJson.nftPrice,
//     nftJson.dataHash,
//     JSON.stringify(nftJson)
//   );
//   mintTx.wait();
//   let nftDetails = await poolC.nft(nftJson.nftId);
//   console.log(nftDetails, 'nft created');
  let nftBorrow = await poolC.borrowedNft(nftJson.nftId);
  console.log('borrowed details', nftBorrow);

//   const borrow = await router.borrow(
//     0,
//     nftJson.nftId,
//     tokenAddress,
//     '1000'
//   );
//   const approval = await usdt.approve(poolAddress, '100');
//   approval.wait();
//   console.log('approval successful');

//   const repaytransaction = await router.repay(
//     0,
//     nftJson.nftId,
//     tokenAddress,
//     '100'
//   );
//   console.log('repay successful');

//   //  const agripool = await ethers.getContractAt('BruPool', poolAddress)
//   // console.log(poolAddress,"pool address");
//   // await usdt.mint(owner.address,'10000000000000000000');
//   // await usdt.approve(poolAddress,depositAmount);
//   // console.log("reached here");

//   // let depositResult =await router.deposit(0,tokenAddress,depositAmount);
//   // console.log("deposit successful",depositResult);

//   // // await agripool.allowTokenAddress(usdt.address,'bUSDT','bUSDT')
//   // await usdt.mint(poolAddress, '100000000000000000000000000000000000000')
//   // await usdt.mint(owner.address, '100000000000000000000000000000000000000')
//   // let value = await usdt.balanceOf(poolAddress)
//   //console.log(owner.address, value)
//   // console.log()
//   //
//   // var nftJson1 = { "nftId": "6272b4c8ad8c64b289b6516f", "commodity": "SOYABEEN", "commodityId": "5f5f0f5edeed643fcc3428af", "quantity": 9900, "nftPrice": 366300, "pool": 1, "dataHash": "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=" }

//   // let mintResult = await agripool.mintNft(owner.address, nftJson.nftId, nftJson.commodityId, nftJson.quantity, nftPrice, JSON.stringify(nftJson))
//   // let nft = await agripool.nft(nftJson.nftId)
//   // console.log(nft)

//   // mintResult = await agripool.mintNft(owner.address, nftJson1.nftId, nftJson1.commodityId, nftJson1.quantity, nftPrice, JSON.stringify(nftJson1))
//   // nft = await agripool.nft(nftJson1.nftId)

//   // console.log(nft)
//   // let borrowResult = await router.borrow(0,nftJson.nftId,tokenAddress,'30000000000000000000')
//   // console.log(borrowResult)
//   // await usdt.approve(poolAddress,'10000000000000000000')
//   // let repayResult = await router.repay(0,nftJson.nftId,tokenAddress,'10000000000000000000')
//   // console.log(repayResult)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
