// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestOracle {
    function latestRoundData()
        external
        view
        returns (
            uint80,
            int256,
            uint256,
            uint256,
            uint80
        )
    {
        return (1, 100000000, 1, 1, 1);
    }

    function decimals() external view returns (uint8) {
        return uint8(8);
    }
}
