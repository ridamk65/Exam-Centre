const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ExamVaultModule", (m) => {
  const audit = m.contract("ExamVaultAudit", []);

  return { audit };
});
