import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:5004', // Replace with your API base URL
  withCredentials: true, // Include cookies in requests
});

export default api;
