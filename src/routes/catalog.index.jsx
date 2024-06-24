import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import supabase from "../lib/supabase.js";
import LocationDropdown from "../components/locationDropdown.jsx";
import { cn } from "../lib/utils.js";
import { useState } from "react";
import { states } from "./_authenticated/planner.jsx";
import { PlaceCard } from "../components/placeCard.jsx";

export const catalogQueryOptions = (category) =>
  queryOptions({
    queryKey: ["get-all-places", category],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("places").select().order("name", { ascending: true });

        if (error) {
          throw new Error("Server Error");
        }
        return data;
      } catch (error) {
        throw new Error("Server Error");
      }
    },
    staleTime: 1000 * 60 * 5,
  });

export const Route = createFileRoute("/catalog/")({
  component: CatalogPage,
});

const categories = [
  {
    name: "Hotel",
    value: "hotel",
  },
  {
    name: "Restaurant & Cafe",
    value: "restaurant",
  },
  {
    name: "Landmarks",
    value: "landmarks",
  },
  {
    name: "Historical",
    value: "museums",
  },
  {
    name: "Things To Do",
    value: "ttd",
  },
];

function StatesDropdown() {
  const [openDropdowns, setOpenDropdowns] = useState(Array(states.length).fill(false));
  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) => {
      const newOpenDropdowns = [...prev];
      newOpenDropdowns[index] = !newOpenDropdowns[index];
      return newOpenDropdowns;
    });
  };
  return (
    <div className="flex justify-end items-center">
      <div className="">
        {states.map(({ name, value, district }, index) => (
          <div
            key={index}
            className="border px-4 py-1 relative hover:cursor-pointer hover:bg-orange-500 hover:text-white"
            onClick={() => toggleDropdown(index)}
          >
            {name}
            <span>
              <div
                className={cn("absolute bg-orange-500 text-white z-10", {
                  block: openDropdowns[index],
                  hidden: !openDropdowns[index],
                })}
                onClick={() => console.log(value)}
                key={index}
              >
                {district.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.name}
                  </option>
                ))}
              </div>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CatalogPage() {
  const { data, isError } = useQuery(catalogQueryOptions());
  const [filteredData, setFilteredData] = useState(data);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const filter = (category, location = null) => {
    setSelectedLocation(location);
    setIsFiltered(true);

    let filteredData = data;

    if (selectedLocation) {
      filteredData = filteredData.filter((place) => place.city === selectedLocation);
    }

    if (location) {
      filteredData = filteredData.filter((place) => place.city === location);
    }

    switch (category) {
      case "hotel":
      case "restaurant":
        filteredData = filteredData.filter((place) => place.type.toLowerCase() === category);
        break;
      case "cafe":
        filteredData = filteredData.filter((place) => place.type.toLowerCase() === "restaurant");
        break;
      case "museums":
        filteredData = filteredData.filter((place) => place.subcategory.includes("Museums"));
        break;
      case "ttd":
        filteredData = filteredData.filter((place) => place.type.toLowerCase() === "attraction");
        break;
      case "landmarks":
        filteredData = filteredData.filter((place) => place.subcategory.includes("Sights & Landmarks"));
        break;
      default:
        break;
    }

    setFilteredData(filteredData);
  };

  const resetFilters = () => {
    setIsFiltered(false);
    setFilteredData(data);
  };

  return (
    <div className="container pb-10">
      <div className="flex justify-start mt-4">
        <LocationDropdown locationList={states} filterLocation={(location) => filter(null, location)} />
      </div>
      <div className="flex w-full justify-between px-20 py-2 mt-4">
        {categories.map(({ name, value }, index) => (
          <button
            onClick={() => filter(value)}
            key={index}
            className="bg-white px-4 py-2 rounded-md outline outline-1 outline-orange-500 hover:bg-orange-500 hover:text-white"
          >
            {name}
          </button>
        ))}
        <button
          disabled={!isFiltered}
          className="bg-white px-4 py-2 rounded-md outline outline-1 outline-orange-500 hover:bg-orange-500 hover:text-white"
          onClick={resetFilters}
        >
          Reset filter
        </button>
      </div>
      <div className="flex flex-col justify-center items-center h-full mt-4">
        {isError ? (
          <div className="flex flex-1 justify-center">
            <h2 className="text-xl">Server Error</h2>
          </div>
        ) : isFiltered ? (
          <div className="grid grid-cols-4 gap-4">
            {filteredData.map((place) => (
              <PlaceCard place={place} key={place.id} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {data && data.map((place) => <PlaceCard place={place} key={place.id} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogPage;
