import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate the distance between two points on the Earth using the Haversine formula.
 * @param {number} lat1 - Latitude of the first point in degrees.
 * @param {number} lon1 - Longitude of the first point in degrees.
 * @param {number} lat2 - Latitude of the second point in degrees.
 * @param {number} lon2 - Longitude of the second point in degrees.
 * @returns {number} - Distance between the two points in kilometers.
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

/**
 * Extracts the low and high price range from a given price range string.
 *
 * @param {string} priceRangeString - The price range string to extract the prices from.
 * @returns {Object|null} An object containing the low and high prices, or null if the price range string format is incorrect.
 */
export const extractPriceRange = (priceRangeString, placeId) => {
  const cleanedString = priceRangeString.replace(/,/g, ""); // Remove commas
  const prices = cleanedString.match(/\d+/g).map((num) => parseInt(num, 10));

  if (prices.length === 1) {
    const [price] = prices;
    return { low: price, high: price };
  } else if (prices.length >= 2) {
    const [low, high] = prices.sort((a, b) => a - b);
    return { low, high };
  } else {
    return { low: 0, high: 0 };
  }
};
