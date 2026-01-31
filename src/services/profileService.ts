import { fetchWithAuth } from './api';

export const updateProfile = async (userData: any) => {
    const response = await fetchWithAuth('/auth/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return response.json();
};
