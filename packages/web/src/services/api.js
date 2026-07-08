import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  verify: () => apiClient.get('/auth/verify'),
};

export const projectAPI = {
  getAll: () => apiClient.get('/projects'),
  getById: (id) => apiClient.get(`/projects/${id}`),
  create: (data) => apiClient.post('/projects', data),
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  delete: (id) => apiClient.delete(`/projects/${id}`),
};

export const teamAPI = {
  getAll: () => apiClient.get('/teams'),
  getById: (id) => apiClient.get(`/teams/${id}`),
  create: (data) => apiClient.post('/teams', data),
  update: (id, data) => apiClient.put(`/teams/${id}`, data),
  delete: (id) => apiClient.delete(`/teams/${id}`),
};

export const materialAPI = {
  getAll: () => apiClient.get('/materials'),
  getById: (id) => apiClient.get(`/materials/${id}`),
  create: (data) => apiClient.post('/materials', data),
  update: (id, data) => apiClient.put(`/materials/${id}`, data),
  delete: (id) => apiClient.delete(`/materials/${id}`),
};

export const equipmentAPI = {
  getAll: () => apiClient.get('/equipment'),
  getById: (id) => apiClient.get(`/equipment/${id}`),
  create: (data) => apiClient.post('/equipment', data),
  update: (id, data) => apiClient.put(`/equipment/${id}`, data),
  delete: (id) => apiClient.delete(`/equipment/${id}`),
};

export const reportAPI = {
  getAll: () => apiClient.get('/reports'),
  getById: (id) => apiClient.get(`/reports/${id}`),
  create: (data) => apiClient.post('/reports', data),
  update: (id, data) => apiClient.put(`/reports/${id}`, data),
  delete: (id) => apiClient.delete(`/reports/${id}`),
};

// Metraj (AI quantity takeoff)
export const takeoffAPI = {
  getAll: () => apiClient.get('/takeoffs'),
  getById: (id) => apiClient.get(`/takeoffs/${id}`),
  analyze: (formData) =>
    apiClient.post('/takeoffs/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) => apiClient.put(`/takeoffs/${id}`, data),
  delete: (id) => apiClient.delete(`/takeoffs/${id}`),
  downloadExcel: (id) =>
    apiClient.get(`/takeoffs/${id}/excel`, { responseType: 'blob' }),
};

export default apiClient;