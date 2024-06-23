import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AiFillStar } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { queryOptions, useQuery } from "@tanstack/react-query";
import supabase from "../lib/supabase.js";
import { states } from "./_authenticated/planner.index.jsx";
import LocationDropdown from "../components/locationDropdown.jsx";
import { cn } from "../lib/utils.js";
import { useState } from "react";

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

  const filterLocation = (location) => {
    setIsFiltered(true);
    const filteredData = data.filter((place) => place.city === location);
    setFilteredData(filteredData);
  };

  const filter = (category) => {
    setIsFiltered(true);
    if (category === "hotel" || category === "restaurant") {
      const filteredData = data.filter((place) => place.type.toLowerCase() === category);
      setFilteredData(filteredData);
    } else if (category === "cafe") {
      const filteredData = data.filter((place) => place.type.toLowerCase() === "restaurant");
      setFilteredData(filteredData);
    } else if (category === "museums") {
      const filteredData = data.filter((place) => place.subcategory.includes("Museums"));
      setFilteredData(filteredData);
    } else if (category === "ttd") {
      const filteredData = data.filter((place) => place.type.toLowerCase() === "attraction");
      setFilteredData(filteredData);
    } else if (category === "landmarks") {
      const filteredData = data.filter((place) => place.subcategory.includes("Sights & Landmarks"));
      setFilteredData(filteredData);
    }
  };

  return (
    <div className="container pb-10">
      <div className="flex justify-start mt-4">
        <LocationDropdown locationList={states} filterLocation={filterLocation} />
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
          onClick={() => setIsFiltered((current) => !current)}
        >
          Reset filter
        </button>
      </div>
      <div className="flex flex-col justify-center items-center h-full mt-4">
        {isError ? (
          <div className="flex flex-1 justify-center">
            <h2 className="text-xl">Server Error</h2>
          </div>
        ) : isFiltered === true ? (
          <div className="grid grid-cols-4 gap-4">
            {filteredData.map((place) => (
              <Link
                to="/catalog/$placeId"
                params={{ placeId: place.id }}
                key={place.id}
                className="place w-full bg-white border rounded-lg overflow-hidden hover:cursor-pointer hover:ring-2 hover:ring-orange-600"
              >
                <div className="h-[150px] md:h-[230px] overflow-hidden">
                  <img
                    src={place.image !== "" ? place.image : "https://via.placeholder.com/400x200?text=No+Image"}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col justify-end">
                  <h3 className="text-xl font-semibold mb-2 w-full truncate">{place.name}</h3>
                  {/* Details */}
                  <div className="flex justify-between mb-2 flex-1 flex-col">
                    <p className="flex items-center space-x-1 text-yellow-500">
                      <span className="text-primary">Rating</span>
                      <div className="flex">
                        {Array.from({ length: place.rating }).map((_, index) => (
                          <AiFillStar key={index} />
                        ))}
                      </div>
                      <span>{place.rating}</span>
                    </p>
                    <div className="flex items-center">
                      <div className="mr-2">
                        <IoLocationOutline />
                      </div>
                      <p className="text-start truncate">{place.address}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {place.subcategory.map((category, index) => (
                        <span key={index} className="bg-gray-200 text-gray-600 px-2 py-1 rounded-lg text-xs">
                          {category}
                        </span>
                      ))}
                      <p className="text-start truncate"></p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {data &&
              data.map((place) => (
                <Link
                  to="/catalog/$placeId"
                  params={{ placeId: place.id }}
                  key={place.id}
                  className="place w-full bg-white border rounded-lg overflow-hidden hover:cursor-pointer hover:ring-2 hover:ring-orange-600"
                >
                  <div className="h-[150px] md:h-[230px] overflow-hidden">
                    <img
                      src={place.image !== "" ? place.image : "https://via.placeholder.com/400x200?text=No+Image"}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-end">
                    <h3 className="text-xl font-semibold mb-2 w-full truncate">{place.name}</h3>
                    {/* Details */}
                    <div className="flex justify-between mb-2 flex-1 flex-col">
                      <p className="flex items-center space-x-1 text-yellow-500">
                        <span className="text-primary">Rating</span>
                        <div className="flex">
                          {Array.from({ length: place.rating }).map((_, index) => (
                            <AiFillStar key={index} />
                          ))}
                        </div>
                        <span>{place.rating}</span>
                      </p>
                      <div className="flex items-center">
                        <div className="mr-2">
                          <IoLocationOutline />
                        </div>
                        <p className="text-start truncate">{place.address}</p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {place.subcategory.map((category, index) => (
                          <span key={index} className="bg-gray-200 text-gray-600 px-2 py-1 rounded-lg text-xs">
                            {category}
                          </span>
                        ))}
                        <p className="text-start truncate"></p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
