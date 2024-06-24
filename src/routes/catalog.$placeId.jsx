import { createFileRoute, Link } from "@tanstack/react-router";
import supabase from "../lib/supabase";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

const getPlaceDetails = async (placeId) => {
  const { data, error } = await supabase.from("places").select("*").eq("id", placeId).single();

  if (error) throw new Error(error.message);
  return data;
};

export const placeDetailsQueryOptions = (placeId) =>
  queryOptions({
    queryKey: ["place-details", placeId],
    queryFn: async () => await getPlaceDetails(placeId),
  });

export const Route = createFileRoute("/catalog/$placeId")({
  component: DetailsComponent,
});

function DetailsComponent() {
  const placeId = Route.useParams().placeId;
  const { data, isError } = useSuspenseQuery(placeDetailsQueryOptions(placeId));

  return (
    <div className="container mb-10">
      <div className="flex flex-col">
        {isError ? (
          <div className="flex flex-1 justify-center">
            <h2 className="text-xl">Server Error</h2>
          </div>
        ) : (
          data && (
            <div className="flex flex-1 justify-center flex-col px-20 mt-10">
              <div className="flex items-start my-2">
                <button className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-white hover:ring-orange-500 hover:text-black hover:ring-1" onClick={() => window.history.back()}>
                  Back
                </button>
              </div>
              <div className="w-full h-[500px] rounded-lg">
                <img src={data.image} alt="image" className="w-full h-full object-cover rounded-lg" />
              </div>

              <div className="flex mt-4 flex-col items-start justify-center gap-4">
                <h3 className="text-xl font-medium">{data.name}</h3>
                <p className="text-justify text-lg">{data.description ?? "No Description"}</p>

                <div className="flex flex-col justify-start items-start">
                  <p>
                    Address: <span className="font-medium">{data.address}</span>
                  </p>
                  <p>
                    Rating: <span className="font-medium">{data.rating}</span>
                  </p>
                  <p>
                    Phone: <span className="font-medium">{data.phone}</span>
                  </p>
                  <p>
                    Reservation email: <span className="font-medium">{data.email}</span>
                  </p>
                  <p>
                    Reviews: <span className="font-medium">{data.number_of_reviews}</span>
                  </p>
                  <p>
                    Price Range: <span className="font-medium">{data.price_range}</span>
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
