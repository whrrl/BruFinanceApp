//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Token.sol";
import "./TokenVestingBru.sol";
import "../wallets/NIIMargin.sol";

struct ExchangeDetails {
    uint256 tokenPrice;
    mapping(address => uint256) tokens;
    address tokenAddress;
    uint256 snapshotDate;
    uint256 startDate;
    uint256 endDate;
    uint256 maxLimitPerInterval;
    uint256 maxLimitPerUser;
    uint256 tokensExchanged;
}

/**
 * @title Bru Burn contract
 * @author Bru-finance team
 * @notice This contract is implements the burn mechanism of Bru tokens
 */
contract VestingBurn is TokenVestingBru {
    uint256 internal exchangeId; // exchange Id of current time

    mapping(uint256 => ExchangeDetails) public exchangeDetails; //details of given exchange period

    /**
     * @notice Emitted when an exchange interval is started
     * @param _exchangeId The ID of the exchange interval which was started
     * @param _tokenAddress address of the token of which is accepted during the interval
     * @param _tokenPrice The price for which Bru tokens are being exchanged for
     * @param _durationInDays The duration for which the interval is active
     */
    event ExchangeIntervalStarted(
        uint256 _exchangeId,
        address _tokenAddress,
        uint256 _tokenPrice,
        uint256 _durationInDays,
        uint256 _maxLimitForInterval,
        uint256 _maxLimitForUser
    );

    event TokensExchanged(address _userAddress, uint256 _tokensExchanged, uint256 _tokensReceived);

    /**
     * @notice Emitted when an exchange interval is stopped
     * @param _exchangeId The ID of the interval which completed its duration and has stopped
     */
    event ExchangeIntervalCompleted(uint256 _exchangeId);

    /**
     * @notice burn tokens from a given category
     * @param _categoryId the category Id for which the tokens are burned
     * @param _bruTokenAmount amount of bru tokens to be burned
     */
    function burnTokensFromCategory(uint256 _categoryId, uint256 _bruTokenAmount) external onlyDeployer {
        require(
            distributionMapping[_categoryId].tokenAmountleft >= _bruTokenAmount,
            "this category does not have enough tokens"
        );
        tokensBurnedPerQuarter[quarterId] += _bruTokenAmount;
        distributionMapping[_categoryId].tokenAmountleft -= _bruTokenAmount;
        token.burn(address(this), _bruTokenAmount);
    }

    /**
     * @notice The function is used by the users to exchange their bru tokens for stable coins when an exchange interval is active
     * @param _bruTokenAmount The amount of bru tokens the user wants to exchange for the corresponding stable coins.
     */
    function exchangeTokens(uint256 _bruTokenAmount) external virtual {
        require(block.timestamp < exchangeDetails[exchangeId].endDate, "Exchange interval has been completed");
        require(
            exchangeDetails[exchangeId].tokensExchanged + _bruTokenAmount <=
                exchangeDetails[exchangeId].maxLimitPerInterval,
            "Interval limit reached for exchanging tokens"
        );
        uint256 totalTokens = exchangeDetails[exchangeId].tokens[msg.sender] + _bruTokenAmount;

        require(totalTokens <= exchangeDetails[exchangeId].maxLimitPerUser, "User limit reached for exchanging tokens");
        exchangeDetails[exchangeId].tokens[msg.sender] = totalTokens;
        uint256 expectedExchangeTokens = exchangeDetails[exchangeId].tokens[msg.sender] *
            exchangeDetails[exchangeId].tokenPrice;
        tokensBurnedPerQuarter[quarterId] += exchangeDetails[exchangeId].tokens[msg.sender];
        token.burn(msg.sender, exchangeDetails[exchangeId].tokens[msg.sender]);
        NIIMargin(NIIWalletAddress).sendAmount(
            expectedExchangeTokens,
            exchangeDetails[exchangeId].tokenAddress,
            msg.sender
        );

        emit TokensExchanged(msg.sender, _bruTokenAmount, expectedExchangeTokens);
    }

    /**
     * @notice used to start the exchange period.
     * @param _tokenPrice  price of the token specified for a given exchange period.
     * @param _tokenAddress address of the token which is allowed to be used in the exchange
     * @param _durationInDays duration of exchange period in days
     * @param _maxLimitForInterval maximum amount of tokens which can be exchanged in an interval
     * @param _maxLimitPerUser maximum amount of tokens which can be exchanged in an interval for a user
     */
    function startExchange(
        uint256 _tokenPrice,
        address _tokenAddress,
        uint256 _durationInDays,
        uint256 _maxLimitForInterval,
        uint256 _maxLimitPerUser
    ) external onlyAdmin {
        require(_tokenAddress != address(0), "invalid token address");
        require(block.timestamp > exchangeDetails[exchangeId].endDate, "Previous exchange is active");
        require(_tokenPrice > 0, "Exchange rate should be greater than zero");
        exchangeId++;
        exchangeDetails[exchangeId].tokenPrice = _tokenPrice;
        exchangeDetails[exchangeId].tokenAddress = _tokenAddress;
        uint256 snapshotDate = token.createSnapshot();
        exchangeDetails[exchangeId].snapshotDate = snapshotDate;
        exchangeDetails[exchangeId].startDate = block.timestamp;
        exchangeDetails[exchangeId].endDate = block.timestamp + (_durationInDays * 86400);
        exchangeDetails[exchangeId].maxLimitPerInterval = _maxLimitForInterval;
        exchangeDetails[exchangeId].maxLimitPerUser = _maxLimitPerUser;
        emit ExchangeIntervalStarted(
            exchangeId,
            _tokenAddress,
            _tokenPrice,
            _durationInDays,
            _maxLimitForInterval,
            _maxLimitPerUser
        );
    }
}
