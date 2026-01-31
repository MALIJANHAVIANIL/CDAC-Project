import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getUserApplications } from '../services/driveService';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/common/Sidebar';

const Applications: React.FC = () => {
    const { user } = useUser();
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApps = async () => {
            if (user) {
                try {
                    // FIX: Handle both id and _id to ensure we get a valid number
                    const userIdStr = user.id || (user as any)._id;
                    const userId = parseInt(userIdStr);

                    if (!userId || isNaN(userId)) {
                        console.error("Invalid User ID for fetching applications:", user);
                        setLoading(false);
                        return;
                    }

                    console.log("Fetching applications for user:", userId);
                    const data = await getUserApplications(userId);
                    console.log("Fetched applications:", data);
                    setApps(data || []);
                } catch (err) {
                    console.error("Failed to fetch applications", err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchApps();
    }, [user]);

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-20 p-8">
                <h1 className="text-3xl font-extrabold bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent mb-10">
                    Track Applications
                </h1>

                {loading ? (
                    <div className="p-8 flex items-center justify-center min-h-[400px]">
                        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {apps.length === 0 ? (
                            <div className="text-center py-20 flex flex-col items-center justify-center">
                                <div className="text-6xl mb-6 opacity-20">📂</div>
                                <h3 className="text-xl font-bold text-white mb-2">No Applications Yet</h3>
                                <p className="text-white/50 mb-8 max-w-md mx-auto">
                                    You haven't applied to any placement drives yet. Explore active drives and start your journey!
                                </p>
                                <button
                                    onClick={() => navigate('/placements')}
                                    className="px-8 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-1"
                                >
                                    Browse Active Drives
                                </button>
                            </div>
                        ) : (
                            apps.map((app, index) => (
                                <motion.div
                                    key={app.applicationId || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 rounded-[32px] bg-white/5 backdrop-blur-[20px] border border-white/10 flex flex-wrap items-center justify-between group hover:border-[#8b5cf6]/50 transition-all"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold">
                                            {(app.companyName || "C")[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{app.companyName}</h3>
                                            <p className="text-white/50 text-sm">{app.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-12 text-center">
                                        <div>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Applied On</p>
                                            <p className="text-white font-medium">{new Date(app.appliedAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Status</p>
                                            <span className={`font-bold ${app.status === 'Rejected' ? 'text-red-400' : 'text-[#8b5cf6]'}`}>{app.status}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <p className="text-sm text-white/70 italic">
                                            {app.status === 'Applied' ? 'Application Under Review' : 'Check Email'}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Applications;
