//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Interest token contract
 * @author Bru-finance team
 * @notice It is an ERC20 token used to show users how much interest they have accured which can be redeemed later.
 */
contract InterestToken is ERC20 {
    address internal poolAddress; //address of the pool
    address internal admin; // address of Multisig wallet
    string private tokenName; // name of token
    /**
     * @notice Emmitted after changeName function executed successfully
     * @param _newName The new changed name
     * @param _by The account address of the user who changed the name
     */
    event TokenNameChanged(string _newName, address _by);
    /**
     * @notice Emmitted after setPoolAddress function executed successfully
     * @param _poolAddress The address of the pool
     */
    event PoolAddressUpdated(address _poolAddress);

    /**
     * @dev Only admin can call functions marked by this modifier.
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    /**
     * @dev Only pool can call functions marked by this modifier.
     */
    modifier onlyPool() {
        require(msg.sender == poolAddress, "Only Pool");
        _;
    }

    /**
     * @notice a constructor used to initailize the necessary variables
     * @param _tokenName The name of the token
     * @param _symbol  The symbol of the token
     * @param _adminAddress address of Multisig wallet
     */
    constructor(
        string memory _tokenName,
        string memory _symbol,
        address _adminAddress
    ) ERC20(_tokenName, _symbol) {
        require(_adminAddress != address(0), "Invalid address");
        tokenName = _tokenName;
        admin = _adminAddress;
    }

    /**
     * @notice Used to get the name of the token
     * @return The name of the token
     */
    function name() public view override returns (string memory) {
        return tokenName;
    }

    /**
     * @notice Changes the name of the token
     * @dev only called by the admin
     * @param _tokenName The new name of the token
     */
    function changeName(string memory _tokenName) external onlyAdmin {
        tokenName = _tokenName;
        emit TokenNameChanged(_tokenName, msg.sender);
    }

    /**
     * @notice Mints specified amount of tokens
     * @dev only called from the Pool contract
     * @param _userAddress The address of the user
     * @param _mintAmount The amount of token to mint
     */
    function mint(address _userAddress, uint256 _mintAmount) external onlyPool {
        _mint(_userAddress, _mintAmount);
    }

    /**_
     * @notice Sets the pool address
     * @dev only called by the admin
     * @param _poolAddress The address of the pool contract
     */
    function setPoolAddress(address _poolAddress) external onlyAdmin {
        require(_poolAddress != address(0), "Invalid address");
        poolAddress = _poolAddress;
        emit PoolAddressUpdated(poolAddress);
    }

    /**
     * @notice Burns specified amount of tokens
     * @dev only called from the pool contract
     * @param _userAddress The address of the user
     * @param _burnAmount The amount of token to be burned
     */
    function burn(address _userAddress, uint256 _burnAmount) external onlyPool {
        _burn(_userAddress, _burnAmount);
    }
}
