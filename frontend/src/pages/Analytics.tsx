import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getStudentStats, getTpoStats } from '../services/analyticsService';
import Sidebar from '../components/layout/Sidebar';

const Analytics: React.FC = () => {
    const { user } = useUser();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = (user?.role === 'TPO' || user?.role === 'ADMIN')
                    ? await getTpoStats()
                    : await getStudentStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />
            <main className="flex-1 ml-20 p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                            Performance Analytics
                        </h1>
                        <p className="text-white/50">Visualize your placement journey.</p>
                    </div>
                </header>

                {loading ? (
                    <div className="text-white/50">Loading analytics...</div>
                ) : (user?.role === 'TPO' || user?.role === 'ADMIN') ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon="👥" color="text-purple-400" />
                        <StatCard title="Placed Students" value={stats?.placedStudents || 0} icon="✅" color="text-green-400" />
                        <StatCard title="Active Drives" value={stats?.activeDrives || 0} icon="🚀" color="text-blue-400" />
                        <StatCard title="Avg Package" value={stats?.avgPackage || '0 LPA'} icon="💰" color="text-yellow-400" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard title="Total Applications" value={stats?.totalApplications || 0} icon="📄" />
                        <StatCard title="Interviews" value={stats?.interviews || 0} icon="🎤" />
                        <StatCard title="Offers" value={stats?.offers || 0} icon="🎉" color="text-green-500" />
                        <StatCard title="Rejections" value={stats?.rejections || 0} icon="❌" color="text-red-500" />
                    </div>
                )}

                <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-bold mb-4">Detailed Analysis</h3>
                    <p className="text-white/50">More charts coming soon...</p>
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ title, value, icon, color = "text-white" }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between"
    >
        <div>
            <p className="text-white/50 text-sm uppercase tracking-wider">{title}</p>
            <h3 className={`text-3xl font-bold mt-1 ${color}`}>{value}</h3>
        </div>
        <div className="text-3xl opacity-50">{icon}</div>
    </motion.div>
);

export default Analytics;
