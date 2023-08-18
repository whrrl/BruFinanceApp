// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/**
 * @title BruProxy
 * @author Bru-finance team
 * @dev This is the cotract for proxy
 */
contract BruProxy is ERC1967Proxy {
    /**
     * @notice it is used to initialize the implementation contract in the proxy contract
     * @param _implementationAddress the address of implementation contract
     */
    constructor(address _implementationAddress) ERC1967Proxy(_implementationAddress, "") {}
}
