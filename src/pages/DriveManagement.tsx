import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveDrives } from '../services/driveService';

const DriveManagement: React.FC = () => {
    const [drives, setDrives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrives = async () => {
            try {
                const data = await getActiveDrives();
                setDrives(data);
            } catch (err) {
                console.error("Failed to fetch drives", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDrives();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-[#0a0a0f]">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#0a0a0f] text-white">
            <header className="h-20 bg-white/5 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-10 sticky top-0 z-[90]">
                <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                    Drive Management
                </h1>
                <div className="flex items-center gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                        + New Drive
                    </button>
                </div>
            </header>

            <main className="p-10 flex-1 overflow-y-auto">
                <div className="flex flex-wrap items-center gap-5 mb-8">
                    <div className="flex-1 min-w-[300px] relative">
                        <input
                            type="text"
                            placeholder="Search active drives..."
                            className="w-full py-3.5 px-5 pl-12 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#8b5cf6]/50 transition-all"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
                    </div>
                    <select className="px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none cursor-pointer hover:bg-white/8 transition-all">
                        <option value="all">All Status</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="upcoming">Upcoming</option>
                    </select>
                </div>

                <div className="bg-white/3 backdrop-blur-[20px] border border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="pb-4 px-4 text-[11px] uppercase tracking-widest text-white/50">Company</th>
                                    <th className="pb-4 px-4 text-[11px] uppercase tracking-widest text-white/50">Role & Package</th>
                                    <th className="pb-4 px-4 text-[11px] uppercase tracking-widest text-white/50">Date</th>
                                    <th className="pb-4 px-4 text-[11px] uppercase tracking-widest text-white/50">Eligibility</th>
                                    <th className="pb-4 px-4 text-[11px] uppercase tracking-widest text-white/50">Status</th>
                                    <th className="pb-4 px-4 text-[11px] uppercase tracking-widest text-white/50 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {drives.map((drive, index) => (
                                        <motion.tr
                                            key={drive.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-white/5 group hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-5 px-4 font-bold text-white">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center">
                                                        {drive.company[0]}
                                                    </div>
                                                    {drive.company}
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <div className="text-sm font-semibold">{drive.role}</div>
                                                <div className="text-xs text-[#10b981] font-medium">{drive.package || drive.salary}</div>
                                            </td>
                                            <td className="py-5 px-4 text-sm text-white/70">{drive.date || 'TBA'}</td>
                                            <td className="py-5 px-4">
                                                <div className="flex gap-1">
                                                    {drive.depts ? drive.depts.map((d: string) => (
                                                        <span key={d} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/50">{d}</span>
                                                    )) : (
                                                        <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/50">{drive.eligibility}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <span className={`px-4 py-1 rounded-full text-[11px] font-bold ${drive.status === 'Ongoing' || drive.status === 'Open' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                    {drive.status}
                                                </span>
                                            </td>
                                            <td className="py-5 px-4 text-right">
                                                <button className="p-2 hover:text-[#8b5cf6] transition-colors">⚙️</button>
                                                <button className="p-2 hover:text-red-500 transition-colors">🗑️</button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DriveManagement;
