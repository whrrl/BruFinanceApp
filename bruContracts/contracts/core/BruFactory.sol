//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

struct PoolDetails {
    string poolName;
    address poolTokenAddress;
    address interestTokenAddress;
    address proxyPoolAddress;
    address implementationPoolAddress;
    address treasuryAddress;
}

/**
 * @title Bru Factory contract
 * @author Bru-finance team
 * @notice Used for storage and retrieval of addresses of Brufinance pools.
 **/
contract BruFactory is Initializable, UUPSUpgradeable {
    // @dev the address of bru token.
    address public bruTokenAddress;
    address internal admin; //The address of multisig wallet
    PoolDetails[] internal poolDetails; //the array which contains the details of pools in the Bru Ecosystem
    uint256 public maxPool; //maximum number of allowed pools
    /**
     * @notice Emitted when the pool is successfully deployed.
     * @param _poolName The name of the pool
     * @param _poolTokenAddress The address of the pool token
     * @param _interestTokenAddress The address of the interest token
     * @param _proxyPoolAddress The address of proxy pool
     * @param _implementationAddress The address of the pool implementation contract
     * @param _treasuryAddress The address of treasury contract
     */
    event PoolDeployed(
        string _poolName,
        address _poolTokenAddress,
        address _interestTokenAddress,
        address _proxyPoolAddress,
        address _implementationAddress,
        address _treasuryAddress
    );

    /**
     * @notice Emitted when max pool changed_
     * @param  _maxPool The number of max pool allowed
     */
    event MaxPoolChanged(uint256 _maxPool);
    /**
     * @dev Only admin can call functions marked by this modifier.
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Can be used only by admin");
        _;
    }

    /**
     * @notice Initializes the required addresses needed for the functioning of this contract
     * @param _multiSigAddress The address of multisig wallet
     * @param _bruTokenAddress Address of the Bru token
     **/
    function initialize(address _multiSigAddress, address _bruTokenAddress) external virtual initializer {
        require(_multiSigAddress != address(0) && _bruTokenAddress != address(0), "zero address not allowed");
        admin = _multiSigAddress;
        bruTokenAddress = _bruTokenAddress;
        maxPool = 99;
    }

    /**
     * @notice Stores addreses related to the pool in the  poolDetails array
     * @dev only called by the admin
     * @param _poolName The name of the pool
     * @param _proxyPoolAddress The address of proxy pool
     * @param _implementationAddress TThe address of the pool implementation contract
     * @param _poolTokenAddress The address of the pool token
     * @param _interestTokenAddress The address of the interest token
     * @param _treasuryAddress The address of treasury contract
     */
    function addPoolDetails(
        string memory _poolName,
        address _proxyPoolAddress,
        address _implementationAddress,
        address _poolTokenAddress,
        address _interestTokenAddress,
        address _treasuryAddress
    ) external onlyAdmin {
        require(
            _proxyPoolAddress != address(0) &&
                _implementationAddress != address(0) &&
                _poolTokenAddress != address(0) &&
                _interestTokenAddress != address(0) &&
                _treasuryAddress != address(0),
            "incorrect address"
        );
        require(poolDetails.length + 1 < maxPool, "Max pool limit reached");
        poolDetails.push(
            PoolDetails(
                _poolName,
                _poolTokenAddress,
                _interestTokenAddress,
                _proxyPoolAddress,
                _implementationAddress,
                _treasuryAddress
            )
        );
        emit PoolDeployed(
            _poolName,
            _poolTokenAddress,
            _interestTokenAddress,
            _proxyPoolAddress,
            _implementationAddress,
            _treasuryAddress
        );
    }

    /**
     * @notice changes the max allowed addresses for a pool
     * @param _maxValue new max value of allowed pools
     */
    function changeMaxPool(uint256 _maxValue) external virtual onlyAdmin {
        maxPool = _maxValue;
        emit MaxPoolChanged(_maxValue);
    }

    /**
     * @notice Used to get the pool address by using poolIndex as a param
     * @param _poolIndex the index of the pool
     * @return The address of pool assocatied with pool index
     */
    function getPoolAddress(uint256 _poolIndex) external view virtual returns (address) {
        require(_poolIndex <= poolDetails.length - 1, "Pool does not exist");
        return poolDetails[_poolIndex].proxyPoolAddress;
    }

    /**
     * @notice Used to get pool details by using poolIndex as param
     * @param _poolIndex the index of the pool
     * @return The details of a pool associated with the pool index.
     */
    function getPoolDetails(uint256 _poolIndex) external view virtual returns (PoolDetails memory) {
        return poolDetails[_poolIndex];
    }

    /**
     * @notice Used to get all pools related addresses
     * @return Array of all pools related addresses
     */
    function getAllPoolDetails() external view virtual returns (PoolDetails[] memory) {
        return poolDetails;
    }

    /**
     * @dev Checks the wallet address which initiates the upgrade transaction for BruFactory contract
     * @param _newImplementation Address of the new implementation contract which is used for upgradation.
     */
    function _authorizeUpgrade(address _newImplementation) internal view override onlyAdmin {}
}
