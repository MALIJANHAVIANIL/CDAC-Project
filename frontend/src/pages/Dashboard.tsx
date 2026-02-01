import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { getUserApplications, getActiveDrives } from '../services/driveService';
import { Bell, Briefcase, CheckCircle, Clock, FileText, Search, Star, TrendingUp, XCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [upcomingDrives, setUpcomingDrives] = useState<any[]>([]);
    const [stats, setStats] = useState({ applied: 0, interviews: 0, offers: 0, rejected: 0 });
    const [profileCompleteness, setProfileCompleteness] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.role === 'HR') navigate('/hr');
            else if (user.role === 'TPO') navigate('/tpo');
            else if (user.role === 'ALUMNI') navigate('/alumni');
            else if (user.role === 'ADMIN') navigate('/admin/drives');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                // Fetch Notifications
                try {
                    const { getNotifications } = await import('../services/notificationService');
                    const notifs = await getNotifications();
                    setNotifications(notifs || []);
                } catch (e) {
                    console.error("Failed to fetch notifications", e);
                }

                // Fetch Applications
                try {
                    const userId = user.id ? parseInt(user.id) : (user as any)._id;
                    const apps = await getUserApplications(userId);
                    // setApplications(apps || []); // Removed as unused

                    // Calculate Stats
                    const statsCount = { applied: 0, interviews: 0, offers: 0, rejected: 0 };
                    apps?.forEach((app: any) => {
                        statsCount.applied++;
                        if (app.status === 'Interview') statsCount.interviews++;
                        if (app.status === 'Offer') statsCount.offers++;
                        if (app.status === 'Rejected') statsCount.rejected++;
                    });
                    setStats(statsCount);

                    // Fetch Upcoming Drives (Mock logic: active drives sorted by date)
                    const drives = await getActiveDrives();
                    setUpcomingDrives(drives.slice(0, 5) || []);

                } catch (e) {
                    console.error("Failed to fetch dashboard data", e);
                }

                // Calculate Profile Completeness
                let score = 0;
                if (user.name) score += 20;
                if (user.email) score += 20;
                if (user.phone) score += 20;
                if (user.resumeUrl) score += 20;
                if (user.cgpa) score += 20;
                setProfileCompleteness(score);
            }
        };

        fetchData();
    }, [user]);

    const handleMarkRead = async (id: number) => {
        try {
            const { markAsRead } = await import('../services/notificationService');
            await markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (e) {
            console.error("Failed to mark read", e);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const { markAllAsRead } = await import('../services/notificationService');
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (e) {
            console.error("Failed to mark all as read", e);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const statCards = [
        { title: 'Applied', value: stats.applied, icon: <FileText size={20} />, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 text-blue-400' },
        { title: 'Interviews', value: stats.interviews, icon: <Briefcase size={20} />, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10 text-purple-400' },
        { title: 'Offers', value: stats.offers, icon: <CheckCircle size={20} />, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10 text-green-400' },
        { title: 'Rejected', value: stats.rejected, icon: <XCircle size={20} />, color: 'from-red-500 to-orange-500', bg: 'bg-red-500/10 text-red-400' },
    ];

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-20 flex flex-col h-screen overflow-y-auto custom-scrollbar">
                {/* Header */}
                <header className="h-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-50">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-xs text-white/40">Welcome back, {user?.name?.split(' ')[0] || 'Student'}</p>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 pl-10 text-sm focus:bg-white/10 focus:border-purple-500/50 outline-none transition-all w-64"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" size={16} />
                        </div>

                        {/* Notification Bell */}
                        <button
                            className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all relative"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell size={18} className="text-white/60" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute top-16 right-20 w-80 bg-[#1a1a24] border border-white/10 rounded-2xl shadow-xl z-[100] overflow-hidden">
                                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                    <h3 className="font-bold text-sm">Notifications</h3>
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs text-purple-400 hover:text-purple-300"
                                    >
                                        Mark all read
                                    </button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-white/30 text-xs">No notifications</div>
                                    ) : (
                                        notifications.map((n, i) => (
                                            <div
                                                key={i}
                                                className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer ${!n.isRead ? 'bg-white/10' : ''}`}
                                                onClick={() => handleMarkRead(n.id)}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="text-lg">{n.type === 'ALERT' ? '🚀' : '📢'}</div>
                                                    <div>
                                                        <p className={`text-xs ${!n.isRead ? 'font-bold text-white' : 'text-white/60'}`}>{n.message}</p>
                                                        <p className="text-[10px] text-white/40 mt-1">{new Date(n.createdAt || Date.now()).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        <div
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-sm cursor-pointer hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                            onClick={() => navigate('/profile')}
                        >
                            {user?.name?.substring(0, 2).toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto w-full space-y-8">

                    {/* Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-[32px] p-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-extrabold text-white mb-2">
                                    Ready for your next big step? 🚀
                                </h2>
                                <p className="text-white/60 max-w-xl">
                                    You have applied to <span className="text-white font-bold">{stats.applied}</span> companies.
                                    Keep your profile updated and stay consistent!
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/placements')}
                                className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all"
                            >
                                Browse Drives
                            </button>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl hover:border-white/20 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform`}>
                                        {stat.icon}
                                    </div>
                                    <TrendingUp size={16} className="text-white/20 group-hover:text-green-400 transition-colors" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-white/40 font-medium">{stat.title}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Column (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Upcoming Drives */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-h-[300px]">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Briefcase size={20} className="text-purple-400" />
                                        Upcoming Drives
                                    </h3>
                                    <button onClick={() => navigate('/placements')} className="text-xs text-white/40 hover:text-white transition-colors">
                                        View All
                                    </button>
                                </div>

                                {upcomingDrives.length > 0 ? (
                                    <div className="space-y-3">
                                        {upcomingDrives.map((drive, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/3 hover:bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer" onClick={() => navigate('/placements')}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center font-bold text-lg border border-white/10 group-hover:border-purple-500/50 transition-colors text-white">
                                                        {drive.companyName?.[0] || 'C'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">{drive.companyName}</h4>
                                                        <p className="text-xs text-white/50">{drive.role} • {drive.location}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-white">{drive.packageValue}</div>
                                                    <div className="text-xs text-white/40">{new Date(drive.deadline).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[200px] text-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                            <Briefcase size={24} className="text-white/20" />
                                        </div>
                                        <h4 className="text-white/50 font-medium">No Upcoming Drives</h4>
                                        <p className="text-white/30 text-sm mt-1">Check back later for new opportunities.</p>
                                    </div>
                                )}
                            </div>

                            {/* Recent Activity Feed */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Clock size={20} className="text-blue-400" />
                                    Recent Activity
                                </h3>

                                <div className="space-y-6 relative ml-2">
                                    {/* Timeline Line */}
                                    <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-white/5"></div>

                                    {notifications.length > 0 ? notifications.slice(0, 4).map((n, i) => (
                                        <div key={i} className="relative flex gap-6 group">
                                            {/* Timeline Dot */}
                                            <div className="w-10 h-10 rounded-full bg-[#0a0a0f] border-2 border-white/10 group-hover:border-blue-500 flex items-center justify-center z-10 transition-colors">
                                                {n.type === 'ALERT' ? <Bell size={14} className="text-orange-400" /> : <FileText size={14} className="text-blue-400" />}
                                            </div>

                                            <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                                <p className="text-sm font-medium text-white/90">{n.message}</p>
                                                <p className="text-xs text-white/40 mt-1">{new Date(n.createdAt || Date.now()).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 text-white/30 text-sm">No recent activity</div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Right Column (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Profile Strength */}
                            <div className="bg-gradient-to-br from-purple-900/10 to-blue-900/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px]"></div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                                    <Star size={18} className="text-yellow-400" />
                                    Profile Strength
                                </h3>

                                <div className="relative pt-2 mb-4 z-10">
                                    <div className="flex justify-between text-sm mb-2 font-bold">
                                        <span className="text-white/80">{profileCompleteness < 100 ? 'Almost there!' : 'Excellent!'}</span>
                                        <span className="text-purple-400">{profileCompleteness}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${profileCompleteness}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {profileCompleteness < 100 && (
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold transition-all relative z-10"
                                    >
                                        Complete Profile
                                    </button>
                                )}
                            </div>

                            {/* Placement Eligibility (Detailed) */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-400" />
                                    Eligibility Status
                                </h3>

                                <div className="space-y-4">
                                    {/* CGPA */}
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                                <TrendingUp size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">CGPA</div>
                                                <div className="text-[10px] text-white/40">Min 6.0 Required</div>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-bold ${(user?.cgpa || 0) >= 6.0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {user?.cgpa || 'N/A'}
                                        </div>
                                    </div>

                                    {/* Backlogs */}
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                                                <XCircle size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">Active Backlogs</div>
                                                <div className="text-[10px] text-white/40">Must be 0</div>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-bold ${(user?.backlogs || 0) === 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {user?.backlogs || 0}
                                        </div>
                                    </div>

                                    {/* Attendance */}
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                                                <Clock size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">Attendance</div>
                                                <div className="text-[10px] text-white/40">Min 75% Required</div>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-bold ${(user?.attendance || 0) >= 75 ? 'text-green-400' : 'text-orange-400'}`}>
                                            {user?.attendance || 0}%
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                                    <p className="text-xs text-white/50">
                                        {((user?.cgpa || 0) >= 6.0 && (user?.backlogs || 0) === 0 && (user?.attendance || 0) >= 75)
                                            ? <span className="text-green-400 font-bold">You are eligible for placements! 🎉</span>
                                            : <span className="text-orange-400 font-bold">Review criteria to improve eligibility.</span>
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => navigate('/placements')} className="p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-center transition-all">
                                        <Briefcase size={20} className="mx-auto mb-2 text-blue-400" />
                                        <span className="text-xs font-semibold text-blue-200">View Jobs</span>
                                    </button>
                                    <button onClick={() => navigate('/applications')} className="p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl text-center transition-all">
                                        <Clock size={20} className="mx-auto mb-2 text-purple-400" />
                                        <span className="text-xs font-semibold text-purple-200">History</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
