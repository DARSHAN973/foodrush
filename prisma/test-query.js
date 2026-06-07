require("dotenv/config");

const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      cuisine: true,
      rating: true,
      menuItems: {
        select: {
          id: true,
          name: true,
          price: true,
          isAvailable:true
        },
      },
    },
  });

  console.log(JSON.stringify(restaurants, null, 2));
}

async function run() {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
