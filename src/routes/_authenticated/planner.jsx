import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import supabase from "../../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Slider } from "../../components/slider";

export const Route = createFileRoute("/_authenticated/planner")({
  component: PlanTour,
});

const getAllCategories = async () => {
  const { data, error } = await supabase.from("places").select("subcategory").neq("subcategory", "{}");
  if (error) {
    console.error(error);
    return [];
  }
  const flatCategories = data
    .map((item) => item.subcategory) // Extract subcategory arrays
    .flat() // Flatten into a single array
    .filter((value, index, self) => self.indexOf(value) === index); // Filter unique values

  return flatCategories;
};

export const states = [
  {
    name: "Terengganu",
    value: "terengganu",
    district: [
      { name: "Kuala Terengganu", value: "kuala terengganu" },
      { name: "Marang", value: "marang" },
      { name: "Kijal", value: "kijal" },
      { name: "Chukai", value: "chukai" },
      { name: "Dungun", value: "dungun" },
      { name: "Paka", value: "paka" },
      { name: "Kerteh", value: "kerteh" },
    ],
  },
  {
    name: "Pahang",
    value: "pahang",
    district: [
      { name: "Genting Highlands", value: "genting highlands" },
      { name: "Brinchang", value: "brinchang" },
      { name: "Tanah Rata", value: "tanah rata" },
      { name: "Janda Baik", value: "janda baik" },
      { name: "Temerloh", value: "temerloh" },
      { name: "Jerantut", value: "jerantut" },
      { name: "Raub", value: "raub" },
      { name: "Mentakab", value: "mentakab" },
      { name: "Kuala Tahan", value: "kuala tahan" },
      { name: "Kuala Rompin", value: "kuala rompin" },
      { name: "Bukit Tinggi", value: "bukit tinggi" },
      { name: "Bentong", value: "bentong" },
      { name: "Kuantan", value: "kuantan" },
      { name: "Cherating", value: "cherating" },
      { name: "Kampung Temiang", value: "kampung temiang" },
      { name: "Ringlet", value: "ringlet" },
    ],
  },
  {
    name: "Kelantan",
    value: "kelantan",
    district: [
      { name: "Kota Bharu", value: "kota bharu" },
      { name: "Tumpat", value: "tumpat" },
    ],
  },
];

const criterias = [
  {
    name: "State",
    value: "state",
    options: states.map((state) => ({
      name: state.name,
      value: state.value,
    })),
  },
  {
    name: "District",
    value: "district",
    options: [
      {
        name: "test",
        value: "test",
      },
    ],
  },
  {
    name: "Rating",
    value: "rating",
    options: [
      { name: "1", value: "5" },
      { name: "2", value: "4" },
      { name: "3", value: "3" },
      { name: "4", value: "3" },
      { name: "5", value: "3" },
    ],
  },
  {
    name: "Distance",
    value: 0,
  },
  {
    name: "Price Range",
    value: "priceRange",
    options: [
      { name: "Cheap", value: "cheap" },
      { name: "Affordable", value: "affordable" },
      { name: "Pricey", value: "pricey" },
    ],
  },
  {
    name: "Category",
    value: "category",
    options: [],
  },
];

export default function PlanTour() {
  const [criteriaList, setCriteriaList] = useState(criterias);
  const [selectedState, setSelectedState] = useState("kelantan");
  const [selectedCriteria, setSelectedCriteria] = useState({
    state: criterias[0].options[0].value,
    district: states[0].district[0]?.value || "",
    rating: criterias[2].options[0].value,
    distance: criterias[3].options[0].value,
    priceRange: criterias[4].options[0].value,
  });

  const { data: categoriesData, error } = useQuery({
    queryKey: ["get-categories"],
    queryFn: getAllCategories,
    gcTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    const stateCriteria = criterias.find((criteria) => criteria.value === "state");
    const districtOptions = states.find((state) => state.value === selectedState)?.district || [];
    const districtCriteria = {
      name: "District",
      value: "district",
      options: districtOptions,
    };

    const newCriteriaList = [
      stateCriteria,
      districtCriteria,
      ...criterias.filter((criteria) => criteria.value !== "state" && criteria.value !== "district"),
    ];

    setCriteriaList(newCriteriaList);

    setSelectedCriteria((prev) => ({
      ...prev,
      district: districtOptions[0]?.value || "",
    }));
  }, [selectedState]);

  const handleCriteriaChange = (value, criteria) => {
    if (criteria === "state") {
      setSelectedState(value);
    }
    setSelectedCriteria((prev) => ({
      ...prev,
      [criteria]: value,
    }));
  };

  useEffect(() => {
    console.log(selectedCriteria);
  }, [selectedCriteria]);

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    handleCriteriaChange(rating, "rating");
  };

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleDistanceChange = (e) => {
    // handleCriteriaChange(value, "distance");
    console.log(e.target.value);
  };

  return (
    <div className="">
      <div className="h-20 flex flex-col mt-10">
        <h1 className="inline-flex text-3xl font-medium">Plan your tour</h1>
      </div>

      <div className="flex w-full gap-8 items-start justify-start">
        {/* Planner Bar */}
        <div className="w-[25%] border-r-2 pr-10 h-screen">
          <h3 className="text-xl font-semibold">Criterias</h3>
          <div className="flex gap-3 flex-col mt-4">
            {/* State */}
            <div>
              <label className="capitalize inline-flex self-start w-full text-lg font-medium">State</label>
              <select
                className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 mt-2 capitalize text-lg"
                name="state"
                onChange={(e) => handleCriteriaChange(e.target.value, value)}
              >
                {states.map((state, index) => (
                  <option className="capitalize" key={index} value={state.value}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            {/* District */}
            <div>
              <label className="capitalize inline-flex self-start w-full text-lg font-medium">
                {criteriaList[1].name}
              </label>
              <select
                className="appearance-none block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 mt-2 capitalize text-lg"
                name="state"
                onChange={(e) => handleCriteriaChange(e.target.value, value)}
              >
                {states.map((state, index) => (
                  <option className="capitalize" key={index} value={state.value}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Rating */}
            <div>
              <label className="capitalize inline-flex self-start w-full text-lg font-medium">
                {criteriaList[2].name}
              </label>
              <div className="" name="state">
                <div className="flex">
                  {Array.from([1, 2, 3, 4, 5]).map((item) => (
                    <svg
                      key={item}
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      className={cn(
                        "cursor-pointer hover:text-orange-400 text-gray-300",
                        (selectedRating >= item || hoveredRating >= item) && "text-orange-500",
                      )}
                      onMouseEnter={() => setHoveredRating(item)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => handleRatingChange(item)}
                    >
                      <path
                        fill="currentColor"
                        d="m7.625 6.4l2.8-3.625q.3-.4.713-.587T12 2t.863.188t.712.587l2.8 3.625l4.25 1.425q.65.2 1.025.738t.375 1.187q0 .3-.088.6t-.287.575l-2.75 3.9l.1 4.1q.025.875-.575 1.475t-1.4.6q-.05 0-.55-.075L12 19.675l-4.475 1.25q-.125.05-.275.063T6.975 21q-.8 0-1.4-.6T5 18.925l.1-4.125l-2.725-3.875q-.2-.275-.288-.575T2 9.75q0-.625.363-1.162t1.012-.763z"
                      />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            {/* Distance */}
            <div>
              <label className="capitalize inline-flex self-start w-full text-lg font-medium">
                {criteriaList[3].name}
              </label>
              <select>
                <Slider
                  defaultValue={[33]}
                  max={100}
                  step={1}
                  value={criteriaList[3].name}
                  onChange={handleDistanceChange}
                />
              </select>
            </div>
            {/* Categories */}
            <div>
              <label className="capitalize inline-flex self-start w-full text-lg font-medium">
                {criteriaList[5].name}
              </label>
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

function CriteriaField({ name, value, options, handleCriteriaChange }) {
  return (
    <div className="">
      <label className="capitalize inline-flex self-start w-full text-lg font-medium">{name}</label>
      <select
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 mt-2 capitalize text-lg"
        name={name}
        onChange={(e) => handleCriteriaChange(e.target.value, value)}
      >
        {options.map((option, index) => (
          <option className="capitalize" key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
