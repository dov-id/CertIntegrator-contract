// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;

interface IFeedbackRegistry {
    /**
     * @dev Adds the feedback to the course.
     *
     * @notice This function takes some params, then verifies ZKP, generated from Circom scheme and
     * contained Merkle Tree verification and Groupsig as signature.
     *
     * @param course_ the course address
     * @param ipfsHash_ IPFS hash that leads us to feedback content saved in IPFS
     * @param pA_ Zero-knowledge proof pi_a parameter
     * @param pB_ Zero-knowledge proof pi_b parameter
     * @param pC_ Zero-knowledge proof pi_c parameter
     * @param pubSignals_ public input and output signals for proof
     */
    function addFeedback(
        address course_,
        string memory ipfsHash_,
        uint[2] memory pA_,
        uint[2][2] memory pB_,
        uint[2] memory pC_,
        uint[11] memory pubSignals_
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
