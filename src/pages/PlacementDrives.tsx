import React from 'react';
import { motion } from 'framer-motion';

const PlacementDrives: React.FC = () => {
    const drives = [
        { id: 1, company: "Google", role: "Software Engineer", salary: "18-24 LPA", eligibility: "8.0+ CGPA", status: "Open" },
        { id: 2, company: "Microsoft", role: "Program Manager", salary: "15-20 LPA", eligibility: "7.5+ CGPA", status: "Closing Soon" },
        { id: 3, company: "Adobe", role: "Product Designer", salary: "12-16 LPA", eligibility: "6.5+ CGPA", status: "Applied" },
    ];

    return (
        <div className="p-8">
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

            <div className="grid grid-cols-1 gap-6">
                {drives.map((drive, index) => (
                    <motion.div
                        key={drive.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-[24px] bg-white/5 backdrop-blur-[20px] border border-white/10 flex flex-wrap items-center justify-between group hover:border-[#8b5cf6]/50 hover:bg-white/8 transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-2xl font-bold">
                                {drive.company[0]}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{drive.company}</h3>
                                <p className="text-white/50 text-sm">{drive.role}</p>
                            </div>
                        </div>

                        <div className="flex gap-12">
                            <div>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Package</p>
                                <p className="text-white font-medium">{drive.salary}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Criteria</p>
                                <p className="text-white font-medium">{drive.eligibility}</p>
                            </div>
                            <div className="flex items-center">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${drive.status === 'Applied' ? 'bg-green-500/20 text-green-500' : 'bg-purple-500/20 text-purple-500'}`}>
                                    {drive.status}
                                </span>
                            </div>
                        </div>

                        <button className={`px-8 py-3 rounded-xl font-bold transition-all ${drive.status === 'Applied' ? 'bg-white/5 text-white/40 cursor-not-allowed' : 'bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5'}`}>
                            {drive.status === 'Applied' ? 'View Status' : 'Apply Now'}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PlacementDrives;
