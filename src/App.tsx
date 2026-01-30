import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BackgroundGradient from './components/common/BackgroundGradient';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DriveManagement from './pages/DriveManagement';
import PlacementDrives from './pages/PlacementDrives';
import Applications from './pages/Applications';
import RejectionAnalysis from './pages/RejectionAnalysis';
import { useLocation } from 'react-router-dom';
import Auth from './pages/Auth';

const ScrollToHash = () => {
    const { hash, pathname } = useLocation();

    React.useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash, pathname]);

    return null;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#0a0a0f] selection:bg-purple-500/30">
                <ScrollToHash />
                <BackgroundGradient />
                <Routes>
                    <Route path="/" element={
                        <>
                            <Navbar />
                            <main>
                                <LandingPage />
                            </main>
                            <Footer />
                        </>
                    } />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/drives" element={<PlacementDrives />} />
                    <Route path="/admin/drives" element={<DriveManagement />} />
                    <Route path="/applications" element={<Applications />} />
                    <Route path="/analysis" element={<RejectionAnalysis />} />
                    <Route path="/auth" element={<Auth />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
