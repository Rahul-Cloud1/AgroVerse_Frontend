// API Configuration
// Set EXPO_PUBLIC_API_BASE_URL in your .env file (see .env.example).
// Falls back to localhost for local development only - this MUST be
// overridden for any build that isn't running against a local backend,
// since localhost is unreachable from a real device or production server.
const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
    },
    EQUIPMENT: '/api/equipment',
    RENT_REQUESTS: '/api/rent-requests',
    UPLOAD: '/api/upload',
    ORDERS: '/api/orders',
  }
};

export default API_CONFIG;