import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import supabase from "../../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Slider } from "../../components/slider";
import { Star } from "../../components/icons";
import { criterias, districtsCoordinates, states } from "../../lib/constant";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_authenticated/planner")({
  component: PlanTour,
});

const getAllCategories = async () => {
  const { data, error } = await supabase.from("places").select("subcategory").neq("subcategory", "{}");
  if (error) {
    console.error(error);
    return [];
  }
  // Filter unique values
  return data
    .map((item) => item.subcategory) // Extract subcategory arrays
    .flat() // Flatten into a single array
    .filter((value, index, self) => self.indexOf(value) === index);
};

const getAllPriceRange = async () => {
  const { data, error } = await supabase.from("places").select("price_range").neq("price_range", "{}");

  if (error) {
    console.error(error);
    return [];
  }

  const priceRange = data
    .map((item) => {
      return item.price_range.match(/\d+/g).map((num) => num.replace(/^0+/, ""));
    })
    .flat()
    .map(Number) // Convert to numbers for correct sorting
    .sort((a, b) => a - b); // Sort numerically

  const uniquePrices = [...new Set(priceRange)]; // Remove duplicates

  const highestPrice = Math.max(...priceRange);
  const lowestPrice = Math.min(...priceRange);

  return {
    uniquePrices,
    highestPrice,
    lowestPrice,
  };
};

export default function PlanTour() {
  const { data: priceRange, isError } = useQuery({
    queryKey: ["get-price-range"],
    queryFn: getAllPriceRange,
  });

  const [criteriaList, setCriteriaList] = useState(criterias);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [selectedCriteria, setSelectedCriteria] = useState({
    state: criterias[0].options[0].value,
    district: states[0].district[0]?.value || "",
    rating: null,
    distance: [0],
    priceRange: [0, 100],
    categories: selectedCategories,
    placeCoordinates: {
      lat: 0,
      long: 0,
    },
  });

  function getCoordinates(place) {
    const district = districtsCoordinates.find((d) => d.place === place);
    if (district) {
      return { lat: district.lat, long: district.long };
    } else {
      return null;
    }
  }

  const setCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setSelectedCriteria((prev) => ({
        ...prev,
        placeCoordinates: {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        },
      }));
    });

    toast.success("Location updated successfully");
  };

  const { data: categoriesData, error } = useQuery({
    queryKey: ["get-categories"],
    queryFn: getAllCategories,
    gcTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    const stateCriteria = criterias.find((criteria) => criteria.value === "state");
    const districtOptions = states.find((state) => state.value === selectedCriteria.state)?.district || [];
    const districtCriteria = {
      name: "District",
      value: "district",
      options: districtOptions,
    };

    setCriteriaList([
      stateCriteria,
      districtCriteria,
      ...criterias.filter((criteria) => criteria.value !== "state" && criteria.value !== "district"),
    ]);

    const { lat, long } = getCoordinates(selectedCriteria.district);

    setSelectedCriteria((prev) => ({
      ...prev,
      district: districtOptions[0]?.value || "",
      placeCoordinates: {
        lat: lat || 0,
        long: long || 0,
      },
    }));
  }, [selectedCriteria.state]);

  useEffect(() => {
    setSelectedCriteria((prev) => ({
      ...prev,
      district: states.find((state) => state.value === prev.state)?.district[0]?.value || "",
    }));
  }, [selectedCriteria.state]);

  const handleCriteriaChange = (value, criteria) => {
    if (criteria === "district") {
      const { lat, long } = getCoordinates(value);
      setSelectedCriteria((prev) => ({
        ...prev,
        [criteria]: value,
        placeCoordinates: {
          lat: lat || 0,
          long: long || 0,
        },
      }));
      return;
    }

    setSelectedCriteria((prev) => ({
      ...prev,
      [criteria]: value,
    }));
  };

  useEffect(() => {
    console.log(JSON.stringify(selectedCriteria));
  }, [selectedCriteria]);

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    handleCriteriaChange(rating, "rating");
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      const updatedCategories = prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category];

      setSelectedCriteria((prevCriteria) => ({
        ...prevCriteria,
        categories: updatedCategories,
      }));
      return updatedCategories;
    });
  };

  const handleDistanceChange = (value) => {
    setSelectedCriteria((prev) => ({
      ...prev,
      distance: value,
    }));
  };

  const handlePriceChange = (value) => {
    setSelectedCriteria((prev) => ({
      ...prev,
      priceRange: value,
    }));
  };

  return (
    <div className="">
      <div className="h-20 flex flex-col mt-10">
        <h1 className="inline-flex text-3xl font-medium">Plan your tour</h1>
      </div>

      <div className="flex w-full gap-8 items-start justify-start">
        {/* Planner Bar */}
        <div className="w-[25%] border-r-2 pr-10 mb-10">
          <h3 className="text-xl font-semibold">Criterias</h3>
          <div className="flex gap-3 flex-col mt-4">
            {/* State */}
            <SelectInput
              label="State"
              name="state"
              value={selectedCriteria.state}
              options={states.map((state) => ({ name: state.name, value: state.value }))}
              onChange={(e) => handleCriteriaChange(e.target.value, "state")}
            />
            {/* District */}
            <SelectInput
              label="District"
              name="district"
              value={selectedCriteria.district}
              options={criteriaList[1].options}
              onChange={(e) => handleCriteriaChange(e.target.value, "district")}
            />
            {/* Rating */}
            <div>
              <label className="capitalize inline-flex self-start w-full text-lg font-medium">
                {criteriaList[2].name}
              </label>
              <div className="" name="rating">
                <div className="flex">
                  {Array.from([1, 2, 3, 4, 5]).map((item, index) => (
                    <Star
                      key={index}
                      className={cn(
                        "cursor-pointer hover:text-orange-400 text-gray-300 size-8",
                        (selectedRating >= item || hoveredRating >= item) && "text-orange-500",
                      )}
                      onMouseEnter={() => setHoveredRating(item)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => handleRatingChange(item)}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Distance */}
            <RangeInput
              name={criteriaList[3].name}
              defaultValue={selectedCriteria.distance}
              max={50}
              onValueChange={handleDistanceChange}
              step={5}
              valuePlaceholder={`${selectedCriteria.distance} KM`}
            />

            <div>
              <button
                onClick={setCurrentLocation}
                className="py-1 px-3 bg-orange-500 text-white rounded-md hover:ring-1 hover:ring-orange-500 hover:bg-white hover:text-black"
              >
                Use Current Location
              </button>
            </div>

            {/* Price */}
            <RangeInput
              name={criteriaList[4].name}
              defaultValue={[0, 100]}
              min={priceRange?.lowestPrice}
              max={priceRange?.highestPrice}
              onValueChange={handlePriceChange}
              step={10}
              valuePlaceholder={`RM${selectedCriteria.priceRange[0]} - RM${selectedCriteria.priceRange[1]}`}
              withInput={true}
              from={selectedCriteria.priceRange[0]}
              to={selectedCriteria.priceRange[1]}
              priceRange={priceRange}
            />
            {/* Categories */}
            <CategoryInput
              categoriesData={categoriesData}
              selectedCategories={selectedCategories}
              handleCategoryChange={handleCategoryChange}
            />
          </div>
          <div className="flex w-full flex-col mt-4">
            <Link
              to="/planner/result"
              search={{
                state: selectedCriteria.state,
                district: selectedCriteria.district,
                rating: selectedCriteria.rating,
                distance: selectedCriteria.distance,
                priceRange: selectedCriteria.priceRange,
                placeCoordinates: selectedCriteria.placeCoordinates,
                categories: selectedCriteria.categories,
              }}
              className="inline-flex self-start px-5 py-2 rounded bg-gray-100 hover:bg-orange-500 hover:text-white"
            >
              Recommmended Tour
            </Link>
          </div>
        </div>
        <div className="col-span-3 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const SelectInput = ({ label, name, value, options, onChange }) => (
  <div>
    <label className="capitalize inline-flex self-start w-full text-lg font-medium">{label}</label>
    <select
      className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 mt-2 capitalize text-lg"
      name={name}
      value={value}
      onChange={onChange}
    >
      {options.map((option, index) => (
        <option className="capitalize" key={index} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

const CategoryInput = ({ categoriesData, selectedCategories, handleCategoryChange }) => (
  <div>
    <label className="capitalize inline-flex self-start w-full text-lg font-medium">Categories</label>
    <div className="mt-2">
      {categoriesData &&
        categoriesData.map((category, index) => (
          <div key={index} className="flex items-center justify-start gap-2">
            <input
              type="checkbox"
              id={`category-${index}`}
              name={category}
              value={category}
              className="size-5"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            <label htmlFor={`category-${index}`} className="capitalize text-lg flex-1">
              {category}
            </label>
          </div>
        ))}
    </div>
  </div>
);

const RangeInput = ({
  name,
  defaultValue,
  onValueChange,
  max,
  step,
  valuePlaceholder,
  withInput,
  from,
  to,
  priceRange,
}) => {
  return (
    <div>
      <label className="capitalize inline-flex self-start w-full text-lg font-medium">{name}</label>
      <div>
        <Slider defaultValue={defaultValue} max={max} step={step} className="mt-3" onValueChange={onValueChange} />
        {withInput && (
          <div className="flex flex-col mt-4 gap-2">
            <div>
              <label htmlFor="">From</label>
              <input
                type="number"
                className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 capitalize text-lg"
                value={from}
                onChange={(e) => onValueChange(e.target.value)}
                max={priceRange?.highestPrice}
                min={priceRange?.lowestPrice}
              />
            </div>
            <div>
              <label htmlFor="">To</label>
              <input
                type="number"
                className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 capitalize text-lg"
                value={to}
                onChange={(e) => onValueChange(e.target.value)}
              />
            </div>
          </div>
        )}
        <div className="mt-2">{valuePlaceholder}</div>
      </div>
    </div>
  );
};
