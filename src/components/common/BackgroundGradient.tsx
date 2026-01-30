import React from 'react';

const BackgroundGradient: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#0a0a0f] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_20%_30%,rgba(88,28,135,0.3)_0%,transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(29,78,216,0.3)_0%,transparent_50%),radial-gradient(ellipse_at_50%_50%,rgba(16,185,129,0.2)_0%,transparent_50%)]"></div>
            <div className="blob absolute rounded-full blur-[80px] opacity-60 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.4),transparent)] top-[10%] left-[10%] animate-pulse"></div>
            <div className="blob absolute rounded-full blur-[80px] opacity-60 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.4),transparent)] bottom-[20%] right-[10%] animate-pulse delay-700"></div>
            <div className="blob absolute rounded-full blur-[80px] opacity-60 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(16,185,129,0.3),transparent)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000"></div>
        </div>
    );
};

export default BackgroundGradient;
