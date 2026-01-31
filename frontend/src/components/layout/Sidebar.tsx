import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useUser();

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

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
                    { icon: '🏠', path: '/tpo', title: 'Dashboard' },
                    { icon: '💼', path: '/admin/drives', title: 'Manage Drives' },
                    { icon: '📊', path: '/analytics', title: 'Analytics' },
                ];
            case 'ALUMNI':
                return [
                    { icon: '🏠', path: '/alumni', title: 'Dashboard' },
                    { icon: '📝', path: '/questions', title: 'Questions' },
                    { icon: '💬', path: '/chat', title: 'Messages' },
                ];
            case 'HR':
                return [
                    { icon: '🏠', path: '/hr', title: 'Dashboard' },
                    { icon: '💼', path: '/hr', title: 'Job Listings' },
                ];
            case 'ADMIN':
                return [
                    { icon: '🏠', path: '/admin/drives', title: 'Drives' },
                    { icon: '📊', path: '/analytics', title: 'Analytics' },
                ];
            default: // STUDENT
                return [
                    { icon: '🏠', path: '/dashboard', title: 'Dashboard' },
                    { icon: '💼', path: '/placements', title: 'Placements' },
                    { icon: '📄', path: '/applications', title: 'Applications' },
                    { icon: '📝', path: '/questions', title: 'Questions' },
                    { icon: '💬', path: '/chat', title: 'Chat' },
                ];
        }
    };

    return (
        <aside className="w-20 bg-white/5 backdrop-blur-[20px] border-r border-white/10 flex flex-col items-center py-6 fixed h-full z-[100]">
            <div className="text-2xl font-extrabold bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent mb-12 cursor-pointer" onClick={() => navigate(getHomeRoute())}>
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
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white/50 hover:bg-red-500/20 hover:text-red-500 transition-all mb-4"
                title="Logout"
            >
                <span className="text-xl">🚪</span>
            </button>
        </aside>
    );
};

const NavItem = ({ icon, active = false, title, onClick }: { icon: string, active?: boolean, title: string, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all ${active ? 'bg-[#8b5cf6]/20 text-[#8b5cf6] shadow-[0_4px_16px_rgba(139,92,246,0.3)]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
        title={title}
    >
        <span className="text-xl">{icon}</span>
    </div>
);

export default Sidebar;
