import { fetchWithAuth } from './api';

export const login = async (credentials: any) => {
    const response = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
    // Store user info without token to avoid duplication/bloat
    const { token, ...userData } = data;
    localStorage.setItem('user', JSON.stringify(userData));
    return data;
};

export const register = async (userData: any) => {
    const response = await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
    return response.json();
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth';
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};
