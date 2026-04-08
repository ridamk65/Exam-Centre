const { PrismaClient } = require("./src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  try {
    const students = await prisma.student.count();
    console.log("Database connection successful. Students count:", students);
  } catch (err) {
    console.error("Database connection failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
