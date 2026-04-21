import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/layout/Sidebar';
import { fetchWithAuth } from '../services/api';
import { Briefcase, CheckCircle, Clock, Edit2, FileText, Plus, Trash2, Users, AlertTriangle, Search, ExternalLink, Sparkles, Hash } from 'lucide-react';

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
    resume?: string;
    User: { name: string; email: string; branch: string; cgpa: number; resumeUrl?: string };
    createdAt: string;
}

const HrDashboard: React.FC = () => {
    const { user } = useUser();
    const location = useLocation();
    const isJobsView = location.pathname === '/hr/jobs';
    const [drives, setDrives] = useState<Drive[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [showCreateDrive, setShowCreateDrive] = useState(false);
    const [selectedDrive, setSelectedDrive] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [driveToDelete, setDriveToDelete] = useState<number | null>(null);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [appSearch, setAppSearch] = useState('');

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

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

    const handleDeleteDrive = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setDriveToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteDrive = async () => {
        if (!driveToDelete) return;
        try {
            await fetchWithAuth(`/drives/${driveToDelete}`, { method: 'DELETE' });
            setDrives(drives.filter(d => d.id !== driveToDelete));
            if (selectedDrive === driveToDelete) {
                setSelectedDrive(null);
                setApplications([]);
            }
            setShowDeleteModal(false);
            setDriveToDelete(null);
            showNotification('Drive deleted successfully', 'success');
        } catch (err) {
            console.error('Error deleting drive', err);
            showNotification('Failed to delete drive. It might have existing applications.', 'error');
        }
    };

    const handleEditDrive = (drive: Drive, e: React.MouseEvent) => {
        e.stopPropagation();
        setNewDrive({
            companyName: drive.companyName,
            role: drive.role,
            package: drive.package,
            location: drive.location,
            date: drive.date ? drive.date.split('T')[0] : '',
            deadline: drive.deadline ? drive.deadline.split('T')[0] : '',
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
            showNotification(`Drive ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
        } catch (err) {
            console.error('Error saving drive', err);
            showNotification(`Failed to ${isEditing ? 'update' : 'create'} drive.`, 'error');
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
            showNotification('Failed to update application status', 'error');
        }
    };

    // Derived Stats
    const totalDrives = drives.length;
    const approvedDrives = drives.filter(d => d.approvalStatus === 'APPROVED').length;
    const pendingDrives = drives.filter(d => d.approvalStatus !== 'APPROVED').length;

    const filteredApplications = applications.filter(app =>
        app.User?.name?.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.User?.email?.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.User?.branch?.toLowerCase().includes(appSearch.toLowerCase())
    );

    const currentApplications = selectedDrive ? filteredApplications.length : '-';

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />
            <main className="flex-1 ml-20 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-24 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10 sticky top-0 z-[100]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent tracking-tight">
                                {isJobsView ? 'Job Management' : 'HR Dashboard'}
                            </h1>
                            <p className="text-xs text-white/40 font-medium">
                                {isJobsView ? 'Manage your open roles and candidate pipeline' : 'Overview of your recruitment activities'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
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
                            className="group px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-2xl font-bold text-sm hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                            Post New Job
                        </button>
                        <Link
                            to="/profile"
                            className="group relative"
                            title="View Profile"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] rounded-2xl flex items-center justify-center font-bold uppercase shadow-xl shadow-purple-500/10 border border-white/10 hover:scale-110 active:scale-95 transition-all">
                                {user?.name?.substring(0, 2) || 'HR'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0a0a0f] rounded-full"></div>
                        </Link>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
                    <div className="max-w-7xl mx-auto space-y-10">
                        {/* Stats Grid */}
                        <AnimatePresence>
                            {!isJobsView && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-hidden"
                                >
                                    <StatCard
                                        icon={<Briefcase size={22} />}
                                        label="Total Jobs"
                                        value={totalDrives}
                                        color="blue"
                                    />
                                    <StatCard
                                        icon={<CheckCircle size={22} />}
                                        label="Approved"
                                        value={approvedDrives}
                                        color="green"
                                    />
                                    <StatCard
                                        icon={<Clock size={22} />}
                                        label="Pending"
                                        value={pendingDrives}
                                        color="yellow"
                                    />
                                    <StatCard
                                        icon={<Users size={22} />}
                                        label="Applications"
                                        value={currentApplications}
                                        color="purple"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

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
                                    <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1 scroll-smooth">
                                        {drives.map((drive) => (
                                            <motion.div
                                                key={drive.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => fetchApplicationsForDrive(drive.id)}
                                                className={`p-5 rounded-[24px] cursor-pointer transition-all border group relative overflow-hidden ${selectedDrive === drive.id
                                                    ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/40 shadow-[0_10px_30px_-5px_rgba(139,92,246,0.2)]'
                                                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/20'
                                                    }`}
                                            >
                                                {selectedDrive === drive.id && (
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#8b5cf6]"></div>
                                                )}

                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${selectedDrive === drive.id ? 'bg-[#8b5cf6] text-white border-white/20' : 'bg-white/10 text-white/60 border-white/5'}`}>
                                                            {drive.companyName?.[0] || 'C'}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <div className="font-bold text-white group-hover:text-purple-400 transition-colors tracking-tight">{drive.companyName}</div>
                                                                <div className="px-1.5 py-0.5 bg-white/5 rounded-md text-[8px] font-black font-mono text-white/20 border border-white/5 flex items-center gap-1">
                                                                    <Hash size={8} />
                                                                    ID: {drive.id}
                                                                </div>
                                                            </div>
                                                            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">{drive.role}</div>
                                                        </div>
                                                    </div>
                                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${drive.approvalStatus === 'APPROVED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                                        {drive.approvalStatus || 'PENDING'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="px-2 py-1 bg-white/5 text-white/40 rounded-lg text-[9px] font-bold border border-white/5 flex items-center gap-1">
                                                        <Briefcase size={10} /> {drive.type}
                                                    </span>
                                                    <span className="px-2 py-1 bg-white/5 text-white/40 rounded-lg text-[9px] font-bold border border-white/5">
                                                        {drive.package}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                    <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-medium">
                                                        <Clock size={10} />
                                                        Deadline: {new Date(drive.deadline).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                        <button
                                                            onClick={(e) => handleEditDrive(drive, e)}
                                                            className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                                                            title="Edit"
                                                        >
                                                            <Edit2 size={12} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteDrive(drive.id, e)}
                                                            className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Applications for Selected Drive */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="lg:col-span-2 bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[32px] p-8 h-[600px] flex flex-col relative overflow-hidden group/apps"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                <div className="flex justify-between items-center mb-8 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white tracking-tight">
                                                {selectedDrive ? 'Candidate Pipeline' : 'Select a Listing'}
                                            </h2>
                                            {selectedDrive && (
                                                <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">
                                                    Manage applicants for {drives.find(d => d.id === selectedDrive)?.companyName}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selectedDrive && (
                                        <div className="relative group/search">
                                            <input
                                                type="text"
                                                placeholder="Search candidates..."
                                                value={appSearch}
                                                onChange={(e) => setAppSearch(e.target.value)}
                                                className="py-2.5 px-5 pl-10 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all text-xs w-64 font-medium"
                                            />
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/search:text-purple-400 transition-colors" size={14} />
                                        </div>
                                    )}
                                </div>

                                {!selectedDrive ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-center">
                                        <motion.div
                                            animate={{
                                                y: [0, -10, 0],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-[32px] border border-white/10 flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/10"
                                        >
                                            <Sparkles size={40} className="text-purple-400" />
                                        </motion.div>
                                        <h3 className="text-xl font-black text-white mb-2 tracking-tight">Ready to Review?</h3>
                                        <p className="text-sm text-white/40 max-w-xs leading-relaxed font-medium">Select a job listing from the sidebar to view candidate applications and manage your pipeline.</p>
                                    </div>
                                ) : applications.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
                                            <Users size={28} className="opacity-40" />
                                        </div>
                                        <p className="font-bold text-white/60">No Applications Yet</p>
                                        <p className="text-xs mt-1">Applications will appear here once students start applying.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-auto custom-scrollbar flex-1 relative z-10">
                                        <table className="w-full border-separate border-spacing-y-3">
                                            <thead className="sticky top-0 bg-[#0a0a0f] z-20">
                                                <tr className="text-left text-white/30 text-[10px] uppercase font-black tracking-[0.2em]">
                                                    <th className="pb-4 pl-4 font-black">Candidate</th>
                                                    <th className="pb-4 font-black">Profile Info</th>
                                                    <th className="pb-4 font-black">Timeline</th>
                                                    <th className="pb-4 font-black">Status</th>
                                                    <th className="pb-4 text-right pr-4 font-black">Workflow</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredApplications.map((app) => (
                                                    <tr key={app.id} className="group/row transition-all">
                                                        <td className="py-4 pl-4 bg-white/[0.02] group-hover/row:bg-white/5 rounded-l-2xl border-y border-l border-white/5 group-hover/row:border-white/10 transition-all">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center font-bold text-sm shadow-lg group-hover/row:scale-110 transition-transform">
                                                                    {app.User?.name?.[0]}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-white group-hover/row:text-purple-400 transition-colors tracking-tight">{app.User?.name}</div>
                                                                    <div className="text-[10px] text-white/40 font-medium">{app.User?.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 bg-white/[0.02] group-hover/row:bg-white/5 border-y border-white/5 group-hover/row:border-white/10 transition-all">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="text-xs font-bold text-white/70">{app.User?.branch || 'N/A'}</div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-black text-purple-400 bg-purple-400/10 px-1.5 rounded">GPA: {app.User?.cgpa || 'N/A'}</span>
                                                                    {(app.resume || app.User?.resumeUrl) && (
                                                                        <a
                                                                            href={app.resume || app.User?.resumeUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="p-1 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/10"
                                                                            title="View Resume"
                                                                        >
                                                                            <ExternalLink size={10} />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 bg-white/[0.02] group-hover/row:bg-white/5 border-y border-white/5 group-hover/row:border-white/10 transition-all">
                                                            <div className="flex items-center gap-2 text-xs text-white/60 font-medium">
                                                                <Clock size={12} className="text-white/20" />
                                                                {new Date(app.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 bg-white/[0.02] group-hover/row:bg-white/5 border-y border-white/5 group-hover/row:border-white/10 transition-all">
                                                            <StatusBadge status={app.status} />
                                                        </td>
                                                        <td className="py-4 bg-white/[0.02] group-hover/row:bg-white/5 border-y border-r border-white/5 group-hover/row:border-white/10 rounded-r-2xl text-right pr-4 transition-all">
                                                            <div className="flex gap-1.5 justify-end">
                                                                <button
                                                                    onClick={() => handleStatusUpdate(app.id, 'Shortlisted')}
                                                                    className="px-2.5 py-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-white transition-all shadow-lg shadow-yellow-500/10 hover:-translate-y-0.5"
                                                                >
                                                                    Shortlist
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(app.id, 'Interviewed')}
                                                                    className="px-2.5 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-lg shadow-purple-500/10 hover:-translate-y-0.5"
                                                                >
                                                                    Interview
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(app.id, 'Selected')}
                                                                    className="px-2.5 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/10 hover:-translate-y-0.5"
                                                                >
                                                                    Select
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                                                                    className="px-2.5 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10 hover:-translate-y-0.5"
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
                    <AnimatePresence>
                        {showCreateDrive && (
                            <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[200] p-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                                    className="bg-[#0a0a0f] border border-white/10 rounded-[40px] p-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative custom-scrollbar"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"></div>

                                    <div className="flex justify-between items-start mb-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center shadow-lg shadow-purple-500/20">
                                                {isEditing ? <Edit2 size={32} /> : <Plus size={32} />}
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-white tracking-tight">
                                                    {isEditing ? 'Pulse Edit' : 'New Opportunity'}
                                                </h2>
                                                <p className="text-xs text-white/40 font-bold uppercase tracking-[0.2em] mt-1">
                                                    {isEditing ? 'Update job details and requirements' : 'Launch a new recruitment drive'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowCreateDrive(false)}
                                            className="w-10 h-10 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-full flex items-center justify-center transition-all text-white/20"
                                        >
                                            <Trash2 size={20} className="rotate-45" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleCreateDrive} className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Company Info */}
                                            <div className="space-y-6">
                                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-1">Primary Details</h3>
                                                <div className="space-y-4">
                                                    <div className="space-y-2 group">
                                                        <label className="text-xs font-bold text-white/40 ml-1 group-focus-within:text-purple-400 transition-colors">Company Name</label>
                                                        <div className="relative">
                                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                                            <input
                                                                type="text"
                                                                placeholder="Google, Microsoft, etc."
                                                                value={newDrive.companyName}
                                                                onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
                                                                className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 group">
                                                        <label className="text-xs font-bold text-white/40 ml-1 group-focus-within:text-purple-400 transition-colors">Job Role</label>
                                                        <div className="relative">
                                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                                            <input
                                                                type="text"
                                                                placeholder="Software Engineer, Product Manager"
                                                                value={newDrive.role}
                                                                onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                                                                className="w-full pl-12 pr-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Logistics */}
                                            <div className="space-y-6">
                                                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-1">Logistics & Compensation</h3>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2 group">
                                                            <label className="text-xs font-bold text-white/40 ml-1 group-focus-within:text-purple-400 transition-colors">Package (LPA)</label>
                                                            <input
                                                                type="text"
                                                                placeholder="12 - 15 LPA"
                                                                value={newDrive.package}
                                                                onChange={(e) => setNewDrive({ ...newDrive, package: e.target.value })}
                                                                className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2 group">
                                                            <label className="text-xs font-bold text-white/40 ml-1 group-focus-within:text-purple-400 transition-colors">Type</label>
                                                            <select
                                                                value={newDrive.type}
                                                                onChange={(e) => setNewDrive({ ...newDrive, type: e.target.value })}
                                                                className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium appearance-none"
                                                            >
                                                                <option value="Full-time" className="bg-[#0a0a0f]">Full-time</option>
                                                                <option value="Internship" className="bg-[#0a0a0f]">Internship</option>
                                                                <option value="Contract" className="bg-[#0a0a0f]">Contract</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 group">
                                                        <label className="text-xs font-bold text-white/40 ml-1 group-focus-within:text-purple-400 transition-colors">Location</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Remote, Bangalore, Mumbai"
                                                            value={newDrive.location}
                                                            onChange={(e) => setNewDrive({ ...newDrive, location: e.target.value })}
                                                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2 group">
                                                <label className="text-xs font-bold text-white/40 ml-1 group-focus-within:text-purple-400 transition-colors">Drive Date</label>
                                                <input
                                                    type="date"
                                                    value={newDrive.date}
                                                    onChange={(e) => setNewDrive({ ...newDrive, date: e.target.value })}
                                                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2 group">
                                                <label className="text-xs font-bold text-white/40 ml-1 group-focus-within:text-purple-400 transition-colors">Application Deadline</label>
                                                <input
                                                    type="date"
                                                    value={newDrive.deadline}
                                                    onChange={(e) => setNewDrive({ ...newDrive, deadline: e.target.value })}
                                                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] pl-1">Requirement Matrix</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-white/40 ml-1">Job Description</label>
                                                    <textarea
                                                        placeholder="Describe the role and responsibilities..."
                                                        value={newDrive.description}
                                                        onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
                                                        className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium min-h-[120px]"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-white/40 ml-1">Eligibility Criteria</label>
                                                    <textarea
                                                        placeholder="Minimum CGPA, specific branches, skills..."
                                                        value={newDrive.eligibility}
                                                        onChange={(e) => setNewDrive({ ...newDrive, eligibility: e.target.value })}
                                                        className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-sm font-medium min-h-[120px]"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-10 border-t border-white/5 relative z-10">
                                            <button
                                                type="button"
                                                onClick={() => setShowCreateDrive(false)}
                                                className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-[2] py-5 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-[24px] font-black text-xs uppercase tracking-widest hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all transform hover:-translate-y-1 active:scale-95"
                                            >
                                                {isEditing ? 'Save Changes' : 'Publish Drive'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Delete Confirmation Modal */}
                    <AnimatePresence>
                        {showDeleteModal && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4 text-white font-['Inter']">
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
                                            className="flex-1 py-4 bg-white/5 rounded-2xl font-bold hover:bg-white/10 border border-white/10 transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmDeleteDrive}
                                            className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all transform hover:-translate-y-1 text-sm text-white"
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
                                    {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                                </div>
                                {notification.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) => {
    const colors: Record<string, string> = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        green: 'text-green-400 bg-green-500/10 border-green-500/20',
        yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all group relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-20 -translate-y-1/2 translate-x-1/2 ${colors[color].split(' ')[0]}`}></div>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${colors[color]} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle size={14} className="text-white/40" />
                </div>
            </div>
            <div className="text-3xl font-black text-white mb-1 tracking-tight">{value}</div>
            <div className="text-xs text-white/40 font-bold uppercase tracking-widest">{label}</div>
        </motion.div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        Applied: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
        Shortlisted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
        Interviewed: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
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
