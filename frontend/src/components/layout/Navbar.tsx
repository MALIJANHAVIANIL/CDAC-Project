import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const logo = "/logo.png";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();

    const handleScroll = (id: string) => {
        if (window.location.pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(`/#${id}`);
        }
    };

    return (
        <nav className="sticky top-0 z-[100] px-[6%] py-5 bg-[#0a0a0fcc] backdrop-blur-[16px] border-b border-white/10 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold no-underline">
                <img src={logo} alt="ElevateConnect" className="h-10 w-auto" />
                <span className="bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent">
                    ElevateConnect
                </span>
            </Link>

            <ul className="hidden md:flex gap-8 items-center list-none">
                {user ? (
                    <>
                        <li><Link to="/dashboard" className="text-white/80 no-underline font-medium hover:text-white transition-colors">Dashboard</Link></li>
                        <li><Link to="/drives" className="text-white/80 no-underline font-medium hover:text-white transition-colors">Drives</Link></li>
                        {user.role === 'ADMIN' && (
                            <li><Link to="/admin/drives" className="text-white/80 no-underline font-medium hover:text-white transition-colors">Management</Link></li>
                        )}
                        <li><Link to="/applications" className="text-white/80 no-underline font-medium hover:text-white transition-colors">Applications</Link></li>
                        <li><button onClick={() => handleScroll('contact')} className="text-white/80 no-underline font-medium hover:text-white transition-colors bg-transparent border-none cursor-pointer">Contact</button></li>
                    </>
                ) : (
                    <>
                        <li><button onClick={() => handleScroll('features')} className="text-white/80 no-underline font-medium hover:text-white transition-colors bg-transparent border-none cursor-pointer">Features</button></li>
                        <li><button onClick={() => handleScroll('testimonials')} className="text-white/80 no-underline font-medium hover:text-white transition-colors bg-transparent border-none cursor-pointer">Success Stories</button></li>
                        <li><button onClick={() => handleScroll('about')} className="text-white/80 no-underline font-medium hover:text-white transition-colors bg-transparent border-none cursor-pointer">About</button></li>
                        <li><button onClick={() => handleScroll('contact')} className="text-white/80 no-underline font-medium hover:text-white transition-colors bg-transparent border-none cursor-pointer">Contact</button></li>
                    </>
                )}
            </ul>

            <div className="flex gap-4 items-center">
                {user ? (
                    <>
                        <Link
                            to="/profile"
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center font-bold text-white shadow-lg hover:scale-105 transition-all uppercase"
                        >
                            {user.name.substring(0, 1)}
                        </Link>
                        <button
                            onClick={logout}
                            className="px-5 py-2.5 rounded-xl font-semibold cursor-pointer transition-all duration-300 bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate('/auth', { state: { mode: 'login' } })}
                            className="px-7 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 bg-white/5 backdrop-blur-[16px] border border-white/20 text-white hover:bg-white/10 hover:-translate-y-0.5"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/auth', { state: { mode: 'register' } })}
                            className="px-7 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] text-white border border-white/20 shadow-[0_4px_16px_rgba(139,92,246,0.4)] relative overflow-hidden group hover:-translate-y-0.5"
                        >
                            <span className="relative z-10">Register</span>
                            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-500 group-hover:left-full"></div>
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
