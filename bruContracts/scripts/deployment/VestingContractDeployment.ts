import { ethers } from "hardhat";
async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy(
      "BruToken",
      "BT",
      "250000000000000000000000000"
    );
  
    console.log("Token address:", token.address);
  
    const TokenVesting = await ethers.getContractFactory("TokenVestingBru");
    const tokenVesting = await TokenVesting.deploy(token.address);
    console.log("TokenVesting address:", tokenVesting.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  