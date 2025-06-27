// API configurations
export const API_BASE_URL = "https://iplant-backend-lyart.vercel.app/api";

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "iplant_auth_token",
  REFRESH_TOKEN: "iplant_refresh_token",
  USER: "iplant_user",
  TOKEN_EXPIRY: "iplant_token_expiry",
};
