import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import supabase from "../../lib/supabase";
import { PlaceCardHorizontal } from "../../components/placeCard";
import { calculateDistance } from "../../lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/planner/result")({
  component: RecommenderResult,
});

function RecommenderResult() {
  const criteria = Route.useSearch();
  console.log(criteria);
  const [origin, setOrigin] = useState({
    lat: 0,
    long: 0,
  });

  let rating = [];
  if (criteria.rating === "low") {
    rating = [0.0, 2.9];
  } else if (criteria.rating === "high") {
    rating = [3.0, 3.9];
  } else {
    rating = [4.0, 5];
  }

  const { data, error, isError } = useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      const { data, error } = await supabase.from("places").select();

      if (error) {
        throw error;
      }

      console.log(data);

      return data;
    },
  });

  return (
    <div className="mt-4">
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-2xl">Recommended Trips</h1>
        {isError && <div>500 Server Error {error}</div>}
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
        {data && data.map((place) => <PlaceCardHorizontal key={place.id} place={place} />)}
      </div>
    </div>
  );
}
