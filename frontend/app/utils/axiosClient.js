import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
  timeout: 30000, // Increased timeout
});

// Request interceptor
axiosClient.interceptors.request.use(config => {
  // Client-side only operations
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  // Handle Content-Type for FormData
  if (config.data instanceof FormData) {
    // Browser will set multipart/form-data with boundary
    if (config.headers) {
      delete config.headers['Content-Type'];
    }
  } else if (config.data && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  console.log('🚀 Axios Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    hasData: !!config.data,
    isFormData: config.data instanceof FormData
  });
  
  return config;
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Safe logging - avoid logging large responses
    console.log('✅ Axios Response Success:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase()
    });
    return response;
  },
  (error) => {
    // Check if it's a timeout error
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout:', error.config?.url);
    }
    
    // Log detailed error info (response body, serialized error)
    const errInfo = {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      responseData: error.response?.data,
      errorJson: typeof error.toJSON === 'function' ? error.toJSON() : undefined
    };

    if (process.env.NODE_ENV === 'production') {
      // Concise single-line log for production
      console.error(`❌ Axios Error: ${errInfo.status || ''} ${errInfo.message || ''} ${errInfo.url || ''}`);
    } else {
      // Detailed object in development for debugging
      console.error('❌ Axios Error:', errInfo);
    }
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // Optional: redirect to login
        // window.location.href = '/auth/login';
      }
    }
    
    // Attach normalized info to the error for callers
    try { error.__normalized = { status: error.response?.status, url: error.config?.url, data: error.response?.data }; } catch(e) {}
    return Promise.reject(error);
  }
);

export default axiosClient;