import { fetchWithAuth } from './api';

export interface PlacementDrive {
    id: number;
    companyName: string;
    role: string;
    location: string;
    packageValue: string;
    deadline: string;
    type: string;
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Student {
    id: number;
    name: string;
    email: string;
    role: string;
    branch?: string;
    cgpa?: number;
    phone?: string;
    resumeUrl?: string;
    accountStatus: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
}

export interface Course {
    id: number;
    name: string;
    code: string;
    credits: number;
    semester: number;
}

export const getPendingDrives = async () => {
    const response = await fetchWithAuth('/tpo/drives/pending');
    if (!response.ok) throw new Error('Failed to fetch pending drives');
    return response.json();
};

export const approveDrive = async (id: number) => {
    const response = await fetchWithAuth(`/tpo/drives/${id}/approve`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error('Failed to approve drive');
    return response.json();
};

export const rejectDrive = async (id: number, reason: string) => {
    const response = await fetchWithAuth(`/tpo/drives/${id}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to reject drive');
    return response.json();
};

export const getStudents = async (status?: string) => {
    const query = status ? `?status=${status}` : '';
    const response = await fetchWithAuth(`/tpo/students${query}`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
};

export const banStudent = async (id: number) => {
    const response = await fetchWithAuth(`/tpo/students/${id}/ban`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error('Failed to ban student');
    return response.json();
};

export const activateStudent = async (id: number) => {
    const response = await fetchWithAuth(`/tpo/students/${id}/activate`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error('Failed to activate student');
    return response.json();
};

export const getCourses = async () => {
    const response = await fetchWithAuth('/tpo/courses');
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
};

export const createCourse = async (course: Omit<Course, 'id'>) => {
    const response = await fetchWithAuth('/tpo/courses', {
        method: 'POST',
        body: JSON.stringify(course)
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
};

export const assignCourse = async (courseId: number, studentId: number) => {
    const response = await fetchWithAuth(`/tpo/courses/${courseId}/assign/${studentId}`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to assign course');
    return response.json();
};
