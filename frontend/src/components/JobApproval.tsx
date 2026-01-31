import React, { useState, useEffect } from 'react';
import { getPendingDrives, approveDrive, rejectDrive, PlacementDrive } from '../services/tpoService';
import { Check, X, Building2, Calendar, MapPin, DollarSign } from 'lucide-react';
import '../styles/TPO.css'; // Will create this later

const JobApproval = () => {
    const [drives, setDrives] = useState<PlacementDrive[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleApprove = async (id: number) => {
        if (confirm('Approve this drive?')) {
            await approveDrive(id);
            loadDrives(); // Refresh list
        }
    };

    const handleReject = async (id: number) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            await rejectDrive(id, reason);
            loadDrives();
        }
    };

    if (loading) return <div>Loading pending drives...</div>;

    return (

        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Pending Job Approvals ({drives.length})</h3>
            {drives.length === 0 ? <p className="text-white/50 italic">No pending drives found.</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drives.map(drive => (
                        <div key={drive.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group flex flex-col justify-between h-full">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white leading-tight mb-1">{drive.companyName}</h4>
                                            <p className="text-sm text-white/60">{drive.role}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-white/50 border border-white/5 uppercase tracking-wide">
                                        {drive.type}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-white/70">
                                        <MapPin size={16} className="text-[#8b5cf6]" /> {drive.location}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/70">
                                        <DollarSign size={16} className="text-[#8b5cf6]" /> {drive.packageValue}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/70">
                                        <Calendar size={16} className="text-[#8b5cf6]" /> Deadline: {drive.deadline}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-auto pt-4 border-t border-white/10">
                                <button
                                    onClick={() => handleApprove(drive.id)}
                                    className="flex-1 py-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={18} /> Approve
                                </button>
                                <button
                                    onClick={() => handleReject(drive.id)}
                                    className="flex-1 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <X size={18} /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobApproval;
