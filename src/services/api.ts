const BASE_URL = 'http://localhost:8084/api';

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
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
