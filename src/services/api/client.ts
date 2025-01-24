// src/services/api/client.ts

import axios from 'axios';

const BASE_URL = '/';
const REQUEST_TIMEOUT = 10000;

export const createApiClient = () => {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      // Add CORS headers
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept',
    },
    // Add withCredentials for CORS
    withCredentials: false
  });

  // Add request interceptor for better error handling
  client.interceptors.request.use(
    config => {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const separator = config.url?.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}_t=${timestamp}`;
      return config;
    },
    error => Promise.reject(error)
  );

  // Add response interceptor with retry logic
  let retryCount = 0;
  const MAX_RETRIES = 3;

  client.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return client(originalRequest);
      }

      retryCount = 0;
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();