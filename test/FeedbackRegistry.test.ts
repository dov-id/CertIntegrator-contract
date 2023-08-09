import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumberish } from "ethers";
import { FeedbackRegistry } from "@/generated-types/ethers";

import { Reverter } from "./helpers/reverter";

describe("FeedbackRegistry", async () => {
  const reverter = new Reverter();

  let feedbackRegistry: FeedbackRegistry;

  let COURSE = "0x63223538169D7228b37C9182eD6d2b9B2CfD8F26";

  let IPFS: string;
  let pA: [BigNumberish, BigNumberish];
  let pB: [[BigNumberish, BigNumberish], [BigNumberish, BigNumberish]];
  let pC: [BigNumberish, BigNumberish];
  let PubSignals: BigNumberish[];

  before(async () => {
    IPFS = "QmcafQDfq4LGzQ6CimzLVBt7rqEAFSwE4ya8uZt9zUSZJr";

    pA = [
      "0x2dbed4d168cd3b80d84ea53a7eb8efa478fcd6e19b66ede8690ae2edb98d4875",
      "0x251e5d8492bcbc1f200ee99ec4d00db4425f8489d5ce2efac0d82f3d4997f64a",
    ];

    pB = [
      [
        "0x2c517a1eddf240fcd37f1f184bdae5e139faa71b0b585000121378365714de78",
        "0x085ea619aa20e0fd538f7e65b0e7de26e05d570d86a8ab40811d2600467c99e1",
      ],
      [
        "0x06361cfb97d52bb5b478f2066259bdb60a02d1ef5f07471725f4bb8adedcd0ba",
        "0x2013d8178716553045a09eafb2e641c347183b0215ec6f1e14af99526671ee38",
      ],
    ];

    pC = [
      "0x29085d3cdd57e2d2167ce07684da6fb76fb69b39915d66949ef7c032976d3af7",
      "0x0c630705767cbff5d893c19d223970d9dfa4d7f9994d28cda3acc17570849858",
    ];

    PubSignals = [
      "0x0000000000000000000000004fccd26b2725f048f89e4cf2795ad70f399b6236",
      "0x00000000000000000000000000000000219ab540356cbb839cbe05303d7705fa",
      "0x000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "0x000000000000000000000000be0eb53f46cd790cd13851d5eff43d12404d33e8",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      "0x000000000000000000000000000000000000000000000000000000000000002a",
    ];

    const groth16VerifierContract = await ethers.getContractFactory("Groth16Verifier");
    const groth16Verifier = await groth16VerifierContract.deploy();

    const feedbackRegistryContract = await ethers.getContractFactory("FeedbackRegistry");
    feedbackRegistry = await feedbackRegistryContract.deploy(groth16Verifier.address);

    await reverter.snapshot();
  });

  afterEach("revert", reverter.revert);

  describe("#addFeedback", () => {
    it("should add feedback correctly", async () => {
      await feedbackRegistry.addFeedback(COURSE, IPFS, pA, pB, pC, PubSignals);

      expect(await feedbackRegistry.contractFeedbacks(COURSE, 0)).to.equal(IPFS);
    });

    it("should revert calling verifyProof", async () => {
      const groth16VerifierMockContract = await ethers.getContractFactory("Groth16VerifierMock");
      const groth16VerifierMock = await groth16VerifierMockContract.deploy();

      const feedbackRegistryContract = await ethers.getContractFactory("FeedbackRegistry");
      const tmpFeedbackRegistry = await feedbackRegistryContract.deploy(groth16VerifierMock.address);

      await expect(tmpFeedbackRegistry.addFeedback(COURSE, IPFS, pA, pB, pC, PubSignals)).to.be.revertedWith(
        "FeedbackRegistry: failed to call verifyProof"
      );
    });

    it("should revert invalid proof", async () => {
      let tmpA: [BigNumberish, BigNumberish] = [
        "0x1dbed4d168cd3b80d84ea53a7eb8efa478fcd6e19b66ede8690ae2edb98d4862",
        "0x141e5d8492bcbc1f200ee99ec4d00db4425f8489d5ce2efac0d82f3d4997f63f",
      ];

      await expect(feedbackRegistry.addFeedback(COURSE, IPFS, tmpA, pB, pC, PubSignals)).to.be.revertedWith(
        "FeedbackRegistry: invalid proof"
      );
    });
  });

  describe("#getFeedbacks", () => {
    it("should return feedback for course", async () => {
      await feedbackRegistry.addFeedback(COURSE, IPFS, pA, pB, pC, PubSignals);

      expect(await feedbackRegistry.getFeedbacks(COURSE, 0, 3)).to.deep.equal([IPFS]);
    });

    it("should return feedback for course", async () => {
      await feedbackRegistry.addFeedback(COURSE, IPFS, pA, pB, pC, PubSignals);

      expect(await feedbackRegistry.getFeedbacks(COURSE, 0, 1)).to.deep.equal([IPFS]);
    });
  });

  describe("#getCourses", () => {
    it("should return all courses", async () => {
      await feedbackRegistry.addFeedback(COURSE, IPFS, pA, pB, pC, PubSignals);

      expect(await feedbackRegistry.getCourses(0, 3)).to.deep.equal([COURSE]);
    });
  });
});
