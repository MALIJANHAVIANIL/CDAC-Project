import React, { useState } from 'react';
import JobApproval from '../components/JobApproval';
import StudentManagement from '../components/StudentManagement';
import CourseManagement from '../components/CourseManagement';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const TPODashboard = () => {
    const [activeTab, setActiveTab] = useState<'jobs' | 'students' | 'courses'>('jobs');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar /> {/* Use Global Sidebar */}

            <div className="flex-1 ml-20 flex flex-col p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                            TPO Dashboard
                        </h1>
                        <p className="text-white/50">Manage jobs, students, and courses.</p>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 text-sm text-red-400 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-all">
                        Logout
                    </button>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 bg-white/5 p-1 rounded-2xl w-fit border border-white/10 backdrop-blur-md">
                    <button
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'jobs' ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/30' : 'text-white/50 hover:text-white'}`}
                        onClick={() => setActiveTab('jobs')}
                    >
                        Job Approvals
                    </button>
                    <button
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/30' : 'text-white/50 hover:text-white'}`}
                        onClick={() => setActiveTab('students')}
                    >
                        Student Manager
                    </button>
                    <button
                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/30' : 'text-white/50 hover:text-white'}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        Courses
                    </button>
                </div>

                <div className="flex-1">
                    {activeTab === 'jobs' && <JobApproval />}
                    {activeTab === 'students' && <StudentManagement />}
                    {activeTab === 'courses' && <CourseManagement />}
                </div>
            </div>
        </div>
    );
};

export default TPODashboard;
