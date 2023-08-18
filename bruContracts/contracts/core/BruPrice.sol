// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

/**
 * @title Bru Price contract
 * @author Bru-finance team
 * @notice Contract that is used to get assets prices which is used in BruPool contract
 */
contract BruPrice is Initializable, UUPSUpgradeable {
    address internal adminAddress; // The address of Multisig wallet
    address internal owner; // The address of deployer.
    /**
     * @notice a mapping that stores assets name with respect to price
     */
    mapping(string => uint256) public asset;

    /**
     * @notice Emitted when commodity price updated
     * @param _id The id of the asset
     * @param _value The newly updated price
     */
    event CommodityPriceUpdated(string _id, uint256 _value);

    /**
     * @dev Only admin can call functions marked by this modifier.
     */
    modifier onlyOwner() {
        require(owner == msg.sender, "Only owner address is allowed");
        _;
    }

    /**
     * @notice Initializes admin address
     * @param _adminAddress The address of Multisig wallet
     */
    function initialize(address _adminAddress) external virtual initializer {
        require(_adminAddress != address(0), "incorrect address");
        adminAddress = _adminAddress;
        owner = msg.sender;
    }

    /**
     * @notice Updates the Price of the asset
     * @param _id The Id of the asset
     * @param _price The price of the asset
     */
    function updatePrice(string memory _id, uint256 _price) external virtual onlyOwner {
        asset[_id] = _price;
        emit CommodityPriceUpdated(_id, _price);
    }

    /**
     * @dev Checks the wallet address which initiates the upgrade transaction for BruPrice contract
     * @param _newImplementation Address of the new implementation contract which is used for upgradation.
     */
    function _authorizeUpgrade(address _newImplementation) internal view override {
        require(msg.sender == adminAddress, "Only admin allowed");
    }
}
