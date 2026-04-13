const { ethers } = require("ethers");
const contractABI = require("../../blockchain/artifacts/contracts/ExamVaultAudit.sol/ExamVaultAudit.json");

let contract = null;

function getContract() {
  if (!contract) {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      contractABI.abi,
      wallet
    );
  }
  return contract;
}

async function recordAccess(userPseudo, paperHash, action = "ACCESS") {
  try {
    const c = getContract();
    const tx = await c.recordAccess(userPseudo, paperHash, action);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Blockchain Service Error:", error.message);
    throw error;
  }
}

module.exports = {
  recordAccess
};
