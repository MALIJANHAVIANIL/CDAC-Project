import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="px-[6%] py-15 border-t border-white/10 bg-[#0a0a0fcc] backdrop-blur-[16px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-[1200px] mx-auto mb-10">
                <div className="footer-section">
                    <h4 className="text-lg mb-4 text-white">Product</h4>
                    <ul className="list-none">
                        <li className="mb-3"><a href="#features" className="text-white/60 no-underline hover:text-[#8b5cf6] transition-colors">Features</a></li>
                        <li className="mb-3"><a href="#pricing" className="text-white/60 no-underline hover:text-[#8b5cf6] transition-colors">Pricing</a></li>
                        <li className="mb-3"><a href="#demo" className="text-white/60 no-underline hover:text-[#8b5cf6] transition-colors">Demo</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4 className="text-lg mb-4 text-white">Company</h4>
                    <ul className="list-none">
                        <li className="mb-3"><a href="#about" className="text-white/60 no-underline hover:text-[#8b5cf6] transition-colors">About Us</a></li>
                        <li className="mb-3"><a href="#careers" className="text-white/60 no-underline hover:text-[#8b5cf6] transition-colors">Careers</a></li>
                        <li className="mb-3"><a href="#contact" className="text-white/60 no-underline hover:text-[#8b5cf6] transition-colors">Contact</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4 className="text-lg mb-4 text-white">Resources</h4>
                    <ul className="list-none">
                        <li className="mb-3"><a href="#blog" className="text-white/60 no-underline hover:text-[#8b5cf6] transition-colors">Blog</a></li>
                        <li className="mb-3"><a href="#docs" className="text-white/60 no-underline hover:text-[#8b5cf6] transition-colors">Documentation</a></li>
                        <li className="mb-3"><a href="#support" className="text-white/60 no-underline hover:text-[#8b5cf6] transition-colors">Support</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4 className="text-lg mb-4 text-white">Legal</h4>
                    <ul className="list-none">
                        <li className="mb-3"><a href="#privacy" className="text-white/60 no-underline hover:text-[#8b5cf6] transition-colors">Privacy Policy</a></li>
                        <li className="mb-3"><a href="#terms" className="text-white/60 no-underline hover:text-[#8b5cf6] transition-colors">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div className="text-center pt-8 border-t border-white/10 text-white/50 text-sm">
                © {new Date().getFullYear()} ElevateConnect. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
