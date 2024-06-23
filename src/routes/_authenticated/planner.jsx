import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/planner")({
  component: PlanTour,
});

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
      { name: "High Rated", value: "high" },
      { name: "Medium Rated", value: "middle" },
      { name: "Low Rated", value: "low" },
    ],
  },
  {
    name: "Distance",
    value: "distance",
    options: [
      { name: "Close", value: "close" },
      { name: "Far", value: "far" },
    ],
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

  return (
    <div className="">
      <div className="h-20 flex flex-col mt-10">
        <h1 className="inline-flex text-3xl font-medium">Plan your tour</h1>
      </div>

      <div className="grid grid-cols-4  gap-8">
        <div className="h-full">
          <h3 className="text-xl font-semibold">Criterias</h3>
          <div className="flex gap-3 flex-col mt-4">
            {criteriaList.map((criteria, index) => (
              <CriteriaField
                key={index}
                name={criteria.name}
                value={criteria.value}
                options={criteria.options}
                handleCriteriaChange={handleCriteriaChange}
              />
            ))}
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
        <div className="col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function CriteriaField({ name, value, options, handleCriteriaChange }) {
  return (
    <div className="relative">
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

function RecommenderResult() {
  const criteria = Route.useSearch();

  let rating = [];
  if (criteria.rating === "low") {
    rating = [0.0, 2.9];
  } else if (criteria.rating === "high") {
    rating = [3.0, 3.9];
  } else {
    rating = [4.0, 5];
  }

  const { data, error } = useQuery({
    queryKey: ["places"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("places")
        .select()
        .ilike("state", criteria.state)
        .ilike("city", criteria.district);
      // .ilike("rating", rating);

      if (error) {
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="mt-4">
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-2xl">Recommended Trips</h1>

        <p>
          Here are some places that we recommend based on your preferences.
          <span>
            <Link to="/planner" className="underline underline-offset-1 ml-2 decoration-orange-500 text-orange-500">
              Back
            </Link>
          </span>
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
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
                  <p className="flex items-center space-x-2 text-yellow-500">
                    <AiFillStar />
                    <span>{place.rating}</span>
                  </p>
                  <div className="flex items-center">
                    <div className="mr-2">
                      <IoLocationOutline />
                    </div>
                    <p className="text-start truncate">{place.address}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
