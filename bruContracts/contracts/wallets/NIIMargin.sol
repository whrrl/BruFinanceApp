//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../vesting/Token.sol";
import "./ReserveWallet.sol";

struct CashFlowDetails {
    uint256 starttime;
    uint256 amountLeft;
    uint256 totalAmountToDistribute;
    address tokenAddress;
    bool status;
}

/**
 * @title NII margin contract
 * @author Bru-finance team
 * @notice Store funds received from fees and interest. The interest expense and other company expenses are given from this wallet
 */
contract NIIMargin is Initializable, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    uint256 public claimId = 0; // claim id
    // @notice The address of Multisig wallet
    address public adminAddress;
    address internal reserveWalletAddress; // address of reserve Wallet
    address internal poolAddress; // address of oool
    address internal owner; // address of owner
    address internal burnContractAddress; // address of Vesting burn contract
    address internal bruTokenAddress; // address of bru token contract
    address internal tokenAddressForCashflow; // address of token in which cashflow will be distributed
    address internal unClaimedWalletAddress; // address of unclaimed Wallet
    mapping(address => mapping(uint256 => bool)) public cashFlowClaimMapping; // mapping to check if the user has claimed their part for a given claimId
    mapping(uint256 => CashFlowDetails) public cashFlowDetailsMapping; // mapping of cashflow details for a given claim Id

    /**
     * @notice Emitted when claim period started
     * @param _claimId claim id
     * @param _tokenAddress address of the token of which we want to divide the cashflow
     */
    event ClaimPeriodStarted(uint256 _claimId, address _tokenAddress);
    /**
     * @notice Emitted when claim period stopped
     * @param _claimId claim id
     */
    event ClaimPeriodStopped(uint256 _claimId);
    /**
     * @notice Emitted when cashflow details are set for a given claimId
     * @param _claimId claim id
     * @param _cashFlowDetails Cashflowdetails structure
     */
    event SetCashflowDetails(uint256 _claimId, CashFlowDetails _cashFlowDetails);
    /**
     * @notice Emitted when user claims a dividend and mapping is updated
     * @param _claimId claim id
     * @param _ownerAddress address Of the owner who claims the dividend
     * @param _claimed boolean for confirming the user has claimed the dividend for given claimId
     */
    event SetCashflowClaimed(bool _claimed, address _ownerAddress, uint256 _claimId);
    /**
     * @dev Only admin can call functions marked by this modifier.
     *
     */

    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Can be used only by adminAddress");
        _;
    }

    /**
     * @dev Only unClaimedWalletAddress can call functions marked by this modifier.
     *
     */
    modifier onlyUnClaimedWallet() {
        require(msg.sender == unClaimedWalletAddress, "Only called by unclaimed wallet address");
        _;
    }

    /**
     * @dev Only admin, pool and burn wallet can call functions marked by this modifier.
     *
     */
    modifier onlyPoolOrAdminOrBurnContract() {
        require(
            msg.sender == adminAddress || msg.sender == poolAddress || msg.sender == burnContractAddress,
            "Only allowed by admin or pool or burn contract"
        );
        _;
    }

    /**
     * @notice Initializes the neccessary variables for the contract
     * @param _reserveWalletAddress The address of ReserveWallet contract
     * @param _adminAddress The address of Multisig wallet
     * @param _poolAddress The address of the pool
     * @param _burnContractAddress The address of burnWallet contract address
     * @param _bruTokenAddress The address of the bru token
     * @param _tokenAddressForCashflow The address of the token in which cashflow is distributed
     * @param _unClaimedWalletAddress The address of the unclaimed wallet contract
     */
    function initialize(
        address _reserveWalletAddress,
        address _adminAddress,
        address _poolAddress,
        address _burnContractAddress,
        address _bruTokenAddress,
        address _tokenAddressForCashflow,
        address _unClaimedWalletAddress
    ) external initializer {
        require(
            _reserveWalletAddress != address(0) &&
                _adminAddress != address(0) &&
                _poolAddress != address(0) &&
                _burnContractAddress != address(0) &&
                _bruTokenAddress != address(0) &&
                _tokenAddressForCashflow != address(0) &&
                _unClaimedWalletAddress != address(0),
            "Invalid Address"
        );

        adminAddress = _adminAddress;
        reserveWalletAddress = _reserveWalletAddress;
        poolAddress = _poolAddress;
        burnContractAddress = _burnContractAddress;
        owner = msg.sender;
        bruTokenAddress = _bruTokenAddress;
        tokenAddressForCashflow = _tokenAddressForCashflow;
        unClaimedWalletAddress = _unClaimedWalletAddress;
    }

    /**
     * @notice To pay expenses or other parts from this wallet.
     * @dev Only called by admin or pool or Burn contract
     * @param _amount The amount of token to safeTransfer
     * @param _tokenAddress The address of the token
     * @param _receiverAddress The address of the receiver
     */
    function sendAmount(
        uint256 _amount,
        address _tokenAddress,
        address _receiverAddress
    ) public onlyPoolOrAdminOrBurnContract {
        if (
            IERC20(_tokenAddress).balanceOf(address(this)) + IERC20(_tokenAddress).balanceOf(reserveWalletAddress) >=
            _amount
        ) {
            if (_amount > IERC20(_tokenAddress).balanceOf(address(this))) {
                _amount -= IERC20(_tokenAddress).balanceOf(address(this));
                IERC20(_tokenAddress).safeTransfer(_receiverAddress, IERC20(_tokenAddress).balanceOf(address(this)));
                transferFromReserve(_amount, _tokenAddress, _receiverAddress);
            } else {
                IERC20(_tokenAddress).safeTransfer(_receiverAddress, _amount);
            }
        } else {
            revert("currently we do not have enough balance");
        }
    }

    /**
     * @notice This function is get cashflow details of a given claimId
     * @param  _claimId claim Id
     * @return CashFlowDetails object of a given claim Id
     */
    function getCashFlowDetailsOfClaimId(uint256 _claimId) public view returns (CashFlowDetails memory) {
        return cashFlowDetailsMapping[_claimId];
    }

    /**
     * @notice Used to get the available wallet balance
     * @param _tokenAddress The address of the token
     * @return Returns amount of balance available
     */
    function getBalance(address _tokenAddress) external view returns (uint256) {
        IERC20 tokenContract = IERC20(_tokenAddress);
        return tokenContract.balanceOf(address(this));
    }

    /**
     * @notice This function allows the user to claim the dividend for current claimId.
     */
    function claimDividend() external {
        require(cashFlowDetailsMapping[claimId].status, "claim period ended try from different place");
        if (!cashFlowClaimMapping[msg.sender][claimId]) {
            uint256 balance = Token(bruTokenAddress).balanceOfAtDate(
                msg.sender,
                cashFlowDetailsMapping[claimId].starttime
            );
            uint256 amountTotransfer = (balance * (cashFlowDetailsMapping[claimId].totalAmountToDistribute)) /
                (Token(bruTokenAddress).totalSupplyOfAtDate(cashFlowDetailsMapping[claimId].starttime));
            if (amountTotransfer > 0 && cashFlowDetailsMapping[claimId].amountLeft > amountTotransfer) {
                cashFlowDetailsMapping[claimId].amountLeft -= amountTotransfer;
                cashFlowClaimMapping[msg.sender][claimId] = true;
                IERC20(tokenAddressForCashflow).safeTransfer(msg.sender, amountTotransfer);
            }
        } else {
            revert("already claimed");
        }
    }

    /**
     * @notice This function is used to start claim Period
     * @param _tokenAddress address of the token of which we want to divide the cashflow although for now this tokenAddress is not used as currently we are giving the cashflow in a fixed token
     */
    function startClaimPeriod(address _tokenAddress) external onlyAdmin {
        uint256 amount = (IERC20(_tokenAddress).balanceOf(address(this)) * (16)) / (100);
        uint256 time = Token(bruTokenAddress).createSnapshot();
        cashFlowDetailsMapping[claimId] = CashFlowDetails(time, amount, amount, _tokenAddress, true);
        emit ClaimPeriodStarted(claimId, _tokenAddress);
    }

    /**
     * @notice This function is used to stop claim Period
     */
    function stopClaimPeriod() external onlyAdmin {
        cashFlowDetailsMapping[claimId].status = false;
        claimId++;
        IERC20(tokenAddressForCashflow).transfer(
            unClaimedWalletAddress,
            cashFlowDetailsMapping[claimId - 1].amountLeft
        );
        emit ClaimPeriodStopped(claimId - 1);
    }

    /**
     * @notice Used to set cashflow details of a given claimId
     * @param  _cashflowDetails details to update
     * @param _claimId claim Id
     */
    function setCashFlowDetailsOfClaimId(CashFlowDetails memory _cashflowDetails, uint256 _claimId)
        external
        onlyUnClaimedWallet
    {
        cashFlowDetailsMapping[_claimId] = _cashflowDetails;
        emit SetCashflowDetails(_claimId, _cashflowDetails);
    }

    /**
     * @notice Used to set cashflow claimed mapping of a given claimId for a given owner
     * @param  _claimId claim Id
     * @param _owner address of the user to update the claimed bool
     * @param _result value to update
     */
    function setCashFlowClaimedMapping(
        uint256 _claimId,
        address _owner,
        bool _result
    ) external onlyUnClaimedWallet {
        cashFlowClaimMapping[_owner][_claimId] = _result;
        emit SetCashflowClaimed(_result, _owner, _claimId);
    }

    /**
     * @notice Transfer tokens from the reserve in case the contract has insufficient balance
     * @dev Only called if reserver wallet is set
     * @param _amount The amount of token to be transferred
     * @param _tokenAddress The address of the token
     * @param _receiverAddress The address of token receiver
     */
    function transferFromReserve(
        uint256 _amount,
        address _tokenAddress,
        address _receiverAddress
    ) internal {
        ReserveWallet(reserveWalletAddress).transferTo(_receiverAddress, _amount, _tokenAddress);
    }

    /**
     *  @dev Checks if the wallet initiating the upgrade transaction for a pool is the admin or not
     *  @param _newImplementation Address of the new implementation contract for upgradation.
     */
    function _authorizeUpgrade(address _newImplementation) internal view override {
        require(msg.sender == adminAddress, "Only admin allowed");
    }
}
