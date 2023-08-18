//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

import "./../vesting/Token.sol";

/**
 * @title BruAdmin contract
 * @author Bru-finance team
 * @dev This contract is used to access admin level functionalities in the pool.
 */
contract BruAdmin {
    //value of pool Rewards APY
    uint256 internal poolRewardAPY;

    // determines the lending rate
    uint256 public spread;

    uint256 public lockPeriod; // lock period for deposited funds

    uint256 internal maxFeeRate; // Maxium fees charged by platform

    uint256 public maxAllowedTokenAddresses; // maximum number of allowed tokens
    /**
     * @notice Admin address
     */
    address public admin;
    /**
     * @notice owner address which can trigger owner only functions
     */
    address internal owner;

    //address of bruRewards Contract
    address internal bruRewardsAddress;

    //address of bruPrice Contract
    address internal bruPriceAddress;

    // address of router contract;
    address internal routerAddress;

    //address of treasury Contract
    address internal treasuryAddress;

    //indicates if asset/NFT is available for borrowing
    mapping(string => bool) public assetLocked;

    /**
     * @notice Array of tokens which can be used in this pool
     */
    address[] public tokenAddresses;
    bool public corePause; // it is used for pause functionality in the pool contracts

    Rates public rates; // interest rates for borrow and lend for the pool.

    PlatformFees public platformFees; // platform fees for borrow and lend functionality
    //Pool Limits
    struct Rates {
        uint256 borrow;
        uint256 lend;
    }

    //Platform Fees
    struct PlatformFees {
        uint256 borrow;
        uint256 lend;
    }

    /// @notice Mapping for maintaing addresses of stablecoins allowed by the admin
    mapping(address => bool) public allowedTokenAddresses;

    /// @notice a mapping that stores the index of the _tokenAddress in tokenAddresses array
    mapping(address => uint256) internal tokenAddressIndex;

    /**
     * @notice emitted during spread change action.
     * @param _spread the new spread value in the pool
     */
    event SpreadChanged(uint256 _spread);

    /**
     * @notice emitted during change lock period action in the pool.
     * @param _lockPeriod the new lock period for deposits in the pool
     */
    event LockPeriodChanged(uint256 _lockPeriod);

    /**
     * @notice Emitted when new token address added to the pool
     * @param _tokenAddress The address of the newly added token
     */
    event TokenAddressAllowed(address _tokenAddress);

    /**
     * @notice Emited when allowed token address removed from the contract
     * @param _tokenAddress The address of the removed token
     */
    event TokenAddressDisabled(address _tokenAddress);

    /**
     * @notice Emitted when pool borrow interest rate changed_
     * @param _rate The number of newly changed_ pool borrow interest rate
     */
    event BorrowRateChanged(uint256 _rate);

    /**
     * @notice Emitted when borrow platform fee changed_
     * @param _fee The number of newly changed platform fee
     */
    event BorrowPlatformFeeChanged(uint256 _fee);

    /**
     * @notice Emitted when max allowed addresses changed_
     * @param _maxAllowedAddresses The number of max addresses allowed
     */
    event MaxAddressesAllowedChanged(uint256 _maxAllowedAddresses);
    /**
     * @notice Emitted when lending platform fee changed
     * @param _fee The number of newly changed platform fee
     */
    event LendPlatformFeeChanged(uint256 _fee);

    /**
     * @notice Emitted when rewardAPY increased
     * @param _apy The amount of the increased APY
     */
    event PoolRewardsStarted(uint256 _apy);

    /**
     * @notice Emitted after pool reward stopped
     */
    event PoolRewardsStopped();

    /**
     * @notice Emitted when the status of the pool changed
     * @param _status the newly changed status
     */
    event CoreFunctionalityAvailabilityStatus(bool _status);

    /**
     * @notice Emitted when NFT is locked
     * @param _nftId the ID of the NFT
     */
    event AssetLocked(string _nftId);

    /**
     * @notice Emitted when NFT is unlocked
     * @param _nftId the ID of the NFT
     */
    event AssetUnlocked(string _nftId);

    /**
     * @dev Checks the availability of the core functionality in the pool
     */
    modifier checkCorePauseStatus() {
        require(!corePause, "Core functionalities disabled");
        _;
    }

    /**
     * @dev Only Asset treasury contract can call functions marked by this modifier.
     */
    modifier onlyAssetTreasury() {
        require(treasuryAddress == msg.sender, "only treasury allowed");
        _;
    }

    /**
     * @notice Used to check the accessibility and only allows the admin to access the functions.
     */

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }

    /**
     * @notice Used to check the accessibility and only allows the router to access the functions.
     */
    modifier onlyRouter() {
        _onlyRouter();
        _;
    }

    /**
     * @notice Used to check the new fee value is less than a max value.
     * @param _fee new fee value
     */
    modifier checkFeeValue(uint256 _fee) {
        _checkFeeValue(_fee);
        _;
    }

    /**
     * @notice Used to check the accessibility and only allows the owner to access the functions.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "only owner is authorized");
        _;
    }

    /**
     * @notice Gives a list of token addresses which are supported by the pool
     * @return array of addresses with list of token addresses supported by the pool
     */
    function getAllowedTokenAddressesArray() public view virtual returns (address[] memory) {
        return tokenAddresses;
    }

    /**
     * @notice Used to add a new token address which can be used in the pool
     * @param _tokenAddress the new token address which can be used in the pool
     */
    function allowTokenAddress(address _tokenAddress) external virtual onlyAdmin {
        require(_tokenAddress != address(0), "Invalid Address");
        require(tokenAddresses.length + 1 < maxAllowedTokenAddresses, "Max limit reached");
        require(!allowedTokenAddresses[_tokenAddress], "Already allowed by admin");
        allowedTokenAddresses[_tokenAddress] = true;
        tokenAddresses.push(_tokenAddress);
        tokenAddressIndex[_tokenAddress] = tokenAddresses.length;
        emit TokenAddressAllowed(_tokenAddress);
    }

    /**
     * @notice Disables specified token for use in the pool.
     * @param _tokenAddress the new token address which is removed from the pool
     */
    function removeTokenAddress(address _tokenAddress) external virtual onlyAdmin {
        require(allowedTokenAddresses[_tokenAddress], "Not allowed by the admin");
        allowedTokenAddresses[_tokenAddress] = false;

        uint256 index = tokenAddressIndex[_tokenAddress];
        tokenAddresses[index - 1] = tokenAddresses[tokenAddresses.length - 1];
        tokenAddressIndex[tokenAddresses[tokenAddresses.length - 1]] = index;
        delete tokenAddressIndex[_tokenAddress];
        tokenAddresses.pop();
        emit TokenAddressDisabled(_tokenAddress);
    }

    /**
     * @notice changes the borrow interest rate in the pool
     * @param _interestRate the new borrow interest rate
     */
    function changeBorrowInterestRate(uint256 _interestRate) external virtual onlyAdmin checkFeeValue(_interestRate) {
        rates.borrow = (_interestRate * (10**18)) / (10000);
        emit BorrowRateChanged(_interestRate);
    }

    /**
     * @notice changes the borrowing platform fees in the pool
     * @param _fee the new borrowing platform fees
     */
    function changeBorrowPlatformFee(uint256 _fee) external virtual onlyAdmin checkFeeValue(_fee) {
        platformFees.borrow = (_fee * (10**18)) / (10000);
        emit BorrowPlatformFeeChanged(_fee);
    }

    /**
     * @notice changes the max allowed addresses for a pool
     * @param _maxValue new max value allowed address
     */
    function changeMaxAddresses(uint256 _maxValue) external virtual onlyAdmin {
        maxAllowedTokenAddresses = _maxValue;
        emit MaxAddressesAllowedChanged(_maxValue);
    }

    /**
     * @notice changes the lending platform fees in the pool
     * @param _fee the new lending platform fees
     */
    function changeLendPlatformFee(uint256 _fee) external virtual onlyAdmin checkFeeValue(_fee) {
        platformFees.lend = _fee * 10000;
        emit LendPlatformFeeChanged(_fee);
    }

    /**
     * @notice changes the time for which the deposits in the pool are locked
     * @param _time the time for which deposits are locked
     */
    function changeLockPeriod(uint256 _time) external virtual onlyAdmin {
        require(_time > 0, "time should be greater than zero");
        lockPeriod = _time;
        emit LockPeriodChanged(_time);
    }

    /**
     * @notice changes the spread which affects the lending rates in the pool
     * @param _spread the value which affects the lending rate in the pool
     */

    function changeSpread(uint256 _spread) external virtual onlyAdmin {
        spread = _spread;
        rates.lend = rates.borrow - spread;
        emit SpreadChanged(spread);
    }

    /**
     * @notice used to enable / disable core functionalities like borrow ,repay , deposit , withdraw
     */
    function changeCoreFunctionalityStatus() external virtual onlyAdmin {
        corePause = !corePause;
        emit CoreFunctionalityAvailabilityStatus(corePause);
    }

    /**
     * @notice used by rewards contract to increase rates during rewards period
     * @param _rewardAPY The of value of new rewardAPY that increases the rates in the pool by this variable
     */
    function startRewards(uint256 _rewardAPY) external virtual {
        checkRewardsAddress();
        rates.lend += _rewardAPY;
        rates.borrow -= _rewardAPY;
        poolRewardAPY = _rewardAPY;
        emit PoolRewardsStarted(_rewardAPY);
    }

    /**
     * @notice used by rewards contract to reset pool rates after rewards period is completed
     */
    function stopRewards() external virtual {
        checkRewardsAddress();
        rates.lend -= poolRewardAPY;
        rates.borrow += poolRewardAPY;
        poolRewardAPY = 0;
        emit PoolRewardsStopped();
    }

    /**
     * @notice Used to check the that the given call is done by admin.
     */
    function _onlyAdmin() internal view virtual {
        require(msg.sender == admin, "Can be used only by admin");
    }

    /**
     * @notice Used to check the that the given call is done by router.
     */
    function _onlyRouter() internal view {
        require(routerAddress == msg.sender, "only router contract can accesss this");
    }

    /**
     * @notice Used to check the new fee value is less than max_fee_rates.
     * @param _fee new fee value
     */
    function _checkFeeValue(uint256 _fee) internal view {
        require(_fee <= maxFeeRate, "fee should be less than max fees");
    }

    /**
     * @notice Used to check the accessibility and only allows the Bru rewards contract to access the functions
     */
    function checkRewardsAddress() internal view virtual {
        require(bruRewardsAddress == msg.sender, "only rewards contract can access");
    }
}
