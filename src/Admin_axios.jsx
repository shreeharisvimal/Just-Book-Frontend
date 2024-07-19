import axios from 'axios';

const accessToken = localStorage.getItem("AccessToken");

const Instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});
console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);

export default Instance;
