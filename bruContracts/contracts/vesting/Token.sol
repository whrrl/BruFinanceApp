// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.7;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

/**
 * @title Bru Token contract
 * @author Bru-finance team
 * @notice ERC20 standard token
 */
contract Token is ERC20Snapshot {
    uint256 public initialTokenSupply; // initial total supply of the tokens
    address internal vestingContractAddress; // contract address (vesting)
    address internal NIIWalletAddress; // contract address (NIIwallet)
    address internal admin; //address of admin
    mapping(address => bool) public enableMint; // mapping of addresses those are allowed to mint
    mapping(uint256 => uint256) public snapshotIds; // mapping to store id of the snapshot

    /**
     * @dev Only admin can call functions marked by this modifier.
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Can be used only by adminAddress");
        _;
    }

    /**
     * @dev Only NIIwallet or admin or vestingContract can call functions marked by this modifier.
     */
    modifier checkAddress() {
        require(
            msg.sender == admin || msg.sender == NIIWalletAddress || msg.sender == vestingContractAddress,
            "usage restricted"
        );
        _;
    }

    /**
     * @notice It is use to initialize teh required values to the contract
     * @param _name name of token
     * @param _symbol symbol of token
     * @param _initialSupply initial supply of token
     * @param _vestingContractAddress address of vesting contract
     * @param _multisigAddress address of multisig address
     * @param _NIIWalletAddress address of NIIMargin contract
     */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address _vestingContractAddress,
        address _multisigAddress,
        address _NIIWalletAddress
    ) ERC20(_name, _symbol) {
        require(
            _vestingContractAddress != address(0) && _multisigAddress != address(0) && _NIIWalletAddress != address(0),
            "Invalid address"
        );
        initialTokenSupply = _initialSupply;
        _mint(_vestingContractAddress, _initialSupply);
        vestingContractAddress = _vestingContractAddress;
        enableMint[_vestingContractAddress] = true;
        NIIWalletAddress = _NIIWalletAddress;
        admin = _multisigAddress;
    }

    /**
     * @notice returns initial supply of tokens
     */
    function getInitialSupply() external view returns (uint256) {
        return initialTokenSupply;
    }

    /**
     * @notice The function is used to mint new tokens to a specific address.
     * @param _userAddress Address of the user whom we have to transfer the new minted tokens
     * @param _mintamount The amount of new tokens to be minted
     */
    function mintNew(address _userAddress, uint256 _mintamount) external {
        require(enableMint[msg.sender], "not allowed to mint");
        _mint(_userAddress, _mintamount);
    }

    /**
     * @notice The function is used to burn tokens to a specific address.
     * @param _userAddress Address of the user whom we have to transfer the new minted tokens
     * @param _burnAmount The amount of tokens to be burned
     */
    function burn(address _userAddress, uint256 _burnAmount) external {
        require(enableMint[msg.sender], "not allowed to burn");
        _burn(_userAddress, _burnAmount);
    }

    /**
     * @notice enables minting for given address
     * @param _userAddress Address of the user
     */
    function enableMinting(address _userAddress) external onlyAdmin {
        enableMint[_userAddress] = true;
    }

    /**
     * @notice disables minting for given address
     * @param _userAddress Address of the user
     */
    function disableMinting(address _userAddress) external onlyAdmin {
        enableMint[_userAddress] = false;
    }

    /**
     * @notice creates snapshot which can be used later to make some decisions
     */
    function createSnapshot() external checkAddress returns (uint256) {
        uint256 currentTime = block.timestamp;
        uint256 date = currentTime - (currentTime % 86400);
        uint256 snapshotId = _snapshot();
        snapshotIds[date] = snapshotId;
        return date;
    }

    /**
     * @notice returns balance of user at given date
     * @param _userAddress address of the user
     * @param _date date for snapshot mapping key
     * @return balance of the user from the snapshot
     */
    function balanceOfAtDate(address _userAddress, uint256 _date) external view returns (uint256) {
        return balanceOfAt(_userAddress, snapshotIds[_date]);
    }

    /**
     * @notice returns total supply at a given date
     * @param _date date for snapshot mapping key
     * @return total supply from the snapshot
     */
    function totalSupplyOfAtDate(uint256 _date) external view returns (uint256) {
        return totalSupplyAt(snapshotIds[_date]);
    }
}
