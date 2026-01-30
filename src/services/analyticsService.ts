import { fetchWithAuth } from './api';

export const getTpoStats = async () => {
    const response = await fetchWithAuth('/analytics/tpo-stats');
    return response.json();
};
