// Centralized API base URL for all fetch calls.
// In development: reads from VITE_API_URL in .env (defaults to localhost)
// In production: set VITE_API_URL to your deployed backend URL
const API_URL = import.meta.env.VITE_API_URL;

export default API_URL;
