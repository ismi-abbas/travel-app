import {
    integer,
    pgTable,
    real,
    serial,
    text,
    timestamp,
    uuid,
  } from "drizzle-orm/pg-core";
  
  export const placeSchema = pgTable("places", {
    id: serial("id").primaryKey(),
    type: text("type"),
    name: text("name"),
    description: text("description"),
    image: text("image"),
    category: text("category"),
    subcategory: text("subcategory").array(),
    address: text("address"),
    addressStreet_1: text("address_street_1"),
    addressStreet_2: text("address_street_2"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    rating: real("rating"),
    phone: text("phone"),
    email: text("email"),
    latitude: text("latitude"),
    longitude: text("longitude"),
    numberOfReviews: text("number_of_reviews"),
    priceRange: text("price_range"),
    priceLevel: integer("price_level"),
    hotelClass: text("hotel_class"),
  });
  
  export const roleSchema = pgTable("role", {
    id: serial("id").primaryKey(),
    role: text("name"),
    userId: uuid("user_id"),
    createdAt: timestamp("created_at").defaultNow(),
  });
  