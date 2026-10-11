import axios from 'axios';

// Get and normalize base API URL from environment variables or default to local backend
const getBaseUrl = () => {
  let url = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').trim();
  // Strip trailing slashes
  url = url.replace(/\/+$/, '');
  // Ensure it points to /api
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach X-User-Id from localStorage if user is authenticated
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.id) {
      config.headers['X-User-Id'] = user.id;
    }
  } catch (err) {
    console.error('Failed to parse user from localStorage', err);
  }
  return config;
});

// Helper to extract clean error message from response
export function errorText(e) {
  if (!e.response) {
    return 'Cannot connect to the backend server. Please verify the backend is running and CORS allows this domain.';
  }
  if (e.response.data?.fields) {
    return Object.values(e.response.data.fields).join(', ');
  }
  return e.response.data?.message || `Request failed (${e.response.status})`;
}

export default api;
