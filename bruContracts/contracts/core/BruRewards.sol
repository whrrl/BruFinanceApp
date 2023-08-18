//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./BruPool.sol";
import "./BruFactory.sol";
import "./BruOracle.sol";
import "../vesting/TokenVestingBru.sol";

/**
 * @title BruRewards contract
 * @author Bru-finance team
 * @dev This contract is used to contains rewards logic
 */
contract BruRewards is Initializable, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    uint256 public emission; // number of tokens emitted per interval
    uint256 internal secondsPerYear; // seconds in a year

    address internal adminAddress; // address of Multisig wallet
    address internal factoryAddress; // address of BruFactory contract
    address internal bruToken; // address of Bru token
    address internal bruOracleAddress; // address of BruOracle contract
    address internal tokenVestingAddress; // address of TokenVestingBru contract
    //struct which is used to store reward details per interval
    struct RewardDetails {
        uint256 rewardTokens;
        uint256 startTime;
        uint256 endTime;
        uint256 totalLendAmount;
        uint256 totalBorrowedAmount;
        bool isActive;
    }
    // struct which is used to store the balance of user per interval
    struct UserBalance {
        uint256 lendAmount;
        uint256 borrowedAmount;
    }

    mapping(uint256 => uint256) internal rewardIntervalIds; // used to store reward interval id for pool
    mapping(uint256 => mapping(uint256 => RewardDetails)) internal rewardDetails; //used to store reward details for pool
    mapping(uint256 => mapping(uint256 => mapping(address => UserBalance))) internal userBalance; // used to store user balance
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) internal userClaims; // to check if the reward is claimed by user for an interval
    /**
     * @notice emitted during emission change action in the contract
     * @param _emission the new emission value in the contract
     */
    event EmissionChanged(uint256 _emission);
    /**
     * @notice emitted during reward interval started
     * @param _poolIndex the pool index for which the reward interval is started
     * @param _rewardAPY The number of reward APY
     */
    event PoolRewardsStarted(uint256 _poolIndex, uint256 _rewardAPY);
    /**
     * @notice emitted when pool reward stopped
     * @param _poolIndex the pool index for which the reward interval is stopped
     */
    event PoolRewardsStopped(uint256 _poolIndex);
    /**
     * @notice emitted when user lent amount updated during reward interval
     * @param _poolIndex The pool index for which the amount added
     * @param _userAddress The user address for which the lend amount updated
     * @param _amount The amount of tokens deposited during a reward interval
     */
    event LendAmountUpdated(uint256 _poolIndex, address _userAddress, uint256 _amount);
    /**
     * @notice emitted when user borrow amount updated during reward interval
     * @param _poolIndex The pool index for which the amount updated
     * @param _userAddress The user address for which the borrow amount updated
     * @param _amount The amount of tokens borrowed during a reward interval
     */
    event BorrowAmountUpdated(uint256 _poolIndex, address _userAddress, uint256 _amount);

    /**
     * @notice emitted when user claims reward tokens for a particulat interval of a pool
     * @param _rewardIntervalId The pool index for which the amount updated
     * @param _poolIndex The user address for which the borrow amount updated
     * @param _userAddress The amount of tokens borrowed during a reward interval
     */
    event RewardsClaimed(uint256 _rewardIntervalId, uint256 _poolIndex, address _userAddress);
    /**
     * @dev Only admin can call functions marked by this modifier.
     */
    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Can be used only by admin");
        _;
    }

    /**
     * @dev Only pool can call functions marked by this modifier.
     */
    modifier onlyPool(uint256 _poolIndex) {
        PoolDetails memory poolDetails = BruFactory(factoryAddress).getPoolDetails(_poolIndex);
        require(poolDetails.proxyPoolAddress == msg.sender, "Only pools can access");
        _;
    }

    /**
     * @notice Initializes necessary contract addresses
     * @param _adminAddress The address of multisig wallet
     * @param _factoryAddress The address of factory contract
     * @param _bruToken address of bru token
     * @param _tokenVestingAddress The address of token vesting contract
     * @param _bruOracleAddress The address of bru oracle contract
     */
    function initialize(
        address _adminAddress,
        address _factoryAddress,
        address _bruToken,
        address _tokenVestingAddress,
        address _bruOracleAddress
    ) external virtual initializer {
        require(
            _adminAddress != address(0) &&
                _factoryAddress != address(0) &&
                _bruToken != address(0) &&
                _tokenVestingAddress != address(0) &&
                _bruOracleAddress != address(0),
            "Invalid Address"
        );
        adminAddress = _adminAddress;
        factoryAddress = _factoryAddress;
        bruToken = _bruToken;
        tokenVestingAddress = _tokenVestingAddress;
        bruOracleAddress = _bruOracleAddress;
        emission = 1000000000000000000000;
        secondsPerYear = 31536000;
    }

    /**
     * @notice gets latest reward interval for a pool index
     * @param _poolIndex the pool index for which the status of the reward interval is to checked
     */
    function getLatestRewardIntervalForPool(uint256 _poolIndex) public view virtual returns (RewardDetails memory) {
        return rewardDetails[_poolIndex][rewardIntervalIds[_poolIndex]];
    }

    /**
     * @notice used to calculate rewardAPY which is used while rewards distribution
     */
    function getRewardAPY() public view virtual returns (uint256) {
        uint256 tokenPrice = BruOracle(bruOracleAddress).getBruTokenPrice();
        uint256 numerator = emission * tokenPrice * secondsPerYear;
        uint256 tokenSupply = Token(BruFactory(factoryAddress).bruTokenAddress()).initialTokenSupply();
        uint256 denominator = tokenSupply * 1440 * 10;
        uint256 rewardAPY = numerator / denominator;
        return rewardAPY;
    }

    /**
     * @notice used to changes the amount of emitted tokens during reward interval
     * @param _emission the new emission value in the contract
     */
    function changeEmission(uint256 _emission) external virtual onlyAdmin {
        emission = _emission;
        emit EmissionChanged(emission);
    }

    /**
     * @notice starts rewards interval for pool
     * @param _poolIndex the pool index for which the reward interval is to be started
     * @param _durationInDays The duration for which the reward interval will be active
     */
    function startRewardsForPool(uint256 _poolIndex, uint256 _durationInDays) external virtual onlyAdmin {
        require(!rewardDetails[_poolIndex][rewardIntervalIds[_poolIndex]].isActive, "An interval is already active");
        rewardIntervalIds[_poolIndex] += 1;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + _durationInDays * 86400;
        PoolDetails[] memory allPoolDetails = BruFactory(factoryAddress).getAllPoolDetails();
        uint256 poolTokenAmount = emission / allPoolDetails.length;
        rewardDetails[_poolIndex][rewardIntervalIds[_poolIndex]] = RewardDetails(
            poolTokenAmount,
            block.timestamp,
            endTime,
            0,
            0,
            true
        );
        PoolDetails memory poolDetails = BruFactory(factoryAddress).getPoolDetails(_poolIndex);
        uint256 rewardAPY = getRewardAPY();
        BruPool(poolDetails.proxyPoolAddress).startRewards(rewardAPY);
        TokenVestingBru(tokenVestingAddress).distributeRewards(emission);
        emit PoolRewardsStarted(_poolIndex, rewardAPY);
    }

    /**
     * @notice stops rewards interval for pool
     * @param _poolIndex the pool index for which the reward interval is to be stopped
     */
    function stopRewardsForPool(uint256 _poolIndex) external virtual onlyAdmin {
        require(rewardDetails[_poolIndex][rewardIntervalIds[_poolIndex]].isActive, "rewards should be active");
        require(
            block.timestamp > rewardDetails[_poolIndex][rewardIntervalIds[_poolIndex]].endTime,
            "Rewards duration not completed"
        );
        rewardDetails[_poolIndex][rewardIntervalIds[_poolIndex]].isActive = false;
        PoolDetails memory poolDetails = BruFactory(factoryAddress).getPoolDetails(_poolIndex);
        BruPool(poolDetails.proxyPoolAddress).stopRewards();
        emit PoolRewardsStopped(_poolIndex);
    }

    /**
     * @notice checks if reward interval is active for a pool index
     * @param _poolIndex the pool index for which the status of the reward interval is to checked
     */
    function getRewardStatusForPool(uint256 _poolIndex) external view virtual returns (bool) {
        return
            rewardDetails[_poolIndex][rewardIntervalIds[_poolIndex]].isActive &&
            (rewardDetails[_poolIndex][rewardIntervalIds[_poolIndex]].endTime >= block.timestamp);
    }

    /**
     * @notice updates user's lent amount when a reward interval is active for a particular pool
     * @param _poolIndex the pool index for which the amount is to be added
     * @param _userAddress The user address for which the lend amount is to be updated
     * @param _amount The amount of tokens deposited during a reward interval
     */
    function updateLendAmountInRewardsInterval(
        uint256 _poolIndex,
        address _userAddress,
        uint256 _amount
    ) external virtual onlyPool(_poolIndex) {
        uint256 id = rewardIntervalIds[_poolIndex];
        userBalance[_poolIndex][id][_userAddress].lendAmount += _amount;
        rewardDetails[_poolIndex][rewardIntervalIds[_poolIndex]].totalLendAmount += _amount;
        emit LendAmountUpdated(_poolIndex, _userAddress, _amount);
    }

    /**
     * @notice updates user's borrowed amount when a reward interval is active for a particular pool
     * @param _poolIndex the pool index for which the amount is to be added
     * @param _userAddress The user address for which the borrowed amount is to be updated
     * @param _amount The amount of tokens borrowed by user during a reward interval
     */
    function updateBorrowAmountInRewardsInterval(
        uint256 _poolIndex,
        address _userAddress,
        uint256 _amount
    ) external virtual onlyPool(_poolIndex) {
        uint256 id = rewardIntervalIds[_poolIndex];
        userBalance[_poolIndex][id][_userAddress].borrowedAmount += _amount;
        rewardDetails[_poolIndex][rewardIntervalIds[_poolIndex]].totalBorrowedAmount += _amount;
        emit BorrowAmountUpdated(_poolIndex, _userAddress, _amount);
    }

    /**
     * @notice It is used by users to claim their reward bru tokens from the reward contracts.
     * @param _poolIndex the pool index for which the users want to claim tokens
     * @param _rewardIntervalId The reward interval from which the users want to claim tokens.
     */

    function claimRewards(uint256 _poolIndex, uint256 _rewardIntervalId) external virtual {
        require(rewardDetails[_poolIndex][_rewardIntervalId].startTime > 0, "Rewards interval does not exist");

        require(!userClaims[_poolIndex][_rewardIntervalId][msg.sender], "Rewards has already been claimed");
        RewardDetails memory rewardDetailsForPool = rewardDetails[_poolIndex][_rewardIntervalId];

        require(
            block.timestamp > rewardDetails[_poolIndex][_rewardIntervalId].endTime,
            "Rewards duration not completed"
        );
        uint256 bruTokenAmountForLend;
        uint256 bruTokenAmountForBorrow;

        if (rewardDetailsForPool.totalLendAmount > 0) {
            uint256 userPercentageInLend = ((userBalance[_poolIndex][_rewardIntervalId][msg.sender].lendAmount) *
                10**18) / (rewardDetailsForPool.totalLendAmount);

            bruTokenAmountForLend = (userPercentageInLend * (rewardDetailsForPool.rewardTokens / 2)) / 10**18;
        }

        if (rewardDetailsForPool.totalBorrowedAmount > 0) {
            uint256 userPercentageInBorrow = (userBalance[_poolIndex][_rewardIntervalId][msg.sender].borrowedAmount *
                10**18) / (rewardDetailsForPool.totalBorrowedAmount);
            bruTokenAmountForBorrow = (userPercentageInBorrow * (rewardDetailsForPool.rewardTokens / 2)) / 10**18;
        }

        uint256 totalAmount = bruTokenAmountForBorrow + bruTokenAmountForLend;

        userClaims[_poolIndex][_rewardIntervalId][msg.sender] = true;
        IERC20(bruToken).safeTransfer(msg.sender, totalAmount);
        emit RewardsClaimed(_rewardIntervalId, _poolIndex, msg.sender);
    }

    /**
     * @dev Checks the wallet address which initiates the upgrade transaction for BruRewards contract
     * @param _newImplementation Address of the new implementation contract which is used for upgradation.
     */
    function _authorizeUpgrade(address _newImplementation) internal view override {
        require(msg.sender == adminAddress, "Only admin allowed");
    }
}
