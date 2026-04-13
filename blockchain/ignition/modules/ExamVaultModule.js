import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ExamVaultModule", (m) => {
  const audit = m.contract("ExamVaultAudit", []);

  return { audit };
});
