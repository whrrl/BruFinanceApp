//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Reserve Wallet contract
 * @author Bru-finance team
 * @notice Stores some amount as reserve incase expense is greater than the balance of NIImargin wallet
 */
contract ReserveWallet is Initializable, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    /// @notice The address of the admin
    address public adminAddress; // The address of Multisig wallet
    address internal NIIWalletAddress;

    /**
     * @dev Only NII wallet and admin address can call functions marked by this modifier
     */
    modifier onlyNIIWalletOrAdmin() {
        require(msg.sender == NIIWalletAddress || msg.sender == adminAddress, "Can be used only by NIIwallet");
        _;
    }

    /**
     * @notice Initializes the neccessary variables for the contract
     * @param _adminAddress The address of Multisig wallet
     * @param _NIIWalletAddress The address the NIIWallet contract
     */
    function initialize(address _adminAddress, address _NIIWalletAddress) external initializer {
        require(_adminAddress != address(0) && _NIIWalletAddress != address(0), "Invalid Address");
        adminAddress = _adminAddress;
        NIIWalletAddress = _NIIWalletAddress;
    }

    /**
     * @notice Used to get wallet's available balance
     * @param _tokenAddress The address of the token
     * @return Returns caller's balance
     */
    function getBalance(address _tokenAddress) external view returns (uint256) {
        IERC20 tokenContract = IERC20(_tokenAddress);
        return tokenContract.balanceOf(address(this));
    }

    /**
     * @notice Transfer funds from reserve wallet to NII wallet.
     * @dev Only called by NIIWallet address or admin
     * @param _receiverAddress The address of token receiver
     * @param _amount The amount of token to be transferred
     * @param _tokenAddress The address of the token
     */
    function transferTo(
        address _receiverAddress,
        uint256 _amount,
        address _tokenAddress
    ) external onlyNIIWalletOrAdmin {
        require(IERC20(_tokenAddress).balanceOf(address(this)) >= _amount, "reserve does not have enough liquidity");
        IERC20(_tokenAddress).safeTransfer(_receiverAddress, _amount);
    }

    /**
     * @dev Checks the wallet address which initiates the upgrade transaction for ReserveWallet contract
     * @param _newImplementation Address of the new implementation contract which is used for upgradation.
     */
    function _authorizeUpgrade(address _newImplementation) internal view override {
        require(msg.sender == adminAddress, "Only admin allowed");
    }
}
