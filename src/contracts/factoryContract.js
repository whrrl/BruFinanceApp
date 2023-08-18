export const FactoryABI = [
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
        indexed: false,
        internalType: 'uint256',
        name: '_maxPool',
        type: 'uint256',
      },
    ],
    name: 'MaxPoolChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: '_poolName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_poolTokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_interestTokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_proxyPoolAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_implementationAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_treasuryAddress',
        type: 'address',
      },
    ],
    name: 'PoolDeployed',
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
        internalType: 'string',
        name: '_poolName',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_proxyPoolAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_implementationAddress',
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
    ],
    name: 'addPoolDetails',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bruTokenAddress',
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
        name: '_maxValue',
        type: 'uint256',
      },
    ],
    name: 'changeMaxPool',
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
        name: '_multiSigAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_bruTokenAddress',
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
    name: 'maxPool',
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
];
