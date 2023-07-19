// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;

interface IFeedbackRegistry {
    /**
     *  @dev Adds the feedback to the course.
     *
     *  @notice This function takes some params, then verifies signature, Merkle
     *  tree proofs and only if nothing wrong stores feedback in storage.
     *  Should be noticed:
     *      - `i_`, `c_`, `r_`, `publickKeysX_` and `publickKeysY_` are parts of Ring
     *  signature;
     *      - `merkleTreeProofs_`, `keys_` and `values_` are parts of Merkle Tree proofs
     *  to verify that all users that took part in Ring signature are course participants.
     *
     *  @param course_ the course address
     *  @param i_ the Ring signature image
     *  @param c_ the Ring signature scalar C
     *  @param r_  the Ring signature scalar R
     *  @param publicKeysX_ x coordinates of public keys that took part in generating signature for its verification
     *  @param publicKeysY_ y coordinates of public keys that took part in generating signature for its verification
     *  @param merkleTreeProofs_ the proofs generated from Merkle Tree for specified course and users
     *  whose public keys were used to generate Ring signature
     *  @param keys_ keys to verify proofs in Sparse Merkle Tree
     *  @param values_ values to verify proofs in Sparse Merkle Tree
     *  @param ipfsHash_ IPFS hash that leads us to feedback content saved in IPFS
     */
    function addFeedback(
        address course_,
        //Ring signature parts
        uint256 i_,
        uint256[] memory c_,
        uint256[] memory r_,
        uint256[] memory publicKeysX_,
        uint256[] memory publicKeysY_,
        //Merkle Tree proofs parts
        bytes32[][] memory merkleTreeProofs_,
        bytes32[] memory keys_,
        bytes32[] memory values_,
        string memory ipfsHash_
    ) external;

    /**
     *  @notice Returns paginated feedbacks for the course.
     *
     *  @param course_ the course address
     *  @param offset_ the amount of feedbacks to offset
     *  @param limit_ the maximum number of feedbacks amount to return
     */
    function getFeedbacks(
        address course_,
        uint256 offset_,
        uint256 limit_
    ) external view returns (string[] memory);

    /**
     *  @notice This function returns ALL feedbacks that are stored in storage
     *  for ALL courses.
     *
     *  @dev Function that mostly oriented to publisher-svc. It's required to get all
     *  feedbacks in order to have the most up to date information about feedbacks in
     *  our backend service. All feedbacks returned in paginated way.
     *
     *  @param offset_ the amount of courses to offset
     *  @param limit_ the maximum courses amount to return their feedbacks
     *  @return courses_ and feedbacks_  where `courses_` is array with course identifiers and
     *  `feebacks_` is 2d array with feebacks (their ipfs hashes) for corresponding course
     *  from `courses_
     */
    function getAllFeedbacks(
        uint256 offset_,
        uint256 limit_
    ) external view returns (address[] memory courses_, string[][] memory feedbacks_);
}
