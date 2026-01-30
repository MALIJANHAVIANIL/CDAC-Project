import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getStudentStats, getTpoStats } from '../services/analyticsService';

const Dashboard: React.FC = () => {
    const { user, logout } = useUser();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = user?.role === 'ADMIN' ? await getTpoStats() : await getStudentStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            {/* Sidebar - Modern Mini Version */}
            <aside className="w-20 bg-white/5 backdrop-blur-[20px] border-r border-white/10 flex flex-col items-center py-6 fixed h-full z-[100]">
                <div className="text-2xl font-extrabold bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent mb-12">
                    E
                </div>
                <nav className="flex flex-col gap-6 flex-1">
                    <NavItem icon="🏠" active title="Dashboard" />
                    <NavItem icon="💼" title="Placements" />
                    <NavItem icon="📄" title="Applications" />
                    <NavItem icon="📊" title="Analytics" />
                    <NavItem icon="✉️" title="Messages" />
                </nav>
                <button
                    onClick={logout}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white/50 hover:bg-red-500/20 hover:text-red-500 transition-all mb-4"
                    title="Logout"
                >
                    <span className="text-xl">🚪</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-20 flex flex-col">
                {/* Top Bar */}
                <header className="h-20 bg-white/5 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-[90]">
                    <div className="flex-1 max-w-[500px] relative">
                        <input
                            type="text"
                            placeholder="Search drives, companies..."
                            className="w-full py-3 px-4 pl-12 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-[#8b5cf6]/50 transition-all font-inter text-sm"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center relative hover:bg-white/10 transition-colors pointer-cursor">
                            🔔
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] rounded-xl flex items-center justify-center font-bold uppercase">
                            {user?.name?.substring(0, 2) || '??'}
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                            Welcome back, {user?.name}!
                        </h1>
                        <p className="text-white/50">
                            {user?.role === 'ADMIN' ? 'Manage your placement ecosystem.' : 'Your placement journey is 85% complete.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-6">
                        {/* Eligibility Widget */}
                        <Widget title={user?.role === 'ADMIN' ? 'Total Students' : 'Placement Eligibility'} icon="🎓" className="lg:col-span-2 lg:row-span-2">
                            <div className="flex flex-col gap-5 h-full">
                                <div className="text-center">
                                    <div className="w-32 h-32 rounded-full border-8 border-purple-500/20 border-t-purple-500 flex items-center justify-center mx-auto mb-4 relative">
                                        <span className="text-3xl font-bold bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent">
                                            {user?.role === 'ADMIN' ? stats?.totalStudents || 0 : user?.cgpa || '8.5'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/50">{user?.role === 'ADMIN' ? 'Registered Students' : 'Current CGPA'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/3 p-3 rounded-xl text-center">
                                        <div className="text-green-500 font-bold mb-1">{user?.role === 'ADMIN' ? stats?.placedCount || 0 : 'Pass'}</div>
                                        <div className="text-[10px] opacity-50 uppercase tracking-wider">{user?.role === 'ADMIN' ? 'Placed' : 'Aptitude'}</div>
                                    </div>
                                    <div className="bg-white/3 p-3 rounded-xl text-center">
                                        <div className="text-green-500 font-bold mb-1">{user?.role === 'ADMIN' ? stats?.ongoingDrives || 0 : 'Clear'}</div>
                                        <div className="text-[10px] opacity-50 uppercase tracking-wider">{user?.role === 'ADMIN' ? 'Active Drives' : 'Backlogs'}</div>
                                    </div>
                                </div>
                            </div>
                        </Widget>

                        {/* Recent Activity / Upcoming Drives */}
                        <Widget title={user?.role === 'ADMIN' ? 'Recent Activity' : 'Upcoming Drives'} icon="🚀" className="lg:row-span-2">
                            <div className="flex flex-col gap-3">
                                {(stats?.upcomingDrives || stats?.activities || [
                                    { company: "Google", date: "Oct 15, 2024", logo: "G" },
                                    { company: "Microsoft", date: "Oct 20, 2024", logo: "M" },
                                    { company: "Amazon", date: "Oct 25, 2024", logo: "A" }
                                ]).map((item: any, idx: number) => (
                                    <DriveItem key={idx} company={item.company} date={item.date} logo={item.company[0]} />
                                ))}
                            </div>
                        </Widget>

                        {/* Quick Actions */}
                        <Widget title="Quick Actions" icon="⚡">
                            <button className="w-full py-3 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-xl font-semibold mb-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                                {user?.role === 'ADMIN' ? 'Post New Drive' : 'Apply Now'}
                            </button>
                        </Widget>
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, active = false, title }: { icon: string, active?: boolean, title: string }) => (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all ${active ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] shadow-[0_4px_16px_rgba(139,92,246,0.3)]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`} title={title}>
        <span className="text-xl">{icon}</span>
    </div>
);

const Widget = ({ title, icon, children, className = "" }: { title: string, icon: string, children: React.ReactNode, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-6 group hover:border-[#8b5cf6]/50 hover:bg-white/8 transition-all duration-400 ${className}`}
    >
        <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-white">{title}</h3>
            <div className="w-9 h-9 bg-purple-500/20 text-[#8b5cf6] flex items-center justify-center rounded-lg">{icon}</div>
        </div>
        {children}
    </motion.div>
);

const DriveItem = ({ company, date, logo }: { company: string, date: string, logo: string }) => (
    <div className="flex items-center gap-3 p-3 bg-white/3 rounded-xl hover:bg-white/8 hover:translate-x-1 transition-all cursor-pointer">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center font-bold">{logo}</div>
        <div className="flex-1">
            <div className="text-sm font-semibold">{company}</div>
            <div className="text-[11px] opacity-40">{date}</div>
        </div>
    </div>
);

export default Dashboard;
