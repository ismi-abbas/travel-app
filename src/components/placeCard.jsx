import { Link } from "@tanstack/react-router";
import { AiFillStar } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";

export const PlaceCard = ({ place }) => (
  <Link
    to="/catalog/$placeId"
    params={{ placeId: place.id }}
    className="place w-full bg-white border rounded-lg overflow-hidden hover:cursor-pointer hover:shadow-xl hover:border-zinc-200"
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
        <div className="flex items-center space-x-1 text-yellow-500">
          <span className="text-primary">Rating</span>
          <div className="flex">
            {Array.from({ length: place.rating }).map((_, index) => (
              <AiFillStar key={index} />
            ))}
          </div>
          <span>{place.rating}</span>
        </div>
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
);

export const PlaceCardHorizontal = ({ place, selectedDistrict }) => (
  <Link
    to="/catalog/$placeId"
    params={{ placeId: place.id }}
    className="flex place w-full bg-white border rounded-lg overflow-hidden hover:cursor-pointer hover:shadow-xl hover:border-zinc-200"
  >
    <img
      src={place.image !== "" ? place.image : "https://via.placeholder.com/400x200?text=No+Image"}
      alt={place.name}
      className="size-[240px] object-cover"
    />
    <div className="p-4 flex flex-col justify-end">
      <h3 className="text-xl font-semibold mb-2 w-full truncate">{place.name}</h3>
      {/* Details */}
      <div className="flex justify-between mb-2 flex-1 flex-col">
        <div className="flex items-center space-x-1 text-yellow-500">
          <span className="text-primary">Rating</span>
          <div className="flex">
            {Array.from({ length: place.rating }).map((_, index) => (
              <AiFillStar key={index} />
            ))}
          </div>
          <span>{place.rating}</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2">
            <IoLocationOutline />
          </div>
          <div className="text-start truncate">{place.address}</div>
        </div>
        <div>
          Distance from <span className="capitalize">{selectedDistrict}</span>:{" "}
          <span className="font-medium">{place.distance.toFixed(2)} KM</span>
        </div>
        <div>
          Price range: <span className="font-medium">{place.price_range}</span>
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
);
