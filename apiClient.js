// apiClient.js - simple fetch wrapper
const API_URL = window.API_URL || 'http://localhost:8000/api'; // adjust port if using PHP built-in server

const apiClient = {
  async request(path, { method = 'GET', body, token } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text().catch(()=> '');
      throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
    }
    return res.json().catch(()=> ({}));
  },
  get(path, opts) { return this.request(path, { ...opts, method: 'GET' }); },
  post(path, body, opts) { return this.request(path, { ...opts, method: 'POST', body }); },
  put(path, body, opts) { return this.request(path, { ...opts, method: 'PUT', body }); },
  delete(path, opts) { return this.request(path, { ...opts, method: 'DELETE' }); },
};

export default apiClient;
