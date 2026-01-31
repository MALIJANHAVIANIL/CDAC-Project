import { fetchWithAuth } from './api';

export const getStudentStats = async () => {
    const response = await fetchWithAuth('/analytics/student-stats');
    return response.json();
};

export const getTpoStats = async () => {
    const response = await fetchWithAuth('/analytics/tpo-stats');
    return response.json();
};
