// API Configuration
const API_CONFIG = {
  // Local backend URL
  BASE_URL: 'http://localhost:5000',
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
    },
    EQUIPMENT: '/api/equipment',
    RENT_REQUESTS: '/api/rent-requests',
    UPLOAD: '/api/upload',
  }
};

export default API_CONFIG;