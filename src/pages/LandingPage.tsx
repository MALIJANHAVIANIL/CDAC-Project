import React from 'react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
    return (
        <div className="relative text-white">
            {/* Hero Section */}
            <section className="px-[6%] pt-32 pb-20 text-center max-w-[1200px] mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent"
                >
                    From Preparation to Placement to Improvement.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-white/70 mb-10 max-w-[700px] mx-auto leading-relaxed"
                >
                    A unified ecosystem that automates placement drives, provides personalized feedback, and suggests curated courses to restore eligibility and accelerate your career growth.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-wrap gap-5 justify-center"
                >
                    <button className="px-8 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] text-white border border-white/20 shadow-[0_4px_16px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(139,92,246,0.6)]">
                        Get Started Free
                    </button>
                    <button className="px-8 py-3 rounded-xl font-semibold cursor-pointer transition-all duration-300 bg-white/5 backdrop-blur-[16px] border border-white/20 text-white hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(139,92,246,0.3)]">
                        Watch Demo
                    </button>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="px-[6%] py-15 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
                {[
                    { label: "Students Placed", value: "500+" },
                    { label: "Partner Companies", value: "120+" },
                    { label: "Improvement Rate", value: "95%" }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="p-10 rounded-[20px] bg-white/5 backdrop-blur-[16px] border border-white/10 text-center transition-all duration-400 hover:-translate-y-2 hover:bg-white/10 hover:border-[#8b5cf6]/50 hover:shadow-[0_16px_48px_rgba(139,92,246,0.3)]"
                    >
                        <div className="text-5xl font-extrabold bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent mb-3">
                            {stat.value}
                        </div>
                        <div className="text-base text-white/60 font-medium">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Features Section - Bento Grid */}
            <section id="features" className="px-[6%] py-20 max-w-[1400px] mx-auto">
                <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-15 bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                    Powerful Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard
                        title="Real-time Eligibility Tracking"
                        desc="Monitor your placement eligibility status in real-time. Get instant updates on criteria, scores, and areas for improvement."
                        icon="⚡"
                        className="lg:col-span-2 lg:row-span-2"
                    />
                    <FeatureCard
                        title="Rejection Analysis"
                        desc="Deep analysis of rejection patterns with actionable feedback and personalized improvement roadmaps."
                        icon="📊"
                        className="lg:row-span-2"
                    />
                    <FeatureCard
                        title="Course Suggestions"
                        desc="AI-powered recommendations from Udemy and NPTEL to fill skill gaps."
                        icon="🎓"
                    />
                    <FeatureCard
                        title="Alumni Connect"
                        desc="Connect with successful alumni for mentorship, guidance, and career insights."
                        icon="🤝"
                        className="lg:col-span-2"
                    />
                    <FeatureCard
                        title="Skill Recovery"
                        desc="Structured programs to restore placement eligibility with milestone tracking."
                        icon="📈"
                    />
                    <FeatureCard
                        title="Smart Notifications"
                        desc="Never miss a placement opportunity with intelligent alerts."
                        icon="🔔"
                    />
                </div>
            </section>
            {/* Testimonials Section */}
            <section id="testimonials" className="px-[6%] py-20 bg-white/3 backdrop-blur-[16px]">
                <div className="max-w-[1200px] mx-auto">
                    <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-15 bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                        Success Stories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            text="ElevateConnect transformed my journey. After initial rejections, the personalized course suggestions helped me land my dream job at a top tech company!"
                            author="Priya Sharma"
                            role="Software Engineer at Google"
                        />
                        <TestimonialCard
                            text="The alumni mentorship feature was a game-changer. Real guidance from people who understood my struggles made all the difference."
                            author="Rahul Verma"
                            role="Product Manager at Microsoft"
                        />
                        <TestimonialCard
                            text="From being ineligible to getting multiple offers - ElevateConnect's structured skill recovery program worked wonders for me!"
                            author="Ananya Patel"
                            role="Data Scientist at Amazon"
                        />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="px-[6%] py-20 max-w-[1200px] mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-15">
                    <div className="flex-1">
                        <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent text-left">
                            Personalized Path to Excellence
                        </h2>
                        <p className="text-lg text-white/70 leading-relaxed mb-8">
                            At ElevateConnect, we believe that every setback is a setup for a stronger comeback. Our platform is designed to bridge the gap between academic learning and industry requirements by providing a transparent, data-driven ecosystem for career growth.
                        </p>
                        <div className="space-y-4">
                            {['Data-Driven Insights', 'Exclusive Partner Network', 'Mentorship-First Approach'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-white/90 font-semibold">
                                    <span className="text-[#8b5cf6]">✓</span> {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 w-full aspect-square bg-gradient-to-br from-[#8b5cf6]/20 to-[#3b82f6]/20 rounded-[40px] border border-white/10 flex items-center justify-center text-8xl">
                        🚀
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="px-[6%] py-20 max-w-[800px] mx-auto text-center">
                <h2 className="text-4xl font-extrabold mb-6 bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                    Get in Touch
                </h2>
                <p className="text-white/60 mb-12">
                    Have questions about the platform or want to partner with us? Our team is here to help.
                </p>
                <form className="space-y-6 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Your Name" className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-purple-500/50 transition-all" />
                        <input type="email" placeholder="Email Address" className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-purple-500/50 transition-all" />
                    </div>
                    <textarea placeholder="Your Message" rows={5} className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-purple-500/50 transition-all resize-none"></textarea>
                    <button className="w-full py-4 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-2xl font-bold text-white shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all">
                        Send Message
                    </button>
                </form>
            </section>
        </div>
    );
};

const TestimonialCard = ({ text, author, role }: { text: string, author: string, role: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-10 rounded-[32px] bg-white/5 border border-white/10 relative"
    >
        <div className="text-4xl text-[#8b5cf6] mb-4 opacity-50">"</div>
        <p className="text-white/80 italic mb-8 relative z-10">{text}</p>
        <div className="flex flex-col">
            <span className="font-bold text-white">{author}</span>
            <span className="text-sm text-white/50">{role}</span>
        </div>
    </motion.div>
);

const FeatureCard = ({ title, desc, icon, className = "" }: { title: string, desc: string, icon: string, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-8 rounded-[24px] bg-white/5 backdrop-blur-[16px] border border-white/10 relative overflow-hidden transition-all duration-400 group hover:-translate-y-2 hover:bg-white/10 hover:border-[#8b5cf6]/50 hover:shadow-[0_20px_60px_rgba(139,92,246,0.4)] ${className}`}
    >
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(circle,rgba(139,92,246,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
        <div className="text-5xl mb-4 relative z-10">{icon}</div>
        <h3 className="text-2xl font-bold mb-3 text-white relative z-10">{title}</h3>
        <p className="text-[15px] text-white/60 leading-relaxed relative z-10">{desc}</p>
    </motion.div>
);

export default LandingPage;
