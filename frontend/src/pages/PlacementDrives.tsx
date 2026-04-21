import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveDrives, applyForDrive } from '../services/driveService';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/layout/Sidebar';

const PlacementDrives: React.FC = () => {
    const { user } = useUser();
    const [drives, setDrives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applying, setApplying] = useState<number | null>(null);
    const navigate = useNavigate();
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successCompanyName, setSuccessCompanyName] = useState('');

    useEffect(() => {
        const fetchDrivesList = async () => {
            try {
                const data = await getActiveDrives();
                setDrives(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch drives');
            } finally {
                setLoading(false);
            }
        };
        fetchDrivesList();
    }, []);

    const handleApply = async (driveId: number, companyName: string) => {
        if (!user) return;
        setApplying(driveId);
        try {
            // Handle both id and _id cases
            const userIdStr = user.id || (user as any)._id;
            const userId = parseInt(userIdStr);
            if (isNaN(userId)) {
                throw new Error("Invalid User ID");
            }

            await applyForDrive(userId, driveId);
            // Refresh drives
            const data = await getActiveDrives();
            setDrives(data);

            // Show Success Modal
            setSuccessCompanyName(companyName);
            setShowSuccessModal(true);
            setTimeout(() => setShowSuccessModal(false), 3000); // Auto close after 3s
        } catch (err: any) {
            showNotification(err.message || 'Failed to apply', 'error');
        } finally {
            setApplying(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />

            <main className="flex-1 ml-20 p-8 relative z-0">
                {/* ... header ... */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                            Active Placement Drives
                        </h1>
                        <p className="text-white/50">Explore and apply for the latest opportunities.</p>
                    </div>
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all">
                        Filter Results
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 flex items-center justify-center min-h-[400px]">
                        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="p-20 text-center">
                        <div className="text-red-400 text-xl font-bold mb-4">⚠️ Oops! Failed to load drives.</div>
                        <p className="text-white/50 mb-6">{error}</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 rounded-lg text-sm font-bold hover:bg-white/20">Try Again</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {!Array.isArray(drives) || drives.length === 0 ? (
                            <div className="text-center py-20 text-white/30">No active drives found.</div>
                        ) : (
                            drives.map((drive, index) => {
                                if (!drive) return null;
                                const companyName = drive.companyName || drive.company || "Unknown Company";
                                const logoLetter = (companyName)[0] || "C";
                                const pkg = drive.package || drive.salary || "N/A";

                                return (
                                    <motion.div
                                        key={drive.id || index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-6 rounded-[24px] bg-white/5 backdrop-blur-[20px] border border-white/10 flex flex-wrap items-center justify-between group hover:border-[#8b5cf6]/50 hover:bg-white/8 transition-all cursor-pointer relative z-10"
                                        onClick={() => {
                                            if (drive.id) navigate(`/drives/${drive.id}`);
                                        }}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-2xl font-bold">
                                                {logoLetter}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{companyName}</h3>
                                                <p className="text-white/50 text-sm">{drive.role || "Role N/A"}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-12">
                                            <div>
                                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Package</p>
                                                <p className="text-white font-medium">{pkg}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Criteria</p>
                                                <p className="text-white font-medium">{drive.eligibility || "N/A"}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${drive.status === 'Applied' ? 'bg-green-500/20 text-green-500' : 'bg-purple-500/20 text-purple-500'}`}>
                                                    {drive.status || "Open"}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (drive.status !== 'Applied' && drive.id) handleApply(drive.id, companyName);
                                            }}
                                            disabled={drive.status === 'Applied' || applying === drive.id}
                                            className={`px-8 py-3 rounded-xl font-bold transition-all ${drive.status === 'Applied' ? 'bg-white/5 text-white/40 cursor-not-allowed' : 'bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5'} ${applying === drive.id ? 'opacity-50' : ''}`}
                                        >
                                            {applying === drive.id ? 'Applying...' : (drive.status === 'Applied' ? 'View Status' : 'Apply Now')}
                                        </button>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                )}
            </main>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#15151e] border border-green-500/30 rounded-3xl p-8 flex flex-col items-center shadow-[0_0_50px_rgba(34,197,94,0.2)] max-w-sm text-center"
                    >
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Application Sent! 🚀</h3>
                        <p className="text-white/60 mb-6">
                            Successfully applied to <span className="text-white font-bold">{successCompanyName}</span>.
                            Good luck!
                        </p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="bg-white/10 hover:bg-white/20 text-white px-8 py-2 rounded-xl font-bold transition-all"
                        >
                            Awesome
                        </button>
                    </motion.div>
                </div>
            )}

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
                            {notification.type === 'success' ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            )}
                        </div>
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlacementDrives;
