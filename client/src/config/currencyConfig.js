// Currency configuration for all supported countries
// Base prices are in INR (Indian Rupees)

const COUNTRIES = [
  { code: "IN", name: "India", symbol: "₹", currency: "INR", rate: 1, default: true },
  { code: "US", name: "USA", symbol: "$", currency: "USD", rate: 0.012 },
  { code: "GB", name: "UK", symbol: "£", currency: "GBP", rate: 0.0095 },
  { code: "CA", name: "Canada", symbol: "$", currency: "CAD", rate: 0.016 },
  { code: "AU", name: "Australia", symbol: "$", currency: "AUD", rate: 0.018 },
  { code: "DE", name: "Germany", symbol: "€", currency: "EUR", rate: 0.011 },
  { code: "FR", name: "France", symbol: "€", currency: "EUR", rate: 0.011 },
  { code: "JP", name: "Japan", symbol: "¥", currency: "JPY", rate: 1.8 },
  { code: "SG", name: "Singapore", symbol: "$", currency: "SGD", rate: 0.016 },
  { code: "AE", name: "UAE", symbol: "د.إ", currency: "AED", rate: 0.044 },
];

const SHIPPING_RATES = {
  India: { baseCost: 200, freeThreshold: 8000 },
  USA: { baseCost: 800, freeThreshold: 15000 },
  UK: { baseCost: 700, freeThreshold: 12000 },
  Canada: { baseCost: 900, freeThreshold: 15000 },
  Australia: { baseCost: 1000, freeThreshold: 18000 },
  Germany: { baseCost: 650, freeThreshold: 12000 },
  France: { baseCost: 650, freeThreshold: 12000 },
  Japan: { baseCost: 1100, freeThreshold: 20000 },
  Singapore: { baseCost: 500, freeThreshold: 10000 },
  UAE: { baseCost: 400, freeThreshold: 8000 },
};

// Get country object by name
export const getCountryByName = (countryName) => {
  return COUNTRIES.find((c) => c.name === countryName) || COUNTRIES[0];
};

// Convert price from INR to target currency
export const convertPrice = (priceInINR, countryName) => {
  const country = getCountryByName(countryName);
  return Math.round(priceInINR * country.rate * 100) / 100;
};

// Format price with currency symbol
export const formatPrice = (priceInINR, countryName) => {
  const country = getCountryByName(countryName);
  const convertedPrice = convertPrice(priceInINR, countryName);
  return `${country.symbol}${convertedPrice.toFixed(2)}`;
};

// Get shipping cost in INR based on country
export const getShippingCostINR = (countryName, subtotalINR) => {
  const rate = SHIPPING_RATES[countryName] || SHIPPING_RATES.India;
  if (subtotalINR > rate.freeThreshold) {
    return 0; // free shipping
  }
  return rate.baseCost;
};

// Get shipping cost converted to target currency
export const getShippingCost = (countryName, subtotalINR) => {
  const shippingINR = getShippingCostINR(countryName, subtotalINR);
  return convertPrice(shippingINR, countryName);
};

// Format shipping cost with currency symbol
export const formatShippingCost = (countryName, subtotalINR) => {
  const country = getCountryByName(countryName);
  const shippingCost = getShippingCost(countryName, subtotalINR);
  return `${country.symbol}${shippingCost.toFixed(2)}`;
};

export { COUNTRIES, SHIPPING_RATES };
