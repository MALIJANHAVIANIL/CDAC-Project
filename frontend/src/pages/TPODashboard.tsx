import { useState } from 'react';
import JobApproval from '../components/JobApproval';
import StudentManagement from '../components/StudentManagement';
import CourseManagement from '../components/CourseManagement';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Briefcase, Users, BookOpen, LogOut, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';

const TPODashboard = () => {
    const [activeTab, setActiveTab] = useState<'jobs' | 'students' | 'courses'>('jobs');
    const navigate = useNavigate();
    const { user } = useUser();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth'); // Updated to /auth consistent with other pages
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
            <Sidebar />

            <div className="flex-1 ml-20 flex flex-col h-screen overflow-y-auto custom-scrollbar">
                <header className="h-24 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10 sticky top-0 z-[100]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                TPO Control Center
                            </h1>
                            <p className="text-xs text-white/40 mt-1">Welcome back, {user?.name?.split(' ')[0] || 'Administrator'}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-3 px-6 py-3 text-sm font-bold text-red-400 bg-red-500/5 border border-red-500/10 rounded-2xl hover:bg-red-500 hover:text-white transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                        <LogOut size={18} className="transition-transform group-hover:translate-x-1" />
                        Logout
                    </button>
                </header>

                <div className="p-10 flex-1">
                    {/* Tabs */}
                    <div className="flex gap-4 mb-10 bg-white/[0.02] p-2 rounded-3xl w-fit border border-white/5 backdrop-blur-xl">
                        <button
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === 'jobs'
                                ? 'bg-[#8b5cf6] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                                : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            onClick={() => setActiveTab('jobs')}
                        >
                            <Briefcase size={18} />
                            Job Approvals
                        </button>
                        <button
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === 'students'
                                ? 'bg-[#8b5cf6] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                                : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            onClick={() => setActiveTab('students')}
                        >
                            <Users size={18} />
                            Student Manager
                        </button>
                        <button
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all ${activeTab === 'courses'
                                ? 'bg-[#8b5cf6] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                                : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            onClick={() => setActiveTab('courses')}
                        >
                            <BookOpen size={18} />
                            Courses
                        </button>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {activeTab === 'jobs' && <JobApproval />}
                        {activeTab === 'students' && <StudentManagement />}
                        {activeTab === 'courses' && <CourseManagement />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TPODashboard;
