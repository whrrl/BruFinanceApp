//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Test Token Contract
 * @author Bru-finance team
 * @notice ERC20 standard test token
 */
contract TestToken is ERC20 {
    uint256 internal constant MAX_INT = 2**256 - 1;

    /**
     * @notice Mints token while contract deployed
     * @param _initialSupply The amount of token to be minted
     */
    constructor(uint256 _initialSupply) ERC20("USD Tether", "USDT") {
        _mint(msg.sender, _initialSupply);
    }

    /**
     * @notice Mints specified amount of tokens
     * @param _address The address of the user
     * @param _amount The amount of token to mint
     */
    function mint(address _address, uint256 _amount) public {
        _mint(_address, _amount);
    }

    /**
     * @notice Burns specified amount of tokens
     * @param _address The address of the user
     * @param _amount The amount of token to be burned
     */
    function burn(address _address, uint256 _amount) public {
        _burn(_address, _amount);
    }

    /**
     * @notice Approves a tokens which can be used by other address
     * @param _address The address of the user
     */
    function approveTokensForTransfer(address _address) public {
        approve(_address, MAX_INT);
    }
}

contract CustomTestToken is ERC20 {
    uint256 internal constant MAX_INT = 2**256 - 1;

    /**
     * @notice Mints token while contract deployed
     * @param _initialSupply The amount of token to be minted
     */
    constructor(uint256 _initialSupply) ERC20("USD Tether", "USDT") {
        _mint(msg.sender, _initialSupply);
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    /**
     * @notice Mints specified amount of tokens
     * @param _address The address of the user
     * @param _amount The amount of token to mint
     */
    function mint(address _address, uint256 _amount) public {
        _mint(_address, _amount);
    }

    /**
     * @notice Burns specified amount of tokens
     * @param _address The address of the user
     * @param _amount The amount of token to be burned
     */
    function burn(address _address, uint256 _amount) public {
        _burn(_address, _amount);
    }

    /**
     * @notice Approves a tokens which can be used by other address
     * @param _address The address of the user
     */
    function approveTokensForTransfer(address _address) public {
        approve(_address, MAX_INT);
    }
}

contract CustomTestToken2 is ERC20 {
    uint256 internal constant MAX_INT = 2**256 - 1;

    /**
     * @notice Mints token while contract deployed
     * @param _initialSupply The amount of token to be minted
     */
    constructor(uint256 _initialSupply) ERC20("USD Tether", "USDT") {
        _mint(msg.sender, _initialSupply);
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 30;
    }

    /**
     * @notice Mints specified amount of tokens
     * @param _address The address of the user
     * @param _amount The amount of token to mint
     */
    function mint(address _address, uint256 _amount) public {
        _mint(_address, _amount);
    }

    /**
     * @notice Burns specified amount of tokens
     * @param _address The address of the user
     * @param _amount The amount of token to be burned
     */
    function burn(address _address, uint256 _amount) public {
        _burn(_address, _amount);
    }

    /**
     * @notice Approves a tokens which can be used by other address
     * @param _address The address of the user
     */
    function approveTokensForTransfer(address _address) public {
        approve(_address, MAX_INT);
    }
}
