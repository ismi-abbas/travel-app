import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import places from "./data.json";
import { placeSchema, type NewPlace } from "./schema.js";

const connectionString = process.env.DATABASE_URL!;
console.log(connectionString);
const client = postgres(connectionString);
const db = drizzle(client);

if (!places) {
  console.error("No data found");
  process.exit(1);
}

const insertUser = async (user: NewPlace) => {
  return db.insert(placeSchema).values(user);
};

const migrate = async () => {
  try {
    for (const place of places) {
      let count;
      if (place.priceLevel) {
        count = place.priceLevel !== null ? place.priceLevel.split("$").length - 1 : 0;
      }

      insertUser({
        address: place.address,
        addressStreet_1: place.addressObj.street1,
        addressStreet_2: place.addressObj.city,
        city: place.addressObj.city,
        state: place.addressObj.state,
        postalCode: place.addressObj.postalcode,
        type: place.type,
        name: place.name,
        description: place.description,
        image: place.image,
        category: place.category,
        subcategory: place.subcategories,
        rating: place.rating,
        phone: place.phone,
        email: place.email,
        latitude: place.latitude?.toString(),
        longitude: place.longitude?.toString(),
        numberOfReviews: place.numberOfReviews.toString(),
        priceRange: place.priceRange,
        priceLevel: count,
        hotelClass: place.hotelClass,
      });
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.log("migration done");
};

migrate();
