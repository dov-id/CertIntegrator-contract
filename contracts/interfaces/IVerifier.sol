// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;

interface IVerifier {
    /**
     * Structure that stores contract data:
     * Merkle Tree root and corresponding block number
     */
    struct Data {
        uint256 blockNumber;
        bytes32 root;
    }

    /**
     * @dev Function to mint token in side-chain
     *
     * @notice This function takes some params, then verifies signature, Merkle
     * tree proofs and only if nothing wrong stores feedback in storage.
     * Should be noticed:
     *     - `i_`, `c_`, `r_`, `publicKeysX_` and `publicKeysY_` are parts of Ring
     * signature;
     *     - `merkleTreeProofs_`, `keys_` and `values_` are parts of Merkle Tree proofs
     * to verify that all users that took part in Ring signature are course participants.
     *
     * @param contract_ the contract address to retrieve last root for and to mint new token from
     * @param i_ the Ring signature image
     * @param c_ the Ring signature scalar C
     * @param r_  the Ring signature scalar R
     * @param publicKeysX_ x coordinates of public keys that took part in generating signature for its verification
     * @param publicKeysY_ y coordinates of public keys that took part in generating signature for its verification
     * @param merkleTreeProofs_ the proofs generated from Merkle Tree for specified course and users
     * whose public keys were used to generate ring signature
     * @param keys_ keys to verify proofs in Sparse Merkle Tree
     * @param values_ values to verify proofs in Sparse Merkle Tree
     * @param tokenUri_ the uri of token to mint in side-chain
     * @return id of the newly minted token
     */
    function verifyContract(
        address contract_,
        // Ring signature parts
        uint256 i_,
        uint256[] memory c_,
        uint256[] memory r_,
        uint256[] memory publicKeysX_,
        uint256[] memory publicKeysY_,
        // Merkle Tree proofs parts
        bytes32[][] memory merkleTreeProofs_,
        bytes32[] memory keys_,
        bytes32[] memory values_,
        string memory tokenUri_
    ) external returns (uint256);
}
