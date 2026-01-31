import React from 'react';
import { Github, Linkedin, Twitter, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="relative bg-[#0a0a0f] border-t border-white/10">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-black/50 pointer-events-none" />

            <div className="relative px-[6%] py-16 max-w-[1400px] mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
                    {/* Brand Section - Wider */}
                    <div className="lg:col-span-4">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
                                ElevateConnect
                            </h3>
                            <p className="text-white/60 leading-relaxed text-sm">
                                Empowering students through intelligent placement automation, personalized feedback, and career growth pathways.
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-white/50 text-sm hover:text-white/80 transition-colors">
                                <Mail size={16} className="text-purple-400" />
                                <span>support@elevateconnect.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/50 text-sm hover:text-white/80 transition-colors">
                                <Phone size={16} className="text-purple-400" />
                                <span>+91 (123) 456-7890</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/50 text-sm hover:text-white/80 transition-colors">
                                <MapPin size={16} className="text-purple-400" />
                                <span>Mumbai, India</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {[
                                { Icon: Twitter, href: '#', label: 'Twitter' },
                                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                                { Icon: Github, href: '#', label: 'Github' },
                                { Icon: Mail, href: '#', label: 'Email' }
                            ].map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="p-2.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 rounded-xl transition-all group"
                                >
                                    <Icon size={18} className="text-white/60 group-hover:text-purple-400 transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Product</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Features', href: '#features' },
                                { label: 'Job Drives', href: '/dashboard' },
                                { label: 'Analytics', href: '#' },
                                { label: 'Integrations', href: '#' }
                            ].map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-white/60 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <ArrowRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'About Us', href: '#about' },
                                { label: 'Careers', href: '#' },
                                { label: 'Blog', href: '#' },
                                { label: 'Contact', href: '#contact' }
                            ].map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-white/60 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <ArrowRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Documentation', href: '#' },
                                { label: 'Help Center', href: '#' },
                                { label: 'API Reference', href: '#' },
                                { label: 'Community', href: '#' }
                            ].map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-white/60 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <ArrowRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Privacy Policy', href: '#privacy' },
                                { label: 'Terms of Service', href: '#terms' },
                                { label: 'Cookie Policy', href: '#' },
                                { label: 'License', href: '#' }
                            ].map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-white/60 hover:text-purple-400 transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <ArrowRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
                    <p className="text-white/40 text-sm">
                        © {new Date().getFullYear()} <span className="text-purple-400 font-semibold">ElevateConnect</span>. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-white/40">
                        <a href="#" className="hover:text-purple-400 transition-colors">Sitemap</a>
                        <span>•</span>
                        <a href="#" className="hover:text-purple-400 transition-colors">Accessibility</a>
                        <span>•</span>
                        <a href="#" className="hover:text-purple-400 transition-colors">Status</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
