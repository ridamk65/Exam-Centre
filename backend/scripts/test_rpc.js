const { ethers } = require("ethers");
async function main() {
    try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const block = await provider.getBlockNumber();
        console.log("Current block:", block);
    } catch (err) {
        console.error("RPC Error:", err);
    }
}
main();
