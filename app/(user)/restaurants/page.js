import RestaurantsClient from "@/components/RestaurantsClient";

async function getRestaurants() {
  const res = await fetch("https://dummyjson.com/recipes");

  if (!res.ok){
    throw new Error("Failed to fetch restaurants");
  }

  const data = await res.json();
  return data.recipes;
  
}

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return <RestaurantsClient restaurants={restaurants} />;
  
}