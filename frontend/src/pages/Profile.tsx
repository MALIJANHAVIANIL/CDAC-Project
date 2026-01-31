import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/profileService';

import Sidebar from '../components/layout/Sidebar';

const Profile: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        branch: '',
        cgpa: '',
        studentId: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                branch: user.branch || '',
                cgpa: user.cgpa?.toString() || '',
                studentId: user.studentId || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const updatedUser = await updateProfile(formData);
            // Check if API returns the full user object (JwtResponse style) or just a message
            // Currently backend returns JwtResponse without token, so we can use it directly if token is handled
            // But we need to keep the token.
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const token = localStorage.getItem('token');

            // Build new user object
            const newUser = { ...currentUser, ...updatedUser, token }; // Ensure token persists

            localStorage.setItem('user', JSON.stringify(newUser));
            alert('Profile Updated Successfully!');
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile');
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const { uploadResume } = await import('../services/profileService');
                const response = await uploadResume(e.target.files[0]);
                // Assuming response contains the file URL or similar
                alert('Resume uploaded successfully!');

                // Update local storage user
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                currentUser.resumeUrl = response.message; // Backend implementation returned URL in message
                localStorage.setItem('user', JSON.stringify(currentUser));
                window.location.reload();
            } catch (error) {
                console.error('Resume upload failed', error);
                alert('Resume upload failed');
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-20 p-8 flex items-center justify-center min-h-screen relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-all group"
                >
                    <span className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all">←</span>
                    <span className="font-bold">Back</span>
                </button>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[32px] p-10 shadow-2xl w-full max-w-3xl"
                >
                    <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-4xl font-black shadow-xl shadow-purple-500/20">
                            {user?.name?.substring(0, 1) || '?'}
                        </div>
                        <div className="text-center md:text-left flex-1 w-full">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="text-4xl font-black text-white bg-transparent border-b-2 border-purple-500 focus:outline-none w-full"
                                    placeholder="Enter Name"
                                />
                            ) : (
                                <h1 className="text-4xl font-black text-white mb-2">{user?.name}</h1>
                            )}
                            <p className="text-purple-400 font-bold uppercase tracking-widest text-sm">{user?.role}</p>
                            {user?.resumeUrl && (
                                <a href={user.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-green-400 mt-2 hover:underline inline-block">
                                    View Resume
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProfileField label="Email Address" name="email" value={formData.email} onChange={handleChange} disabled={true} />
                        <ProfileField label="Branch" name="branch" value={formData.branch} onChange={handleChange} isEditing={isEditing} />
                        <ProfileField label="CGPA" name="cgpa" value={formData.cgpa} onChange={handleChange} isEditing={isEditing} />
                        <ProfileField
                            label="Student ID"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            isEditing={isEditing}
                            placeholder="Enter Student ID"
                        />
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 flex justify-end gap-4">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="px-8 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-all">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all">
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">
                                Edit Profile
                            </button>
                        )}
                        <label className="px-8 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer">
                            Upload Resume
                            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                        </label>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

const ProfileField = ({ label, value, name, onChange, isEditing = false, disabled = false, placeholder }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">{label}</label>
        {isEditing && !disabled ? (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full py-4 px-6 bg-white/10 border border-white/20 rounded-2xl text-white font-medium focus:outline-none focus:border-purple-500 transition-all"
            />
        ) : (
            <div className="w-full py-4 px-6 bg-white/5 border border-white/5 rounded-2xl text-white/80 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                {value || 'N/A'}
            </div>
        )}
    </div>
);



export default Profile;
