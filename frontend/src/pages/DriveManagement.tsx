import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllDrives, deleteDrive, createDrive, updateDrive } from '../services/driveService';
import Sidebar from '../components/layout/Sidebar';
import { Plus, Search, Building2, Calendar, MapPin, Trash2, Settings, Briefcase, DollarSign, GraduationCap, X, AlertTriangle } from 'lucide-react';

const DriveManagement: React.FC = () => {
    const [drives, setDrives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDrive, setShowCreateDrive] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [driveToDelete, setDriveToDelete] = useState<number | null>(null);
    const [newDrive, setNewDrive] = useState({
        companyName: '', role: '', package: '', location: '',
        date: '', deadline: '', description: '', eligibility: '', type: 'Full-time'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editDriveId, setEditDriveId] = useState<number | null>(null);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchDrives = async () => {
        try {
            const data = await getAllDrives();
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

    const handleDeleteClick = (id: number) => {
        setDriveToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!driveToDelete) return;
        try {
            await deleteDrive(driveToDelete);
            setDrives(drives.filter(d => d.id !== driveToDelete));
            setShowDeleteModal(false);
            setDriveToDelete(null);
        } catch (err) {
            console.error('Error deleting drive', err);
            showNotification('Failed to delete drive. Please try again.', 'error');
        }
    };

    const handleEditClick = (drive: any) => {
        setNewDrive({
            companyName: drive.companyName || '',
            role: drive.role || '',
            package: drive.package || '',
            location: drive.location || '',
            date: drive.date ? drive.date.split('T')[0] : '',
            deadline: drive.deadline ? drive.deadline.split('T')[0] : '',
            description: drive.description || '',
            eligibility: drive.eligibility || '',
            type: drive.type || 'Full-time'
        });
        setEditDriveId(drive.id);
        setIsEditing(true);
        setShowCreateDrive(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && editDriveId) {
                await updateDrive(editDriveId, newDrive);
                showNotification('Drive updated successfully!', 'success');
            } else {
                await createDrive(newDrive);
                showNotification('Drive published successfully!', 'success');
            }
            setShowCreateDrive(false);
            setIsEditing(false);
            setEditDriveId(null);
            setNewDrive({
                companyName: '', role: '', package: '', location: '',
                date: '', deadline: '', description: '', eligibility: '', type: 'Full-time'
            });
            fetchDrives();
        } catch (err) {
            console.error('Error saving drive', err);
            showNotification(`Failed to ${isEditing ? 'update' : 'create'} drive.`, 'error');
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
                <header className="h-24 bg-[#0a0a0f]/80 backdrop-blur-[20px] border-b border-white/5 flex items-center justify-between px-10 sticky top-0 z-[90]">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                            Drive Management
                        </h1>
                        <p className="text-xs text-white/40 mt-1">Configure and manage placement opportunities.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditDriveId(null);
                                setNewDrive({
                                    companyName: '', role: '', package: '', location: '',
                                    date: '', deadline: '', description: '', eligibility: '', type: 'Full-time'
                                });
                                setShowCreateDrive(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-xl font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95"
                        >
                            <Plus size={18} />
                            <span>New Drive</span>
                        </button>
                    </div>
                </header>

                <main className="p-10 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-wrap items-center gap-5 mb-10">
                        <div className="flex-1 min-w-[300px] relative group">
                            <input
                                type="text"
                                placeholder="Search active drives..."
                                className="w-full py-4 px-6 pl-14 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#8b5cf6]/50 focus:bg-white/10 transition-all font-medium"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#8b5cf6] transition-colors" size={20} />
                        </div>
                        <div className="relative">
                            <select className="appearance-none pl-6 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none cursor-pointer hover:bg-white/8 transition-all font-medium">
                                <option value="all" className="bg-[#12121a]">All Status</option>
                                <option value="ongoing" className="bg-[#12121a]">Ongoing</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">▼</div>
                        </div>
                    </div>

                    <div className="bg-white/2 backdrop-blur-[20px] border border-white/5 rounded-[32px] p-2 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5">Company</th>
                                        <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5">Role & Package</th>
                                        <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5">Date</th>
                                        <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5">Eligibility</th>
                                        <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <AnimatePresence>
                                        {drives.map((drive, index) => (
                                            <motion.tr
                                                key={drive.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group hover:bg-white/[0.03] transition-colors"
                                            >
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center group-hover:border-[#8b5cf6]/30 transition-colors shadow-lg">
                                                            <Building2 size={24} className="text-[#8b5cf6]" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-white text-lg tracking-tight">{drive.companyName || 'Unknown Company'}</span>
                                                            <div className="flex items-center gap-1.5 text-xs text-white/40 mt-1">
                                                                <MapPin size={10} />
                                                                <span>{drive.location || 'TBA'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2 font-bold text-white tracking-tight">
                                                            <Briefcase size={14} className="text-white/20" />
                                                            {drive.role}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-[#10b981] font-bold mt-1 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                            <DollarSign size={14} />
                                                            {drive.package}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                                                        <Calendar size={14} className="text-white/20" />
                                                        {drive.date ? new Date(drive.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap size={14} className="text-[#8b5cf6]/60" />
                                                        <span className="px-3 py-1 rounded-full bg-[#8b5cf6]/10 text-[11px] font-bold text-[#8b5cf6] border border-[#8b5cf6]/20">
                                                            {drive.eligibility || 'N/A'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-8">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-[#8b5cf6] hover:bg-[#8b5cf6]/10 border border-white/5 hover:border-[#8b5cf6]/20 transition-all"
                                                            title="Edit"
                                                            onClick={() => handleEditClick(drive)}
                                                        >
                                                            <Settings size={18} />
                                                        </button>
                                                        <button
                                                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 transition-all"
                                                            title="Delete"
                                                            onClick={() => handleDeleteClick(drive.id)}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
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
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-white">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-[#12121a] border border-white/10 rounded-[32px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(139,92,246,0.15)] custom-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                        {isEditing ? 'Edit Job Listing' : 'Create New Job Listing'}
                                    </h2>
                                    <p className="text-white/40 text-sm mt-1">
                                        {isEditing ? 'Update the details of this placement opportunity.' : 'Fill in the details to post a new placement opportunity.'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowCreateDrive(false)}
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] ml-1">Company Name</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                placeholder="e.g. Google, Microsoft"
                                                value={newDrive.companyName}
                                                onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
                                                className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#8b5cf6] focus:bg-white/10 transition-all font-medium"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] ml-1">Job Role</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Software Engineer"
                                            value={newDrive.role}
                                            onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                                            className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#8b5cf6] focus:bg-white/10 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] ml-1">Package (CTC)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 12 LPA"
                                            value={newDrive.package}
                                            onChange={(e) => setNewDrive({ ...newDrive, package: e.target.value })}
                                            className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#8b5cf6] focus:bg-white/10 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] ml-1">Work Location</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Remote, Bangalore"
                                            value={newDrive.location}
                                            onChange={(e) => setNewDrive({ ...newDrive, location: e.target.value })}
                                            className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#8b5cf6] focus:bg-white/10 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] ml-1">Drive Date</label>
                                        <input
                                            type="date"
                                            value={newDrive.date}
                                            onChange={(e) => setNewDrive({ ...newDrive, date: e.target.value })}
                                            className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#8b5cf6] focus:bg-white/10 transition-all font-medium [color-scheme:dark]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] ml-1">Application Deadline</label>
                                        <input
                                            type="date"
                                            value={newDrive.deadline}
                                            onChange={(e) => setNewDrive({ ...newDrive, deadline: e.target.value })}
                                            className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#8b5cf6] focus:bg-white/10 transition-all font-medium [color-scheme:dark]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] ml-1">Job Description</label>
                                    <textarea
                                        placeholder="Describe the role, responsibilities, and requirements..."
                                        value={newDrive.description}
                                        onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
                                        className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#8b5cf6] focus:bg-white/10 transition-all font-medium min-h-[120px] resize-none"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] ml-1">Eligibility Criteria</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 7.0+ CGPA, No Backlogs"
                                            value={newDrive.eligibility}
                                            onChange={(e) => setNewDrive({ ...newDrive, eligibility: e.target.value })}
                                            className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#8b5cf6] focus:bg-white/10 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#8b5cf6] ml-1">Employment Type</label>
                                        <div className="relative">
                                            <select
                                                value={newDrive.type}
                                                onChange={(e) => setNewDrive({ ...newDrive, type: e.target.value })}
                                                className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#8b5cf6] focus:bg-white/10 transition-all font-medium appearance-none cursor-pointer"
                                            >
                                                <option value="Full-time" className="bg-[#12121a] text-white">Full-time</option>
                                                <option value="Internship" className="bg-[#12121a] text-white">Internship</option>
                                                <option value="Contract" className="bg-[#12121a] text-white">Contract</option>
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">▼</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateDrive(false)}
                                        className="flex-1 py-4 bg-white/5 rounded-2xl font-bold hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-xl font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all transform hover:-translate-y-1"
                                    >
                                        {isEditing ? 'Update Drive' : 'Publish Drive'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4 text-white">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-[#12121a] border border-white/10 rounded-[32px] p-8 w-full max-w-sm shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
                                    <AlertTriangle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Are you sure?</h3>
                                <p className="text-white/40 mb-8 text-sm font-medium leading-relaxed">
                                    Deleting this drive is a permanent action and cannot be undone. All application data will be lost.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 py-4 bg-white/5 rounded-2xl font-bold hover:bg-white/10 border border-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all transform hover:-translate-y-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

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
                                {notification.type === 'success' ? <Plus size={18} className="rotate-45" /> : <AlertTriangle size={18} />}
                            </div>
                            {notification.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DriveManagement;
