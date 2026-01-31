import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useUser();

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="w-20 bg-white/5 backdrop-blur-[20px] border-r border-white/10 flex flex-col items-center py-6 fixed h-full z-[100]">
            <div className="text-2xl font-extrabold bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent mb-12 cursor-pointer" onClick={() => navigate('/dashboard')}>
                E
            </div>
            <nav className="flex flex-col gap-6 flex-1">
                <NavItem icon="🏠" active={isActive('/dashboard')} title="Dashboard" onClick={() => navigate('/dashboard')} />
                <NavItem icon="💼" active={isActive('/placements') || isActive('/drives')} title="Placements" onClick={() => navigate('/placements')} />
                <NavItem icon="📄" active={isActive('/applications')} title="Applications" onClick={() => navigate('/applications')} />
                <NavItem icon="📊" active={isActive('/analytics')} title="Analytics" onClick={() => navigate('/analytics')} />

                {/* NEW: Profile Link in Sidebar for easy access */}
                <NavItem icon="👤" active={isActive('/profile')} title="My Profile" onClick={() => navigate('/profile')} />
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
