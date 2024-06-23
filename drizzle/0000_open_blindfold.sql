CREATE TABLE IF NOT EXISTS "places" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text,
	"name" text,
	"description" text,
	"image" text,
	"category" text,
	"subcategory" text[],
	"address" text,
	"address_street_1" text,
	"address_street_2" text,
	"city" text,
	"state" text,
	"postal_code" text,
	"rating" real,
	"phone" text,
	"email" text,
	"latitude" text,
	"longitude" text,
	"number_of_reviews" text,
	"price_range" text,
	"price_level" integer,
	"hotel_class" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now()
);
