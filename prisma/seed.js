require("dotenv/config");

const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const restaurants = [
    {
      name: "Pizza Palace",
      cuisine: "Italian",
      rating: 4.5,
      deliveryTime: 25,
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
      menuItems: [
        {
          name: "Margherita Pizza",
          description: "Classic cheese pizza with tomato sauce",
          imageUrl:
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
          price: 249,
          category: "Pizza",
          isVeg: true,
        },
        {
          name: "Farmhouse Pizza",
          description: "Loaded pizza with capsicum, onion, tomato, and corn",
          imageUrl:
            "https://images.unsplash.com/photo-1594007654729-407eedc4be65",
          price: 349,
          category: "Pizza",
          isVeg: true,
        },
        {
          name: "Garlic Bread",
          description: "Toasted bread with garlic butter and herbs",
          imageUrl:
            "https://images.unsplash.com/photo-1619531040576-f9416740661f",
          price: 149,
          category: "Sides",
          isVeg: true,
        },
      ],
    },
    {
      name: "Burger Barn",
      cuisine: "American",
      rating: 4.3,
      deliveryTime: 30,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      menuItems: [
        {
          name: "Classic Veg Burger",
          description: "Crispy veg patty with lettuce, cheese, and house sauce",
          imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349",
          price: 179,
          category: "Burger",
          isVeg: true,
        },
        {
          name: "Chicken Cheese Burger",
          description: "Grilled chicken patty with cheese and smoky sauce",
          imageUrl:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
          price: 239,
          category: "Burger",
          isVeg: false,
        },
        {
          name: "Peri Peri Fries",
          description: "Crispy fries tossed in peri peri seasoning",
          imageUrl:
            "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",
          price: 129,
          category: "Sides",
          isVeg: true,
        },
      ],
    },
    {
      name: "Spice Bowl",
      cuisine: "Indian",
      rating: 4.6,
      deliveryTime: 35,
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
      menuItems: [
        {
          name: "Paneer Butter Masala",
          description: "Paneer cubes cooked in rich tomato butter gravy",
          imageUrl:
            "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
          price: 279,
          category: "Main Course",
          isVeg: true,
        },
        {
          name: "Chicken Biryani",
          description: "Fragrant basmati rice cooked with spiced chicken",
          imageUrl:
            "https://images.unsplash.com/photo-1563379091339-03246963d51a",
          price: 329,
          category: "Biryani",
          isVeg: false,
        },
        {
          name: "Butter Naan",
          description: "Soft naan brushed with butter",
          imageUrl:
            "https://images.unsplash.com/photo-1601050690597-df0568f70950",
          price: 69,
          category: "Bread",
          isVeg: true,
        },
      ],
    },
  ];
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];

    await prisma.restaurant.create({
      data: {
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        deliveryTime: restaurant.deliveryTime,
        imageUrl: restaurant.imageUrl,
        menuItems: {
          create: restaurant.menuItems,
        },
      },
    });
  }
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

