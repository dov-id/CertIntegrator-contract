// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;

contract Groth16VerifierMock {
    function verifyProof(
        uint[2] calldata,
        uint[2][2] calldata,
        uint[2] calldata,
        uint[11] calldata
    ) public pure returns (bool) {
        revert("verifyProof: reverts");
    }
}
