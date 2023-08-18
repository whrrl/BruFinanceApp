import { ethers } from "hardhat";
import fs from 'fs';

//const {constants} = require('@openzeppelin/test-helpers');

let addresses = JSON.parse(fs.readFileSync("./scripts/deployment/Address.json").toString())
async function main() {
    const [owner,addr1,addr2,addr3] = await ethers.getSigners()
    console.log(addresses["FACTORY_ADDRESS"])
    // break from here
    const token = await ethers.getContractAt("TestToken",addresses["TOKEN_ADDRESS"])
    const factory = await ethers.getContractAt("BruFactory",addresses["FACTORY_ADDRESS"])
    
    const poolDetails = await factory.getPoolDetails(0);
    console.log(poolDetails)
    let poolToken = await ethers.getContractAt("PoolToken",poolDetails['poolTokenAddress'])
    let interestToken = await ethers.getContractAt("InterestToken",poolDetails['interestTokenAddress'])
    let Router = await ethers.getContractFactory("BruRouter")

    // await poolToken.setPoolAddress(poolDetails.proxyPoolAddress)
    // await interestToken.setPoolAddress(poolDetails.proxyPoolAddress)
    // const router = await Router.deploy(addresses["FACTORY_ADDRESS"])
    // await router.deployed()
    const multisig = await ethers.getContractAt("multiSig","0xD9164f102cfa63D86Db2d233fA1eA5f3Ce35E198");
    let agripool = await ethers.getContractAt("BruPool", poolDetails.proxyPoolAddress)
    // await agripool.allowTokenAddress(token.address)

    let address = await agripool.allowedTokenAddresses("0xD6B321E4dDeE5cBdec425E01C27EA093C253e8F8");
    console.log("allowed",address);
    let k = await multisig.getAllProposals();
    console.log(k);
    
    // addresses["ROUTER_ADDRESS"]  = router.address
    save(addresses);
   
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
function save(addresses: Object) {
    fs.writeFileSync('./scripts/deployment/Address.json', JSON.stringify(addresses, null, '\t'))
}
