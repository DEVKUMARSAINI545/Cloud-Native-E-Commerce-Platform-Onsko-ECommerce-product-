import axios from 'axios';

// const API = window.APP_CONFIG.API_URL
// Create an axios instance with default configurations
const axiosInstance = axios.create({
  // baseURL: 'https://onsko-e-commerce-project.onrender.com/api/v1/onsko', // The base URL of your backend
  // baseURL: import.meta.env.VITE_SERVER_URL , // The base URL of your backend
  baseURL: import.meta.env.VITE_BACKEND_URI, // The base URL of your backend
  // baseURL: "h" , // The base URL of your backend
  withCredentials: true,  // Automatically send credentials (cookies) with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
