import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getActiveDrives, applyForDrive } from '../services/driveService';
import { useUser } from '../context/UserContext';

const DriveDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useUser();
    const navigate = useNavigate();
    const [drive, setDrive] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

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
            alert('Application successful!');
            navigate('/applications');
        } catch (err: any) {
            alert(err.message || 'Failed to apply');
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
                                className={`w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-black text-white shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-wider ${drive.status === 'Applied' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {applying ? 'Processing...' : (drive.status === 'Applied' ? 'Already Applied' : 'Confirm Application')}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
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
