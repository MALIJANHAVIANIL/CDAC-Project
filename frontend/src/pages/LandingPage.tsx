import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, BarChart, GraduationCap, Users, TrendingUp, Bell, CheckCircle, ArrowRight, Play } from 'lucide-react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        drives: 0,
        placed: 0,
        partners: 0
    });

    useEffect(() => {
        fetch('http://localhost:8081/api/auth/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Error fetching stats:', err));
    }, []);

    const handleGetStarted = () => {
        navigate('/auth');
    };

    const handleWatchDemo = () => {
        // Scroll to features section smoothly
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="relative text-white min-h-screen bg-[#0a0a0f] overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-[6%] text-center max-w-[1400px] mx-auto z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white/80 mb-8 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default"
                >
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Revolutionizing Campus Placements
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight"
                >
                    From <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Preparation</span> to <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Placement</span> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">Improvement</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-white/60 mb-12 max-w-[800px] mx-auto leading-relaxed"
                >
                    A unified ecosystem that automates placement drives, provides personalized feedback, and suggests curated courses to restore eligibility and accelerate your career growth.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    <button onClick={handleGetStarted} className="group px-8 py-4 rounded-xl font-bold bg-white text-black hover:bg-gray-100 transition-all flex items-center gap-2 hover:gap-3 cursor-pointer">
                        Get Started Free
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={handleWatchDemo} className="group px-8 py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer">
                        <Play size={18} className="fill-current" />
                        Watch Demo
                    </button>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="px-[6%] py-12 max-w-[1200px] mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        label="Students Placed"
                        value={stats.placed}
                        suffix="+"
                        icon={<Users className="text-blue-400" size={32} />}
                        delay={0}
                    />
                    <StatCard
                        label="Active Job Listings"
                        value={stats.drives}
                        suffix="+"
                        icon={<Briefcase className="text-purple-400" size={32} />}
                        delay={0.1}
                    />
                    <StatCard
                        label="Placement Rate"
                        value={95}
                        suffix="%"
                        icon={<TrendingUp className="text-green-400" size={32} />}
                        delay={0.2}
                    />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-[6%] py-32 max-w-[1400px] mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Powerful Features</h2>
                    <p className="text-white/60 max-w-[600px] mx-auto">Everything you need to streamline your placement journey and achieve your career goals.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        title="Real-time Eligibility"
                        desc="Monitor your status instantly. Get updates on criteria and scores."
                        icon={<Zap size={32} className="text-yellow-400" />}
                        className="lg:col-span-2 lg:row-span-2"
                    />
                    <FeatureCard
                        title="Rejection Analysis"
                        desc="Deep insights into rejection patterns with actionable feedback maps."
                        icon={<BarChart size={32} className="text-red-400" />}
                        className="lg:row-span-2"
                    />
                    <FeatureCard
                        title="Course Suggestions"
                        desc="AI-powered recommendations to fill skill gaps efficiently."
                        icon={<GraduationCap size={32} className="text-blue-400" />}
                    />
                    <FeatureCard
                        title="Alumni Connect"
                        desc="Connect with successful alumni for mentorship and insights."
                        icon={<Users size={32} className="text-purple-400" />}
                        className="lg:col-span-2"
                    />
                    <FeatureCard
                        title="Skill Recovery"
                        desc="Structured programs to restore eligibility with tracking."
                        icon={<TrendingUp size={32} className="text-green-400" />}
                    />
                    <FeatureCard
                        title="Smart Alerts"
                        desc="Never miss an opportunity with intelligent notifications."
                        icon={<Bell size={32} className="text-orange-400" />}
                    />
                </div>
            </section>

            {/* ... keeping testimonials and footer area similar but upgraded styles ... */}
            <section className="px-[6%] py-20 bg-gradient-to-b from-transparent to-black/40">
                <div className="max-w-[1000px] mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold mb-12">Trusted by Students & Companies</h2>
                    {/* Placeholder for logos or just text */}
                    <p className="text-white/40">Over 50+ Top Recruiters Hiring</p>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="px-[6%] py-20 max-w-[1200px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold mb-6 border border-purple-500/20">
                            Our Mission
                        </div>
                        <h2 className="text-4xl font-bold mb-6 leading-tight">
                            Personalized Path to <span className="text-purple-400">Excellence</span>
                        </h2>
                        <p className="text-lg text-white/60 leading-relaxed mb-8">
                            At ElevateConnect, we believe that every setback is a setup for a stronger comeback. Our platform bridges the gap between academic learning and industry requirements through data-driven insights.
                        </p>
                        <div className="space-y-4">
                            {['Data-Driven Insights', 'Exclusive Partner Network', 'Mentorship-First Approach'].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-white/90 font-medium p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                        <CheckCircle size={18} />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative w-full aspect-square bg-[#1a1a20] rounded-[40px] border border-white/10 flex items-center justify-center text-8xl overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)]" />
                            🚀
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Components
import { Briefcase } from 'lucide-react';

const StatCard = ({ label, value, suffix, icon, delay }: any) => {
    // Simple count up effect
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value || 0;
        if (end === 0) return;

        const duration = 2000;
        const increment = Math.max(1, end / (duration / 16));
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.ceil(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="p-8 rounded-[24px] bg-white/5 backdrop-blur-[20px] border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-2xl text-white/80 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                {/* Decoration */}
                <div className="h-12 w-12 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl" />
            </div>
            <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                {count}{suffix}
            </div>
            <div className="text-sm text-white/50 font-medium uppercase tracking-wider">{label}</div>
        </motion.div>
    );
};

const FeatureCard = ({ title, desc, icon, className = "" }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className={`p-8 rounded-[32px] bg-[#12121a] border border-white/5 hover:border-purple-500/30 transition-all hover:bg-[#1a1a24] group relative overflow-hidden ${className}`}
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:bg-purple-500/20" />

        <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-purple-500/10 transition-colors">
            {icon}
        </div>

        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">{title}</h3>
        <p className="text-white/50 leading-relaxed text-sm">{desc}</p>
    </motion.div>
);

export default LandingPage;
