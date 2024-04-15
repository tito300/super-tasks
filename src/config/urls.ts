const baseUrl = import.meta.env.PROD
  ? "https://api.example.com/api"
  : "http://localhost:3444/api";

export const urls = {
    BASE_URL: baseUrl, 
}