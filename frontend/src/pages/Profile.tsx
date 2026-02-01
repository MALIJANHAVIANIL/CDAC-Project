import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/profileService';
import Sidebar from '../components/layout/Sidebar';
import {
    User,
    Mail,
    Briefcase,
    GraduationCap,
    FileText,
    Save,
    X,
    Edit3,
    ArrowLeft,
    Upload,
    CheckCircle,
    AlertCircle,
    Building2,
    Calendar,
    BookOpen,
    PieChart,
    Hash
} from 'lucide-react';

const Profile: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        branch: '',
        cgpa: '',
        studentId: '',
        backlogs: '',
        attendance: '',
        tenthMarks: '',
        twelfthMarks: ''
    });
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                branch: user.branch || '',
                cgpa: user.cgpa?.toString() || '',
                studentId: user.studentId || '',
                backlogs: user.backlogs?.toString() || '',
                attendance: user.attendance?.toString() || '',
                tenthMarks: user.tenthMarks?.toString() || '',
                twelfthMarks: user.twelfthMarks?.toString() || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const updatedUser = await updateProfile(formData);
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const token = localStorage.getItem('token');
            const newUser = { ...currentUser, ...updatedUser, token };
            localStorage.setItem('user', JSON.stringify(newUser));
            showNotification('Profile Updated Successfully! ✨', 'success');
            setIsEditing(false);
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error('Failed to update profile', error);
            showNotification('Failed to update profile', 'error');
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const { uploadResume } = await import('../services/profileService');
                const response = await uploadResume(e.target.files[0]);
                showNotification('Resume uploaded successfully! 📄', 'success');
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                currentUser.resumeUrl = response.message;
                localStorage.setItem('user', JSON.stringify(currentUser));
                setTimeout(() => window.location.reload(), 2000);
            } catch (error) {
                console.error('Resume upload failed', error);
                showNotification('Resume upload failed', 'error');
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />

            <main className="flex-1 ml-20 p-8 flex flex-col items-center">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="self-start flex items-center gap-2 text-white/40 hover:text-white transition-all group mb-8"
                >
                    <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-all border border-white/5">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-widest">Back</span>
                </motion.button>

                <div className="w-full max-w-4xl space-y-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative p-10 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative flex flex-col md:flex-row items-center gap-10">
                            <div className="w-40 h-40 rounded-[32px] bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-5xl font-black shadow-[0_20px_50px_rgba(139,92,246,0.3)] border-4 border-white/10">
                                {user?.name?.substring(0, 1) || '?'}
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="text-4xl font-black text-white bg-white/10 border border-white/10 rounded-2xl px-4 py-2 focus:outline-none focus:border-purple-500 w-full"
                                            placeholder="Full Name"
                                        />
                                    ) : (
                                        <h1 className="text-5xl font-black text-white tracking-tight">{user?.name}</h1>
                                    )}
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                                        <span className="px-4 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs font-black uppercase tracking-widest">
                                            {user?.role}
                                        </span>
                                        <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-black uppercase tracking-widest">
                                            {user?.branch || 'N/A Branch'}
                                        </span>
                                    </div>
                                </div>

                                {user?.resumeUrl && (
                                    <a
                                        href={user.resumeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-green-400 hover:text-green-300 transition-colors group"
                                    >
                                        <FileText size={16} className="group-hover:scale-110 transition-transform" />
                                        View Professional Resume
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats & Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="md:col-span-2 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <User size={20} className="text-purple-500" />
                                    Account Details
                                </h3>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border border-white/5"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileField
                                    icon={<Mail size={16} />}
                                    label="Email Address"
                                    value={formData.email}
                                    disabled={true}
                                />
                                {user?.role === 'STUDENT' ? (
                                    <>
                                        <ProfileField
                                            icon={<GraduationCap size={16} />}
                                            label="Student ID"
                                            name="studentId"
                                            value={formData.studentId}
                                            onChange={handleChange}
                                            isEditing={isEditing}
                                            placeholder="Enter ID"
                                        />
                                        <ProfileField
                                            icon={<Building2 size={16} />}
                                            label="Branch"
                                            name="branch"
                                            value={formData.branch}
                                            onChange={handleChange}
                                            isEditing={isEditing}
                                        />
                                        <ProfileField
                                            icon={<PieChart size={16} />}
                                            label="CGPA"
                                            name="cgpa"
                                            value={formData.cgpa}
                                            onChange={handleChange}
                                            isEditing={isEditing}
                                        />
                                        <ProfileField
                                            icon={<AlertCircle size={16} />}
                                            label="Backlogs"
                                            name="backlogs"
                                            value={formData.backlogs}
                                            onChange={handleChange}
                                            isEditing={isEditing}
                                            type="number"
                                        />
                                    </>
                                ) : (
                                    <ProfileField
                                        icon={<Building2 size={16} />}
                                        label="Department"
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        isEditing={isEditing}
                                    />
                                )}
                            </div>

                            {isEditing && (
                                <div className="flex gap-4 pt-6 mt-6 border-t border-white/5">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 py-4 bg-white/5 hover:bg-red-500/10 text-white hover:text-red-400 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 py-4 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-[0_10px_30px_rgba(139,92,246,0.3)] transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> Save Changes
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* Side Widgets */}
                        <div className="space-y-8">
                            {/* Academic Performance / Quick Stats */}
                            {user?.role === 'STUDENT' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="p-8 rounded-[40px] bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-xl shadow-purple-500/20"
                                >
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Academic Score</h4>
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-6xl font-black leading-none">{user?.cgpa || '0'}</span>
                                        <span className="text-xl font-bold opacity-60 mb-1">GPA</span>
                                    </div>
                                    <p className="text-xs font-bold opacity-80 leading-relaxed">
                                        Your academic performance is tracked for placement eligibility.
                                    </p>
                                </motion.div>
                            )}

                            {/* Resume Widget */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl"
                            >
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex items-center gap-2">
                                    <FileText size={14} /> Documents
                                </h4>
                                {user?.role === 'STUDENT' ? (
                                    <div className="space-y-4">
                                        <p className="text-xs text-white/50 font-medium">Keep your resume updated for the best placement opportunities.</p>
                                        <label className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-all group overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <Upload size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-black uppercase tracking-widest">Upload Resume</span>
                                            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 opacity-30">
                                        <Briefcase size={40} className="mx-auto mb-4" />
                                        <p className="text-xs font-bold">HR Management Role</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>

                    {/* Additional Fields (Optional for Students) */}
                    {user?.role === 'STUDENT' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl"
                        >
                            <h3 className="text-lg font-black text-white/50 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <BookOpen size={20} className="text-blue-500" />
                                Educational History
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ProfileField
                                    icon={<Hash size={16} />}
                                    label="System Identity UID"
                                    value={user?.id}
                                    disabled={true}
                                />
                                <ProfileField
                                    icon={<Calendar size={16} />}
                                    label="Attendance (%)"
                                    name="attendance"
                                    value={formData.attendance}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    type="number"
                                />
                                <ProfileField
                                    icon={<CheckCircle size={16} />}
                                    label="10th Marks (%)"
                                    name="tenthMarks"
                                    value={formData.tenthMarks}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    type="number"
                                />
                                <ProfileField
                                    icon={<CheckCircle size={16} />}
                                    label="12th Marks (%)"
                                    name="twelfthMarks"
                                    value={formData.twelfthMarks}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                    type="number"
                                />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Notifications */}
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 font-bold backdrop-blur-xl ${notification.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-400 shadow-green-500/10'
                                : 'bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/10'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${notification.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            </div>
                            {notification.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const ProfileField = ({ icon, label, value, name, onChange, isEditing = false, disabled = false, placeholder, type = "text" }: any) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-4 group-focus-within:text-purple-400 transition-colors flex items-center gap-2">
            {icon} {label}
        </label>
        {isEditing && !disabled ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-[20px] text-white font-bold focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all text-sm"
            />
        ) : (
            <div className="w-full py-4 px-6 bg-white/[0.02] border border-white/5 rounded-[20px] text-white/60 font-black tracking-tight whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                {value || 'N/A'}
                {disabled && <span className="ml-2 text-[8px] opacity-30">(Locked)</span>}
            </div>
        )}
    </div>
);

export default Profile;
