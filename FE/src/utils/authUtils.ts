import Cookies from 'js-cookie';

export const setToken = (token: string, expiresIn: number) => {
  Cookies.set('token', token, { expires: expiresIn / (24 * 60 * 60) });
};

export const setRefreshToken = (refreshToken: string) => {
  Cookies.set('refreshToken', refreshToken);
};

export const getToken = () => Cookies.get('token');
export const getRefreshToken = () => Cookies.get('refreshToken');
export const removeToken = () => Cookies.remove('token');
export const removeRefreshToken = () => Cookies.remove('refreshToken');