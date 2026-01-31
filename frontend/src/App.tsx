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
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Profile from './pages/Profile';
import DriveDetails from './pages/DriveDetails';
import Analytics from './pages/Analytics';
import TPODashboard from './pages/TPODashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import HrDashboard from './pages/HrDashboard';
import ChatPage from './pages/ChatPage';
import InterviewQuestions from './pages/InterviewQuestions';

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
        <UserProvider>
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
                        <Route path="/auth" element={<Auth />} />

                        {/* Protected Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                        <Route path="/placements" element={
                            <ProtectedRoute role="STUDENT">
                                <PlacementDrives />
                            </ProtectedRoute>
                        } />
                        <Route path="/drives/:id" element={
                            <ProtectedRoute role="STUDENT">
                                <DriveDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="/applications" element={
                            <ProtectedRoute role="STUDENT">
                                <Applications />
                            </ProtectedRoute>
                        } />
                        <Route path="/analysis" element={
                            <ProtectedRoute role="STUDENT">
                                <RejectionAnalysis />
                            </ProtectedRoute>
                        } />
                        <Route path="/analytics" element={
                            <ProtectedRoute>
                                <Analytics />
                            </ProtectedRoute>
                        } />

                        {/* Admin Routes - Accessible to ADMIN and TPO */}
                        <Route path="/admin/drives" element={
                            <ProtectedRoute>
                                <DriveManagement />
                            </ProtectedRoute>
                        } />

                        {/* TPO Routes */}
                        <Route path="/tpo" element={
                            <ProtectedRoute role="TPO">
                                <TPODashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/tpo/dashboard" element={
                            <ProtectedRoute role="TPO">
                                <TPODashboard />
                            </ProtectedRoute>
                        } />

                        {/* Alumni Routes */}
                        <Route path="/alumni" element={
                            <ProtectedRoute role="ALUMNI">
                                <AlumniDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/alumni/dashboard" element={
                            <ProtectedRoute role="ALUMNI">
                                <AlumniDashboard />
                            </ProtectedRoute>
                        } />

                        {/* HR Routes */}
                        <Route path="/hr" element={
                            <ProtectedRoute role="HR">
                                <HrDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/hr/dashboard" element={
                            <ProtectedRoute role="HR">
                                <HrDashboard />
                            </ProtectedRoute>
                        } />

                        {/* Chat - accessible to Students and Alumni */}
                        <Route path="/chat" element={
                            <ProtectedRoute>
                                <ChatPage />
                            </ProtectedRoute>
                        } />

                        {/* Interview Questions - accessible to Students */}
                        <Route path="/questions" element={
                            <ProtectedRoute>
                                <InterviewQuestions />
                            </ProtectedRoute>
                        } />
                        <Route path="/interview-questions" element={
                            <ProtectedRoute>
                                <InterviewQuestions />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </UserProvider >
    );
}

export default App;
