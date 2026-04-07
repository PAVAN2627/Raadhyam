import axios from 'axios';

const api = axios.create({
  baseURL: '/api/courses',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCourses = () => api.get();
export const getCourse = (id) => api.get(`/${id}`);
export const createCourse = (data) => api.post('', data);
export const updateCourse = (id, data) => api.put(`/${id}`, data);
export const deleteCourse = (id) => api.delete(`/${id}`);