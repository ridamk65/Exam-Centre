
import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const studentsCount = await prisma.student.count();
  const hallsCount = await prisma.hall.count();
  console.log(`Current Students: ${studentsCount}`);
  console.log(`Current Halls: ${hallsCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
