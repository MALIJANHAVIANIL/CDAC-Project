import { fetchWithAuth } from './api';

export interface Notification {
    id: number;
    message: string;
    type: string;
    isRead: boolean; // Match backend naming or handle both
    createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await fetchWithAuth('/notifications');
    return response.json();
};

export const markAsRead = async (id: number) => {
    await fetchWithAuth(`/notifications/${id}/read`, {
        method: 'PUT',
    });
};

export const markAllAsRead = async () => {
    await fetchWithAuth('/notifications/read-all', {
        method: 'PUT',
    });
};
