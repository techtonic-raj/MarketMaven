export const mockSentimentData = {
  positive: 65,
  neutral: 20,
  negative: 15,
};

export const mockMarketData = {
  marketSize: "$50B",
  growthRate: "12%",
  demographics: [
    { name: "18-24", value: 20 },
    { name: "25-34", value: 35 },
    { name: "35-44", value: 25 },
    { name: "45+", value: 20 },
  ],
  marketTrends: [
    { month: "Jan", value: 100 },
    { month: "Feb", value: 120 },
    { month: "Mar", value: 150 },
    { month: "Apr", value: 180 },
    { month: "May", value: 220 },
    { month: "Jun", value: 280 },
  ],
};

export const mockCompetitorData = [
  {
    name: "Competitor A",
    marketShare: 35,
    features: ["Feature 1", "Feature 2", "Feature 3"],
    price: "High",
  },
  {
    name: "Competitor B",
    marketShare: 25,
    features: ["Feature 1", "Feature 2"],
    price: "Medium",
  },
  {
    name: "Competitor C",
    marketShare: 15,
    features: ["Feature 1"],
    price: "Low",
  },
];

export const mockKeywords = [
  { text: "Innovation", value: 30 },
  { text: "Technology", value: 25 },
  { text: "Growth", value: 20 },
  { text: "Market", value: 18 },
  { text: "Customers", value: 15 },
];
