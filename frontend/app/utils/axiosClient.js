// import axios from 'axios';

// const axiosClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
// });

// // Add token automatically to every request
// axiosClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('accessToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosClient;

// utils/axiosClient.js
// import axios from 'axios';

// const axiosClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
// });

// // Add token automatically to every request (client-side only)
// axiosClient.interceptors.request.use(config => {
//   // This only runs in the browser
//   if (typeof window !== 'undefined') {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });

// export default axiosClient;

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
});

// Add token automatically to every request (client-side only)
axiosClient.interceptors.request.use(config => {
  // This only runs in the browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  // Important: Don't set Content-Type for FormData - let browser set it automatically
  // This is crucial for file uploads to work properly
  if (config.data instanceof FormData) {
    // Browser will automatically set Content-Type with boundary for FormData
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  
  console.log('🚀 Axios Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    dataType: config.data instanceof FormData ? 'FormData' : typeof config.data
  });
  
  return config;
});

// Response interceptor for better error handling
axiosClient.interceptors.response.use(
  (response) => {
    console.log('✅ Axios Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Axios Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message,
      data: error.response?.data
    });
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // You might want to redirect to login page here
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;