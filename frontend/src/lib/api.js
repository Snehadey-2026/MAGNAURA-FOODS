const API_BASE = '/api';

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('magnaura_token');
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

export const api = {
  getHero: () => request('/hero'),
  getBrands: () => request('/brands'),
  getMenu: () => request('/menu'),
  submitFranchise: (payload) =>
    request('/franchise', { method: 'POST', body: JSON.stringify(payload) }),
  submitContact: (payload) =>
    request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  adminSummary: () => request('/admin/summary'),
  createResource: (resource, payload) =>
    request(`/admin/${resource}`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteResource: (resource, id) => request(`/admin/${resource}/${id}`, { method: 'DELETE' }),
};
