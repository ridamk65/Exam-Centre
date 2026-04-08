const { PrismaClient } = require("./src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'halls'`;
    console.log(res.map(c => c.column_name).join(", "));
  } catch (err) {
    console.error("Query failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
