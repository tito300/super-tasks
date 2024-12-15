const baseUrl = import.meta.env.PROD
  ? "https://axess-api-7d6f868e9766.herokuapp.com/api"
  : "http://localhost:3444/api";

export const urls = {
  BASE_URL: baseUrl,
};
