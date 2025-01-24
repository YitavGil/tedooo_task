import axios, { InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'https://backend.tedooo.com/hw';
const REQUEST_TIMEOUT = 10000;

export const createApiClient = () => {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (config.headers) {
        delete config.headers['Cache-Control'];
        delete config.headers['Pragma'];
        delete config.headers['If-Modified-Since'];
        delete config.headers['If-None-Match'];
      }
      return config;
    },
    error => Promise.reject(error)
  );

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