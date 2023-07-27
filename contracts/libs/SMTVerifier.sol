// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.16;

import {PoseidonUnit2L, PoseidonUnit3L} from "@iden3/contracts/lib/Poseidon.sol";

/**
 * 1. This library is needed for verifying sparse Merkle Tree proof, that is generated with
 *  help of [Sparse Merkle Tree](https://github.com/iden3/go-merkletree-sql) in backend service,
 *  written in Golang (to generate proof just use `GenerateProof` method from the library).
 *
 * 2. This realization uses Poseidon hashing as a main hash function. The main repo for usage
 *  can be found in [circomlibjs](https://github.com/iden3/circomlibjs). Example of its usage and
 *  linking can be found in tests for this library.
 *
 * 3. Gas usage for main `verifyProof` method is:
 *     a. Min: 252226
 *     b. Avg: 252418
 *     c. Max: 252610
 *
 * 4. With this library there is no need to implement own realization for proof verifying in iden3 sparse
 *  Merkle Tree realization.
 */
library SMTVerifier {
    /**
     * @notice Verifies root from proof.
     *
     * 1. Function takes some params and requires Merkle Tree proof
     *  array not to be empty to have ability to retrieve root from it.
     *
     * 2. Then, it generates tree leaf from `key_`, `value_` and `1` (level in tree)
     *  with help of Poseidon hashing for 3 elements (`poseidon3Hash_`).
     *
     * 3. On the next step it starts processing proof elements (starting from
     *  the last element (`proof_.length - 1`)) until all are processed. At every
     *  iteration it checks if the bit is set (not zero) to get some  kind of a path
     *  from the root to the leaf.
     *
     * 4. When all elements are processed, retrieved node compared with given root
     *  to get response.
     *
     * @param root_ Merkle Tree root to verify
     * @param key_ the key to verify in SMT
     * @param value_ the value to verify in SMT
     * @param proof_ Sparse Merkle Tree proof
     * @return true when retrieved SMT root from proof is equal to the given `root_`,
     * otherwise - false
     *
     * Requirements:
     *  - the `proof_` array mustn't be empty.
     */
    function verifyProof(
        bytes32 root_,
        bytes32 key_,
        bytes32 value_,
        bytes32[] memory proof_
    ) internal pure returns (bool) {
        return _verifyProof(root_, key_, value_, proof_);
    }

    function _verifyProof(
        bytes32 root_,
        bytes32 key_,
        bytes32 value_,
        bytes32[] memory proof_
    ) private pure returns (bool) {
        uint256 proofLength_ = proof_.length;

        require(proofLength_ > 0, "SMTVerifier: sparse Merkle Tree proof is empty");

        uint256 midKey_ = _swapEndianness(
            _newPoseidonHash3(
                _swapEndianness(uint256(key_)),
                _swapEndianness(uint256(value_)),
                uint256(1)
            )
        );

        uint256 siblingKey_;

        for (uint256 lvl = proofLength_ - 1; ; lvl--) {
            siblingKey_ = uint256(proof_[lvl]);

            if (_testBit(key_, lvl)) {
                midKey_ = _swapEndianness(
                    _newPoseidonHash2(_swapEndianness(siblingKey_), _swapEndianness(midKey_))
                );
            } else {
                midKey_ = _swapEndianness(
                    _newPoseidonHash2(_swapEndianness(midKey_), _swapEndianness(siblingKey_))
                );
            }

            if (lvl == 0) {
                break;
            }
        }

        return midKey_ == uint256(root_);
    }

    /**
     * @dev Swaps bytes order (endianness).
     *
     * @notice Function to swap bytes order, for better
     * understanding it just makes `result[len(data)-1-i] = data[i]`
     * for every byte in bytes array.
     *
     * @param data_ bytes data to swap byte order
     * @return result_ uint256 with swapped `data_` bytes order
     */
    function _swapEndianness(uint256 data_) private pure returns (uint256 result_) {
        for (uint i = 0; i < 32; i++) {
            result_ |= (255 & (data_ >> (i * 8))) << ((31 - i) * 8);
        }
    }

    /**
     * @notice Tests bit.
     *
     * @dev This function tests bit value. It takes the byte
     * at the specified index, then shifts the bit to the right
     * position and perform bitwise AND, then checks if the bit
     * is set (not zero)
     *
     * @param bitmap_ bytes array
     * @param n_ position of bit to test
     * @return true if bit in such position is set (1)
     */
    function _testBit(bytes32 bitmap_, uint256 n_) private pure returns (bool) {
        uint256 byteIndex_ = n_ >> 3;
        uint256 bitIndex_ = n_ & 7;

        uint8 byteValue_ = uint8(bitmap_[byteIndex_]);
        uint8 mask_ = uint8(1 << bitIndex_);

        return (byteValue_ & mask_) != 0;
    }

    function _newPoseidonHash2(uint256 elem1_, uint256 elem2_) private pure returns (uint256) {
        return PoseidonUnit2L.poseidon([elem1_, elem2_]);
    }

    function _newPoseidonHash3(
        uint256 elem1_,
        uint256 elem2_,
        uint256 elem3_
    ) private pure returns (uint256) {
        return PoseidonUnit3L.poseidon([elem1_, elem2_, elem3_]);
    }
}
