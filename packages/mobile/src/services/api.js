import axios from 'axios';
import Constants from 'expo-constants';

// Backend API adresi. Uretimde app.json > extra.apiUrl veya .env ile ayarlayin.
export const API_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000/api';

const apiClient = axios.create({ baseURL: API_URL });

export const takeoffAPI = {
  getAll: () => apiClient.get('/takeoffs'),
  getById: (id) => apiClient.get(`/takeoffs/${id}`),
  analyze: (formData, token) =>
    apiClient.post('/takeoffs/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }),
  delete: (id, token) =>
    apiClient.delete(`/takeoffs/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
  excelUrl: (id) => `${API_URL}/takeoffs/${id}/excel`,
};

export default apiClient;
