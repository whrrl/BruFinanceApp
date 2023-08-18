export const PoolABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: '_nftId',
        type: 'string',
      },
    ],
    name: 'AssetLocked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: '_nftId',
        type: 'string',
      },
    ],
    name: 'AssetUnlocked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_bondId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
    ],
    name: 'BondCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_bondId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
    ],
    name: 'BondInterestClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_bondId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
    ],
    name: 'BondWithdrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_fee',
        type: 'uint256',
      },
    ],
    name: 'BorrowPlatformFeeChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_rate',
        type: 'uint256',
      },
    ],
    name: 'BorrowRateChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_nftId',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
    ],
    name: 'Borrowed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'CoreFunctionalityAvailabilityStatus',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_fee',
        type: 'uint256',
      },
    ],
    name: 'LendPlatformFeeChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_lockPeriod',
        type: 'uint256',
      },
    ],
    name: 'LockPeriodChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_maxAllowedAddresses',
        type: 'uint256',
      },
    ],
    name: 'MaxAddressesAllowedChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_nftId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_commodityId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_quantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_value',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_dataHash',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_data',
        type: 'string',
      },
    ],
    name: 'NFTMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_apy',
        type: 'uint256',
      },
    ],
    name: 'PoolRewardsStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'PoolRewardsStopped',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_nftId',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_timestamp',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
    ],
    name: 'Repaid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: '_spread',
        type: 'uint256',
      },
    ],
    name: 'SpreadChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
    ],
    name: 'TokenAddressAllowed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
    ],
    name: 'TokenAddressDisabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
    ],
    name: 'allowTokenAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'allowedTokenAddresses',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'assetLocked',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'bondInterestClaimed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_nftId',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
    ],
    name: 'borrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'borrowedNft',
    outputs: [
      {
        internalType: 'uint256',
        name: 'borrowedAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'time',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'tokenBorrowedAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_interestRate',
        type: 'uint256',
      },
    ],
    name: 'changeBorrowInterestRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_fee',
        type: 'uint256',
      },
    ],
    name: 'changeBorrowPlatformFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'changeCoreFunctionalityStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_fee',
        type: 'uint256',
      },
    ],
    name: 'changeLendPlatformFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_time',
        type: 'uint256',
      },
    ],
    name: 'changeLockPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_maxValue',
        type: 'uint256',
      },
    ],
    name: 'changeMaxAddresses',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_spread',
        type: 'uint256',
      },
    ],
    name: 'changeSpread',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_bondId',
        type: 'uint256',
      },
    ],
    name: 'claimInterestOnBond',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'corePause',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllowedTokenAddressesArray',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_nftId',
        type: 'string',
      },
    ],
    name: 'getRepaymentAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_routerAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_multiSigAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_factoryAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_poolTokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_interestTokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_treasuryAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_poolName',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_interestWalletAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_bruRewardsAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_bruPriceAddress',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_nftId',
        type: 'string',
      },
    ],
    name: 'lockAsset',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lockPeriod',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxAllowedTokenAddresses',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_nftId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_commodityId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_quantity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_dataHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_data',
        type: 'string',
      },
    ],
    name: 'mintNft',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'nft',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'commodityId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'borrowed',
        type: 'bool',
      },
      {
        internalType: 'string',
        name: 'dataHash',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'data',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformFees',
    outputs: [
      {
        internalType: 'uint256',
        name: 'borrow',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lend',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rates',
    outputs: [
      {
        internalType: 'uint256',
        name: 'borrow',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lend',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_requiredTokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
    ],
    name: 'redeemInterestToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
    ],
    name: 'removeTokenAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_nftId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
    ],
    name: 'repay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'spread',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_rewardAPY',
        type: 'uint256',
      },
    ],
    name: 'startRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stopRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'tokenAddresses',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'totalExpense',
    outputs: [
      {
        internalType: 'uint256',
        name: 'otherexpenses',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interest',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_nftId',
        type: 'string',
      },
    ],
    name: 'unlockAsset',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'userBondIds',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userBonds',
    outputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'bondTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interest',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'bondAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lockTimePeriod',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'claimedDay',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'withdrawn',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_bondId',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
