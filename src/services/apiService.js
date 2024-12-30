import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Function to get the current token from localStorage
const getToken = () => localStorage.getItem('token');

// Create the axios instance
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically add the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken(); // Get the latest token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API function to fetch orders
export const getOrders = (params) => apiClient.get('/pre-orders', { params });

// API function to delete an order
export const deleteOrder = (id) => apiClient.delete(`/pre-orders/${id}`);
