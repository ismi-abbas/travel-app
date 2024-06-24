import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import supabase from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { AiFillStar } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { PlaceCard } from "../components/placeCard";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <Fragment>
      <Hero />
      <Places />
    </Fragment>
  );
}

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    await navigate({
      to: "/catalog",
      search: { place: searchQuery },
    });
  };

  return (
    <div className="py-10">
      <div className="w-full h-[500px] rounded-md bg-[url('https://images.pexels.com/photos/450441/pexels-photo-450441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover">
        <div className="w-full md:4/5 lg:w-1/2 2xl:w-1/3 bg-gradient-to-r from-gray-600 h-full flex flex-col justify-center space-y-5 p-5 text-white rounded-md">
          <h1 className="text-4xl md:text-5xl font-bold">Explore the best holiday location!</h1>
          <p className="text-sm md:text-base">
            Embark on an extraordinary journey with our exclusive travel tours, meticulously crafted to indulge your
            wanderlust and create unforgettable experiences. Our tours promise a seamless blend of adventure, culture,
            and relaxation, curated to suit every traveler&apos;s desires.
          </p>
          <form className="flex items-center justify-between border" onSubmit={handleSearch}>
            <input
              className="px-5 py-2 bg-white text-gray-500 outline-0 w-full"
              type="text"
              placeholder="search place"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <span className="bg-orange-500 font-bold px-5 py-2 outline-0">
              <Link to="/catalog/search" search={{ place: searchQuery }} type="button">
                Search
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

async function fetchPlaces() {
  const { data, error } = await supabase.from("places").select();

  if (error) throw new Error("Server Error");

  const pahang = data.filter((data) => data.state.toLowerCase() === "pahang").slice(0, 8);
  const terengganu = data.filter((data) => data.state.toLowerCase() === "terengganu").slice(0, 8);
  const kelantan = data.filter((data) => data.state.toLowerCase() === "kelantan").slice(0, 8);

  return {
    kelantan: kelantan,
    pahang: pahang,
    terengganu: terengganu,
  };
}

export const useGetPlaces = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["get-places"],
    queryFn: fetchPlaces,
    gcTime: Infinity,
    staleTime: Infinity,
  });

  return {
    data,
    isError,
    isLoading,
  };
};

const Places = () => {
  const { data, isError } = useGetPlaces();

  return (
    <div className="py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Popular Places</h1>
        <Link
          to="/catalog"
          className="px-5 py-2 rounded border bg-white border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
        >
          View All
        </Link>
      </div>
      {isError ? (
        <div className="flex flex-1 justify-center">
          <h2 className="text-xl">Server Error</h2>
        </div>
      ) : (
        data &&
        Object.keys(data).map((state) => (
          <div key={state} className="mb-10">
            <h2 className="text-2xl font-semibold capitalize mb-4">{state}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data[state].length > 0 ? (
                data[state].map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))
              ) : (
                <div className="places flex flex-col items-center">
                  <p className="text-center">No Places Found</p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
