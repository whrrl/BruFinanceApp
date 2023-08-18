//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./core/BruFactory.sol";
import "./core/BruPool.sol";

/**
 * @title Bru Router contract
 * @author Bru-finance team
 * @notice Finds a pool by it is index and  redirects deposit, withdraw, borrow or repay to the pool
 */
contract BruRouter is Initializable, UUPSUpgradeable {
    address internal factoryAddress; // address of the factory contract
    address internal adminAddress; // The address of Multisig wallet

    /**
     * @notice Initializes factoryAddress and adminAddress
     * @param _factoryAddress The address of factory contract
     * @param _adminAddress The address of Multisig wallet
     */
    function initialize(address _factoryAddress, address _adminAddress) external virtual initializer {
        require(_factoryAddress != address(0) && _adminAddress != address(0), "wrong address passed");
        factoryAddress = _factoryAddress;
        adminAddress = _adminAddress;
    }

    /**
     * @notice Used to get pool address of the pool assigned to a given index
     * @param _poolIndex The index of a particular pool
     * @return Returns the address of the pool
     */
    function getPoolAddress(uint256 _poolIndex) public view virtual returns (address) {
        return BruFactory(factoryAddress).getPoolAddress(_poolIndex);
    }

    /**
     * @notice Redirects the borrow call to a particular pool for which it is assigned
     * @param _poolIndex The Index of a particular pool
     * @param _nftId The unique Id of the NFT
     * @param _tokenAddress The address of the token
     * @param _tokenAmount The amount of tokens to borrow
     */
    function borrow(
        uint256 _poolIndex,
        string calldata _nftId,
        address _tokenAddress,
        uint256 _tokenAmount
    ) external virtual {
        BruPool(poolShouldExist(_poolIndex)).borrow(msg.sender, _nftId, _tokenAddress, _tokenAmount);
    }

    /**
     * @notice Redirects the repay call to a particular pool for which it is assigned
     * @param _poolIndex The Index of a particular pool
     * @param _nftId The unique Id of the NFT
     * @param _tokenAddress The address of the token
     * @param _tokenAmount The amount of tokens to repay
     */
    function repay(
        uint256 _poolIndex,
        string calldata _nftId,
        address _tokenAddress,
        uint256 _tokenAmount
    ) external virtual {
        BruPool(poolShouldExist(_poolIndex)).repay(msg.sender, _nftId, _tokenAmount, _tokenAddress);
    }

    /**
     * @notice Redirects the deposit call to a particular pool for which it is assigned
     * @param _poolIndex The Index of a particular pool
     * @param _tokenAddress The address of the token
     * @param _tokenAmount The amount of tokens to deposit
     */
    function deposit(
        uint256 _poolIndex,
        address _tokenAddress,
        uint256 _tokenAmount
    ) external virtual {
        BruPool(poolShouldExist(_poolIndex)).deposit(msg.sender, _tokenAddress, _tokenAmount);
    }

    /**
     * @notice Redirects the withdraw call to a particular pool for which it is assigned
     * @param _poolIndex The index of a particular pool
     * @param _bondId The amount of tokens to withdraw
     */
    function withdraw(uint256 _poolIndex, uint256 _bondId) external virtual {
        BruPool(poolShouldExist(_poolIndex)).withdraw(msg.sender, _bondId);
    }

    /**
     * @notice Used to get the details of the pool associated with a given index
     * @param _poolIndex The index of a particular pool
     * @return Returns the details information of a particular pool
     */
    function getPoolDetails(uint256 _poolIndex) external view virtual returns (PoolDetails memory) {
        return BruFactory(factoryAddress).getPoolDetails(_poolIndex);
    }

    /**
     * @notice Used to get an array of all available pool details
     * @return Return an array of all available pool details
     */
    function getAllPoolDetails() external view virtual returns (PoolDetails[] memory) {
        return BruFactory(factoryAddress).getAllPoolDetails();
    }

    /**
     * @notice Checks whether pool exists in the factory or not
     * @param _poolIndex The index of the pool
     * @return The address of the pool
     */
    function poolShouldExist(uint256 _poolIndex) internal view returns (address) {
        address poolAddress = getPoolAddress(_poolIndex);
        return poolAddress;
    }

    /**
     * @dev Checks the wallet address which initiates the upgrade transaction for BruRouter contract
     * @param _newImplementation Address of the new implementation contract which is used for upgradation.
     **/
    function _authorizeUpgrade(address _newImplementation) internal view override {
        require(msg.sender == adminAddress, "Only admin allowed");
    }
}
