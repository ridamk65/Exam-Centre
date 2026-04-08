const { PrismaClient } = require("./src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'students'`;
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("Query failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
