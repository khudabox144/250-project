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
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
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
  return config;
});

export default axiosClient;