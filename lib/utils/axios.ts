import axios from 'axios';
import { toast } from 'sonner';

// Axios Instance 
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error("Session expired. Please login again.", { id: 'session-expired' });
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);