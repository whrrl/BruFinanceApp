import {ethers} from "hardhat";

export async function increaseTime(timeToAdd: number) {
    await ethers.provider.send("evm_increaseTime", [timeToAdd]);
    await ethers.provider.send("evm_mine", []);
}
export async function currentTime() {
    return (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
}
