const BASE_URL = 'http://localhost:8089/api';

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');

    const headers: any = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/auth';
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Something went wrong');
    }

    return response;
};
