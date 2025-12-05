import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data: any) => apiClient.put('/auth/profile', data),
};

// Tours Service
export const tourService = {
  getAll: () => apiClient.get('/tours'),
  getById: (id: string) => apiClient.get(`/tours/${id}`),
  search: (filters: any) => apiClient.post('/tours/search', filters),
  book: (id: string, data: any) => apiClient.post(`/tours/${id}/book`, data),
};

// Flights Service
export const flightService = {
  search: (filters: any) => apiClient.post('/flights/search', filters),
  getById: (id: string) => apiClient.get(`/flights/${id}`),
  book: (id: string, data: any) => apiClient.post(`/flights/${id}/book`, data),
};

// Accommodations Service
export const accommodationService = {
  search: (filters: any) => apiClient.post('/accommodations/search', filters),
  getById: (id: string) => apiClient.get(`/accommodations/${id}`),
  book: (id: string, data: any) =>
    apiClient.post(`/accommodations/${id}/book`, data),
};

// Bookings Service
export const bookingService = {
  getAll: () => apiClient.get('/bookings'),
  getById: (id: string) => apiClient.get(`/bookings/${id}`),
  update: (id: string, data: any) => apiClient.put(`/bookings/${id}`, data),
  cancel: (id: string) => apiClient.delete(`/bookings/${id}`),
};

// Payments Service
export const paymentService = {
  createIntent: (data: any) => apiClient.post('/payments/create-intent', data),
  confirm: (data: any) => apiClient.post('/payments/confirm', data),
  getHistory: () => apiClient.get('/payments/history'),
};

export default apiClient;
