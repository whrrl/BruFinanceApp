import {ethers} from 'ethers';
import {TokenABI} from '../contracts/tokenContract';
import {environment} from '../environments/environment';
import {RouterABI} from '../contracts/routerContract';
import {PoolABI} from '../contracts/poolContract';
import {FactoryABI} from '../contracts/factoryContract';
// import Web3 from 'web3';

export const getTokenBalance = async (
  web3Provider,
  userAddress,
  token,
  chainId,
) => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }

  const contract = new ethers.Contract(
    environment.contracts[chainId].tokens[token].address,
    TokenABI,
    web3Provider,
  );

  const balance = await contract.balanceOf(userAddress);
  const formattedBalance = ethers.utils.formatUnits(balance, 6);
  console.log(
    '%c Line:27 🍬 formattedBalance',
    'color:#93c0a4',
    formattedBalance,
  );

  return formattedBalance;
};

export const getTokenAllowance = async (
  web3Provider,
  userAddress,
  tokenAddress,
  contractAddress,
) => {
  if (!web3Provider) {
    throw new Error('web3Provider not connected');
  }

  const contract = new ethers.Contract(tokenAddress, TokenABI, web3Provider);

  const balance = await contract.allowance(userAddress, contractAddress);
  const formattedBalance = ethers.utils.formatUnits(balance, 18);

  return formattedBalance;
};

export const approveToken = async (
  web3Provider,
  userAddress,
  token,
  contractAddress,
) => {
  return new Promise(async resolve => {
    try {
      if (!web3Provider) {
        throw new Error('web3Provider not connected');
      }
      const signer = web3Provider;
      const contract = new ethers.Contract(token, TokenABI, signer);
      let result;
      await contract
        .approve(contractAddress, `1000000000000000`)
        .then(r => {
          result = r;
          console.log('%c Line:62 🍔 r', 'color:#4fff4B', result);
        })
        .catch(err => {
          console.log('%c Line:67 🌶 err', 'color:#e41a6a', err);
        });
      await result.wait();
      resolve(result);
    } catch (error) {
      console.log('%c Line:276 🥕 error', 'color:#ed9ec7', error);
      resolve(false);
    }
  });
};

export const buyBonds = async (
  web3Provider,
  token,
  contractAddress,
  amount,
) => {
  return new Promise(async resolve => {
    try {
      if (!web3Provider) {
        throw new Error('web3Provider not connected');
      }
      // const signer = web3Provider.getSigner();
      const signer = web3Provider;
      const contract = new ethers.Contract(contractAddress, RouterABI, signer);
      let result;
      const value = ethers.utils.parseEther(amount);
      console.log(
        '%c Line:104 🍣 amount',
        'color:#ed9ec7',
        amount,
        token,
        contractAddress,
      );
      await contract
        .deposit(0, token, value)
        .then(r => {
          result = r;
          console.log('%c Line:62 🍔 r', 'color:#4fff4B', result);
        })
        .catch(err => {
          console.log('%c Line:67 🌶 err', 'color:#e41a6a', err);
        });

      await result.wait();
      resolve(result);
    } catch (error) {
      console.log('%c Line:276 🥕 error', 'color:#ed9ec7', error);
      resolve(false);
    }
  });
};

export const getPstTransactions = async (web3Provider, address, chainId) => {
  try {
    let transactionData = new Array();
    if (!web3Provider) {
      throw new Error('web3Provider not connected');
    }
    // const web3 = new Web3(web3Provider);

    const latestBlock = await web3Provider.provider.getBlockNumber();

    const signer = web3Provider.getSigner();
    const contract = new ethers.Contract(
      environment.contracts[chainId].PoolAddress,
      PoolABI,
      signer,
    );

    // BondCreated  event
    let BondCreated = await contract.queryFilter(
      'BondCreated',
      41175249 - 100,
      41175249 + 1000,
    );
    if (BondCreated) {
      BondCreated.forEach(ele => {
        if ((ele.args[0] = 'address')) {
          transactionData.push({
            type: 'deposit',
            amount: ethers.utils.formatUnits(ele.args[4], 6),
            time: new Date(ele.args[2] * 1000),
            coin: environment.TokenAddress == ele.args[3] ? 'USDT' : 'USDC',
            transactionHash: ele.transactionHash,
          });
        }
      });
    }

    // BondCreated  event
    let BondWithdrawn = await contract.queryFilter(
      'BondWithdrawn',
      41175249 - 100,
      41175249 + 1000,
    );
    if (BondWithdrawn) {
      BondWithdrawn.forEach(ele => {
        if ((ele.args[0] = 'address')) {
          transactionData.push({
            type: 'withdraw',
            amount: ethers.utils.formatUnits(ele.args[4], 6),
            time: new Date(ele.args[2] * 1000),
            coin: environment.TokenAddress == ele.args[3] ? 'USDT' : 'USDC',
            transactionHash: ele.transactionHash,
          });
        }
      });
    }

    // BondCreated  event
    let Borrowed = await contract.queryFilter(
      'Borrowed',
      41175249 - 100,
      41175249 + 1000,
    );
    if (Borrowed) {
      Borrowed.forEach(ele => {
        if ((ele.args[0] = 'address')) {
          transactionData.push({
            type: 'borrow',
            amount: ethers.utils.formatUnits(ele.args[4], 6),
            time: new Date(ele.args[2] * 1000),
            coin: environment.TokenAddress == ele.args[3] ? 'USDT' : 'USDC',
            transactionHash: ele.transactionHash,
          });
        }
      });
    }

    // BondCreated  event
    let Repaid = await contract.queryFilter(
      'Repaid',
      41175249 - 100,
      41175249 + 1000,
    );
    if (Repaid) {
      Repaid.forEach(ele => {
        if ((ele.args[0] = 'address')) {
          transactionData.push({
            type: 'repay',
            amount: ethers.utils.formatUnits(ele.args[4], 6),
            time: new Date(ele.args[2] * 1000),
            coin: environment.TokenAddress == ele.args[3] ? 'USDT' : 'USDC',
            transactionHash: ele.transactionHash,
          });
        }
      });
    }

    return transactionData;
  } catch (error) {
    // console.log('%c Line:99 🥪 error', 'color:#e41a6a', error);
    return [];
  }
};

export const getPoolAddressDetails = async (web3Provider, factoryAddress) => {
  const contract = new ethers.Contract(
    factoryAddress,
    FactoryABI,
    web3Provider,
  );

  let poolDetails = await contract.getPoolAddress(0);
  return poolDetails;
};

const getPoolDetails = async web3Provider => {
  const contract = new ethers.Contract(
    environment.factoryAddress,
    FactoryABI,
    web3Provider,
  );

  let poolDetails = await contract.getAllPoolDetails();
  return poolDetails[0];
};

export const getUserBondIds = async (
  web3Provider,
  userAddress,
  chainId,
  pollAddress,
) => {
  try {
    if (!web3Provider) {
      throw new Error('web3Provider not connected');
    }

    // const poolDetails = await getPoolDetails(web3Provider);

    const contract = new ethers.Contract(pollAddress, PoolABI, web3Provider);

    const bondId = await contract.userBondIds(userAddress);

    let amount = 0,
      tokenAmount = [],
      totalWithdrawableAmount = 0;
    let currentTime = new Date().getTime() / 1000;

    let bId = bondId * 1;

    for (let i = 0; i < parseInt(bId); i++) {
      let bond = await contract.userBonds(userAddress, i);

      let bondClaimed = await contract.bondInterestClaimed(userAddress, i);

      let bondAmount = ethers.utils.formatUnits(bond[3], 18);
      let interest = ethers.utils.formatUnits(bond[2], 18);
      let depositTime = bond[1] * 1;

      if (!bond[6]) {
        if (
          currentTime - parseInt(depositTime) >=
          parseInt(bond['lockTimePeriod'])
        ) {
          totalWithdrawableAmount += Number(bondAmount);
        }
      }
      amount += parseFloat(bondAmount);
      let tokenAddress = bond[0];

      tokenAmount.push({
        tokenAddress: tokenAddress,
        depositTime: new Date(depositTime * 1000).toDateString(),
        time: depositTime,
        bondAmount: bondAmount,
        interest: (interest * 100).toFixed(2),
        withdrawn: bond[6],
        bondClaimed: bondClaimed,
        bondId: i,
      });
    }

    return {
      tokenAmount,
      interest: 8,
      bondAmount: amount,
      totalWithdrawableAmount: totalWithdrawableAmount,
    };
  } catch (error) {
    console.log('%c Line:246 🥐 error', 'color:#e41a6a', error);
    return {};
  }
};

export const ClaimBond = async (web3Provider, data, chainId) => {
  return new Promise(async resolve => {
    try {
      if (!web3Provider) {
        throw new Error('web3Provider not connected');
      }
      const signer = web3Provider;
      // const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(
        environment.contracts[chainId].PoolAddress,
        PoolABI,
        signer,
      );
      let result;
      await contract
        .claimInterestOnBond(data.bondId)
        .then(r => {
          result = r;
          console.log('%c Line:62 🍔 r', 'color:#4fff4B', result);
        })
        .catch(err => {
          console.log('%c Line:67 🌶 err', 'color:#e41a6a', err);
        });

      await result.wait();
      resolve(result);
    } catch (error) {
      console.log('%c Line:276 🥕 error', 'color:#ed9ec7', error);
      resolve(false);
    }
  });
};

export const WithdrawBond = async (
  web3Provider,
  userAddress,
  data,
  chainId,
) => {
  return new Promise(async resolve => {
    try {
      if (!web3Provider) {
        throw new Error('web3Provider not connected');
      }
      // const signer = web3Provider.getSigner();
      const signer = web3Provider;

      const contract = new ethers.Contract(
        environment.contracts[chainId].RouterAddress,
        RouterABI,
        signer,
      );

      let result;

      await contract
        .withdraw('0', data.bondId)
        .then(r => {
          result = r;
          console.log('%c Line:62 🍔 r', 'color:#4fff4B', result);
        })
        .catch(err => {
          console.log('%c Line:67 🌶 err', 'color:#e41a6a', err);
        });

      await result.wait();
      resolve(result);
    } catch (error) {
      console.log('%c Line:276 🥕 error', 'color:#ed9ec7', error);
      resolve(false);
    }
  });
};

// export const sendTransaction = async ({web3Provider, method}) => {
//   if (!web3Provider) {
//     throw new Error('web3Provider not connected');
//   }

//   // Get the signer from the UniversalProvider
//   const signer = web3Provider.getSigner();

//   const {chainId} = await web3Provider.getNetwork();

//   const amount = ethers.utils.parseEther('0.0001');
//   const address = '0x0000000000000000000000000000000000000000';
//   const transaction = {
//     to: address,
//     value: amount,
//     chainId,
//   };

//   // Send the transaction using the signer
//   const txResponse = await signer.sendTransaction(transaction);
//   const transactionHash = txResponse.hash;
//   console.log('transactionHash is ' + transactionHash);

//   // Wait for the transaction to be mined (optional)
//   const receipt = await txResponse.wait();
//   console.log('Transaction was mined in block:', receipt.blockNumber);

//   return {
//     method,
//     address,
//     valid: true,
//     result: transactionHash,
//   };
// };

// export const readContract = async ({web3Provider, method}) => {
//   if (!web3Provider) {
//     throw new Error('web3Provider not connected');
//   }

//   const contract = new ethers.Contract(
//     CONTRACT_VALUES.contractAddress,
//     CONTRACT_VALUES.readContractAbi,
//     web3Provider,
//   );

//   // Read contract information
//   const name = await contract.name();
//   const symbol = await contract.symbol();
//   const balance = await contract.balanceOf(CONTRACT_VALUES.balanceAddress);

//   // Format the USDT for displaying to the user
//   const formattedBalance = ethers.utils.formatUnits(balance, 6);

//   return {
//     method,
//     address: CONTRACT_VALUES.contractAddress,
//     valid: true,
//     result: `name: ${name}, symbol: ${symbol}, balance: ${formattedBalance}`,
//   };
// };
