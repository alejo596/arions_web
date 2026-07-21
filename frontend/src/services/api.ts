import axios from 'axios';

const getNormalizedApiUrl = (): string => {
  let rawUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || '';

  // Clean markdown brackets, parens, quotes or accidental wrapper formatting
  rawUrl = rawUrl.replace(/[\[\]\(\)'"]/g, ' ').trim();

  // Extract valid http/https URL if embedded
  const match = rawUrl.match(/(https?:\/+[^\s]+)/i);
  if (match) {
    rawUrl = match[1];
  }

  if (!rawUrl) {
    return import.meta.env.PROD 
      ? 'https://arions-web.onrender.com/api/v1' 
      : '/api/v1';
  }

  // Fix malformed protocol typos like "https:/arions-web..." -> "https://arions-web..."
  if (/^https:\/+[^\/]/i.test(rawUrl)) {
    rawUrl = rawUrl.replace(/^https:\/+/i, 'https://');
  } else if (/^http:\/+[^\/]/i.test(rawUrl)) {
    rawUrl = rawUrl.replace(/^http:\/+/i, 'http://');
  } else if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://') && !rawUrl.startsWith('/')) {
    rawUrl = `https://${rawUrl}`;
  }

  // Auto-correct legacy/typo domain arions-backend.onrender.com -> arions-web.onrender.com
  if (rawUrl.includes('arions-backend.onrender.com')) {
    rawUrl = rawUrl.replace('arions-backend.onrender.com', 'arions-web.onrender.com');
  }

  return rawUrl.replace(/\/+$/, '');
};

const API_URL = getNormalizedApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for JWT Access Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('arions_access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Interceptor for Refresh Token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('arions_refresh_token');
        if (refreshToken) {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const newAccessToken = res.data.data.accessToken;
          localStorage.setItem('arions_access_token', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        localStorage.removeItem('arions_access_token');
        localStorage.removeItem('arions_refresh_token');
        localStorage.removeItem('arions_user');
      }
    }
    return Promise.reject(error);
  }
);
