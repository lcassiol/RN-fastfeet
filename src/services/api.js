import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.35:3000',
  // baseURL: 'http://localhost:3000',
});

export default api;
