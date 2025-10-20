// Toggle backend integration
// Set to true when running PHP backend locally or on a server
export const USE_BACKEND = false; // change to true to use API
export const API_URL = 'http://127.0.0.1:8000/api';

// Also expose globally for non-module utilities if needed
window.API_URL = API_URL;
