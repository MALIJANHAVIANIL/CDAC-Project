import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Auth: React.FC = () => {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(true);
    const [selectedRole, setSelectedRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (location.state?.mode === 'register') {
            setIsLogin(false);
        } else if (location.state?.mode === 'login') {
            setIsLogin(true);
        }
    }, [location.state]);

    const roles = [
        { id: 'student', label: 'Student' },
        { id: 'tpo', label: 'TPO Admin' },
        { id: 'alumni', label: 'Alumni' },
        { id: 'hr', label: 'HR' }
    ];

    const benefits = [
        { icon: '⚡', title: 'Track Placements' },
        { icon: '🤝', title: 'Alumni Network' },
        { icon: '📈', title: 'Skill Recovery' },
        { icon: '📊', title: 'Real-time Analytics' }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left Panel: Benefits */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden lg:flex flex-col gap-8"
                >
                    <div>
                        <h1 className="text-6xl font-black bg-gradient-to-br from-white to-purple-400 bg-clip-text text-transparent mb-4 leading-tight">
                            {isLogin ? 'Welcome Back' : 'Start Your Journey'}
                        </h1>
                        <p className="text-xl text-white/50 max-w-[500px] leading-relaxed">
                            {isLogin
                                ? 'Sign in to continue your journey towards career excellence and placement success.'
                                : 'Join our unified ecosystem to automate your career growth and land the perfect role.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {benefits.map((benefit, i) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 + 0.5 }}
                                className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-purple-500/50 transition-all group"
                            >
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{benefit.icon}</div>
                                <h3 className="font-bold text-lg">{benefit.title}</h3>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Panel: Auth Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-[40px] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Role Tabs */}
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 mb-8">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${selectedRole === role.id
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                                    }`}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex gap-8 mb-10 justify-center">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`text-2xl font-black pb-2 transition-all ${isLogin ? 'text-white border-b-4 border-purple-500' : 'text-white/20 hover:text-white/40'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`text-2xl font-black pb-2 transition-all ${!isLogin ? 'text-white border-b-4 border-purple-500' : 'text-white/20 hover:text-white/40'}`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form Container */}
                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isLogin ? 'login' : 'register'}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {!isLogin && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full py-4 px-6 bg-white/5 border-b-2 border-white/10 rounded-t-2xl outline-none focus:border-purple-500 transition-all focus:bg-white/10" required />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Email Address</label>
                                <input type="email" placeholder="name@example.com" className="w-full py-4 px-6 bg-white/5 border-b-2 border-white/10 rounded-t-2xl outline-none focus:border-purple-500 transition-all focus:bg-white/10" required />
                            </div>

                            <div className="space-y-1 relative">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full py-4 px-6 bg-white/5 border-b-2 border-white/10 rounded-t-2xl outline-none focus:border-purple-500 transition-all focus:bg-white/10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 bottom-4 text-white/30 hover:text-purple-400 transition-colors"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>

                            {isLogin && (
                                <div className="text-right">
                                    <a href="#" className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors">Forgot Password?</a>
                                </div>
                            )}

                            <button className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-black text-white shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 active:translate-y-0 transition-all mt-4 uppercase tracking-wider">
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </button>

                            <div className="relative py-4 flex items-center gap-4">
                                <div className="flex-1 h-[1px] bg-white/10"></div>
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">or continue with</span>
                                <div className="flex-1 h-[1px] bg-white/10"></div>
                            </div>

                            <div className="flex gap-4">
                                {['🔵', '⚫', '🔴'].map((social, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/50 transition-all text-xl"
                                    >
                                        {social}
                                    </button>
                                ))}
                            </div>
                        </motion.form>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
