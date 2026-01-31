import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/layout/Sidebar';
import { fetchWithAuth } from '../services/api';
import { Briefcase, CheckCircle, Clock, Edit2, FileText, Plus, Trash2, Users } from 'lucide-react';

interface Drive {
    id: number;
    companyName: string;
    role: string;
    package: string;
    location: string;
    date: string;
    deadline: string;
    type: string;
    approvalStatus: string;
    description?: string;
    eligibility?: string;
}

interface Application {
    id: number;
    status: string;
    User: { name: string; email: string; branch: string; cgpa: number };
    createdAt: string;
}

const HrDashboard: React.FC = () => {
    const { user } = useUser();
    const [drives, setDrives] = useState<Drive[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [showCreateDrive, setShowCreateDrive] = useState(false);
    const [selectedDrive, setSelectedDrive] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [newDrive, setNewDrive] = useState({
        companyName: '',
        role: '',
        package: '',
        location: '',
        date: '',
        deadline: '',
        description: '',
        eligibility: '',
        type: 'Full-time'
    });

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const res = await fetchWithAuth('/drives/all');
            const data = await res.json();
            setDrives(data);
        } catch (err) {
            console.error('Error fetching drives', err);
        }
    };

    const fetchApplicationsForDrive = async (driveId: number) => {
        try {
            const res = await fetchWithAuth(`/applications/drive/${driveId}`);
            const data = await res.json();
            setApplications(data);
            setSelectedDrive(driveId);
        } catch (err) {
            console.error('Error fetching applications', err);
        }
    };

    const handleDeleteDrive = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await fetchWithAuth(`/drives/${id}`, { method: 'DELETE' });
            setDrives(drives.filter(d => d.id !== id));
            if (selectedDrive === id) {
                setSelectedDrive(null);
                setApplications([]);
            }
        } catch (err) {
            console.error('Error deleting drive', err);
        }
    };

    const handleEditDrive = (drive: Drive, e: React.MouseEvent) => {
        e.stopPropagation();
        setNewDrive({
            companyName: drive.companyName,
            role: drive.role,
            package: drive.package,
            location: drive.location,
            date: drive.date,
            deadline: drive.deadline,
            description: drive.description || '',
            eligibility: drive.eligibility || '',
            type: drive.type
        });
        setIsEditing(true);
        setEditingId(drive.id);
        setShowCreateDrive(true);
    };

    const handleCreateDrive = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing && editingId ? `/drives/${editingId}` : '/drives';
            const method = isEditing ? 'PUT' : 'POST';

            await fetchWithAuth(url, {
                method,
                body: JSON.stringify(newDrive)
            });

            setShowCreateDrive(false);
            setNewDrive({
                companyName: '', role: '', package: '', location: '',
                date: '', deadline: '', description: '', eligibility: '', type: 'Full-time'
            });
            setIsEditing(false);
            setEditingId(null);
            fetchDrives();
        } catch (err) {
            console.error('Error saving drive', err);
        }
    };

    const handleStatusUpdate = async (appId: number, status: string) => {
        try {
            await fetchWithAuth(`/applications/${appId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            setApplications(apps =>
                apps.map(app => app.id === appId ? { ...app, status } : app)
            );
        } catch (err) {
            console.error('Error updating status', err);
        }
    };

    // Derived Stats
    const totalDrives = drives.length;
    const approvedDrives = drives.filter(d => d.approvalStatus === 'APPROVED').length;
    const pendingDrives = drives.filter(d => d.approvalStatus !== 'APPROVED').length;
    const currentApplications = selectedDrive ? applications.length : '-';

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />
            <main className="flex-1 ml-20 flex flex-col">
                {/* Header */}
                <header className="h-20 bg-white/5 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-[90]">
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">HR Dashboard</h1>
                        <p className="text-sm text-white/50">Manage job postings & applications</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditingId(null);
                                setNewDrive({
                                    companyName: '', role: '', package: '', location: '',
                                    date: '', deadline: '', description: '', eligibility: '', type: 'Full-time'
                                });
                                setShowCreateDrive(true);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Post New Job
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] rounded-xl flex items-center justify-center font-bold uppercase shadow-lg shadow-purple-500/20">
                            {user?.name?.substring(0, 2) || 'HR'}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatCard icon={<Briefcase size={24} className="text-blue-400" />} label="Total Jobs" value={totalDrives} />
                        <StatCard icon={<CheckCircle size={24} className="text-green-400" />} label="Approved" value={approvedDrives} />
                        <StatCard icon={<Clock size={24} className="text-yellow-400" />} label="Pending" value={pendingDrives} />
                        <StatCard icon={<Users size={24} className="text-purple-400" />} label="Applications (Selected)" value={currentApplications} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Job Listings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-1 bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-6 flex flex-col h-[600px]"
                        >
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-white/60" />
                                Your Listings
                            </h2>
                            {drives.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-white/30">
                                    <Briefcase size={48} className="mb-4 opacity-50" />
                                    <p>No job listings yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-1">
                                    {drives.map((drive) => (
                                        <div
                                            key={drive.id}
                                            onClick={() => fetchApplicationsForDrive(drive.id)}
                                            className={`p-4 rounded-xl cursor-pointer transition-all border group ${selectedDrive === drive.id
                                                ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.4)]'
                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-bold text-white group-hover:text-purple-300 transition-colors">{drive.companyName}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${drive.approvalStatus === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                                                        {drive.approvalStatus || 'PENDING'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-xs text-white/50 mb-3">{drive.role} • {drive.location}</div>

                                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                                                <div className="flex gap-2">
                                                    <span className="px-2 py-1 bg-white/5 text-white/70 rounded text-[10px] border border-white/5">{drive.package}</span>
                                                    <span className="px-2 py-1 bg-white/5 text-white/70 rounded text-[10px] border border-white/5">{drive.type}</span>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => handleEditDrive(drive, e)}
                                                        className="p-1.5 hover:bg-blue-500/20 text-white/40 hover:text-blue-400 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteDrive(drive.id, e)}
                                                        className="p-1.5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Applications for Selected Drive */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2 bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-6 h-[600px] flex flex-col"
                        >
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Users size={20} className="text-white/60" />
                                {selectedDrive ? 'Applications' : 'Select a listing'}
                            </h2>

                            {!selectedDrive ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-white/30">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                        <Briefcase size={32} className="opacity-50" />
                                    </div>
                                    <p className="text-lg font-medium">Select a job listing</p>
                                    <p className="text-sm mt-2">View and manage applications here</p>
                                </div>
                            ) : applications.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-white/30">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Users size={24} className="opacity-50" />
                                    </div>
                                    <p>No applications received yet</p>
                                </div>
                            ) : (
                                <div className="overflow-auto custom-scrollbar flex-1 -mr-2 pr-2">
                                    <table className="w-full border-collapse">
                                        <thead className="sticky top-0 bg-[#0a0a0f] z-10">
                                            <tr className="text-left text-white/40 text-xs uppercase tracking-wider border-b border-white/10">
                                                <th className="pb-4 font-medium pl-4">Candidate</th>
                                                <th className="pb-4 font-medium">Branch & CGPA</th>
                                                <th className="pb-4 font-medium">Applied Date</th>
                                                <th className="pb-4 font-medium">Status</th>
                                                <th className="pb-4 font-medium text-right pr-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.map((app) => (
                                                <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                                    <td className="py-4 pl-4">
                                                        <div className="font-semibold text-white/90">{app.User?.name}</div>
                                                        <div className="text-xs text-white/40">{app.User?.email}</div>
                                                    </td>
                                                    <td className="py-4">
                                                        <div className="text-sm">{app.User?.branch || 'N/A'}</div>
                                                        <div className="text-xs text-white/40">CGPA: {app.User?.cgpa || 'N/A'}</div>
                                                    </td>
                                                    <td className="py-4 text-sm text-white/60">
                                                        {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-4">
                                                        <StatusBadge status={app.status} />
                                                    </td>
                                                    <td className="py-4 text-right pr-4">
                                                        <div className="flex gap-2 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleStatusUpdate(app.id, 'Shortlisted')}
                                                                className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg text-xs hover:bg-yellow-500/20 transition-all font-medium"
                                                            >
                                                                Shortlist
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(app.id, 'Selected')}
                                                                className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs hover:bg-green-500/20 transition-all font-medium"
                                                            >
                                                                Select
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                                                                className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs hover:bg-red-500/20 transition-all font-medium"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Create/Edit Drive Modal */}
                {showCreateDrive && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#15151e] border border-white/10 rounded-[24px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${isEditing ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                        {isEditing ? <Edit2 size={24} /> : <Plus size={24} />}
                                    </div>
                                    {isEditing ? 'Edit Job Listing' : 'Create New Job Listing'}
                                </h2>
                                <button onClick={() => setShowCreateDrive(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                                    <Trash2 size={20} className="rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateDrive} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/60">Company Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Google"
                                            value={newDrive.companyName}
                                            onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
                                            className="w-full p-3.5 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/60">Job Role</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Software Engineer"
                                            value={newDrive.role}
                                            onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                                            className="w-full p-3.5 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/60">Package (CTC)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 12 LPA"
                                            value={newDrive.package}
                                            onChange={(e) => setNewDrive({ ...newDrive, package: e.target.value })}
                                            className="w-full p-3.5 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/60">Location</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Bangalore"
                                            value={newDrive.location}
                                            onChange={(e) => setNewDrive({ ...newDrive, location: e.target.value })}
                                            className="w-full p-3.5 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/60">Drive Date</label>
                                        <input
                                            type="date"
                                            value={newDrive.date}
                                            onChange={(e) => setNewDrive({ ...newDrive, date: e.target.value })}
                                            className="w-full p-3.5 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/60">Application Deadline</label>
                                        <input
                                            type="date"
                                            value={newDrive.deadline}
                                            onChange={(e) => setNewDrive({ ...newDrive, deadline: e.target.value })}
                                            className="w-full p-3.5 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60">Job Description</label>
                                    <textarea
                                        placeholder="Enter detailed job description..."
                                        value={newDrive.description}
                                        onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
                                        className="w-full p-3.5 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all text-sm min-h-[100px] resize-none"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/60">Eligibility Criteria</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 7.0+ CGPA, No Backlogs"
                                            value={newDrive.eligibility}
                                            onChange={(e) => setNewDrive({ ...newDrive, eligibility: e.target.value })}
                                            className="w-full p-3.5 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/60">Job Type</label>
                                        <select
                                            value={newDrive.type}
                                            onChange={(e) => setNewDrive({ ...newDrive, type: e.target.value })}
                                            className="w-full p-3.5 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all text-sm text-white"
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Contract">Contract</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateDrive(false)}
                                        className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all text-sm"
                                    >
                                        {isEditing ? 'Update Listing' : 'Create Listing'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-6 hover:border-purple-500/30 transition-all flex items-center gap-4 group"
    >
        <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-white/40 font-medium uppercase tracking-wide">{label}</div>
        </div>
    </motion.div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        Applied: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
        Shortlisted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
        Interview: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
        Selected: 'bg-green-500/20 text-green-400 border-green-500/20',
        Rejected: 'bg-red-500/20 text-red-400 border-red-500/20'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/20'}`}>
            {status}
        </span>
    );
};

export default HrDashboard;
