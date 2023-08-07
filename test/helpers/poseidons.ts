import { ethers } from "hardhat";
import { Contract } from "ethers";

// @ts-ignore
import { poseidonContract } from "circomlibjs";

export async function getPoseidons(): Promise<{ poseidonHasher2: Contract; poseidonHasher3: Contract }> {
  console.info("\n   Deploying Poseidon hashers...\n");

  const [deployer] = await ethers.getSigners();
  const PoseidonHasher2 = new ethers.ContractFactory(
    poseidonContract.generateABI(2),
    poseidonContract.createCode(2),
    deployer
  );
  const poseidonHasher2 = await PoseidonHasher2.deploy();
  await poseidonHasher2.deployed();

  console.info("   Poseidon 2 deployed.\n");

  const PoseidonHasher3 = new ethers.ContractFactory(
    poseidonContract.generateABI(3),
    poseidonContract.createCode(3),
    deployer
  );
  const poseidonHasher3 = await PoseidonHasher3.deploy();
  await poseidonHasher3.deployed();

  console.info("   Poseidon 3 deployed.\n");

  return { poseidonHasher2, poseidonHasher3 };
}
