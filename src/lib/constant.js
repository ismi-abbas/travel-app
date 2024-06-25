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

export const criterias = [
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
    value: [0],
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

export const districtsCoordinates = [
  { place: "kuala terengganu", lat: 5.3302, long: 103.1408 },
  { place: "marang", lat: 5.2056, long: 103.1979 },
  { place: "kijal", lat: 4.2431, long: 103.4492 },
  { place: "chukai", lat: 4.2365, long: 103.4477 },
  { place: "dungun", lat: 4.7594, long: 103.4259 },
  { place: "paka", lat: 4.6378, long: 103.4415 },
  { place: "kerteh", lat: 4.5146, long: 103.4525 },
  { place: "genting highlands", lat: 3.4221, long: 101.7926 },
  { place: "brinchang", lat: 4.4914, long: 101.3891 },
  { place: "tanah rata", lat: 4.4713, long: 101.3761 },
  { place: "janda baik", lat: 3.4219, long: 101.792 },
  { place: "temerloh", lat: 3.446, long: 102.4267 },
  { place: "jerantut", lat: 3.9385, long: 102.3621 },
  { place: "raub", lat: 3.7899, long: 101.8577 },
  { place: "mentakab", lat: 3.485, long: 102.3497 },
  { place: "kuala tahan", lat: 4.3884, long: 102.4104 },
  { place: "kuala rompin", lat: 2.8197, long: 103.4843 },
  { place: "bukit tinggi", lat: 3.3662, long: 101.7916 },
  { place: "bentong", lat: 3.5239, long: 101.9115 },
  { place: "kuantan", lat: 3.8077, long: 103.326 },
  { place: "cherating", lat: 4.1216, long: 103.3939 },
  { place: "kampung temiang", lat: 3.4234, long: 101.9163 },
  { place: "ringlet", lat: 4.4203, long: 101.3806 },
  { place: "kota bharu", lat: 6.1228, long: 102.2495 },
  { place: "tumpat", lat: 6.197, long: 102.1711 },
];
