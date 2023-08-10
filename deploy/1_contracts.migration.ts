import { artifacts } from "hardhat";

import { Deployer, Logger } from "@dlsl/hardhat-migrate";

import { getPoseidons } from "@/test/helpers/poseidons";

const Verifier = artifacts.require("Verifier");
const CertIntegrator = artifacts.require("CertIntegrator");
const FeedbackRegistry = artifacts.require("FeedbackRegistry");
const Groth16Verifier = artifacts.require("Groth16Verifier");

const PoseidonUnit2L = artifacts.require("PoseidonUnit2L");
const PoseidonUnit3L = artifacts.require("PoseidonUnit3L");

export = async (deployer: Deployer, logger: Logger) => {
  const { poseidonHasher2, poseidonHasher3 } = await getPoseidons();

  const certIntegrator = await deployer.deploy(CertIntegrator);

  const poseidonUnit2L = await PoseidonUnit2L.at(poseidonHasher2.address);
  const poseidonUnit3L = await PoseidonUnit3L.at(poseidonHasher3.address);

  const groth16Verifier = await deployer.deploy(Groth16Verifier);

  const feedbackRegistry = await deployer.deploy(FeedbackRegistry, groth16Verifier.address);

  await deployer.link(poseidonUnit2L, Verifier);
  await deployer.link(poseidonUnit3L, Verifier);

  const verifier = await deployer.deploy(Verifier, certIntegrator.address);

  logger.logContracts(
    ["CertIntegrator", certIntegrator.address],
    ["FeedbackRegistry", feedbackRegistry.address],
    ["Groth16Verifier", groth16Verifier.address],
    ["Verifier", verifier.address]
  );
};
