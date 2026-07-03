import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Fetch all products
  getProducts: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  // Fetch a single product by ID
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Fetch all product categories
  getCategories: async () => {
    const response = await apiClient.get('/products/categories');
    return response.data;
  },

  // Fetch products in a specific category
  getProductsByCategory: async (category) => {
    const response = await apiClient.get(`/products/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  // Authenticate user using Fake Store API login
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', {
      username,
      password,
    });
    return response.data; // Returns token { token: "..." }
  },
  
  // Get all users (useful for validating profiles or finding standard test credentials)
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  }
};
