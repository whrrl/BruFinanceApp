//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./NIIMargin.sol";

/**
 * @title Reserve Wallet contract
 * @author Bru-finance team
 * @notice Stores some amount as some users might not have claimed their cashflow distribution
 */
contract UnClaimedCashFlowWallet is Initializable, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    uint256 public maxUnclaimedPeriod = 28; // max unclaimed dividend allowed to be claimed
    address public adminAddress; // The address of Multisig wallet
    address internal NIIWalletAddress; // The address of NII margin contract
    address internal bruTokenAddress; // The address of Bru token
    address internal tokenAddressForCashFlow; // The token address which is supported by pool
    /**
     * @notice This mapping contains last timestamp of a user claim
     */
    mapping(address => uint256) internal lastClaimedTimestamp;
    /**
     * @notice Emitted when user claims previous dividend
     * @param _amount amount claimed
     * @param _ownerAddress  address of the owner
     */
    event ClaimedPreviousDividend(uint256 _amount, address _ownerAddress);
    /**
     * @notice Emitted when the value of maxUnclaimedPeriod is changed
     * @param _maxUnClaimed  max allowed claims from past
     */
    event UnclaimedDividendMaxChanged(uint256 _maxUnClaimed);

    /**
     * @dev Only admin can call functions marked by this modifier
     */
    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Can be used only by adminAddress");
        _;
    }

    /**
     * @notice Initializes the necessary varaibles for the contract
     * @param _adminAddress The address of the admin
     * @param _NIIWalletAddress The address the NIIWallet contract
     * @param _bruTokenAddress The address of the bruToken
     * @param _tokenAddressForCashFlow The address of cashflow token contract
     */
    function initialize(
        address _adminAddress,
        address _NIIWalletAddress,
        address _bruTokenAddress,
        address _tokenAddressForCashFlow
    ) external initializer {
        require(
            _adminAddress != address(0) &&
                _NIIWalletAddress != address(0) &&
                _bruTokenAddress != address(0) &&
                _tokenAddressForCashFlow != address(0),
            "Invalid Address"
        );

        adminAddress = _adminAddress;
        NIIWalletAddress = _NIIWalletAddress;
        bruTokenAddress = _bruTokenAddress;
        tokenAddressForCashFlow = _tokenAddressForCashFlow;
        maxUnclaimedPeriod = 28;
    }

    /**
     * @notice for users who have not claimed their dividend in the given time period
     */
    function claimUnClaimedDividend() external {
        require(block.timestamp - lastClaimedTimestamp[msg.sender] > 86400, "come back later");
        uint256 claimId = NIIMargin(NIIWalletAddress).claimId();
        uint256 i = 0;
        uint256 tempSum = 0;
        if (claimId > maxUnclaimedPeriod) {
            i = claimId - maxUnclaimedPeriod;
        }
        for (i; i < claimId; i++) {
            CashFlowDetails memory tempcashflow = NIIMargin(NIIWalletAddress).getCashFlowDetailsOfClaimId(i);
            bool claimed = NIIMargin(NIIWalletAddress).cashFlowClaimMapping(msg.sender, i);
            if (!claimed) {
                uint256 balance = Token(bruTokenAddress).balanceOfAtDate(msg.sender, tempcashflow.starttime);
                uint256 amountTotransfer = (balance * (tempcashflow.totalAmountToDistribute)) /
                    (Token(bruTokenAddress).totalSupplyOfAtDate(tempcashflow.starttime));
                require(tempcashflow.amountLeft > amountTotransfer);
                tempSum += amountTotransfer;
                tempcashflow.amountLeft -= amountTotransfer;
                NIIMargin(NIIWalletAddress).setCashFlowDetailsOfClaimId(tempcashflow, i);
                NIIMargin(NIIWalletAddress).setCashFlowClaimedMapping(i, msg.sender, true);
            }
        }

        lastClaimedTimestamp[msg.sender] = block.timestamp;
        IERC20(tokenAddressForCashFlow).safeTransfer(msg.sender, tempSum);
        emit ClaimedPreviousDividend(tempSum, msg.sender);
    }

    /**
     * @notice Used to get wallet's available balance
     * @param _tokenAddress The address of the token
     * @return Returns caller balance
     */
    function getBalance(address _tokenAddress) external view returns (uint256) {
        IERC20 tokenContract = IERC20(_tokenAddress);
        return tokenContract.balanceOf(msg.sender);
    }

    /**
     * @notice Transfer funds from this wallet to NII wallet.
     * @dev Only called by NIIWallet address or admin
     * @param _receiverAddress The address of token receiver
     * @param _amount The amount of token to be transferred
     * @param _tokenAddress The address of the token
     */
    function transferTo(
        address _receiverAddress,
        uint256 _amount,
        address _tokenAddress
    ) external onlyAdmin {
        require(IERC20(_tokenAddress).balanceOf(address(this)) >= _amount, "reserve does not have enough liquidity");
        IERC20(_tokenAddress).safeTransfer(_receiverAddress, _amount);
    }

    /**
     * @notice changes the max allowed unclaimed dividend periods for claiming past dividends
     * @param _newMaxAllowedUnclaimed  new value for  max allowed unclaimed dividend periods
     */
    function changeMaxAllowedUnClaimed(uint256 _newMaxAllowedUnclaimed) external virtual onlyAdmin {
        maxUnclaimedPeriod = _newMaxAllowedUnclaimed;
        emit UnclaimedDividendMaxChanged(_newMaxAllowedUnclaimed);
    }

    /**
     * @dev Checks if the wallet initiating the upgrade transaction for a pool is the admin or not
     * @param _newImplementation Address of the new implementation contract for upgradation.
     */
    function _authorizeUpgrade(address _newImplementation) internal view override {
        require(msg.sender == adminAddress, "Only admin allowed");
    }
}
