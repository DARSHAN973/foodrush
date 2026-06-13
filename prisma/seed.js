require("dotenv/config");

const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding restaurants and menu items...");

  const restaurants = [
    // 1
    {
      name: "Spice Garden",
      cuisine: "North Indian",
      rating: 4.5,
      deliveryTime: 35,
      imageUrl:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Butter Chicken",
            description: "Creamy tomato-based curry with tender chicken",
            price: 320,
            category: "Main Course",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop",
          },
          {
            name: "Dal Makhani",
            description: "Slow-cooked black lentils in butter and cream",
            price: 220,
            category: "Main Course",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop",
          },
          {
            name: "Garlic Naan",
            description: "Soft leavened bread with garlic and butter",
            price: 60,
            category: "Breads",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop",
          },
          {
            name: "Paneer Tikka",
            description: "Grilled cottage cheese with spiced marinade",
            price: 280,
            category: "Starters",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop",
          },
          {
            name: "Chicken Biryani",
            description: "Fragrant basmati rice cooked with spiced chicken",
            price: 380,
            category: "Rice",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop",
          },
          {
            name: "Mango Lassi",
            description: "Chilled yogurt drink blended with fresh mango",
            price: 120,
            category: "Beverages",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 2
    {
      name: "Pizza Republic",
      cuisine: "Italian",
      rating: 4.3,
      deliveryTime: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Margherita Pizza",
            description: "Classic pizza with tomato sauce, mozzarella, basil",
            price: 299,
            category: "Pizza",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop",
          },
          {
            name: "Pepperoni Pizza",
            description: "Loaded with pepperoni and mozzarella",
            price: 399,
            category: "Pizza",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop",
          },
          {
            name: "Pasta Arrabiata",
            description: "Penne in spicy tomato sauce with garlic",
            price: 249,
            category: "Pasta",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&auto=format&fit=crop",
          },
          {
            name: "Caesar Salad",
            description: "Romaine lettuce, croutons, parmesan, Caesar dressing",
            price: 199,
            category: "Salads",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop",
          },
          {
            name: "Garlic Bread",
            description: "Toasted bread with garlic butter and herbs",
            price: 129,
            category: "Sides",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1619531040576-f9416740661d?w=600&auto=format&fit=crop",
          },
          {
            name: "Tiramisu",
            description: "Classic Italian dessert with espresso and mascarpone",
            price: 179,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 3
    {
      name: "Dragon Wok",
      cuisine: "Chinese",
      rating: 4.1,
      deliveryTime: 25,
      imageUrl:
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Kung Pao Chicken",
            description: "Spicy stir-fried chicken with peanuts and chillies",
            price: 340,
            category: "Main Course",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&auto=format&fit=crop",
          },
          {
            name: "Veg Fried Rice",
            description: "Wok-tossed rice with fresh vegetables and soy",
            price: 220,
            category: "Rice",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop",
          },
          {
            name: "Hakka Noodles",
            description: "Stir-fried noodles with vegetables and sauces",
            price: 210,
            category: "Noodles",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&auto=format&fit=crop",
          },
          {
            name: "Spring Rolls",
            description: "Crispy rolls stuffed with vegetables",
            price: 160,
            category: "Starters",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1548811591-e280b3b7c72c?w=600&auto=format&fit=crop",
          },
          {
            name: "Chicken Manchurian",
            description: "Fried chicken balls in tangy Manchurian sauce",
            price: 310,
            category: "Starters",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 4
    {
      name: "The Burger Lab",
      cuisine: "American",
      rating: 4.4,
      deliveryTime: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Classic Smash Burger",
            description: "Double smash patty, cheddar, pickles, special sauce",
            price: 349,
            category: "Burgers",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
          },
          {
            name: "Crispy Chicken Burger",
            description: "Fried chicken thigh with slaw and sriracha mayo",
            price: 319,
            category: "Burgers",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&auto=format&fit=crop",
          },
          {
            name: "Veggie Burger",
            description: "Black bean patty with avocado and fresh vegetables",
            price: 279,
            category: "Burgers",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&auto=format&fit=crop",
          },
          {
            name: "Loaded Fries",
            description: "Crispy fries topped with cheese sauce and jalapeños",
            price: 179,
            category: "Sides",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop",
          },
          {
            name: "Chocolate Milkshake",
            description: "Thick creamy shake with premium chocolate ice cream",
            price: 199,
            category: "Beverages",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop",
          },
          {
            name: "Onion Rings",
            description: "Beer-battered crispy onion rings",
            price: 139,
            category: "Sides",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 5
    {
      name: "Sushi Sakura",
      cuisine: "Japanese",
      rating: 4.7,
      deliveryTime: 40,
      imageUrl:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Salmon Nigiri",
            description: "Fresh salmon over hand-pressed sushi rice",
            price: 420,
            category: "Sushi",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&auto=format&fit=crop",
          },
          {
            name: "Dragon Roll",
            description: "Shrimp tempura roll topped with avocado",
            price: 480,
            category: "Rolls",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1617196034099-2bf2b2c1e57a?w=600&auto=format&fit=crop",
          },
          {
            name: "Veggie Maki",
            description: "Cucumber, avocado and carrot rolled in nori",
            price: 300,
            category: "Rolls",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&auto=format&fit=crop",
          },
          {
            name: "Miso Soup",
            description: "Traditional Japanese soup with tofu and wakame",
            price: 120,
            category: "Soups",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop",
          },
          {
            name: "Edamame",
            description: "Steamed salted young soybeans",
            price: 150,
            category: "Starters",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1571167366136-b57e07b7f82e?w=600&auto=format&fit=crop",
          },
          {
            name: "Matcha Ice Cream",
            description: "Creamy Japanese green tea ice cream",
            price: 180,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 6
    {
      name: "Taco Fiesta",
      cuisine: "Mexican",
      rating: 4.2,
      deliveryTime: 25,
      imageUrl:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Beef Tacos",
            description: "Seasoned ground beef in corn tortillas with salsa",
            price: 280,
            category: "Tacos",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop",
          },
          {
            name: "Chicken Burrito",
            description: "Grilled chicken, rice, beans and cheese wrapped up",
            price: 320,
            category: "Burritos",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600&auto=format&fit=crop",
          },
          {
            name: "Veggie Quesadilla",
            description: "Grilled tortilla with cheese and roasted vegetables",
            price: 240,
            category: "Quesadillas",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=600&auto=format&fit=crop",
          },
          {
            name: "Guacamole & Chips",
            description: "Fresh homemade guacamole with tortilla chips",
            price: 180,
            category: "Starters",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&auto=format&fit=crop",
          },
          {
            name: "Nachos Supreme",
            description: "Tortilla chips with cheese, jalapeños, sour cream",
            price: 220,
            category: "Starters",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop",
          },
          {
            name: "Churros",
            description: "Fried dough pastry with cinnamon sugar and dip",
            price: 160,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1624372637855-cd03d3b7f2b8?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 7
    {
      name: "Mumbai Street Eats",
      cuisine: "Street Food",
      rating: 4.6,
      deliveryTime: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Vada Pav",
            description: "Spiced potato fritter in a bun with chutneys",
            price: 60,
            category: "Snacks",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop",
          },
          {
            name: "Pav Bhaji",
            description: "Spiced mashed vegetable curry with buttery buns",
            price: 140,
            category: "Main Course",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop",
          },
          {
            name: "Bhel Puri",
            description: "Puffed rice with tangy tamarind chutney and veggies",
            price: 80,
            category: "Snacks",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop",
          },
          {
            name: "Sev Puri",
            description: "Crispy puris topped with potatoes and chutneys",
            price: 90,
            category: "Snacks",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop",
          },
          {
            name: "Misal Pav",
            description: "Spicy sprouted lentil curry served with bread",
            price: 120,
            category: "Main Course",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 8
    {
      name: "The Kebab House",
      cuisine: "Middle Eastern",
      rating: 4.3,
      deliveryTime: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Seekh Kebab",
            description: "Minced lamb kebabs grilled on skewers",
            price: 360,
            category: "Kebabs",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop",
          },
          {
            name: "Shawarma Wrap",
            description: "Chicken shawarma with garlic sauce in flatbread",
            price: 280,
            category: "Wraps",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&auto=format&fit=crop",
          },
          {
            name: "Falafel Plate",
            description: "Crispy chickpea fritters with hummus and pita",
            price: 240,
            category: "Vegetarian",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1593001874117-c99c800e3c27?w=600&auto=format&fit=crop",
          },
          {
            name: "Hummus",
            description: "Creamy chickpea dip with olive oil and pita",
            price: 160,
            category: "Starters",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1571197119669-9f24ef643d5a?w=600&auto=format&fit=crop",
          },
          {
            name: "Lamb Kofta",
            description: "Spiced lamb meatballs in tomato sauce",
            price: 380,
            category: "Main Course",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&auto=format&fit=crop",
          },
          {
            name: "Baklava",
            description: "Layered pastry with nuts and honey syrup",
            price: 140,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 9
    {
      name: "South Indian Tadka",
      cuisine: "South Indian",
      rating: 4.5,
      deliveryTime: 25,
      imageUrl:
        "https://images.unsplash.com/photo-1630409351241-e90e7f5e791a?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Masala Dosa",
            description: "Crispy rice crepe with spiced potato filling",
            price: 130,
            category: "Dosas",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1630409351241-e90e7f5e791a?w=600&auto=format&fit=crop",
          },
          {
            name: "Idli Sambar",
            description: "Steamed rice cakes with lentil soup and chutney",
            price: 100,
            category: "Breakfast",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop",
          },
          {
            name: "Uttapam",
            description: "Thick rice pancake topped with vegetables",
            price: 120,
            category: "Dosas",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1630409351241-e90e7f5e791a?w=600&auto=format&fit=crop",
          },
          {
            name: "Chettinad Chicken Curry",
            description: "Fiery South Indian chicken curry with whole spices",
            price: 340,
            category: "Main Course",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop",
          },
          {
            name: "Rava Kesari",
            description: "Semolina dessert with saffron and dry fruits",
            price: 90,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1548340748-6ca51f437ca7?w=600&auto=format&fit=crop",
          },
          {
            name: "Filter Coffee",
            description: "Strong South Indian decoction with frothy milk",
            price: 70,
            category: "Beverages",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 10
    {
      name: "Bangkok Bites",
      cuisine: "Thai",
      rating: 4.4,
      deliveryTime: 35,
      imageUrl:
        "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Pad Thai",
            description: "Stir-fried rice noodles with egg, peanuts, lime",
            price: 300,
            category: "Noodles",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&auto=format&fit=crop",
          },
          {
            name: "Green Curry",
            description: "Creamy coconut milk curry with Thai basil",
            price: 320,
            category: "Curries",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&auto=format&fit=crop",
          },
          {
            name: "Tom Yum Soup",
            description: "Hot and sour Thai soup with lemongrass",
            price: 220,
            category: "Soups",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop",
          },
          {
            name: "Mango Sticky Rice",
            description: "Sweet glutinous rice with fresh mango and coconut",
            price: 180,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=600&auto=format&fit=crop",
          },
          {
            name: "Thai Fish Cakes",
            description: "Fried fish cakes with sweet chilli dipping sauce",
            price: 260,
            category: "Starters",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop",
          },
          {
            name: "Jasmine Rice",
            description: "Steamed fragrant Thai jasmine rice",
            price: 80,
            category: "Sides",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 11
    {
      name: "Seoul Kitchen",
      cuisine: "Korean",
      rating: 4.5,
      deliveryTime: 40,
      imageUrl:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Bibimbap",
            description: "Rice bowl with vegetables, egg, and gochujang",
            price: 340,
            category: "Rice Bowls",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600&auto=format&fit=crop",
          },
          {
            name: "Korean Fried Chicken",
            description: "Double-fried crispy chicken with gochujang glaze",
            price: 420,
            category: "Chicken",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&auto=format&fit=crop",
          },
          {
            name: "Kimchi Jjigae",
            description: "Hearty kimchi stew with tofu and pork",
            price: 300,
            category: "Stews",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop",
          },
          {
            name: "Japchae",
            description: "Glass noodles stir-fried with vegetables and soy",
            price: 280,
            category: "Noodles",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&auto=format&fit=crop",
          },
          {
            name: "Tteokbokki",
            description: "Spicy rice cakes in gochujang sauce",
            price: 220,
            category: "Snacks",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 12
    {
      name: "Café Parisien",
      cuisine: "French",
      rating: 4.6,
      deliveryTime: 45,
      imageUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Croque Monsieur",
            description: "Ham and gruyere toasted sandwich with béchamel",
            price: 320,
            category: "Sandwiches",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&auto=format&fit=crop",
          },
          {
            name: "French Onion Soup",
            description: "Rich caramelised onion soup with gruyere crouton",
            price: 260,
            category: "Soups",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop",
          },
          {
            name: "Croissant",
            description: "Buttery flaky pastry, freshly baked",
            price: 120,
            category: "Bakery",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop",
          },
          {
            name: "Crème Brûlée",
            description: "Classic vanilla custard with caramelised sugar top",
            price: 240,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop",
          },
          {
            name: "Quiche Lorraine",
            description: "Savoury tart with bacon, eggs and cream",
            price: 280,
            category: "Mains",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=600&auto=format&fit=crop",
          },
          {
            name: "Café au Lait",
            description: "Strong French coffee with steamed milk",
            price: 140,
            category: "Beverages",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 13
    {
      name: "Biryani Bros",
      cuisine: "Hyderabadi",
      rating: 4.7,
      deliveryTime: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Hyderabadi Dum Biryani",
            description: "Slow-cooked aromatic rice with tender mutton",
            price: 420,
            category: "Biryani",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop",
          },
          {
            name: "Veg Biryani",
            description:
              "Fragrant basmati rice with mixed vegetables and saffron",
            price: 280,
            category: "Biryani",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1645177628172-a94c1f96debb?w=600&auto=format&fit=crop",
          },
          {
            name: "Raita",
            description: "Chilled yogurt with cucumber and spices",
            price: 60,
            category: "Sides",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop",
          },
          {
            name: "Mirchi Ka Salan",
            description: "Tangy peanut-based chilli curry served with biryani",
            price: 90,
            category: "Sides",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=600&auto=format&fit=crop",
          },
          {
            name: "Double Ka Meetha",
            description: "Hyderabadi bread pudding with nuts and saffron",
            price: 130,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1548340748-6ca51f437ca7?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 14
    {
      name: "Mediterranean Mezze",
      cuisine: "Mediterranean",
      rating: 4.3,
      deliveryTime: 35,
      imageUrl:
        "https://images.unsplash.com/photo-1534766438357-2b270dbd1b40?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Grilled Sea Bass",
            description: "Whole sea bass with lemon, herbs and olive oil",
            price: 560,
            category: "Seafood",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop",
          },
          {
            name: "Greek Salad",
            description: "Tomato, cucumber, olives, feta with oregano dressing",
            price: 220,
            category: "Salads",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop",
          },
          {
            name: "Mezze Platter",
            description: "Hummus, baba ghanoush, falafel, pita, olives",
            price: 380,
            category: "Platters",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1534766438357-2b270dbd1b40?w=600&auto=format&fit=crop",
          },
          {
            name: "Lamb Souvlaki",
            description: "Grilled lamb skewers with tzatziki and pita",
            price: 420,
            category: "Grills",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop",
          },
          {
            name: "Spanakopita",
            description: "Spinach and feta filled filo pastry triangles",
            price: 200,
            category: "Pastries",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=600&auto=format&fit=crop",
          },
          {
            name: "Baklava",
            description: "Flaky phyllo with pistachios and rose water syrup",
            price: 160,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 15
    {
      name: "Wrap & Roll",
      cuisine: "Fusion",
      rating: 4.0,
      deliveryTime: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Paneer Tikka Wrap",
            description:
              "Grilled paneer with mint chutney in a whole wheat wrap",
            price: 200,
            category: "Wraps",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop",
          },
          {
            name: "Chicken Caesar Wrap",
            description:
              "Grilled chicken with Caesar dressing in a flour tortilla",
            price: 240,
            category: "Wraps",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop",
          },
          {
            name: "Falafel Wrap",
            description: "Crispy falafel with tahini and pickled vegetables",
            price: 180,
            category: "Wraps",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1593001874117-c99c800e3c27?w=600&auto=format&fit=crop",
          },
          {
            name: "Korean BBQ Wrap",
            description: "Bulgogi beef with kimchi and sesame in a wrap",
            price: 280,
            category: "Wraps",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&auto=format&fit=crop",
          },
          {
            name: "Smoothie Bowl",
            description: "Acai base with banana, granola and fresh berries",
            price: 220,
            category: "Bowls",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 16
    {
      name: "Punjabi Rasoi",
      cuisine: "Punjabi",
      rating: 4.4,
      deliveryTime: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Sarson Ka Saag",
            description: "Mustard greens cooked with spices and makki roti",
            price: 200,
            category: "Main Course",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop",
          },
          {
            name: "Amritsari Kulcha",
            description: "Stuffed bread baked in tandoor with chole",
            price: 160,
            category: "Breads",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop",
          },
          {
            name: "Butter Chicken",
            description: "Classic Punjabi butter chicken with rich gravy",
            price: 340,
            category: "Main Course",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop",
          },
          {
            name: "Lassi",
            description: "Thick sweet or salted yogurt drink",
            price: 80,
            category: "Beverages",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop",
          },
          {
            name: "Pinni",
            description: "Traditional Punjabi wheat flour sweet with ghee",
            price: 100,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1548340748-6ca51f437ca7?w=600&auto=format&fit=crop",
          },
          {
            name: "Tandoori Chicken",
            description: "Whole chicken marinated and cooked in tandoor oven",
            price: 450,
            category: "Starters",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 17
    {
      name: "The Waffle House",
      cuisine: "Desserts & Cafe",
      rating: 4.5,
      deliveryTime: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Classic Belgian Waffle",
            description: "Light crispy waffle with maple syrup and butter",
            price: 220,
            category: "Waffles",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop",
          },
          {
            name: "Nutella Banana Waffle",
            description: "Waffle topped with Nutella, banana slices and cream",
            price: 280,
            category: "Waffles",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&auto=format&fit=crop",
          },
          {
            name: "Pancake Stack",
            description: "Fluffy pancakes stacked high with berry compote",
            price: 240,
            category: "Pancakes",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop",
          },
          {
            name: "Hot Chocolate",
            description: "Thick rich hot chocolate topped with marshmallows",
            price: 160,
            category: "Beverages",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop",
          },
          {
            name: "French Toast",
            description: "Brioche dipped in custard, pan-fried, with jam",
            price: 200,
            category: "Breakfast",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&auto=format&fit=crop",
          },
          {
            name: "Affogato",
            description: "Vanilla gelato drowned in a shot of hot espresso",
            price: 180,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 18
    {
      name: "Goan Shack",
      cuisine: "Goan",
      rating: 4.4,
      deliveryTime: 35,
      imageUrl:
        "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Goan Fish Curry",
            description: "Fresh pomfret in tangy coconut-based curry",
            price: 380,
            category: "Curries",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&auto=format&fit=crop",
          },
          {
            name: "Prawn Balchão",
            description: "Fiery prawns in vinegar-based masala",
            price: 420,
            category: "Seafood",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop",
          },
          {
            name: "Chicken Xacuti",
            description: "Goan chicken curry with roasted spices and coconut",
            price: 360,
            category: "Curries",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop",
          },
          {
            name: "Veg Caldine",
            description: "Mild coconut milk curry with seasonal vegetables",
            price: 220,
            category: "Curries",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&auto=format&fit=crop",
          },
          {
            name: "Bebinca",
            description: "Traditional Goan layered coconut dessert",
            price: 140,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1548340748-6ca51f437ca7?w=600&auto=format&fit=crop",
          },
          {
            name: "Sol Kadhi",
            description: "Pink coconut and kokum drink, digestive and cooling",
            price: 90,
            category: "Beverages",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 19
    {
      name: "The Salad Bar",
      cuisine: "Healthy & Salads",
      rating: 4.2,
      deliveryTime: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Quinoa Buddha Bowl",
            description:
              "Quinoa, roasted chickpeas, greens and tahini dressing",
            price: 280,
            category: "Bowls",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=600&auto=format&fit=crop",
          },
          {
            name: "Grilled Chicken Salad",
            description: "Mixed greens with grilled chicken, avocado and lemon",
            price: 320,
            category: "Salads",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop",
          },
          {
            name: "Watermelon Feta Salad",
            description: "Juicy watermelon with feta cheese and fresh mint",
            price: 220,
            category: "Salads",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&auto=format&fit=crop",
          },
          {
            name: "Acai Bowl",
            description: "Acai blended with banana and topped with granola",
            price: 260,
            category: "Bowls",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&auto=format&fit=crop",
          },
          {
            name: "Green Detox Juice",
            description: "Spinach, cucumber, celery, ginger, lemon",
            price: 180,
            category: "Beverages",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&auto=format&fit=crop",
          },
          {
            name: "Avocado Toast",
            description:
              "Multigrain toast with smashed avocado and poached egg",
            price: 240,
            category: "Breakfast",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 20
    {
      name: "Rajasthani Haveli",
      cuisine: "Rajasthani",
      rating: 4.6,
      deliveryTime: 40,
      imageUrl:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Dal Baati Churma",
            description: "Baked wheat balls with lentil curry and sweet churma",
            price: 260,
            category: "Main Course",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop",
          },
          {
            name: "Laal Maas",
            description: "Fiery Rajasthani mutton curry with mathania chillies",
            price: 420,
            category: "Main Course",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop",
          },
          {
            name: "Gatte Ki Sabzi",
            description: "Gram flour dumplings in tangy yogurt gravy",
            price: 200,
            category: "Main Course",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=600&auto=format&fit=crop",
          },
          {
            name: "Bajra Roti",
            description: "Pearl millet flatbread served with ghee",
            price: 40,
            category: "Breads",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop",
          },
          {
            name: "Ghewar",
            description: "Traditional disc-shaped sweet with rabri and nuts",
            price: 120,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1548340748-6ca51f437ca7?w=600&auto=format&fit=crop",
          },
          {
            name: "Thandai",
            description: "Chilled milk drink with almonds, rose and spices",
            price: 100,
            category: "Beverages",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
    // 21
    {
      name: "Pasta Palace",
      cuisine: "Italian",
      rating: 4.2,
      deliveryTime: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop",
      isActive: true,
      menuItems: {
        create: [
          {
            name: "Spaghetti Carbonara",
            description: "Spaghetti with egg, pancetta, parmesan and pepper",
            price: 360,
            category: "Pasta",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop",
          },
          {
            name: "Penne Pesto",
            description: "Penne pasta in fresh basil pesto with pine nuts",
            price: 300,
            category: "Pasta",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&auto=format&fit=crop",
          },
          {
            name: "Lasagne al Forno",
            description: "Layered beef lasagne with béchamel and tomato sauce",
            price: 380,
            category: "Pasta",
            isVeg: false,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&auto=format&fit=crop",
          },
          {
            name: "Bruschetta",
            description:
              "Toasted bread with tomato, basil, garlic and olive oil",
            price: 160,
            category: "Starters",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&auto=format&fit=crop",
          },
          {
            name: "Panna Cotta",
            description: "Set cream dessert with fresh berry coulis",
            price: 200,
            category: "Desserts",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop",
          },
          {
            name: "Sparkling Lemonade",
            description: "Freshly squeezed lemon with sparkling water and mint",
            price: 120,
            category: "Beverages",
            isVeg: true,
            isAvailable: true,
            imageUrl:
              "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&auto=format&fit=crop",
          },
        ],
      },
    },
  ];

  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  for (const restaurant of restaurants) {
    await prisma.restaurant.create({ data: restaurant });
  }

  console.log(
    `✅ Seeded ${restaurants.length} restaurants with menu items successfully!`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
