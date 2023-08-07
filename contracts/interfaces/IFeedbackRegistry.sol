// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;

interface IFeedbackRegistry {
    /**
     * @dev Adds the feedback to the course.
     *
     * @notice This function takes some params, then verifies signature, Merkle
     * tree proofs and only if nothing wrong stores feedback in storage.
     * Should be noticed:
     *     - `i_`, `c_`, `r_`, `publicKeysX_` and `publicKeysY_` are parts of Ring
     * signature;
     *     - `merkleTreeProofs_`, `keys_` and `values_` are parts of Merkle Tree proofs
     * to verify that all users that took part in Ring signature are course participants.
     *
     * @param course_ the course address
     * @param i_ the Ring signature image
     * @param c_ the Ring signature scalar C
     * @param r_  the Ring signature scalar R
     * @param publicKeysX_ x coordinates of public keys that took part in generating signature for its verification
     * @param publicKeysY_ y coordinates of public keys that took part in generating signature for its verification
     * @param merkleTreeProofs_ the proofs generated from Merkle Tree for specified course and users
     * whose public keys were used to generate Ring signature
     * @param keys_ keys to verify proofs in Sparse Merkle Tree
     * @param values_ values to verify proofs in Sparse Merkle Tree
     * @param ipfsHash_ IPFS hash that leads us to feedback content saved in IPFS
     */
    function addFeedback(
        address course_,
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
        string memory ipfsHash_
    ) external;

    /**
     * @notice Returns paginated feedbacks for the course.
     *
     * @param course_ the course address
     * @param offset_ the amount of feedbacks to offset
     * @param limit_ the maximum number of feedbacks amount to return
     * @return list_ with feedbacks for required course in specified range
     */
    function getFeedbacks(
        address course_,
        uint256 offset_,
        uint256 limit_
    ) external view returns (string[] memory list_);

    /**
     * @notice This function returns paginated courses for which feedbacks were stored.
     *
     * @param offset_ the amount of courses to offset
     * @param limit_ the maximum courses amount to return
     * @return courses_ array with course addresses in specified range
     */
    function getCourses(
        uint256 offset_,
        uint256 limit_
    ) external view returns (address[] memory courses_);
}
