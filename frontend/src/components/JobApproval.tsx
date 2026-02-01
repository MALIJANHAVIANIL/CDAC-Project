import { useState, useEffect } from 'react';
import { getPendingDrives, approveDrive, rejectDrive, PlacementDrive } from '../services/tpoService';
import { Check, X, Building2, Calendar, MapPin, DollarSign, AlertTriangle } from 'lucide-react';
import '../styles/TPO.css'; // Will create this later

const JobApproval = () => {
    const [drives, setDrives] = useState<PlacementDrive[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [modalAction, setModalAction] = useState<'approve' | 'reject'>('approve');
    const [rejectionReason, setRejectionReason] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadDrives();
    }, []);

    const loadDrives = async () => {
        try {
            const data = await getPendingDrives();
            setDrives(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const confirmAction = (id: number, action: 'approve' | 'reject') => {
        setSelectedId(id);
        setModalAction(action);
        setRejectionReason('');
        setError('');
        setShowModal(true);
    };

    const handleConfirm = async () => {
        if (!selectedId) return;

        try {
            if (modalAction === 'approve') {
                await approveDrive(selectedId);
            } else {
                if (!rejectionReason.trim()) {
                    setError('Please provide a reason for rejection.');
                    return;
                }
                await rejectDrive(selectedId, rejectionReason);
            }
            setShowModal(false);
            loadDrives();
        } catch (error) {
            console.error('Action failed', error);
        }
    };

    if (loading) return <div>Loading pending drives...</div>;

    return (

        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    Pending Proposals
                    <span className="px-2.5 py-1 bg-[#8b5cf6]/10 text-[#8b5cf6] text-[10px] font-black rounded-lg border border-[#8b5cf6]/20 uppercase">
                        {drives.length} total
                    </span>
                </h3>
            </div>

            {drives.length === 0 ? (
                <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-20 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4">
                        <Check size={32} />
                    </div>
                    <p className="text-white/40 font-medium italic">All queue is clear! No pending drives found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drives.map(drive => (
                        <div key={drive.id} className="bg-white/2 backdrop-blur-md border border-white/5 rounded-[32px] p-8 hover:bg-white/[0.05] transition-all group flex flex-col h-full shadow-lg hover:shadow-purple-500/[0.05]">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                        <Building2 size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white tracking-tight">{drive.companyName}</h4>
                                        <p className="text-sm text-white/40 font-medium">{drive.role}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-white/40 border border-white/5 uppercase tracking-widest">
                                    {drive.type}
                                </span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm font-medium text-white/60">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#8b5cf6]">
                                        <MapPin size={16} />
                                    </div>
                                    {drive.location}
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-white/60">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#8b5cf6]">
                                        <DollarSign size={16} />
                                    </div>
                                    <span className="text-[#10b981] font-bold">{drive.packageValue}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm font-medium text-white/60">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#8b5cf6]">
                                        <Calendar size={16} />
                                    </div>
                                    Deadline: {new Date(drive.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-auto pt-6 border-t border-white/5">
                                <button
                                    onClick={() => confirmAction(drive.id, 'approve')}
                                    className="flex-1 py-3.5 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-green-500/20"
                                >
                                    <Check size={18} /> Approve
                                </button>
                                <button
                                    onClick={() => confirmAction(drive.id, 'reject')}
                                    className="flex-1 py-3.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-red-500/20"
                                >
                                    <X size={18} /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Custom Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4 text-white">
                    <div className="bg-[#12121a] border border-white/10 rounded-[32px] p-8 w-full max-w-sm shadow-[0_0_50px_rgba(139,92,246,0.15)] transform transition-all animate-in zoom-in-95 duration-300">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${modalAction === 'approve' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {modalAction === 'approve' ? <Check size={32} /> : <X size={32} />}
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-2 leading-tight">
                            {modalAction === 'approve' ? 'Confirm Approval' : 'Reject Drive'}
                        </h4>
                        <p className="text-white/40 mb-8 text-sm font-medium leading-relaxed">
                            {modalAction === 'approve'
                                ? 'This job posting will be published and become instantly visible to all eligible students.'
                                : 'Please provide a transparent reason for rejection to help the poster improve.'}
                        </p>

                        {modalAction === 'reject' && (
                            <div className="space-y-3 mb-8">
                                <textarea
                                    className={`w-full bg-white/5 border rounded-2xl p-4 text-white focus:outline-none min-h-[120px] resize-none font-medium transition-all ${error ? 'border-red-500 bg-red-500/5' : 'border-white/10 focus:border-red-500'}`}
                                    placeholder="e.g. Insufficient description or role mismatch..."
                                    value={rejectionReason}
                                    onChange={(e) => {
                                        setRejectionReason(e.target.value);
                                        if (error) setError('');
                                    }}
                                    autoFocus
                                />
                                {error && (
                                    <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                                        <AlertTriangle size={14} />
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-4 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 font-bold transition-all border border-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-xl transition-all transform hover:-translate-y-1 ${modalAction === 'approve'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/20'
                                    : 'bg-gradient-to-r from-red-500 to-pink-600 shadow-red-500/20'
                                    }`}
                            >
                                {modalAction === 'approve' ? 'Approve' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobApproval;
