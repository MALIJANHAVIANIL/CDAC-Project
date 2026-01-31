import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getActiveDrives, applyForDrive } from '../services/driveService';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/common/Sidebar';

const PlacementDrives: React.FC = () => {
    const { user } = useUser();
    const [drives, setDrives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<number | null>(null);
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDrives = async () => {
            try {
                const data = await getActiveDrives();
                if (Array.isArray(data)) {
                    setDrives(data);
                } else {
                    console.error("Data is not array", data);
                    setDrives([]);
                }
            } catch (err: any) {
                console.error("Failed to fetch drives", err);
                setError(err.message || 'Failed to load drives');
            } finally {
                setLoading(false);
            }
        };
        fetchDrives();
    }, []);

    const handleApply = async (driveId: number) => {
        if (!user) return;
        setApplying(driveId);
        try {
            // Handle both id and _id cases, and ensure it's parsed as int
            const userIdStr = user.id || (user as any)._id;
            const userId = parseInt(userIdStr);
            if (isNaN(userId)) {
                throw new Error("Invalid User ID");
            }

            await applyForDrive(userId, driveId);
            // Refresh drives to update status
            const data = await getActiveDrives();
            setDrives(data);
            alert('Application submitted successfully!');
        } catch (err: any) {
            alert(err.message || 'Failed to apply');
        } finally {
            setApplying(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-20 p-8 relative z-0">
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
                                            console.log("Navigating to drive:", drive.id);
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
                                                e.stopPropagation(); // Prevent navigation when clicking Apply
                                                if (drive.status !== 'Applied' && drive.id) handleApply(drive.id);
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
        </div>
    );
};

export default PlacementDrives;
