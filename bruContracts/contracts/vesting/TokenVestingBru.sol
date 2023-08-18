// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";
import "../core/BruPool.sol";
import "../core/BruFactory.sol";
import "../core/BruOracle.sol";

/**
 * @title TokenVestingBur contract
 * @author Bru-finance team
 * @notice Is a contract that locks and distributes purchased tokens within a time frame(vesting period).
 *		   And it delays access to the asset being offered.
 */

contract TokenVestingBru is Ownable, ReentrancyGuard, Initializable, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    uint256 private constant QUARTER_TIME = 7889229; // quarter of 3 months in seconds
    uint256 private constant MINIMUM_POOL_TVL = 10**8; // minimum TVL amount above which new tokens can be minted
    uint256 public maxVestingSchedules; // per address max allowed vesting schedules
    uint256 public maxCategories; // max categories

    uint256 public totalPercentageUsed; // total % used <=100
    uint256 internal lastStarted; // last time the quarter started
    uint256 private vestingSchedulesTotalAmount; // total amount vested
    uint256 internal categoryId; //category Id counter
    uint256 public quarterId; // quarterId counter
    address internal adminAddress; //address of admin
    address internal NIIWalletAddress; // address of NIIwallet
    address internal bruRewardsAddress; // address of Rewards wallet
    address internal factoryAddress; // address of factory contract
    address internal bruOracleAddress; // address of bruOracle
    address internal deployer; // address of the owner who deploys the contract
    bool internal pause; // pause boolean for major functionalities
    Token public token; // bru token contract
    bytes32[] private vestingSchedulesIds; // array of vesting schedule Ids created till time

    struct VestingSchedule {
        bool initialized;
        // beneficiary of tokens after they are released
        address beneficiary;
        // cliff period in seconds
        uint256 cliff;
        // start time of the vesting period
        uint256 start;
        // duration of the vesting period in seconds
        uint256 duration;
        // duration of a slice period for the vesting in seconds
        uint256 slicePeriodSeconds;
        // whether or not the vesting is revocable
        bool revocable;
        // total amount of tokens to be released at the end of the vesting
        uint256 amountTotal;
        // amount of tokens released
        uint256 released;
        // whether or not the vesting has been revoked
        bool revoked;
    }

    struct TokenDistribution {
        uint256 tokenAmountleft;
        uint256 tokenPercentage;
    }

    struct Records {
        uint256 initialQuarterBalance;
        uint256 finalQuarterBalance;
        uint256 timeStamp;
    }

    struct Categories {
        string categoryName;
        address[] memberAddresses;
        uint256 cliff;
        // duration of the vesting period in seconds
        uint256 duration;
        // duration of a slice period for the vesting in seconds
        uint256 slicePeriodSeconds;
        // whether or not the vesting is revocable
        bool revocable;
    }

    mapping(uint256 => uint256) internal tokensBurnedPerQuarter; // amount of token burned in a quarter
    mapping(uint256 => Records) public quarterTVLMapping; //mapping for TVL of every quarter
    mapping(bytes32 => VestingSchedule) private vestingSchedules; // mapping of vesting schedule Id to the details of the vesting schedule
    mapping(address => uint256) private holdersVestingCount; // total vestin count of a given holder
    mapping(uint256 => Categories) public categoryMapping; // category Id to description mapping
    mapping(uint256 => TokenDistribution) public distributionMapping; // category Id to its token distribution mapping
    mapping(uint256 => bool) public existsMapping; // to confirm is cateogry Id mapping exists or not .
    mapping(uint256 => uint256) QuarterBalanceForIssuance; // amount issued for 3 categories
    mapping(address => uint256[]) internal memberCategoryMapping; // member belonging to a particular category mapping
    mapping(bytes32 => uint256) public vestingScheduleCategoryMapping; // vesting schedules to category Mapping
    /**
     * @notice Emitted after a category is added
     * @param _memberAddress address of the new member in category
     * @param _categoryID Id oof the category
     */
    event AddAddressForCategory(address _memberAddress, uint256 _categoryID);
    /**
     * @notice Emitted after a category is created
     * @param _categoryName name of category
     * @param _memberAddresses array of member addresses to be added
     * @param _cliff of the vesting schedule for category
     * @param _duration of vesting schedule for category
     * @param _slicePeriodSeconds slice period in seconds
     * @param _revocable category vesting schedules revokable or not bool.
     * @param _categoryId category Id
     */
    event CategoryCreated(
        string _categoryName,
        address[] _memberAddresses,
        uint256 _cliff,
        uint256 _duration,
        uint256 _slicePeriodSeconds,
        bool _revocable,
        uint256 _categoryId
    );
    /**
     * @notice Emitted after new tokens are issues
     * @param _amount number of tokens added
     * @param _sentAddress address where the new tokens are added
     */
    event TokensIssued(uint256 _amount, address _sentAddress);
    /**
     * @notice Emitted when vesting schedule is created
     * @param _vestingSchedule vesting schedule details
     * @param _categoryId Id of category
     */
    event VestingScheduleCreation(VestingSchedule _vestingSchedule, uint256 _categoryId);
    /**
     * @notice Emitted when vesting schedule is revoked
     * @param _vestingSchedule vesting schedule details
     * @param _revoked bool
     */
    event RevokedSchedule(VestingSchedule _vestingSchedule, bool _revoked);
    /**
     * @notice Emitted when pause status is changed
     * @param _status value of new status
     */
    event PauseStatusChanged(bool _status);
    /**
     * @notice Emitted when new token distribution is added
     * @param _distribution new token distribution
     */
    event TokenDistributionAdded(TokenDistribution _distribution);
    /**
     * @notice Emitted TVL is recorded
     * @param _quarterId Id of the quarter
     * @param _time  when tvl was recorded
     * @param _amount tvl amount
     */
    event RecordedTVL(uint256 _quarterId, uint256 _time, uint256 _amount);
    /**
     * @notice Emitted when quarter starts
     * @param _quarterId Id of the quarter
     * @param _timestamp  when quarter started
     */
    event QuarterStart(uint256 _quarterId, uint256 _timestamp);
    /**
     * @notice Emitted when max schedules allowed value changed
     * @param _maxschedules new value of max schedules
     */
    event VestingScheduleMaxChanged(uint256 _maxschedules);
    /**
     * @notice Emitted when max categories allowed value changed
     * @param _maxcategories new value of max categories
     */
    event CategoriesMaxChanged(uint256 _maxcategories);

    event Released(uint256 _amount); // event fo amount released
    /**
     * @notice Emitted a BruRewards contract start a rewards interval for a pool
     * @param _emissionAmount new value of max categories
     */
    event RewardsDistributed(uint256 _emissionAmount);

    /**
     * @dev Only owner can call functions marked by this modifier.
     *
     */
    modifier onlyDeployer() {
        require(msg.sender == deployer, "only deployer allowed");
        _;
    }

    /**
     * @dev Only admin can call functions marked by this modifier.
     *
     */
    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "only admin allowed");
        _;
    }

    /**
     * @dev checks the pause condition for functions .
     *
     */
    modifier checkPauseStatus() {
        require(!pause, "Core functionalities disabled");
        _;
    }

    /**
     * @dev Reverts if the vesting schedule does not exist or has been revoked.
     */
    modifier onlyIfVestingScheduleNotRevoked(bytes32 _vestingScheduleId) {
        require(vestingSchedules[_vestingScheduleId].initialized);
        require(!vestingSchedules[_vestingScheduleId].revoked);
        _;
    }

    /**
     * @notice Initializes the deployed contract with given parameters
     * @param _token The address of the token
     * @param _adminAddress The address of admin
     * @param _NIIWalletAddress The address of NII Wallet contract
     * @param _bruRewardsAddress The address of BruReward contract
     * @param _factoryAddress The address of Factory contract
     * @param _bruOracleAddress The address of BruOracle contract
     */
    function initialize(
        address _token,
        address _adminAddress,
        address _NIIWalletAddress,
        address _bruRewardsAddress,
        address _factoryAddress,
        address _bruOracleAddress
    ) external virtual initializer {
        require(
            _token != address(0) &&
                _adminAddress != address(0) &&
                _NIIWalletAddress != address(0) &&
                _bruRewardsAddress != address(0) &&
                _factoryAddress != address(0) &&
                _bruOracleAddress != address(0),
            "Invalid Address"
        );
        token = Token(_token);
        adminAddress = _adminAddress;
        categoryId = 1;
        maxVestingSchedules = 5;
        maxCategories = 10;
        NIIWalletAddress = _NIIWalletAddress;
        bruRewardsAddress = _bruRewardsAddress;
        factoryAddress = _factoryAddress;
        bruOracleAddress = _bruOracleAddress;
        deployer = msg.sender;
    }

    /**
     * @notice Release vested amount of tokens.
     * @param _vestingScheduleId the vesting schedule identifier
     * @param _amount the amount to release
     */
    function release(bytes32 _vestingScheduleId, uint256 _amount)
        public
        onlyIfVestingScheduleNotRevoked(_vestingScheduleId)
        checkPauseStatus
    {
        VestingSchedule storage vestingSchedule = vestingSchedules[_vestingScheduleId];
        bool isBeneficiary = msg.sender == vestingSchedule.beneficiary;
        bool isOwner = msg.sender == deployer;
        require(isBeneficiary || isOwner, "TokenVesting: only beneficiary and owner can release vested tokens");
        uint256 vestedAmount = computeReleasableAmount(vestingSchedule);

        require(vestedAmount >= _amount, "TokenVesting: cannot release tokens, not enough vested tokens");
        vestingSchedule.released = vestingSchedule.released + _amount;
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount - _amount;
        IERC20(address(token)).safeTransfer(vestingSchedule.beneficiary, _amount);
        emit Released(_amount);
    }

    /**
     * @dev Returns the number of vesting schedules managed by this contract.
     * @return the number of vesting schedules
     */
    function getVestingSchedulesCount() public view returns (uint256) {
        return vestingSchedulesIds.length;
    }

    /**
     * @notice Returns the vesting schedule information for a given identifier.
     * @return the vesting schedule structure information
     */
    function getVestingSchedule(bytes32 _vestingScheduleId) public view returns (VestingSchedule memory) {
        return vestingSchedules[_vestingScheduleId];
    }

    /**
     * @dev Computes the vesting schedule identifier for an address and an index.
     * @param _holder address of the holder
     * @param _index index in array
     * @return vesting schedule Id
     */
    function computeVestingScheduleIdForAddressAndIndex(address _holder, uint256 _index) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_holder, _index));
    }

    /**
     * @dev Returns the number of vesting schedules associated to a beneficiary.
     * @return the number of vesting schedules
     */
    function getVestingSchedulesCountByBeneficiary(address _beneficiary) external view returns (uint256) {
        return holdersVestingCount[_beneficiary];
    }

    /**
     * @dev Returns the vesting schedule id at the given index.
     * @return the vesting id
     */
    function getVestingIdAtIndex(uint256 _index) external view returns (bytes32) {
        require(_index < getVestingSchedulesCount(), "TokenVesting: index out of bounds");
        return vestingSchedulesIds[_index];
    }

    /**
     * @notice Returns the vesting schedule information for a given holder and index.
     * @return the vesting schedule structure information
     */
    function getVestingScheduleByAddressAndIndex(address _holder, uint256 _index)
        external
        view
        returns (VestingSchedule memory)
    {
        return getVestingSchedule(computeVestingScheduleIdForAddressAndIndex(_holder, _index));
    }

    /**
     * @notice Returns the vesting schedule total amount noted.
     * @return the vesting schedule total amount
     */
    function getVestingSchedulesTotalAmount() external view returns (uint256) {
        return vestingSchedulesTotalAmount;
    }

    /**
     * @notice Returns the token contract address
     * @return token contract address of bru token
     */
    function getToken() external view returns (address) {
        return address(token);
    }

    /**
     * @notice sets the paramters of the category for the given categoryID
     * @param _categoryName name of category
     * @param _memberAddresses the array of address of the members of category
     * @param _cliff Cliff for the category
     * @param _duration duration for the category
     * @param _slicePeriodSeconds slice period of the category
     * @param _revocable property of category
     */
    function setCategoryParams(
        string memory _categoryName,
        address[] memory _memberAddresses,
        uint256 _cliff,
        uint256 _duration,
        uint256 _slicePeriodSeconds,
        bool _revocable
    ) external onlyDeployer {
        require(categoryId < maxCategories + 1, "max categories reaches");
        categoryMapping[categoryId] = Categories(
            _categoryName,
            _memberAddresses,
            _cliff,
            _duration,
            _slicePeriodSeconds,
            _revocable
        );
        existsMapping[categoryId] = true;
        for (uint256 i = 0; i < _memberAddresses.length; i++) {
            memberCategoryMapping[_memberAddresses[i]].push(categoryId);
            emit AddAddressForCategory(_memberAddresses[i], categoryId);
        }
        categoryId++;
        emit CategoryCreated(
            _categoryName,
            _memberAddresses,
            _cliff,
            _duration,
            _slicePeriodSeconds,
            _revocable,
            categoryId
        );
    }

    /**
     * @notice Returns the category parameters
     * @return returns struct of category params
     */
    function getCategoryParams(uint256 _categoryId) external view returns (Categories memory) {
        return categoryMapping[_categoryId];
    }

    /**
     * @notice add member address to a category
     * @param _walletAddress address of the member
     * @param _categoryId category Id of the category
     */

    function addAddressToCategory(address _walletAddress, uint256 _categoryId) external onlyDeployer {
        require(_walletAddress != address(0), "zero address not allowed");
        categoryMapping[_categoryId].memberAddresses.push(_walletAddress);
        memberCategoryMapping[_walletAddress].push(categoryId);
        emit AddAddressForCategory(_walletAddress, _categoryId);
    }

    /**
     * @notice Creates a new vesting schedule for a beneficiary.
     * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
     * @param _start start time of the vesting
     * @param _amount total amount of tokens to be released at the end of the vesting
     */
    function createVestingScheduleForCategory(
        uint256 _amount,
        uint256 _start,
        address _beneficiary,
        uint256 _categoryId
    ) external onlyDeployer checkPauseStatus {
        bool _temp = false;
        for (uint256 j = 0; j < memberCategoryMapping[_beneficiary].length; j++) {
            if (memberCategoryMapping[_beneficiary][j] == _categoryId) _temp = true;
        }
        if (_categoryId != 0 && _temp) {
            vestingInternal(
                _amount,
                categoryMapping[_categoryId].duration,
                categoryMapping[_categoryId].slicePeriodSeconds,
                _categoryId,
                _beneficiary,
                categoryMapping[_categoryId].cliff,
                _start,
                categoryMapping[_categoryId].revocable
            );
        } else {
            revert("category passed as 0 or beneficiary does not belong to this category");
        }
    }

    /**
     * @notice Creates a new vesting schedule for a beneficiary.
     * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
     * @param _start start time of the vesting period
     * @param _cliff duration in seconds of the cliff in which tokens will begin to vest
     * @param _duration duration in seconds of the period in which the tokens will vest
     * @param _slicePeriodSeconds duration of a slice period for the vesting in seconds
     * @param _revocable whether the vesting is revocable or not
     * @param _amount total amount of tokens to be released at the end of the vesting
     * @param _categoryId Id of the category to which it belongs
     */
    function createVestingSchedule(
        address _beneficiary,
        uint256 _start,
        uint256 _cliff,
        uint256 _duration,
        uint256 _slicePeriodSeconds,
        bool _revocable,
        uint256 _amount,
        uint8 _categoryId
    ) external onlyDeployer checkPauseStatus nonReentrant {
        categoryMapping[_categoryId].memberAddresses.push(_beneficiary);
        memberCategoryMapping[_beneficiary].push(_categoryId);
        vestingInternal(_amount, _duration, _slicePeriodSeconds, _categoryId, _beneficiary, _cliff, _start, _revocable);
    }

    /**
     * @notice changes the max allowed vesting schedules for single address
     * @param _newMaxSchedule new value for  max allowed vesting schedules
     */
    function changeMaxVestingSchedules(uint256 _newMaxSchedule) external virtual onlyAdmin {
        maxVestingSchedules = _newMaxSchedule;
        emit VestingScheduleMaxChanged(_newMaxSchedule);
    }

    /**
     * @notice changes the max allowed categories
     * @param _newMaxCategories new value for max allowed categories
     */
    function changeMaxCategories(uint256 _newMaxCategories) external virtual onlyAdmin {
        maxCategories = _newMaxCategories;
        emit CategoriesMaxChanged(_newMaxCategories);
    }

    /**
     * @notice Revokes the vesting schedule for given identifier.
     * @param _vestingScheduleId the vesting schedule identifier
     */
    function revoke(bytes32 _vestingScheduleId, uint256 _categoryId)
        external
        onlyDeployer
        onlyIfVestingScheduleNotRevoked(_vestingScheduleId)
        checkPauseStatus
    {
        require(
            vestingScheduleCategoryMapping[_vestingScheduleId] == _categoryId,
            "vesting schedule does not belong to this category"
        );
        VestingSchedule storage vestingSchedule = vestingSchedules[_vestingScheduleId];
        require(vestingSchedule.revocable, "TokenVesting: vesting is not revocable");
        uint256 vestedAmount = computeReleasableAmount(vestingSchedule);
        if (vestedAmount > 0) {
            release(_vestingScheduleId, vestedAmount);
        }
        uint256 unreleased = vestingSchedule.amountTotal - vestingSchedule.released;
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount - unreleased;

        for (uint256 j = 0; j < memberCategoryMapping[vestingSchedule.beneficiary].length; j++) {
            distributionMapping[_categoryId].tokenAmountleft += unreleased;
        }
        vestingSchedule.revoked = true;
        emit RevokedSchedule(vestingSchedule, vestingSchedule.revoked);
    }

    /**
     * @notice Withdraw the specified amount if possible.
     * @param _amount the amount to withdraw
     */
    function withdraw(uint256 _amount) external onlyDeployer {
        require(this.getWithdrawableAmount() >= _amount, "TokenVesting: not enough withdrawable funds");
        IERC20(address(token)).safeTransfer(deployer, _amount);
    }

    /**
     * @notice change the pause status of the contract
     */
    function changePauseStatus() external onlyAdmin {
        pause = !pause;
        emit PauseStatusChanged(pause);
    }

    /**
     * @notice adding the token distribution of a given category.
     * @param _categoryId category Id for adding distribution.
     * @param _tokenPercentage the token percentage of a given category
     */
    function addTokenDistribution(uint256 _categoryId, uint256 _tokenPercentage) external onlyAdmin nonReentrant {
        require(distributionMapping[_categoryId].tokenPercentage == 0, "distribution already added");
        require(totalPercentageUsed + _tokenPercentage <= 100, "percentage not allowed");
        distributionMapping[_categoryId] = TokenDistribution(
            (token.getInitialSupply() * (_tokenPercentage)) / (100),
            _tokenPercentage
        );
        totalPercentageUsed += _tokenPercentage;
        emit TokenDistributionAdded(distributionMapping[_categoryId]);
    }

    /**
     * @notice Computes the vested amount of tokens for the given vesting schedule identifier.
     * @param _vestingScheduleId schedule Id of the vesting schedule
     * @return the vested amount
     */
    function computeReleasableAmount(bytes32 _vestingScheduleId)
        external
        view
        onlyIfVestingScheduleNotRevoked(_vestingScheduleId)
        returns (uint256)
    {
        VestingSchedule storage vestingSchedule = vestingSchedules[_vestingScheduleId];
        return computeReleasableAmount(vestingSchedule);
    }

    /**
     * @dev Returns the amount of tokens that can be withdrawn by the owner.
     * @return the amount of tokens
     */
    function getWithdrawableAmount() external view returns (uint256) {
        return token.balanceOf(address(this)) - vestingSchedulesTotalAmount;
    }

    /**
     * @dev Computes the next vesting schedule identifier for a given holder address.
     * _holder address of the vesting schedule holder
     */
    function computeNextVestingScheduleIdForHolder(address _holder) external view returns (bytes32) {
        return computeVestingScheduleIdForAddressAndIndex(_holder, holdersVestingCount[_holder]);
    }

    /**
     * @notice records TVL for a given time and quarter
     */
    function recordTVL() external onlyDeployer {
        require(
            block.timestamp - quarterTVLMapping[quarterId].timeStamp >= QUARTER_TIME,
            "3 months have not passed yet"
        );
        if (quarterTVLMapping[quarterId].initialQuarterBalance == 0) {
            quarterTVLMapping[quarterId].initialQuarterBalance = calculateSum();
            emit RecordedTVL(
                quarterId,
                quarterTVLMapping[quarterId].timeStamp,
                quarterTVLMapping[quarterId].initialQuarterBalance
            );
        } else if (quarterTVLMapping[quarterId].finalQuarterBalance == 0) {
            quarterTVLMapping[quarterId].finalQuarterBalance = calculateSum();

            if (
                quarterTVLMapping[quarterId].initialQuarterBalance > MINIMUM_POOL_TVL &&
                quarterTVLMapping[quarterId].finalQuarterBalance > MINIMUM_POOL_TVL &&
                quarterTVLMapping[quarterId].finalQuarterBalance > quarterTVLMapping[quarterId].initialQuarterBalance
            ) {
                uint256 temp = quarterTVLMapping[quarterId].finalQuarterBalance -
                    quarterTVLMapping[quarterId].initialQuarterBalance;
                uint256 percentage = ((temp) * (10**20)) / (quarterTVLMapping[quarterId].initialQuarterBalance);
                issueTokens(percentage);
            }
            emit RecordedTVL(
                quarterId,
                quarterTVLMapping[quarterId].timeStamp,
                quarterTVLMapping[quarterId].finalQuarterBalance
            );
        } else {
            revert("TVL already recorded for this quater");
        }
        quarterTVLMapping[quarterId].timeStamp = block.timestamp;
    }

    /**
     * @notice starts quarter
     */
    function startQuarter() external onlyDeployer {
        require(block.timestamp - lastStarted >= QUARTER_TIME);
        quarterId++;
        lastStarted = block.timestamp;
        emit QuarterStart(quarterId, lastStarted);
    }

    /**
     * @notice it is used to transfer token to the BruRewards contract
     * @param _emissionAmount the amount of token to be emmited during a reward interval
     */
    function distributeRewards(uint256 _emissionAmount) external {
        require(msg.sender == bruRewardsAddress, "only BruRewards can access this");
        distributionMapping[1].tokenAmountleft -= _emissionAmount;
        IERC20(address(token)).safeTransfer(bruRewardsAddress, _emissionAmount);
        emit RewardsDistributed(_emissionAmount);
    }

    /*
     * @notice issues new token according to last quarter TVL.
     * @param _risePercentage percentage growth in last quarter.
     */
    function issueTokens(uint256 _risePercentage) internal {
        uint256 totalAmount;
        uint256 toMint;

        totalAmount = QuarterBalanceForIssuance[quarterId];

        uint256 calculateTVLamount = (totalAmount * (_risePercentage)) / (10**20);
        uint256 burntAmount = (tokensBurnedPerQuarter[quarterId] * (995)) / (1000);
        if (calculateTVLamount < burntAmount) {
            toMint += calculateTVLamount;
        } else {
            toMint += burntAmount;
        }
        token.mintNew(address(this), toMint);
        emit TokensIssued(toMint, address(this));
    }

    /**
     * @dev Computes the releasable amount of tokens for a vesting schedule.
     * @param _vestingSchedule vesting scheudle structure to calculate amount .
     * @return the amount of releasable tokens
     */
    function computeReleasableAmount(VestingSchedule memory _vestingSchedule) internal view returns (uint256) {
        uint256 currentTime = block.timestamp;
        if ((currentTime < _vestingSchedule.cliff) || _vestingSchedule.revoked) {
            return 0;
        } else if (currentTime >= _vestingSchedule.start + _vestingSchedule.duration) {
            return _vestingSchedule.amountTotal - _vestingSchedule.released;
        } else {
            uint256 timeFromStart = currentTime - _vestingSchedule.start;
            uint256 secondsPerSlice = _vestingSchedule.slicePeriodSeconds;
            uint256 vestedSlicePeriods = timeFromStart / (secondsPerSlice);
            uint256 vestedSeconds = vestedSlicePeriods * (secondsPerSlice);
            uint256 vestedAmount = (_vestingSchedule.amountTotal * (vestedSeconds)) / (_vestingSchedule.duration);
            vestedAmount = vestedAmount - _vestingSchedule.released;
            return vestedAmount;
        }
    }

    /**
     * @notice used to create the vesting schedules with the given info
     * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
     * @param _start start time of the vesting period
     * @param _cliff duration in seconds of the cliff in which tokens will begin to vest
     * @param _duration duration in seconds of the period in which the tokens will vest
     * @param _slicePeriodSeconds duration of a slice period for the vesting in seconds
     * @param _revocable whether the vesting is revocable or not
     * @param _amount total amount of tokens to be released at the end of the vesting
     * @param _categoryId Id of the category to which it belongs
     */
    function vestingInternal(
        uint256 _amount,
        uint256 _duration,
        uint256 _slicePeriodSeconds,
        uint256 _categoryId,
        address _beneficiary,
        uint256 _cliff,
        uint256 _start,
        bool _revocable
    ) internal {
        require(existsMapping[_categoryId] && _beneficiary != address(0), "incorrect category/address");
        require(holdersVestingCount[_beneficiary] <= maxVestingSchedules, "max limit for schedules reached");
        require(
            this.getWithdrawableAmount() >= _amount,
            "TokenVesting: cannot create vesting schedule because not sufficient tokens"
        );
        require(distributionMapping[_categoryId].tokenAmountleft >= _amount, "insufficient balance");
        require(_duration > 0, "TokenVesting: duration must be > 0");
        require(_amount > 0, "TokenVesting: amount must be > 0");
        require(_slicePeriodSeconds >= 1, "TokenVesting: slicePeriodSeconds must be >= 1");
        bytes32 _vestingScheduleId = this.computeNextVestingScheduleIdForHolder(_beneficiary);
        uint256 cliff = _start + _cliff;
        vestingSchedules[_vestingScheduleId] = VestingSchedule(
            true,
            _beneficiary,
            cliff,
            _start,
            _duration,
            _slicePeriodSeconds,
            _revocable,
            _amount,
            0,
            false
        );
        distributionMapping[_categoryId].tokenAmountleft -= _amount;
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount + _amount;
        vestingSchedulesIds.push(_vestingScheduleId);
        uint256 currentVestingCount = holdersVestingCount[_beneficiary];
        holdersVestingCount[_beneficiary] = currentVestingCount + 1;
        vestingScheduleCategoryMapping[_vestingScheduleId] = _categoryId;

        if (_categoryId == 2 || _categoryId == 3 || _categoryId == 4) {
            QuarterBalanceForIssuance[quarterId] += _amount;
        }
        emit VestingScheduleCreation(vestingSchedules[_vestingScheduleId], _categoryId);
    }

    /**
     * @notice calculates sum of TVL of all the pools when called .
     */
    function calculateSum() internal view returns (uint256) {
        PoolDetails[] memory tempPoolDetailsArray = BruFactory(factoryAddress).getAllPoolDetails();
        uint256 sum = 0;
        for (uint32 i = 0; i < tempPoolDetailsArray.length; i++) {
            address[] memory tokenAddressArray = BruPool(tempPoolDetailsArray[i].proxyPoolAddress)
                .getAllowedTokenAddressesArray();
            for (uint8 j = 0; j < tokenAddressArray.length; j++) {
                //fetch the conversion value from oracle according to token address

                uint256 tokenPriceinUSD = uint256(
                    BruOracle(bruOracleAddress).getLatestPriceOfTokenInUSD(tokenAddressArray[j])
                );
                uint256 priceFeedDecimals = BruOracle(bruOracleAddress).getPriceFeedDecimal(tokenAddressArray[j]);
                uint256 temp = IERC20(tokenAddressArray[i]).balanceOf(tempPoolDetailsArray[i].proxyPoolAddress);
                uint256 decimal = ERC20(tokenAddressArray[i]).decimals();
                if (decimal < 18) {
                    temp = temp * 10**(18 - decimal);
                } else if (decimal > 18) {
                    temp = temp / 10**(decimal - 18);
                }
                temp = (temp * tokenPriceinUSD) / 10**(priceFeedDecimals);
                sum += temp;
            }
        }

        return sum / 10**18;
    }

    /**
     * @dev Checks the wallet address which initiates the upgrade transaction for TokenVesting contract
     * @param _newImplementation Address of the new implementation contract which is used for upgradation.
     */
    function _authorizeUpgrade(address _newImplementation) internal view override {
        require(msg.sender == adminAddress, "Only admin allowed");
    }
}
