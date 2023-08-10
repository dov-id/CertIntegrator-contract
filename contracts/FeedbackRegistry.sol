// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;

import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {Paginator} from "@dlsl/dev-modules/libs/arrays/Paginator.sol";

import {IFeedbackRegistry} from "./interfaces/IFeedbackRegistry.sol";

/**
 * @notice The Feedback registry contract
 *
 * 1. The FeedbackRegistry contract is the main contract in the Dov-Id system. It will provide the logic
 *    for adding and storing the course participants’ feedbacks, where the feedback is an IPFS hash that
 *    routes us to the user’s feedback payload on IPFS. Also, it is responsible for validating the ZKP
 *    of NFT owning.
 *
 * 2. The course identifier - is its address as every course is represented by NFT contract.
 *
 * 3. Requirements:
 *    - The ability to add feedback by a user for a specific course with a provided ZKP of NFT owning.
 *      The proof must be validated.
 *    - The ability to retrieve feedbacks with a pagination.
 */
contract FeedbackRegistry is IFeedbackRegistry {
    using Paginator for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    // course address => feedbacks (ipfs)
    mapping(address => string[]) public contractFeedbacks;

    address private _verifier;

    EnumerableSet.AddressSet private _courses;

    constructor(address verifier_) {
        _verifier = verifier_;
    }

    /**
     * @inheritdoc IFeedbackRegistry
     */
    function addFeedback(
        address course_,
        string memory ipfsHash_,
        uint256[2] calldata pA_,
        uint256[2][2] calldata pB_,
        uint256[2] calldata pC_,
        uint256[11] calldata pubSignals_
    ) external {
        (bool success_, bytes memory data_) = _verifier.call(
            abi.encodeWithSignature(
                "verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[11])",
                pA_,
                pB_,
                pC_,
                pubSignals_
            )
        );

        require(success_, "FeedbackRegistry: failed to call verifyProof");

        require(abi.decode(data_, (bool)), "FeedbackRegistry: invalid proof");

        _courses.add(course_);
        contractFeedbacks[course_].push(ipfsHash_);
    }

    /**
     * @inheritdoc IFeedbackRegistry
     */
    function getFeedbacks(
        address course_,
        uint256 offset_,
        uint256 limit_
    ) external view returns (string[] memory list_) {
        uint256 to_ = Paginator.getTo(contractFeedbacks[course_].length, offset_, limit_);

        list_ = new string[](to_ - offset_);

        for (uint256 i = offset_; i < to_; i++) {
            list_[i - offset_] = contractFeedbacks[course_][i];
        }
    }

    /**
     * @inheritdoc IFeedbackRegistry
     */
    function getCourses(
        uint256 offset_,
        uint256 limit_
    ) external view returns (address[] memory courses_) {
        courses_ = _courses.part(offset_, limit_);
    }
}
