# DOV-ID Contracts

**Dov-Id** (*Ukrainian* "довід", - specific reasoning, idea, or the fact that is presented to prove something.)   

The **Dov-Id** platform aims to ensure the authenticity of user feedback by preventing any tampering or manipulation of responses. If you have this product, claim, state, or membership - you can leave feedback about it.

## DOV-ID Simplified architecture

INSERT IMAGE HERE

## Description

The **Dov-Id** has two main contracts that are responsible for logic: *Certificates Integrator* and *Feedback Registry* contracts. 

### Certificates Integrator
The **CertIntegrator** contract is a *Solidity* contract that solves the problem, when *Fabric* and *Issuer* contracts presented only on their main chain, but **FeedbackRegistry** will be on several chains at the same time (*Q*, *Polygon*, *Ethereum*, etc.) and will not have access to information about courses and their participants. 
   
So this contract will be deployed on the supported chains, and its purpose is to store and provide the ability to update data about courses and their participants from the chain where *Issuers* are present. This data is the *root* of the **Sparse Merkle Tree** that contains course participants. Whenever a certificate is issued or a new course is created, the *Certificates Integration service* will update the data in contracts. This way, every instance of **FeedbackRegistry** on different chains will have the latest and most up-to-date data available.
   
   
### Feedback Registry
The **FeedbackRegistry** contract is the main contract in the **Dov-Id** system. It will provide the logic for adding and storing the course participants’ feedbacks, where the feedback is an **IPFS** hash that routes us to the user’s feedback payload on **IPFS**. Also, it is responsible for validating the **ZKP** of NFT owning.
   
   
### Verifier
Also, this repository contains **Verifier** contract that has similar to **Feedback Registry** logic, but required for purposes of creating new instances of *SBT* tokens. This contract is not used in this system, but will be used in other projects.
   
   
# Usage

```
# install dependencies
npm install

# run unit tests
npm run test

# deploy contracts
// supported networks: sepolia, mumbai 
npm run deploy-*network*
```
