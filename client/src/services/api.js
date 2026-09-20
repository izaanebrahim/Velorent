import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors globally, especially 401 unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If user's token is invalid or expired, log them out
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Redirect to login only if we are not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
