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
        { title: 'Applied', value: stats.applied, icon: <FileText size={20} />, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-500/10 text-blue-400', shadow: 'shadow-blue-500/10' },
        { title: 'Interviews', value: stats.interviews, icon: <Briefcase size={20} />, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10 text-purple-400', shadow: 'shadow-purple-500/10' },
        { title: 'Offers', value: stats.offers, icon: <CheckCircle size={20} />, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10 text-emerald-400', shadow: 'shadow-emerald-500/10' },
        { title: 'Rejected', value: stats.rejected, icon: <XCircle size={20} />, color: 'from-red-500 to-rose-500', bg: 'bg-red-500/10 text-red-400', shadow: 'shadow-red-500/10' },
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
                        className="relative overflow-hidden rounded-[40px] p-10 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] border border-white/10 shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">
                                    Ready for your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">next big step?</span> 🚀
                                </h2>
                                <p className="text-white/40 text-lg max-w-xl font-medium leading-relaxed">
                                    You have applied to <span className="text-white font-bold">{stats.applied}</span> companies.
                                    Keep your profile updated for better placement opportunities.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/placements')}
                                className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all active:scale-95 whitespace-nowrap"
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
                                className={`bg-[#12121a] backdrop-blur-xl border border-white/5 p-6 rounded-[32px] hover:border-white/20 transition-all group shadow-2xl hover:shadow-2xl ${stat.shadow}`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} group-hover:scale-110 transition-transform shadow-lg`}>
                                        {stat.icon}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                        <TrendingUp size={12} className="text-green-400" />
                                        <span className="text-[10px] font-bold text-green-400">+12%</span>
                                    </div>
                                </div>
                                <div className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">{stat.title}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left Column (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Upcoming Drives */}
                            <div className="bg-[#12121a] backdrop-blur-xl border border-white/5 rounded-[40px] p-8 min-h-[300px] shadow-2xl">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-black flex items-center gap-3 tracking-tighter">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                            <Briefcase size={20} className="text-purple-400" />
                                        </div>
                                        Upcoming Drives
                                    </h3>
                                    <button onClick={() => navigate('/placements')} className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                                        View All
                                    </button>
                                </div>

                                {upcomingDrives.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcomingDrives.map((drive, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-6 rounded-[24px] bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-purple-500/30 transition-all group cursor-pointer"
                                                onClick={() => navigate('/placements')}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] flex items-center justify-center font-black text-xl border border-white/10 group-hover:border-purple-500/50 transition-colors text-white shadow-lg">
                                                        {drive.companyName?.[0] || 'C'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-lg text-white group-hover:text-purple-400 transition-colors tracking-tight">{drive.companyName}</h4>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                                                            <span>{drive.role}</span>
                                                            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                                            <span>{drive.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-black text-white tracking-tighter">{drive.packageValue}</div>
                                                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Deadline: {new Date(drive.deadline).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[200px] text-center">
                                        <div className="w-20 h-20 bg-white/5 rounded-[24px] flex items-center justify-center mb-6 border border-white/5">
                                            <Briefcase size={32} className="text-white/10" />
                                        </div>
                                        <h4 className="text-white/50 font-black text-lg">No Upcoming Drives</h4>
                                        <p className="text-white/20 text-sm mt-1 font-medium">Opportunities will appear here soon.</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#12121a] backdrop-blur-xl border border-white/5 rounded-[40px] p-8 shadow-2xl">
                                <h3 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tighter">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <Clock size={20} className="text-blue-400" />
                                    </div>
                                    Recent Activity
                                </h3>

                                <div className="space-y-6 relative ml-2">
                                    <div className="absolute left-[20px] top-2 bottom-2 w-[1px] bg-white/5"></div>

                                    {notifications.length > 0 ? notifications.slice(0, 4).map((n, i) => (
                                        <div key={i} className="relative flex gap-8 group">
                                            <div className="w-10 h-10 rounded-2xl bg-[#0a0a0f] border border-white/10 group-hover:border-blue-500/50 flex items-center justify-center z-10 transition-all shadow-lg group-hover:scale-110">
                                                {n.type === 'ALERT' ? <Bell size={14} className="text-yellow-500" /> : <FileText size={14} className="text-blue-500" />}
                                            </div>

                                            <div className="flex-1 p-5 bg-white/[0.02] rounded-[24px] border border-white/5 group-hover:bg-white/[0.05] transition-all">
                                                <p className="text-sm font-bold text-white/80 leading-relaxed">{n.message}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2">{new Date(n.createdAt || Date.now()).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 text-white/20 text-sm font-medium italic">No recent activity detected.</div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Right Column (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">

                            <div className="bg-[#12121a] backdrop-blur-xl border border-white/5 rounded-[40px] p-8 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] -mr-16 -mt-16"></div>
                                <h3 className="text-xl font-black mb-6 flex items-center gap-3 tracking-tighter relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center">
                                        <Star size={18} className="text-yellow-400" />
                                    </div>
                                    Profile Strength
                                </h3>

                                <div className="relative mb-8 z-10">
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="text-white font-black text-lg tracking-tight">{profileCompleteness < 100 ? 'Almost there!' : 'Excellent!'}</span>
                                        <span className="text-2xl font-black text-purple-400 tracking-tighter">{profileCompleteness}%</span>
                                    </div>
                                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${profileCompleteness}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"
                                        ></motion.div>
                                    </div>
                                </div>

                                {profileCompleteness < 100 && (
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative z-10 active:scale-95"
                                    >
                                        Complete Profile
                                    </button>
                                )}
                            </div>

                            <div className="bg-[#12121a] backdrop-blur-xl border border-white/5 rounded-[40px] p-8 shadow-2xl">
                                <h3 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tighter">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                        <CheckCircle size={18} className="text-green-400" />
                                    </div>
                                    Eligibility Status
                                </h3>

                                <div className="space-y-4">
                                    <EligibilityItem icon={<TrendingUp size={16} />} label="CGPA" target="6.0 Required" value={user?.cgpa || 'N/A'} isEligible={(user?.cgpa || 0) >= 6.0} color="blue" />
                                    <EligibilityItem icon={<XCircle size={16} />} label="Active Backlogs" target="Must be 0" value={user?.backlogs || 0} isEligible={(user?.backlogs || 0) === 0} color="red" />
                                    <EligibilityItem icon={<Clock size={16} />} label="Attendance" target="75% Required" value={`${user?.attendance || 0}%`} isEligible={(user?.attendance || 0) >= 75} color="yellow" />
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                        {((user?.cgpa || 0) >= 6.0 && (user?.backlogs || 0) === 0 && (user?.attendance || 0) >= 75)
                                            ? <span className="text-green-400">Placements Eligible 🎉</span>
                                            : <span className="text-orange-400 italic">Not Yet Eligible</span>
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

const EligibilityItem = ({ icon, label, target, value, isEligible, color }: any) => {
    const colorMap: any = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/10',
        red: 'text-red-400 bg-red-500/10 border-red-500/10',
        yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/10',
        green: 'text-green-400 bg-green-500/10 border-green-500/10'
    };

    return (
        <div className="flex items-center justify-between p-5 bg-white/[0.02] rounded-[24px] border border-white/5 hover:bg-white/[0.05] transition-all group">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${colorMap[color]} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div>
                    <div className="text-sm font-black text-white tracking-tight">{label}</div>
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{target}</div>
                </div>
            </div>
            <div className={`text-lg font-black tracking-tighter ${isEligible ? 'text-green-400' : 'text-red-400'}`}>
                {value}
            </div>
        </div>
    );
};

export default Dashboard;
