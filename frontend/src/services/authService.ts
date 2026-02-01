// Generic fetch without auth header for login/signup
const publicFetch = async (endpoint: string, options: RequestInit = {}) => {
    const BASE_URL = 'http://localhost:8089/api'; // Hardcoded for safety or import from api.ts if exported
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Something went wrong');
    }
    return response;
};

export const login = async (credentials: any) => {
    // Backend expects /auth/signin
    const response = await publicFetch('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    localStorage.setItem('token', data.token); // Backend returns "token" in JwtResponse
    // User info: { id, username, email, roles ... }
    const { token, ...userData } = data;
    localStorage.setItem('user', JSON.stringify(userData));
    return data;
};

export const register = async (userData: any) => {
    // Backend expects /auth/signup
    const response = await publicFetch('/auth/signup', {
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
