export const RouterABI = [
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
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
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
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
    name: 'getAllPoolDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'poolName',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'poolTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'interestTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'proxyPoolAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'implementationPoolAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'treasuryAddress',
            type: 'address',
          },
        ],
        internalType: 'struct PoolDetails[]',
        name: '',
        type: 'tuple[]',
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
    ],
    name: 'getPoolAddress',
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
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
      },
    ],
    name: 'getPoolDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'poolName',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'poolTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'interestTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'proxyPoolAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'implementationPoolAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'treasuryAddress',
            type: 'address',
          },
        ],
        internalType: 'struct PoolDetails',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_factoryAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_adminAddress',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
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
    name: 'repay',
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
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
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
