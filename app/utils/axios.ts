import axios from 'axios';
import { baseURL } from './url';

const api = axios.create({
  baseURL: baseURL,
  timeout: 50000,
  withCredentials: false,
});

export default api;







