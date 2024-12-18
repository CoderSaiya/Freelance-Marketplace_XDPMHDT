import axios from 'axios';

const BASE_URL = import.meta.env.BASE_URL;

const API_URL = `${BASE_URL}api/auth`;

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};

export const refreshToken = async (token: string) => {
  const response = await axios.post(`${API_URL}/refresh-token`, { token });
  return response.data;
};
