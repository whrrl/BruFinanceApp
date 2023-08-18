//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

/**
 * @title IBruProxy
 * @author Bru-finance team
 * @dev This is the interface for proxy contract
 */
interface IBruProxy {
    /**
     * @notice it is use to update the implementation contract address in a proxy contract
     * @param _implementationAddress it is address of the new implementation contract
     */
    function upgradeTo(address _implementationAddress) external;
}
