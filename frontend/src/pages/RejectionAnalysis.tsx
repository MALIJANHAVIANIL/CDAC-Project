import React from 'react';
import { motion } from 'framer-motion';

const RejectionAnalysis: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col min-h-screen bg-[#0a0a0f] text-white">
            <header className="h-20 bg-white/5 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-10 sticky top-0 z-[90]">
                <div className="flex flex-col">
                    <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                        Feedback & Skill Recovery
                    </h1>
                    <p className="text-xs text-white/50">Analyze rejections and track your path back to eligibility.</p>
                </div>
            </header>

            <main className="p-10 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px] mx-auto">
                    {/* Rejection Analysis Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: -0 }}
                        className="bg-red-500/10 backdrop-blur-[20px] border border-red-500/20 rounded-3xl p-10 relative overflow-hidden group hover:border-red-500/40 transition-all shadow-xl"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>

                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-4xl shadow-lg shadow-red-500/40">
                                🏢
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-black text-white">Google</h2>
                                <p className="text-white/60 font-medium">Software Engineer (L3)</p>
                            </div>
                            <div className="px-5 py-2 rounded-full bg-red-500/20 border-2 border-red-500/40 text-red-500 font-bold text-xs uppercase tracking-wider">
                                Rejected
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-3"><span className="text-purple-500">📊</span> Interview Insight</h3>
                            <div className="bg-white/3 border border-white/10 rounded-2xl p-6">
                                <p className="text-white/80 leading-relaxed mb-6 italic">
                                    "Candidate showed strong problem-solving skills but struggled with <span className="text-red-500 font-bold">System Design</span> and <span className="text-red-500 font-bold">Distributed Systems</span> scalability patterns during the technical round."
                                </p>
                                <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                    <div className="text-2xl">📉</div>
                                    <div>
                                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Concept Gap Score</p>
                                        <p className="text-2xl font-black text-red-500">65%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-6">
                                <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">✨ Recovery Roadmap</h4>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    Based on the feedback, focus on microservices architecture and CAP theorem. Suggested recovery time: 4 weeks of intensive learning.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-8">
                        {/* Progress Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-3xl p-10 hover:border-purple-500/40 transition-all"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold flex items-center gap-3">🛠️ Recovery Progress</h3>
                                <span className="text-xs text-white/40 uppercase tracking-tighter font-bold">Eligibility Restoration</span>
                            </div>

                            <div className="relative w-44 h-44 mx-auto mb-8">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="88" cy="88" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                    <circle cx="88" cy="88" r="80" fill="none" stroke="url(#restorationGradient)" strokeWidth="12" strokeDasharray="502" strokeDashoffset="125" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="restorationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#3b82f6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent">75%</span>
                                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Complete</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/3 border border-white/10 p-5 rounded-2xl text-center">
                                    <div className="text-3xl font-black text-purple-500">12/16</div>
                                    <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mt-1">Modules Done</div>
                                </div>
                                <div className="bg-white/3 border border-white/10 p-5 rounded-2xl text-center">
                                    <div className="text-3xl font-black text-blue-500">9 Days</div>
                                    <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mt-1">To Eligibility</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Suggested Courses */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-3">🎓 Recommended Courses</h3>
                            <div className="space-y-4">
                                <CourseCard title="Mastering Distributed Systems" platform="Udemy" duration="12h" rating="4.9" />
                                <CourseCard title="Introduction to Cloud Architecture" platform="NPTEL" duration="8 Weeks" rating="4.7" completed />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const CourseCard = ({ title, platform, duration, rating, completed = false }: { title: string, platform: string, duration: string, rating: string, completed?: boolean }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className={`bg-white/5 backdrop-blur-[20px] border border-white/10 p-6 rounded-2xl flex items-center justify-between group transition-all cursor-pointer ${completed ? 'border-green-500/30 bg-green-500/5' : 'hover:border-purple-500/50 hover:bg-white/8'}`}
    >
        <div className="flex-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8b5cf6] mb-2 inline-block px-3 py-1 bg-purple-500/10 rounded-full">{platform}</span>
            <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
            <div className="flex gap-6 text-xs text-white/40 font-medium">
                <span>⏱️ {duration}</span>
                <span>⭐ {rating}</span>
            </div>
        </div>
        {completed ? (
            <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xl">✓</div>
        ) : (
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] text-white text-xs font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all">Start Now</button>
        )}
    </motion.div>
);

export default RejectionAnalysis;
