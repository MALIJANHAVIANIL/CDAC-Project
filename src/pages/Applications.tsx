import React from 'react';
import { motion } from 'framer-motion';

const Applications: React.FC = () => {
    const apps = [
        { id: 1, company: "Google", role: "Software Engineer", appDate: "Oct 12, 2024", status: "Interviewing", nextStep: "Technical Round 2" },
        { id: 2, company: "Adobe", role: "Product Designer", appDate: "Oct 05, 2024", status: "Rejected", nextStep: "View Feedback" },
        { id: 3, company: "Netflix", role: "Backend Engineer", appDate: "Oct 14, 2024", status: "Applied", nextStep: "Reviewing" },
    ];

    return (
        <div className="p-8 max-w-[1200px] mx-auto">
            <h1 className="text-3xl font-extrabold bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent mb-10">
                Track Applications
            </h1>

            <div className="flex flex-col gap-6">
                {apps.map((app, index) => (
                    <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-8 rounded-[32px] bg-white/5 backdrop-blur-[20px] border border-white/10 flex flex-wrap items-center justify-between group hover:border-[#8b5cf6]/50 transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl">
                                {app.company[0]}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{app.company}</h3>
                                <p className="text-white/50 text-sm">{app.role}</p>
                            </div>
                        </div>

                        <div className="flex gap-12 text-center">
                            <div>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Applied On</p>
                                <p className="text-white font-medium">{app.appDate}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Status</p>
                                <span className={`font-bold ${app.status === 'Rejected' ? 'text-red-400' : 'text-[#8b5cf6]'}`}>{app.status}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <p className="text-sm text-white/70 italic">{app.nextStep}</p>
                            <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">
                                View Details
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Applications;
