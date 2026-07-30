import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach headers or tokens if needed
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Better Auth credentials (cookies) are sent automatically due to withCredentials: true.
    // Additional custom headers can be set here if required.
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle common HTTP errors & 401 Unauthorized globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized: Redirect to login or dispatch custom event
      if (status === 401) {
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          // Dispatch event so AuthContext can clean up state cleanly
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
      }

      // Format custom error response
      const errorMessage =
        (error.response.data as { message?: string; error?: string })?.message ||
        (error.response.data as { message?: string; error?: string })?.error ||
        `Request failed with status ${status}`;

      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      return Promise.reject(new Error("Unable to connect to the server. Please check your network connection."));
    }

    return Promise.reject(error);
  }
);

export default api;
