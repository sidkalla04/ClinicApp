import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sfcc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sfcc_token');
      localStorage.removeItem('sfcc_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginApi = (data) => api.post('/auth/login', data);
export const getMeApi = () => api.get('/auth/me');

// Patients
export const getPatientsApi = (params) => api.get('/patients', { params });
export const getPatientApi = (id) => api.get(`/patients/${id}`);
export const createPatientApi = (data) => api.post('/patients', data);
export const updatePatientApi = (id, data) => api.put(`/patients/${id}`, data);
export const deletePatientApi = (id) => api.delete(`/patients/${id}`);
export const getStatsApi = () => api.get('/patients/stats');

// Therapy Sessions
export const getTherapySessionsApi = (patientId) => api.get(`/patients/${patientId}/therapy`);
export const addTherapySessionApi = (patientId, data) => api.post(`/patients/${patientId}/therapy`, data);
export const updateTherapySessionApi = (sessionId, data) => api.put(`/therapy/${sessionId}`, data);
export const deleteTherapySessionApi = (sessionId) => api.delete(`/therapy/${sessionId}`);

export default api;
