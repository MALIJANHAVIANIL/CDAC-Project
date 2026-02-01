import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import {
    LayoutDashboard,
    Briefcase,
    PieChart,
    MessageSquare,
    User,
    GraduationCap,
    BookOpen,
    LogOut,
    CheckSquare
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useUser();

    const isActive = (path: string) => {
        if (path === '/hr' || path === '/tpo' || path === '/dashboard' || path === '/alumni') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    // Get home route based on role
    const getHomeRoute = () => {
        switch (user?.role) {
            case 'TPO': return '/tpo';
            case 'ALUMNI': return '/alumni';
            case 'HR': return '/hr';
            case 'ADMIN': return '/admin/drives';
            default: return '/dashboard';
        }
    };

    // Role-specific navigation items
    const getNavItems = () => {
        switch (user?.role) {
            case 'TPO':
                return [
                    { icon: <LayoutDashboard size={22} />, path: '/tpo', title: 'Dashboard' },
                    { icon: <Briefcase size={22} />, path: '/admin/drives', title: 'Manage Drives' },
                    { icon: <PieChart size={22} />, path: '/analytics', title: 'Analytics' },
                    { icon: <User size={22} />, path: '/profile', title: 'Profile' },
                ];
            case 'ALUMNI':
                return [
                    { icon: <LayoutDashboard size={22} />, path: '/alumni', title: 'Dashboard' },
                    { icon: <BookOpen size={22} />, path: '/questions', title: 'Questions' },
                    { icon: <MessageSquare size={22} />, path: '/chat', title: 'Messages' },
                    { icon: <User size={22} />, path: '/profile', title: 'Profile' },
                ];
            case 'HR':
                return [
                    { icon: <LayoutDashboard size={22} />, path: '/hr', title: 'Dashboard' },
                    { icon: <Briefcase size={22} />, path: '/hr/jobs', title: 'Job Listings' },
                    { icon: <User size={22} />, path: '/profile', title: 'Profile' },
                ];
            case 'ADMIN':
                return [
                    { icon: <Briefcase size={22} />, path: '/admin/drives', title: 'Drives' },
                    { icon: <PieChart size={22} />, path: '/analytics', title: 'Analytics' },
                    { icon: <User size={22} />, path: '/profile', title: 'Profile' },
                ];
            default: // STUDENT
                return [
                    { icon: <LayoutDashboard size={22} />, path: '/dashboard', title: 'Dashboard' },
                    { icon: <Briefcase size={22} />, path: '/placements', title: 'Placements' },
                    { icon: <CheckSquare size={22} />, path: '/applications', title: 'Applications' },
                    { icon: <BookOpen size={22} />, path: '/questions', title: 'Questions' },
                    { icon: <MessageSquare size={22} />, path: '/chat', title: 'Chat' },
                    { icon: <User size={22} />, path: '/profile', title: 'Profile' },
                ];
        }
    };

    return (
        <aside className="w-20 bg-[#0a0a0f]/80 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-8 fixed h-full z-[100] shadow-2xl">
            <div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-xl font-black text-white mb-12 cursor-pointer shadow-lg shadow-purple-500/20 hover:scale-110 active:scale-95 transition-all"
                onClick={() => navigate(getHomeRoute())}
            >
                E
            </div>
            <nav className="flex flex-col gap-6 flex-1">
                {getNavItems().map((item) => (
                    <NavItem
                        key={item.path}
                        icon={item.icon}
                        active={isActive(item.path)}
                        title={item.title}
                        onClick={() => navigate(item.path)}
                    />
                ))}
            </nav>
            <button
                onClick={logout}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/20 hover:bg-red-500/10 hover:text-red-500 transition-all mb-4 group relative"
                title="Logout"
            >
                <LogOut size={22} />
                <div className="absolute left-full ml-4 px-3 py-2 bg-red-500 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap">
                    Sign Out
                </div>
            </button>
        </aside>
    );
};

const NavItem = ({ icon, active = false, title, onClick }: { icon: React.ReactNode, active?: boolean, title: string, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all group relative ${active
            ? 'bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] text-white shadow-lg shadow-purple-500/30'
            : 'text-white/30 hover:bg-white/5 hover:text-white'}`}
    >
        {icon}
        <div className={`absolute left-full ml-4 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-[200] ${active ? 'bg-purple-500/20' : ''}`}>
            {title}
        </div>
        {active && (
            <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full"></div>
        )}
    </div>
);

export default Sidebar;
