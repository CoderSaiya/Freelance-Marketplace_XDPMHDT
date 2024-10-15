import axios from 'axios';

const BASE_URL = import.meta.env.BASE_URL;

const API_URL = `${BASE_URL}/api/file-upload`;

export const uploadImage = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
