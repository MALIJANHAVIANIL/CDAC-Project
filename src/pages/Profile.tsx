import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

const Profile: React.FC = () => {
    const { user } = useUser();

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[32px] p-10 shadow-2xl"
            >
                <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-4xl font-black shadow-xl shadow-purple-500/20">
                        {user?.name?.substring(0, 1) || '?'}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black text-white mb-2">{user?.name}</h1>
                        <p className="text-purple-400 font-bold uppercase tracking-widest text-sm">{user?.role}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProfileField label="Email Address" value={user?.email || 'N/A'} />
                    <ProfileField label="Branch" value={user?.branch || 'Information Technology'} />
                    <ProfileField label="CGPA" value={user?.cgpa?.toString() || '8.5'} />
                    <ProfileField label="Student ID" value="STUDENT_2024_001" />
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex justify-end gap-4">
                    <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">
                        Edit Profile
                    </button>
                    <button className="px-8 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                        Upload Resume
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const ProfileField = ({ label, value }: { label: string, value: string }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">{label}</label>
        <div className="w-full py-4 px-6 bg-white/5 border border-white/5 rounded-2xl text-white/80 font-medium">
            {value}
        </div>
    </div>
);

export default Profile;
