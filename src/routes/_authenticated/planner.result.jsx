import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import supabase from "../../lib/supabase";
import { PlaceCardHorizontal } from "../../components/placeCard";
import { calculateDistance, extractPriceRange } from "../../lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/planner/result")({
  component: RecommenderResult,
});

const getAllPlaces = async ({ state, origin }) => {
  let { data, error } = await supabase.from("places").select().order("name", { ascending: true });

  if (error) {
    throw error;
  }

  for (const place of data) {
    const distance = calculateDistance(
      origin.lat,
      origin.long,
      parseFloat(place.latitude),
      parseFloat(place.longitude),
    );

    const priceRange = place.price_range && extractPriceRange(place.price_range, place.id);
    place.distance = isNaN(distance) ? 0 : distance;
    place.lowestPrice = priceRange?.high || 0;
    place.highestPrice = priceRange?.low || 0;
  }

  if (state) {
    data = data.filter((place) => place.state.toLowerCase() === state);
  }

  return data;
};

function RecommenderResult() {
  const criteria = Route.useSearch();

  // eslint-disable-next-line no-unused-vars
  const [_origin, _setOrigin] = useState({
    lat: criteria.placeCoordinates.lat,
    long: criteria.placeCoordinates.lat,
  });

  const {
    data: allPlaceData,
    error: getPlaceError,
    isError: getPlaceIsError,
  } = useQuery({
    queryKey: ["places", criteria],
    queryFn: () =>
      getAllPlaces({
        state: criteria.state,
        origin: {
          lat: criteria.placeCoordinates.lat,
          long: criteria.placeCoordinates.long,
        },
        isTopResult: criteria.isTopResult,
      }),
  });

  if (allPlaceData) {
    var filtered = allPlaceData;
    if (criteria.rating) {
      filtered = allPlaceData.filter((place) => place.rating <= criteria.rating);
    }

    if (criteria.priceRange) {
      filtered = filtered.filter((place) => {
        const lowestPrice = place.lowestPrice; // assuming lowestPrice is a string like "MYR 24"
        const highestPrice = place.highestPrice; // assuming highestPrice is a string like "MYR 188"

        const minPrice = criteria.priceRange[0];
        const maxPrice = criteria.priceRange[1];

        // Check if the place's price range overlaps with the criteria
        return lowestPrice <= maxPrice && highestPrice >= minPrice;
      });
    }

    if (criteria.categories.length > 0) {
      filtered = filtered.filter((place) => {
        const categories = place.subcategory;
        const matches = criteria.categories.filter((category) => categories.includes(category));
        place.matchedCategories = matches.length; // Optional: count of matched categories
        return matches.length > 0; // Return places that have at least one matching category
      });
    }

    if (criteria.distance[0]) {
      if (criteria.distance[0] === 0) {
        return;
      }
      console.log(criteria.distance[0]);
      filtered = filtered.filter((place) => {
        return place.distance <= criteria.distance[0];
      });
    }

    if (criteria.isTopResult) {
      filtered = allPlaceData.slice(0, 1);
    }
  }

  return (
    <div className="mt-4 mb-10">
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-2xl">Recommended Trips</h1>
        {getPlaceIsError && <div>500 Server Error {getPlaceError}</div>}
        <p>
          Here are some places that we recommend based on your preferences.
          <span>
            <Link to="/planner" className="underline underline-offset-1 ml-2 decoration-orange-500 text-orange-500">
              Clear
            </Link>
          </span>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-4">
        {filtered &&
          filtered.map((place) => (
            <PlaceCardHorizontal key={place.id} place={place} selectedDistrict={criteria.district} />
          ))}
      </div>
    </div>
  );
}
