import { fetchWithAuth } from './api';

export const getActiveDrives = async () => {
    const response = await fetchWithAuth('/drives/active');
    return response.json();
};

export const applyForDrive = async (userId: number, driveId: number) => {
    const response = await fetchWithAuth(`/applications/apply?userId=${userId}&driveId=${driveId}`, {
        method: 'POST'
    });
    return response.json();
};

export const getUserApplications = async (userId: number) => {
    const response = await fetchWithAuth(`/applications/user/${userId}`);
    return response.json();
};
