// This file is just for reference incase you want to go through

//   const { expect } = require("chai");
// const { deploy, PROXIES, CONTRACTS, CONSTANTS } =  require("./../shared/deploy");

//   describe("TokenVesting", function () {
//     let Token;
//     let testToken;
//     let TokenVesting;
//     let owner;
//     let addr1;
//     let addr2;
//     let addrs;

//     before(async function () {
//       await deploy();
//       testToken = CONTRACTS.BruTokenContract;
//       Token = await ethers.getContractFactory("Token");
//       TokenVesting = await ethers.getContractFactory("MockTokenVesting");
//     });
//     beforeEach(async function () {
//       [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

//       await testToken.deployed();
//     });

//     describe("Vesting", function () {
//       it("Should assign the total supply of tokens to the owner", async function () {
//         const ownerBalance = await testToken.balanceOf(owner.address);
//         let k = await testToken.totalSupply();
//         let supply = parseInt(k.toString(),10);
//         let balance = parseInt(ownerBalance.toString(),10);
//         console.log(ownerBalance,k,"here");
//         expect(supply).to.equal(balance);
//       });

//       it("Should vest tokens gradually", async function () {
//         // deploy vesting contract

//         const tokenVesting = PROXIES.TokenVestingBruProxy;

//         expect((await tokenVesting.getToken()).toString()).to.equal(
//           testToken.address
//         );
//         // send tokens to vesting contract
//         await expect(testToken.transfer(tokenVesting.address, 1000));
//           // .to.emit(testToken, "Transfer")
//           // .withArgs(owner.address, tokenVesting.address, 1000);
//         const vestingContractBalance = await testToken.balanceOf(
//           tokenVesting.address
//         );
//         let vestingContractBalanceDecimal = parseInt(vestingContractBalance.toString(),10);
//         expect(vestingContractBalanceDecimal).to.equal(1000);
//         let temp = await tokenVesting.getWithdrawableAmount();
//         let withdrawableDecimal = parseInt(temp.toString(),10);
//         expect(withdrawableDecimal).to.equal(1000);

//         const baseTime = 1656319236;
//         const beneficiary = addr1;
//         const startTime = baseTime;
//         const cliff = 0;
//         const duration = 1000;
//         const slicePeriodSeconds = 1;
//         const revokable = true;
//         const amount = 100;

//         // create new vesting schedule
//         await tokenVesting.createVestingSchedule(
//           beneficiary.address,
//           startTime,
//           cliff,
//           duration,
//           slicePeriodSeconds,
//           revokable,
//           amount
//         );
//         let temp1 = await tokenVesting.getVestingSchedulesCount();
//         let count = parseInt(temp1.toString(),10);
//         expect(count).to.be.equal(1);
//         let temp2 =  await tokenVesting.getVestingSchedulesCountByBeneficiary(
//           beneficiary.address
//         );
//         let scheduleCountDecimal = parseInt(temp1.toString(),10);
//         expect(
//           scheduleCountDecimal
//         ).to.be.equal(1);

//         // compute vesting schedule id
//         const vestingScheduleId =
//           await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
//             beneficiary.address,
//             0
//           );

//         // check that vested amount is 0
//         let temp3 =  await tokenVesting.computeReleasableAmount(vestingScheduleId);
//         let releasableDecimal = parseInt(temp3.toString(),10);
//         expect(
//          releasableDecimal
//         ).to.be.equal(0);

//         // set time to half the vesting period
//         const halfTime = baseTime + duration / 2;
//         await tokenVesting.setCurrentTime(halfTime);

//         let temp4 =  await tokenVesting.connect(beneficiary).computeReleasableAmount(vestingScheduleId);
//         let releasableDecimalCompute = parseInt(temp4.toString(),10);
//         // check that vested amount is half the total amount to vest
//         expect(
//           releasableDecimalCompute
//         ).to.be.equal(50);

//         // check that only beneficiary can try to release vested tokens
//         // await expect(
//            //await tokenVesting.connect(addr2).release(vestingScheduleId, 100)
//         // );
//         // .to.be.revertedWith(
//         //   "TokenVesting: only beneficiary and owner can release vested tokens"
//         // );

//         // check that beneficiary cannot release more than the vested amount
//         //await expect(
//           //await tokenVesting.connect(beneficiary).release(vestingScheduleId, 100)
//        // )
//         // .to.be.revertedWith(
//         //   "TokenVesting: cannot release tokens, not enough vested tokens"
//         // );

//         // release 10 tokens and check that a Transfer event is emitted with a value of 10
//         //await expect(
//          await tokenVesting.connect(beneficiary).release(vestingScheduleId, 10)
//        // );
//           // .to.emit(testToken, "Transfer")
//           // .withArgs(tokenVesting.address, beneficiary.address, 10);

//         // check that the vested amount is now 40
//         let temp5 =   await tokenVesting.connect(beneficiary).computeReleasableAmount(vestingScheduleId);
//         let amountrelease = parseInt(temp5.toString(),10);
//         expect(
//          amountrelease
//         ).to.be.equal(40);
//         let vestingSchedule = await tokenVesting.getVestingSchedule(
//           vestingScheduleId
//         );

//         // check that the released amount is 10
//         expect(parseInt(vestingSchedule.released.toString(),10)).to.be.equal(10);

//         // set current time after the end of the vesting period
//         await tokenVesting.setCurrentTime(baseTime + duration + 1);

//         // check that the vested amount is 90
//         let temp6 =   await tokenVesting .connect(beneficiary) .computeReleasableAmount(vestingScheduleId);
//         let releaseAmountnine = parseInt(temp6.toString(),10);

//         expect(
//           releaseAmountnine
//         ).to.be.equal(90);

//         // beneficiary release vested tokens (45)
//         // await expect(
//           await tokenVesting.connect(beneficiary).release(vestingScheduleId, 45)
//         // )
//           // .to.emit(testToken, "Transfer")
//           // .withArgs(tokenVesting.address, beneficiary.address, 45);

//         // owner release vested tokens (45)
//        // await expect(
//         await tokenVesting.connect(owner).release(vestingScheduleId, 45)
//         //)
//           // .to.emit(testToken, "Transfer")
//           // .withArgs(tokenVesting.address, beneficiary.address, 45);
//         vestingSchedule = await tokenVesting.getVestingSchedule(
//           vestingScheduleId
//         );

//         // check that the number of released tokens is 100
//         expect(parseInt(vestingSchedule.released.toString(),10)).to.be.equal(100);

//         // check that the vested amount is 0
//         let temp7 =   await await tokenVesting.connect(beneficiary).computeReleasableAmount(vestingScheduleId);
//         let amounttorelease = parseInt(temp7.toString(),10);
//         expect(
//           amounttorelease
//         ).to.be.equal(0);

//         // check that anyone cannot revoke a vesting
//         // await expect(
//         //   tokenVesting.connect(addr2).revoke(vestingScheduleId)
//         // )
//        // .to.be.revertedWith(" Ownable: caller is not the owner");
//         await tokenVesting.revoke(vestingScheduleId,0);

//         /*
//          * TEST SUMMARY
//          * deploy vesting contract
//          * send tokens to vesting contract
//          * create new vesting schedule (100 tokens)
//          * check that vested amount is 0
//          * set time to half the vesting period
//          * check that vested amount is half the total amount to vest (50 tokens)
//          * check that only beneficiary can try to release vested tokens
//          * check that beneficiary cannot release more than the vested amount
//          * release 10 tokens and check that a Transfer event is emitted with a value of 10
//          * check that the released amount is 10
//          * check that the vested amount is now 40
//          * set current time after the end of the vesting period
//          * check that the vested amount is 90 (100 - 10 released tokens)
//          * release all vested tokens (90)
//          * check that the number of released tokens is 100
//          * check that the vested amount is 0
//          * check that anyone cannot revoke a vesting
//          */
//       });

//       it("Should release vested tokens if revoked", async function () {
//         // deploy vesting contract
//         const tokenVesting = await TokenVesting.deploy(testToken.address);
//         await tokenVesting.deployed();
//         expect((await tokenVesting.getToken()).toString()).to.equal(
//           testToken.address
//         );
//         // send tokens to vesting contract
//         await expect(testToken.transfer(tokenVesting.address, 1000));
//           // .to.emit(testToken, "Transfer")
//           // .withArgs(owner.address, tokenVesting.address, 1000);

//         const baseTime = 1622551248;
//         const beneficiary = addr1;
//         const startTime = baseTime;
//         const cliff = 0;
//         const duration = 1000;
//         const slicePeriodSeconds = 1;
//         const revokable = true;
//         const amount = 100;

//         // create new vesting schedule
//         await tokenVesting.createVestingSchedule(
//           beneficiary.address,
//           startTime,
//           cliff,
//           duration,
//           slicePeriodSeconds,
//           revokable,
//           amount
//         );

//         // compute vesting schedule id
//         const vestingScheduleId =
//           await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
//             beneficiary.address,
//             0
//           );

//         // set time to half the vesting period
//         const halfTime = baseTime + duration / 2;
//         await tokenVesting.setCurrentTime(halfTime);

//         await expect(tokenVesting.revoke(vestingScheduleId,0))
//           // .to.emit(testToken, "Transfer")
//           // .withArgs(tokenVesting.address, beneficiary.address, 50);
//       });

//       it("Should compute vesting schedule index", async function () {
//         const tokenVesting = await TokenVesting.deploy(testToken.address);
//         await tokenVesting.deployed();
//         const expectedVestingScheduleId =
//           "0xa279197a1d7a4b7398aa0248e95b8fcc6cdfb43220ade05d01add9c5468ea097";
//         expect(
//           (
//             await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
//               addr1.address,
//               0
//             )
//           ).toString()
//         ).to.equal(expectedVestingScheduleId);
//         expect(
//           (
//             await tokenVesting.computeNextVestingScheduleIdForHolder(
//               addr1.address
//             )
//           ).toString()
//         ).to.equal(expectedVestingScheduleId);
//       });

//       it("Should check input parameters for createVestingSchedule method", async function () {
//         const tokenVesting = await TokenVesting.deploy(testToken.address);
//         await tokenVesting.deployed();
//         await testToken.transfer(tokenVesting.address, 1000);
//         const time = Date.now();
//         await expect(
//           tokenVesting.createVestingSchedule(
//             addr1.address,
//             time,
//             0,
//             0,
//             1,
//             false,
//             1
//           )
//         )
//         // .to.be.revertedWith("TokenVesting: duration must be > 0");
//         await expect(
//           tokenVesting.createVestingSchedule(
//             addr1.address,
//             time,
//             0,
//             1,
//             0,
//             false,
//             1
//           )
//         )
//         //.to.be.revertedWith("TokenVesting: slicePeriodSeconds must be >= 1");
//         await expect(
//           tokenVesting.createVestingSchedule(
//             addr1.address,
//             time,
//             0,
//             1,
//             1,
//             false,
//             0
//           )
//         )
//         //.to.be.revertedWith("TokenVesting: amount must be > 0");
//       });

//       it("Should vest tokens gradually for a given category", async function () {
//         // deploy vesting contract
//         const tokenVesting = await TokenVesting.deploy(testToken.address);
//         await tokenVesting.deployed();
//         expect((await tokenVesting.getToken()).toString()).to.equal(
//           testToken.address
//         );
//         // send tokens to vesting contract
//         await expect(testToken.transfer(tokenVesting.address, 1000))
//           // .to.emit(testToken, "Transfer")
//           // .withArgs(owner.address, tokenVesting.address, 1000);
//         const vestingContractBalance = await testToken.balanceOf(
//           tokenVesting.address
//         );

//         expect(parseInt(vestingContractBalance.toString(),10)).to.equal(1000);
//         let temp1 = await tokenVesting.getWithdrawableAmount();

//         expect(parseInt(temp1.toString())).to.equal(1000);
//         const a = [owner.address];
//         // const duration = 1000;
//         // const slicePeriodSeconds = 1;
//         // const revokable = true;
//         // const amount = 100;
//         console.log("reached before category creation");
//         // let k = await tokenVesting.categoryMapping(0);
//        // console.log(k,"category details");
//         await tokenVesting.setCategoryParams(
//           "trial",
//           a,
//            0,
//           1000,
//           1,
//           true

//       )
//       console.log("reached after category creation")
//      await tokenVesting.addtokenDistribution(
//         1,
//        50
//     )
//     let temptrial = await tokenVesting.distributionMapping(1);
//     console.log("amount allocated",temptrial);
//     console.log("reached after adding distribution creation")
//         const baseTime = 1656320298;
//         const beneficiary = owner;
//         const startTime = baseTime;
//        // const cliff = 0;
//         const amount = 100;
//         console.log("reached before vesting schedule creation")
//         // create new vesting schedule
//         await tokenVesting.createVestingScheduleForCategory(
//          amount,startTime,beneficiary.address,1
//         );
//         console.log("reached after vesting schedule creation")
//         let temp2 = await tokenVesting.getVestingSchedulesCount();
//         expect(parseInt(temp2.toString(),10)).to.be.equal(1);
//         console.log("reached after schedule count")
//         let temp3 =  await tokenVesting.getVestingSchedulesCountByBeneficiary(
//           beneficiary.address
//         );
//         expect(parseInt(temp3.toString(),10)).to.be.equal(1);

//         // compute vesting schedule id
//         const vestingScheduleId =
//           await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
//             beneficiary.address,
//             0
//           );

//         // check that vested amount is 0
//         let temp4 = await tokenVesting.computeReleasableAmount(vestingScheduleId);

//         expect(
//           parseInt(temp4.toString(),10)
//         ).to.be.equal(0);

//         // set time to half the vesting period
//         const halfTime = baseTime + 1000 / 2;
//         await tokenVesting.setCurrentTime(halfTime);

//         // check that vested amount is half the total amount to vest
//         let temp5 =  await tokenVesting
//         .connect(beneficiary)
//         .computeReleasableAmount(vestingScheduleId);
//         expect(
//          parseInt(temp5.toString(),10)
//         ).to.be.equal(50);

//         // check that only beneficiary can try to release vested tokens
//        // await expect(
//           //await tokenVesting.connect(addr2).release(vestingScheduleId, 100)
//        // )
//         // .to.be.revertedWith(
//         //   "TokenVesting: only beneficiary and owner can release vested tokens"
//         // );

//         // check that beneficiary cannot release more than the vested amount
//         // await expect(
//         //   tokenVesting.connect(beneficiary).release(vestingScheduleId, 100)
//         // )
//         // .to.be.revertedWith(
//         //   "TokenVesting: cannot release tokens, not enough vested tokens"
//         // );

//         // release 10 tokens and check that a Transfer event is emitted with a value of 10
//         // await expect(
//          await tokenVesting.connect(beneficiary).release(vestingScheduleId, 10)
//         //)
//           // .to.emit(testToken, "Transfer")
//           // .withArgs(tokenVesting.address, beneficiary.address, 10);

//         // check that the vested amount is now 40
//         let temp6 =  await tokenVesting
//         .connect(beneficiary)
//         .computeReleasableAmount(vestingScheduleId);

//         expect(
//          parseInt(temp6.toString(),10)
//         ).to.be.equal(40);
//         let vestingSchedule = await tokenVesting.getVestingSchedule(
//           vestingScheduleId
//         );

//         // check that the released amount is 10
//         expect(parseInt(vestingSchedule.released.toString(),10)).to.be.equal(10);

//         // set current time after the end of the vesting period
//         await tokenVesting.setCurrentTime(baseTime + 1000 + 1);

//         // check that the vested amount is 90
//         let temp7 = await tokenVesting
//         .connect(beneficiary)
//         .computeReleasableAmount(vestingScheduleId);
//         expect(
//           parseInt(temp7.toString(),10)
//         ).to.be.equal(90);

//         // beneficiary release vested tokens (45)
//       // await expect(
//         await   tokenVesting.connect(beneficiary).release(vestingScheduleId, 45)
//        // )
//           // .to.emit(testToken, "Transfer")
//           // .withArgs(tokenVesting.address, beneficiary.address, 45);

//         // owner release vested tokens (45)
//         // await expect(
//           await  tokenVesting.connect(owner).release(vestingScheduleId, 45)
//           //)
//           // .to.emit(testToken, "Transfer")
//           // .withArgs(tokenVesting.address, beneficiary.address, 45);
//         vestingSchedule = await tokenVesting.getVestingSchedule(
//           vestingScheduleId
//         );

//         // check that the number of released tokens is 100
//         expect(parseInt(vestingSchedule.released.toString(),10)).to.be.equal(100);

//         // check that the vested amount is 0
//         let temp8 =  await tokenVesting
//         .connect(beneficiary)
//         .computeReleasableAmount(vestingScheduleId);
//         expect(
//          parseInt(temp8.toString(),10)
//         ).to.be.equal(0);

//         // check that anyone cannot revoke a vesting
//         // await expect(
//         //   tokenVesting.connect(addr2).revoke(vestingScheduleId));
//         // ).to.be.revertedWith(" Ownable: caller is not the owner");
//         await tokenVesting.revoke(vestingScheduleId,1);

//       });
//     });
//   });
