import {ethers} from 'ethers';
import {environment} from '../environments/environment';
import request from './request';
import {getPoolAddressDetails} from './web3Service';

export const getTotalDepositors = data => {
  return new Promise(async (resolve, reject) => {
    await request
      .get('/api/v1/nfts/nftDatas')
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
      });
  });
};

export const getPolAddress = () => {
  return new Promise(async (resolve, reject) => {
    let returnData = {};
    const networks = environment.supportedNetwork;
    for (const iterator of networks) {
      // const Web3Provider = new ethers.providers.InfuraProvider(
      //   environment.contracts[iterator].InfuraName,
      //   environment.InfuraKey,
      // );
      const Web3Provider = new ethers.providers.JsonRpcProvider(
        environment.contracts[iterator].InfuraUrl,
      );
      const poolAddress = await getPoolAddressDetails(
        Web3Provider,
        environment.contracts[iterator].factoryAddress,
      );
      returnData[iterator] = poolAddress;
    }
    resolve(returnData);
  });
};
