require("dotenv/config");

const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Pizza Palace",
      cuisine: "Italian",
      rating: 4.5,
      deliveryTime: 25,
      imageUrl: "https://example.com/pizza.jpg",
      menuItems: {
        create: [
          {
            name: "Margherita Pizza",
            description: "Classic cheese pizza with tomato sauce",
            price: 249,
            category: "Pizza",
            isVeg: true,
          },
        ],
      },
    },
  });
}

async function runSeed() {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

runSeed();
