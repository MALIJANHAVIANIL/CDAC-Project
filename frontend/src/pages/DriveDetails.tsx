import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom'; // Added useParams and useNavigate
import { getActiveDrives, applyForDrive } from '../services/driveService';
import { useUser } from '../context/UserContext';

const DriveDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useUser();
    const navigate = useNavigate();
    const [drive, setDrive] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        const fetchDrive = async () => {
            try {
                const drives = await getActiveDrives();
                const found = drives.find((d: any) => d.id.toString() === id);
                setDrive(found);
            } catch (err) {
                console.error("Failed to fetch drive details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDrive();
    }, [id]);

    const handleApply = async () => {
        if (!user || !drive) return;
        setApplying(true);
        try {
            await applyForDrive(parseInt(user.id), drive.id);
            showNotification('Application successful! 🚀', 'success');
            setTimeout(() => navigate('/applications'), 1500);
        } catch (err: any) {
            showNotification(err.message || 'Failed to apply', 'error');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!drive) {
        return <div className="p-20 text-center text-white/30">Drive not found.</div>;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
            >
                <div className="h-48 bg-gradient-to-r from-purple-600/30 to-blue-600/30 relative">
                    <div className="absolute -bottom-10 left-10 w-24 h-24 rounded-3xl bg-white flex items-center justify-center text-4xl shadow-2xl border-4 border-[#0a0a0f]">
                        {drive.company[0]}
                    </div>
                </div>

                <div className="p-10 pt-16">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-white mb-2">{drive.company}</h1>
                            <p className="text-xl text-white/50">{drive.role}</p>
                        </div>
                        <div className="bg-purple-500/20 px-6 py-2 rounded-full text-purple-400 font-bold uppercase tracking-widest text-sm border border-purple-500/30">
                            {drive.package || drive.salary}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="md:col-span-2 space-y-10">
                            <section>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-purple-500">📄</span> Job Description
                                </h3>
                                <p className="text-white/60 leading-relaxed">
                                    We are looking for a highly motivated {drive.role} to join our team at {drive.company}.
                                    You will be responsible for developing high-quality software solutions and collaborating
                                    with cross-functional teams to deliver exceptional user experiences.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-purple-500">🎯</span> Eligibility Criteria
                                </h3>
                                <ul className="space-y-3 text-white/60">
                                    <li className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                        Minimum CGPA: {drive.eligibility}
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                        Eligible Branches: IT, CSE, ECE
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                        No active backlogs
                                    </li>
                                </ul>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-white/3 border border-white/5 rounded-[24px]">
                                <h4 className="font-bold text-white mb-4">Drive Schedule</h4>
                                <div className="space-y-4">
                                    <ScheduleItem label="Registration Link" value="Open" color="text-green-400" />
                                    <ScheduleItem label="PPT Session" value="Oct 14, 10:00 AM" />
                                    <ScheduleItem label="Aptitude Test" value="Oct 15, 11:00 AM" />
                                </div>
                            </div>

                            <button
                                onClick={handleApply}
                                disabled={drive.status === 'Applied' || applying}
                                className={`w - full py - 5 bg - gradient - to - r from - purple - 600 to - blue - 600 rounded - 2xl font - black text - white shadow - xl shadow - purple - 500 / 20 hover: shadow - purple - 500 / 40 hover: -translate - y - 1 active: translate - y - 0 transition - all uppercase tracking - wider ${drive.status === 'Applied' ? 'opacity-50 cursor-not-allowed' : ''} `}
                            >
                                {applying ? 'Processing...' : (drive.status === 'Applied' ? 'Already Applied' : 'Confirm Application')}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Notifications */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`fixed bottom - 8 right - 8 z - [200] px - 6 py - 4 rounded - 2xl shadow - 2xl border flex items - center gap - 3 font - bold backdrop - blur - xl ${notification.type === 'success'
                            ? 'bg-green-500/10 border-green-500/20 text-green-400 shadow-green-500/10'
                            : 'bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/10'
                            } `}
                    >
                        <div className={`w - 8 h - 8 rounded - xl flex items - center justify - center ${notification.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'} `}>
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

const ScheduleItem = ({ label, value, color = "text-white/70" }: { label: string, value: string, color?: string }) => (
    <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</p>
        <p className={`font-medium ${color}`}>{value}</p>
    </div>
);

export default DriveDetails;
