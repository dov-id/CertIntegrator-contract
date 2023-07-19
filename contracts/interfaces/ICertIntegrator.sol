// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;

interface ICertIntegrator {
    /**
     * A structure to store course data:
     * Merkle Tree root and corresponding block number
     */
    struct Data {
        uint256 blockNumber;
        bytes32 root;
    }

    /**
     * @notice Updates course state information.
     *
     * This function takes two identically sized arrays containing course addresses and the roots
     * of the Merkle Tree (to identify whether the user is on a course)
     *
     * @param courses_ array with course addresses
     * @param states_ an array with the states of the courses
     *
     * Requirements:
     *  - the length of the `courses_` and `states_` arrays must be the same.
     */
    function updateCourseState(address[] memory courses_, bytes32[] memory states_) external;

    /**
     * @notice Gets information about a course by its address.
     *
     * @param course_ course address to get the information
     * @return Array of states for the course
     */
    function getData(address course_) external view returns (Data[] memory);

    /**
     * @dev Gets information about the last state of a course by its address.
     *
     * @param course_ course address to get the information
     * @return Last state of course
     */
    function getLastData(address course_) external view returns (Data memory);

    /**
     * @dev Gets the number of states for a course by its address
     *
     * @param course_ course address
     * @return number of course states
     */
    function getDataLength(address course_) external view returns (uint256);
}
