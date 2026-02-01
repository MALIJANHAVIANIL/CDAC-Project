import { fetchWithAuth } from './api';

export const getActiveDrives = async () => {
    const response = await fetchWithAuth('/drives/active');
    return response.json();
};

export const getAllDrives = async () => {
    const response = await fetchWithAuth('/drives/all');
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

export const deleteDrive = async (id: number) => {
    await fetchWithAuth(`/drives/${id}`, {
        method: 'DELETE'
    });
};

export const createDrive = async (driveData: any) => {
    const response = await fetchWithAuth('/drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driveData)
    });
    return response.json();
};

export const updateDrive = async (id: number, driveData: any) => {
    const response = await fetchWithAuth(`/drives/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driveData)
    });
    return response.json();
};
