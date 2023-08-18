//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";

/**
 * @title Bru Oracle contract
 * @author Bru-finance team
 * @notice This is used to get price of Bru Token
 **/
contract BruOracle is Initializable, UUPSUpgradeable {
    address internal adminAddress; // The address of multisig wallet
    uint256 internal bruTokenPrice; // The price of Bru token

    /**
     * @notice Mapping that store pricefeed address for tokens
     */
    mapping(address => address) public priceFeeds;
    /**
     * @notice Emitted during set rewardAPY action
     * @param _bruTokenPrice The updated bru token price
     **/
    event BruTokenPriceChanged(uint256 _bruTokenPrice);

    /**
     * @notice Emitted when pricefeed set for a token
     * @param _tokenAddress The address of token address to fetch price from oracle
     * @param _oracleAddress The address of oracle contract for given token address
     **/
    event TokenOracleChanged(address _tokenAddress, address _oracleAddress);

    /**
     * @dev Only admin can call functions marked by this modifier.
     **/
    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Can be used only by admin");
        _;
    }

    /**
     * @notice Initializes the required addresses needed for the functioning of this contract
     * @param _adminAddress The address of multisig wallet
     **/
    function initialize(address _adminAddress) external initializer {
        require(_adminAddress != address(0), "zero address not allowed");
        adminAddress = _adminAddress;
        bruTokenPrice = 1000000000000000000;
    }

    /**
     * @notice function to set the oracle contaract for particular token
     * @param _tokenAddress The address of token address to fetch price from oracle
     * @param _priceFeed The address of oracle contract for given token address
     **/
    function setPriceFeedForToken(address _tokenAddress, address _priceFeed) external virtual onlyAdmin {
        priceFeeds[_tokenAddress] = _priceFeed;
        emit TokenOracleChanged(_tokenAddress, _priceFeed);
    }

    /**
     * @notice function to get the value of given token address in USD
     * @param _tokenAddress The address of token address to fetch price from oracle
     * @return returns price of Token/USD
     **/
    function getLatestPriceOfTokenInUSD(address _tokenAddress) public view returns (uint256) {
        int256 answer;
        (, answer, , , ) = AggregatorV2V3Interface(priceFeeds[_tokenAddress]).latestRoundData();
        return uint256(answer);
    }

    /**
     * @notice function to get the decimal point of price feed for given token address
     * @param _tokenAddress The address of token address to fetch decimal of price feed from oracle
     * @return returns decimal of price feed
     **/
    function getPriceFeedDecimal(address _tokenAddress) public view returns (uint256) {
        uint8 decimals = AggregatorV2V3Interface(priceFeeds[_tokenAddress]).decimals();
        return uint256(decimals);
    }

    /**
     * @notice Sets the price of the Bru token
     * @dev Only called by the admin
     * @param _bruTokenPrice The bru token price value
     **/
    function setBruTokenPrice(uint256 _bruTokenPrice) external virtual onlyAdmin {
        bruTokenPrice = _bruTokenPrice;
        emit BruTokenPriceChanged(bruTokenPrice);
    }

    /**
     * @notice Used to get the price of the Bru token
     * @return The current price of the Bru token
     **/
    function getBruTokenPrice() external view virtual returns (uint256) {
        return bruTokenPrice;
    }

    /**
     * @dev Checks the wallet address which initiates the upgrade transaction for the BruOracle contract
     * @param _newImplementation Address of the new implementation contract which is used for upgradation.
     **/
    function _authorizeUpgrade(address _newImplementation) internal view override onlyAdmin {}
}
