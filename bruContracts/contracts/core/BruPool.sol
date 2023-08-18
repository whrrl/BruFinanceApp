//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../tokens/PoolToken.sol";
import "../tokens/InterestToken.sol";
import "../wallets/NIIMargin.sol";
import "./BruAdmin.sol";
import "./BruRewards.sol";
import "./AssetTreasury.sol";
import "./BruPrice.sol";

/**
 * @title Bru Pool contract
 * @author Bru-finance team
 * @notice Is a contract that is responsible for the main functionality of the platform
 */
contract BruPool is BruAdmin, Initializable, ReentrancyGuard, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    /**
     * @notice name of the pool
     */
    string public name;

    uint256 internal poolIndex;

    //for handling ID of btoken and nft
    //important addresses
    address internal poolTokenAddress; // The address of pool token
    address internal interestTokenAddress; // The address of interest token
    address internal interestWalletAddress; // The address of NIImargin contract

    address internal factory; // The address of BruFactory contract

    struct BondDetails {
        address tokenAddress;
        uint256 bondTimestamp;
        uint256 interest;
        uint256 bondAmount;
        uint256 lockTimePeriod;
        uint256 claimedDay;
        bool withdrawn;
    }

    //Struct used for storing NFT Data
    struct NFT {
        uint256 tokenId;
        string commodityId;
        uint256 quantity;
        uint256 value;
        bool borrowed;
        string dataHash;
        string data;
    }

    //Struct for other expenses
    struct BorrowDetails {
        uint256 borrowedAmount;
        uint256 time;
        address tokenBorrowedAddress;
    }

    struct Expenses {
        uint256 otherexpenses;
        uint256 interest;
    }
    /**
     * @notice Mapping which stores nft data
     */
    mapping(string => NFT) public nft;

    /**
     * @notice Mapping for storing borrow details of NFT
     */
    mapping(string => BorrowDetails) public borrowedNft;

    /**
     * @notice Mapping for storing expenses
     */
    mapping(string => Expenses) public totalExpense;

    mapping(address => uint256) public userBondIds;
    mapping(address => mapping(uint256 => BondDetails)) public userBonds;
    mapping(address => mapping(uint256 => bool)) public bondInterestClaimed;

    /**
     * @notice Emitted when a user deposits funds into the pool
     * @param _userAddress The address of the usersbr
     * @param _bondId The ID of the newly created bond
     * @param _timestamp The time at which the deposit function was executed
     * @param _tokenAddress The address of the token deposited in the pool by te user.
     * @param _tokenAmount the amount of token deposited by the user
     */
    event BondCreated(
        address indexed _userAddress,
        uint256 _bondId,
        uint256 indexed _timestamp,
        address _tokenAddress,
        uint256 _tokenAmount
    );

    /**
     * @notice Emitted when a bond which has matured has been withdrawn by the user.
     * @param _userAddress The address of the user
     * @param _bondId The matured bond which is withdrawn by the user
     * @param _timestamp The time at which the bond was withdrawn by the user
     */
    event BondWithdrawn(
        address indexed _userAddress,
        uint256 _bondId,
        uint256 indexed _timestamp,
        address _tokenAddress,
        uint256 _tokenAmount
    );

    /**
     * @notice Emitted when the interest on a bond is claimed by the user.
     * @param _userAddress The address of the user
     * @param _bondId The matured bond which is withdrawn by the user
     * @param _timestamp The time at which the bond was withdrawn by the user
     * @param _tokenAmount Amount of interest claimed on the bond
     */
    event BondInterestClaimed(address indexed _userAddress, uint256 _bondId, uint256 _timestamp, uint256 _tokenAmount);

    /**
     * @notice Emitted after user repays
     * @param _amount amount repaid
     * @param _nftId Id of the NFT
     * @param _userAddress address of the user who repaid
     * @param _tokenAddress address of token used to pay
     */
    event Repaid(
        uint256 _amount,
        string _nftId,
        uint256 indexed _timestamp,
        address indexed _userAddress,
        address _tokenAddress
    );

    /**
     * @notice Emitted after user borrows
     * @param _amount amount repaid
     * @param _nftId Id of the NFT
     * @param _userAddress address of the user who repaid
     * @param _tokenAddress address of token used to pay
     */
    event Borrowed(
        uint256 _amount,
        string _nftId,
        uint256 indexed _timestamp,
        address indexed _userAddress,
        address _tokenAddress
    );
    /**
     * @notice Emitted an nft is minted
     * @param _tokenId  Token ID of the SFT minted in asset treasury for the user
     * @param _nftId NftID from the data of the nft
     * @param _commodityId The Id of the commodity
     * @param _quantity The amount of the commodity
     * @param _value The total valuation of the commodity deposited
     * @param _dataHash The hash encrypted by sha256 which has all the data of nft
     * @param _data The original data of nft which combines its price and quantity and other details
     */
    event NFTMinted(
        uint256 _tokenId,
        string _nftId,
        string _commodityId,
        uint256 _quantity,
        uint256 _value,
        string _dataHash,
        string _data
    );

    /**
     * @notice Initializes necessary contract addresses
     * @param _multiSigAddress The address of multi sign wallet
     * @param _factoryAddress The address of factory contract
     * @param _poolTokenAddress The address of pool token
     * @param _interestTokenAddress The address of interest token
     * @param _treasuryAddress The address of asset treasury contract
     * @param _poolName The name of the pool
     * @param _interestWalletAddress The address of NIImargin contract
     * @param _bruRewardsAddress The address of bruReward contract
     * @param _bruPriceAddress The address of BruPrice contract
     */
    function initialize(
        uint256 _poolIndex,
        address _routerAddress,
        address _multiSigAddress,
        address _factoryAddress,
        address _poolTokenAddress,
        address _interestTokenAddress,
        address _treasuryAddress,
        string memory _poolName,
        address _interestWalletAddress,
        address _bruRewardsAddress,
        address _bruPriceAddress
    ) external virtual initializer {
        require(
            _routerAddress != address(0) &&
                _multiSigAddress != address(0) &&
                _factoryAddress != address(0) &&
                _poolTokenAddress != address(0) &&
                _interestTokenAddress != address(0) &&
                _treasuryAddress != address(0) &&
                _interestWalletAddress != address(0) &&
                _bruRewardsAddress != address(0) &&
                _bruPriceAddress != address(0),
            "Invalid Address"
        );

        poolIndex = _poolIndex;
        routerAddress = _routerAddress;
        admin = _multiSigAddress;
        owner = msg.sender;
        factory = _factoryAddress;
        name = _poolName;
        maxFeeRate = 10000;
        maxAllowedTokenAddresses = 99;
        rates.borrow = (uint256(1000) * (10 ** 18)) / (maxFeeRate);
        platformFees.borrow = (uint256(1) * (10 ** 18)) / (maxFeeRate);
        platformFees.lend = (uint256(1) * (10 ** 18)) / (maxFeeRate);
        spread = (uint256(200) * (10 ** 18)) / (maxFeeRate);
        rates.lend = rates.borrow - spread;
        poolTokenAddress = _poolTokenAddress;
        interestTokenAddress = _interestTokenAddress;
        interestWalletAddress = _interestWalletAddress;
        treasuryAddress = _treasuryAddress;
        bruRewardsAddress = _bruRewardsAddress;
        bruPriceAddress = _bruPriceAddress;
        lockPeriod = 5 days;
    }

    /**
     * @notice Store's NFT's detailed information in the nft mapping by using nftID
     * @param _tokenId  Token ID of the SFT minted in asset treasury for the user
     * @param _nftId NftID from the data of the nft
     * @param _commodityId The Id of the commodity
     * @param _quantity The amount of the commodity
     * @param _value The total valuation of the commodity deposited
     * @param _dataHash The hash encrypted by sha256 which has all the data of nft
     * @param _data The original data of nft which combines its price and quantity and other details
     */
    function mintNft(
        uint256 _tokenId,
        string memory _nftId,
        string memory _commodityId,
        uint256 _quantity,
        uint256 _value,
        string memory _dataHash,
        string memory _data
    ) external virtual onlyAssetTreasury {
        require(nft[_nftId].quantity == 0, "minted already");
        nft[_nftId] = NFT(_tokenId, _commodityId, _quantity, _value, false, _dataHash, _data);
        emit NFTMinted(_tokenId, _nftId, _commodityId, _quantity, _value, _dataHash, _data);
    }

    /**
     * @notice Used to borrow tokens / stablecoins from the contract
     * @dev tranfers allowed tokens from contract to the user accounts.
     * @param _userAddress The address of the borrower
     * @param _nftId The Id of the nft borrower can used as collateral
     * @param _tokenAddress the address of the token borrower can borrow
     * @param _tokenAmount the amount of token borrower wants to borrow
     */
    function borrow(
        address _userAddress,
        string memory _nftId,
        address _tokenAddress,
        uint256 _tokenAmount
    ) external virtual checkCorePauseStatus onlyRouter {
        require(AssetTreasury(treasuryAddress).balanceOf(_userAddress, nft[_nftId].tokenId) > 0, "NFT does not exist");
        require(!assetLocked[_nftId] && !nft[_nftId].borrowed, "Already borrowed on this NFT");
        require(allowedTokenAddresses[_tokenAddress], "Token Address not allowed");
        require(IERC20(_tokenAddress).balanceOf(address(this)) > _tokenAmount, "Pool does not have enough liquidity");
        uint256 totalAssetValue;
        uint256 assetValuePerKG = BruPrice(bruPriceAddress).asset(nft[_nftId].commodityId);
        if (assetValuePerKG > 0) {
            totalAssetValue = nft[_nftId].quantity * assetValuePerKG;
        } else {
            totalAssetValue = nft[_nftId].value;
        }
        require(_tokenAmount <= (totalAssetValue * 7) / 10, "Collateral provided is less for specified token amount");
        nft[_nftId].borrowed = true;
        assetLocked[_nftId] = true;
        borrowedNft[_nftId] = BorrowDetails(_tokenAmount, block.timestamp, _tokenAddress);
        if (BruRewards(bruRewardsAddress).getRewardStatusForPool(poolIndex)) {
            BruRewards(bruRewardsAddress).updateBorrowAmountInRewardsInterval(poolIndex, _userAddress, _tokenAmount);
        }
        IERC20(_tokenAddress).safeTransfer(_userAddress, _tokenAmount);
        emit Borrowed(_tokenAmount, _nftId, block.timestamp, _userAddress, _tokenAddress);
    }

    /**
     * @notice Used to repay the borrowed amount
     * @param _userAddress The address of the borrower
     * @param _nftId The Id of the nft borrower used as collateral
     * @param _tokenAmount the amount of token borrower want to repay
     * @param _tokenAddress the address of the token borrower has borrowed
     */
    function repay(
        address _userAddress,
        string memory _nftId,
        uint256 _tokenAmount,
        address _tokenAddress
    ) external virtual nonReentrant checkCorePauseStatus onlyRouter {
        uint256 interestCollected = 0;
        require(AssetTreasury(treasuryAddress).balanceOf(_userAddress, nft[_nftId].tokenId) > 0, "NFT does not exist");
        require(nft[_nftId].borrowed, "This NFT is not borrowed");
        require(_tokenAddress == borrowedNft[_nftId].tokenBorrowedAddress, "token does not match the token borrowed");
        borrowInterest(_nftId);
        uint256 amount = (_tokenAmount * (10 ** 18)) / ((10 ** 18) + platformFees.borrow);

        uint256 totalPayablePrice = borrowedNft[_nftId].borrowedAmount + totalExpense[_nftId].interest;

        require(totalPayablePrice >= amount, "amount greater than borrowed");

        if (amount >= totalExpense[_nftId].interest) {
            interestCollected += totalExpense[_nftId].interest;

            totalExpense[_nftId].interest = 0;

            borrowedNft[_nftId].borrowedAmount -= amount - interestCollected;
        } else {
            totalExpense[_nftId].interest -= amount;
            interestCollected += amount;
        }
        borrowedNft[_nftId].time = block.timestamp;

        if (borrowedNft[_nftId].borrowedAmount <= 1) {
            nft[_nftId].borrowed = false;
            assetLocked[_nftId] = false;
            borrowedNft[_nftId] = BorrowDetails(0, 0, address(0));
        }

        IERC20(_tokenAddress).safeTransferFrom(_userAddress, address(this), _tokenAmount);

        IERC20(_tokenAddress).safeTransfer(interestWalletAddress, interestCollected + _tokenAmount - amount);
        emit Repaid(_tokenAmount, _nftId, block.timestamp, _userAddress, _tokenAddress);
    }

    /**
     * @notice Deposits user's tokens in the pool contract
     * @param _userAddress The address of the user who deposits his tokens
     * @param _tokenAddress The address of the token user wants to deposit
     * @param _tokenAmount The amount of token user wants to deposit
     */
    function deposit(
        address _userAddress,
        address _tokenAddress,
        uint256 _tokenAmount
    ) external virtual nonReentrant checkCorePauseStatus onlyRouter {
        require(allowedTokenAddresses[_tokenAddress], "Token Address not allowed");
        require(_tokenAmount > 0, "Token Amount less than one");
        require(IERC20(_tokenAddress).balanceOf(_userAddress) >= _tokenAmount, "Insufficient Token Amount");
        uint256 amount = (_tokenAmount * (10 ** 18)) / ((10 ** 18) + platformFees.lend);

        uint256 bondId = userBondIds[_userAddress];
        userBonds[_userAddress][bondId] = BondDetails(
            _tokenAddress,
            block.timestamp,
            rates.lend,
            amount,
            lockPeriod,
            0,
            false
        );
        userBondIds[_userAddress]++;
        IERC20(_tokenAddress).safeTransferFrom(_userAddress, address(this), _tokenAmount);
        IERC20(_tokenAddress).safeTransfer(interestWalletAddress, _tokenAmount - amount);

        if (BruRewards(bruRewardsAddress).getRewardStatusForPool(poolIndex)) {
            BruRewards(bruRewardsAddress).updateLendAmountInRewardsInterval(poolIndex, _userAddress, _tokenAmount);
        }
        PoolToken(poolTokenAddress).mint(_userAddress, amount);
        emit BondCreated(_userAddress, bondId, block.timestamp, _tokenAddress, _tokenAmount);
    }

    /**
     * @notice Withdraws user's withdrawable balance from pool and transfers it to a user's wallet address
     * @param _userAddress The account address of the user
     * @param _bondId The ID of the bond which is to be withdrawn
     */
    function withdraw(
        address _userAddress,
        uint256 _bondId
    ) external virtual nonReentrant checkCorePauseStatus onlyRouter {
        BondDetails memory userBond = userBonds[_userAddress][_bondId];
        require(userBond.bondTimestamp > 0, "Bond does not exist");
        require(!userBond.withdrawn, "Bond already withdrawn");
        require(withdrawable(userBond.bondTimestamp, userBond.lockTimePeriod), "Bond has not matured yet");
        userBonds[_userAddress][_bondId].withdrawn = true;
        PoolToken(poolTokenAddress).burn(_userAddress, userBond.bondAmount);
        IERC20(userBond.tokenAddress).safeTransfer(_userAddress, userBond.bondAmount);
        emit BondWithdrawn(_userAddress, _bondId, block.timestamp, userBond.tokenAddress, userBond.bondAmount);
    }

    /**
     * @notice Used to exchange interest token with tokens / stablecoins supported by the pool
     * @param _requiredTokenAddress The address of token to be redeem
     * @param _tokenAmount The amount of token to redeem
     */
    function redeemInterestToken(address _requiredTokenAddress, uint256 _tokenAmount) external virtual {
        address userAddress = msg.sender;
        require(allowedTokenAddresses[_requiredTokenAddress], "Token address not allowed for redeeming");
        require(
            IERC20(interestTokenAddress).balanceOf(userAddress) >= _tokenAmount && _tokenAmount > 0,
            "Insufficient interest tokens to redeem"
        );
        InterestToken(interestTokenAddress).burn(userAddress, _tokenAmount);
        NIIMargin(interestWalletAddress).sendAmount(_tokenAmount, _requiredTokenAddress, userAddress);
    }

    /**
     * @notice Calculates the accumulated interest
     * @param _nftId the Id of the NFT
     * @return _interest the total accumulated interest
     */
    function borrowInterest(string memory _nftId) internal returns (uint256) {
        totalExpense[_nftId].interest += calculateBorrowInterest(_nftId);

        return totalExpense[_nftId].interest;
    }

    /**
     * @notice It is used to claim the interest amount on a bond based on the time the bond was created / the last time the interest was claimed on the bond
     * @param _bondId The ID of bond which the user wants to claim the interest for.
     */
    function claimInterestOnBond(uint256 _bondId) external {
        BondDetails memory userBond = userBonds[msg.sender][_bondId];
        require(userBond.bondTimestamp > 0, "Bond does not exist");
        require(!bondInterestClaimed[msg.sender][_bondId], "Bond interest already claimed");
        uint256 currentTime;
        uint256 depositedTimeInSeconds;
        uint256 bondMaturityPeriod = userBond.bondTimestamp + userBond.lockTimePeriod;
        if (block.timestamp >= bondMaturityPeriod) {
            bondInterestClaimed[msg.sender][_bondId] = true;
        }
        if (bondMaturityPeriod < block.timestamp) {
            currentTime = bondMaturityPeriod;
        } else {
            currentTime = block.timestamp;
        }
        if (userBond.claimedDay == 0) {
            depositedTimeInSeconds = ((currentTime - userBond.bondTimestamp));
        } else {
            depositedTimeInSeconds = ((currentTime - userBond.claimedDay));
        }
        uint256 interestTokenAmount = (userBond.bondAmount * userBond.interest * depositedTimeInSeconds) /
            (31536000 * (10 ** 18));
        userBonds[msg.sender][_bondId].claimedDay = block.timestamp;
        InterestToken(interestTokenAddress).mint(msg.sender, interestTokenAmount);
        emit BondInterestClaimed(msg.sender, _bondId, block.timestamp, interestTokenAmount);
    }

    /**
     * @notice Locks the NFT and prevents user from borrowing on it
     * @param _userAddress The account address of the user
     * @param _nftId the ID of the NFT
     */
    function lockAsset(address _userAddress, string calldata _nftId) external onlyOwner {
        require(AssetTreasury(treasuryAddress).balanceOf(_userAddress, nft[_nftId].tokenId) > 0, "NFT does not exist");
        assetLocked[_nftId] = true;
        emit AssetLocked(_nftId);
    }

    /**
     * @notice Unlocks the NFT and allows the user to borrow on the NFT
     * @param _userAddress The account address of the user
     * @param _nftId the ID of the NFT
     */
    function unlockAsset(address _userAddress, string calldata _nftId) external onlyOwner {
        require(AssetTreasury(treasuryAddress).balanceOf(_userAddress, nft[_nftId].tokenId) > 0, "NFT does not exist");
        assetLocked[_nftId] = false;
        emit AssetUnlocked(_nftId);
    }

    /**
     * @notice It helps to get the amount for complete repayment for an NFT
     * @param _nftId the ID of the NFT
     */
    function getRepaymentAmount(string memory _nftId) external view returns (uint256) {
        uint256 interestAmountAccumulated = calculateBorrowInterest(_nftId);
        uint256 totalPayablePrice = borrowedNft[_nftId].borrowedAmount +
            totalExpense[_nftId].interest +
            interestAmountAccumulated;
        totalPayablePrice += (platformFees.borrow * totalPayablePrice) / 10 ** 18;
        return totalPayablePrice;
    }

    /**
     * @notice It calculates the interest amount for the NFT
     * @param _nftId the ID of the NFT
     */
    function calculateBorrowInterest(string memory _nftId) internal view returns (uint256) {
        uint256 borrowedDays = (block.timestamp - borrowedNft[_nftId].time) / 86400;
        uint256 interestAmountAccumulated = (borrowedNft[_nftId].borrowedAmount * rates.borrow * borrowedDays) /
            (365 * (10 ** 18));
        return interestAmountAccumulated;
    }

    /**
     * @notice Checks whether the bond is withdrawable or not
     * @param _bondCreationTime The timestamp at which bond is created
     * @param _bondLockPeriod The duration of the lock-in period
     */
    function withdrawable(uint256 _bondCreationTime, uint256 _bondLockPeriod) internal view returns (bool) {
        uint256 currentTime = block.timestamp;
        uint256 timePassedFromDeposit = currentTime - _bondCreationTime;
        return timePassedFromDeposit >= _bondLockPeriod;
    }

    /**
     * @dev Checks the wallet address which initiates the upgrade transaction for BruPool contract
     * @param _newImplementation Address of the new implementation contract which is used for upgradation.
     */
    function _authorizeUpgrade(address _newImplementation) internal view override {
        require(msg.sender == admin, "Only called by admin");
    }
}
