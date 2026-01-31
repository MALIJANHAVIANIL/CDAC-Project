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

export const uploadResume = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetchWithAuth('/files/upload/resume', {
        method: 'POST',
        body: formData,
    });
    return response.json();
};
