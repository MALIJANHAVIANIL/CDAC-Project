import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveDrives, deleteDrive, createDrive } from '../services/driveService';
import Sidebar from '../components/layout/Sidebar';

const DriveManagement: React.FC = () => {
    const [drives, setDrives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDrive, setShowCreateDrive] = useState(false);
    const [newDrive, setNewDrive] = useState({
        companyName: '', role: '', package: '', location: '',
        date: '', deadline: '', description: '', eligibility: '', type: 'Full-time'
    });

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

    useEffect(() => {
        fetchDrives();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this drive?')) {
            try {
                await deleteDrive(id);
                setDrives(drives.filter(d => d.id !== id));
            } catch (err) {
                console.error('Error deleting drive', err);
                alert('Failed to delete drive');
            }
        }
    };

    const handleCreateDrive = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createDrive(newDrive);
            setShowCreateDrive(false);
            setNewDrive({
                companyName: '', role: '', package: '', location: '',
                date: '', deadline: '', description: '', eligibility: '', type: 'Full-time'
            });
            fetchDrives();
        } catch (err) {
            console.error('Error creating drive', err);
            alert('Failed to create drive');
        }
    };

    if (loading) {
        return (
            <div className="flex bg-[#0a0a0f] min-h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-20">
                <header className="h-20 bg-white/5 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-10 sticky top-0 z-[90]">
                    <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                        Drive Management
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowCreateDrive(true)}
                            className="px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
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
                            <option value="ongoing">Show All</option>
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
                                        <th className="pb-4 px-4 text-[11px] uppercase tracking-widest text-white/50">Actions</th>
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
                                                            {(drive.companyName || 'C')[0]}
                                                        </div>
                                                        {drive.companyName || 'Unknown Company'}
                                                    </div>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <div className="text-sm font-semibold">{drive.role}</div>
                                                    <div className="text-xs text-[#10b981] font-medium">{drive.package}</div>
                                                </td>
                                                <td className="py-5 px-4 text-sm text-white/70">{drive.date ? new Date(drive.date).toLocaleDateString() : 'TBA'}</td>
                                                <td className="py-5 px-4">
                                                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/50">
                                                        {drive.eligibility || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-4">
                                                    <button className="p-2 hover:text-[#8b5cf6] transition-colors" title="Edit">⚙️</button>
                                                    <button
                                                        className="p-2 hover:text-red-500 transition-colors"
                                                        title="Delete"
                                                        onClick={() => handleDelete(drive.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                {/* Create Drive Modal */}
                {showCreateDrive && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#1a1a24] border border-white/10 rounded-[24px] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-xl font-bold mb-4">Create New Job Listing</h2>
                            <form onSubmit={handleCreateDrive} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        value={newDrive.companyName}
                                        onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Job Role"
                                        value={newDrive.role}
                                        onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Package (e.g., 12 LPA)"
                                        value={newDrive.package}
                                        onChange={(e) => setNewDrive({ ...newDrive, package: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={newDrive.location}
                                        onChange={(e) => setNewDrive({ ...newDrive, location: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-white/50 mb-1 block">Drive Date</label>
                                        <input
                                            type="date"
                                            value={newDrive.date}
                                            onChange={(e) => setNewDrive({ ...newDrive, date: e.target.value })}
                                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/50 mb-1 block">Deadline</label>
                                        <input
                                            type="date"
                                            value={newDrive.deadline}
                                            onChange={(e) => setNewDrive({ ...newDrive, deadline: e.target.value })}
                                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Job Description..."
                                    value={newDrive.description}
                                    onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500 min-h-[80px]"
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Eligibility (e.g., 7.0+ CGPA)"
                                        value={newDrive.eligibility}
                                        onChange={(e) => setNewDrive({ ...newDrive, eligibility: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500"
                                        required
                                    />
                                    <select
                                        value={newDrive.type}
                                        onChange={(e) => setNewDrive({ ...newDrive, type: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateDrive(false)}
                                        className="flex-1 py-3 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        Create Drive
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriveManagement;
