//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./BruPool.sol";

/**
 * @title Asset Treasury contract
 * @author Bru-finance team
 * @dev This contract is used to mint the Assets as NFT.
 */
contract AssetTreasury is ERC1155 {
    uint256 internal tokenId;
    address internal poolAddress;
    address internal adminAddress;
    /**
     * @notice mint wallet address which only has access to mint nfts
     */
    address public mintWalletAddress;

    /**
     * @notice Emitted after changeMintWalletAddress function executed successfully
     * @param _newAddress The new mint wallet address
     */
    event MintWalletChanged(address _newAddress);

    /**
     * @dev Only admin can call functions marked by this modifier.
     */
    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Can be used only by admin");
        _;
    }

    /**
     * @dev functions marked with this modifier can only be called by mint wallet address
     */
    modifier onlyMintWalletAddress() {
        require(msg.sender == mintWalletAddress, "Can be used only by mint wallet address");
        _;
    }

    /**
     * @notice Initializes the poolAddress, mintWalletAddress and adminAddress
     * @param _poolAddress The address of the pool
     * @param _mintWalletAddress The address which is allowed to mint NFTs in the contract
     * @param _adminAddress The address of the admin
     */
    constructor(address _poolAddress, address _mintWalletAddress, address _adminAddress) ERC1155("") {
        require(
            _poolAddress != address(0) && _mintWalletAddress != address(0) && _adminAddress != address(0),
            "zero address not allowed"
        );
        adminAddress = _adminAddress;
        poolAddress = _poolAddress;
        mintWalletAddress = _mintWalletAddress;
    }

    /**
     * @notice Add a commodities as NFT on the blockchain.
     * @dev Mint the nft and stores the data's in the BruPool nft mapping.
     * @param _userAddress The account address of the a commodity owner.
     * @param _nftId The unique Id of the particular NFT
     * @param _commodityId The Id of the commodity.
     * @param _quantity The amount of the commodity
     * @param _value The value of the commodity.
     * @param _dataHash The hash encrypted by sha256 which has all the data of nft.
     * @param _data The original data of nft which combines its price and quantity and other details.
     */
    // function mintNft(
    //     address _userAddress,
    //     string memory _nftId,
    //     string memory _commodityId,
    //     uint256 _quantity,
    //     uint256 _value,
    //     string memory _dataHash,
    //     string memory _data
    // ) external onlyMintWalletAddress {
    //     tokenId++;
    //     _mint(_userAddress, tokenId, _quantity, bytes(_data));
    //     BruPool(poolAddress).mintNft(tokenId, _nftId, _commodityId, _quantity, _value, _dataHash, _data);
    // }
    function mintNft(
        address _userAddress,
        string memory _nftId,
        string memory _commodityId,
        uint256 _quantity,
        uint256 _value,
        string memory _dataHash,
        string memory _data
    ) external onlyMintWalletAddress {
        tokenId++;
        _mint(_userAddress, tokenId, _quantity, bytes(_data));
        BruPool(poolAddress).mintNft(tokenId, _nftId, _commodityId, _quantity, _value, _dataHash, _data);
    }

    /**
     * @notice Changes The mintWallet address
     * @param _newAddress The new address of mintWallet
     *
     */
    function changeMintWalletAddress(address _newAddress) external onlyAdmin {
        require(_newAddress != address(0), "invalid address");
        mintWalletAddress = _newAddress;
        emit MintWalletChanged(_newAddress);
    }
}
