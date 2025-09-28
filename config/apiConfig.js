// API Configuration
const API_CONFIG = {
  // Your actual Render deployment URL
  BASE_URL: 'https://agroverse-backend.onrender.com',
  
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