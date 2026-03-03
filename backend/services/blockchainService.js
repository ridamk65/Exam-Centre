const { ethers } = require("ethers");
const contractABI = require("../../blockchain/artifacts/contracts/ExamVaultAudit.sol/ExamVaultAudit.json");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI.abi,
  wallet
);

async function recordAccess(userPseudo, paperHash) {
  try {
    const tx = await contract.recordAccess(userPseudo, paperHash, "ACCESS");
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Blockchain Service Error:", error);
    throw error;
  }
}

module.exports = {
  recordAccess
};
