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
