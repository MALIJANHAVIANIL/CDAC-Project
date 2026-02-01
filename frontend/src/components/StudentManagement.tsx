import { useState, useEffect } from 'react';
import { getStudents, banStudent, activateStudent, Student } from '../services/tpoService';
import { Search, UserX, UserCheck, Mail, Phone, BookOpen, AlertCircle, AlertTriangle, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentManagement = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Custom Modal State
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        studentId: null as number | null,
        name: '',
        type: 'ban' as 'ban' | 'activate'
    });
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBanClick = (student: Student) => {
        setConfirmModal({
            show: true,
            studentId: student.id,
            name: student.name,
            type: 'ban'
        });
    };

    const handleActivateClick = (student: Student) => {
        setConfirmModal({
            show: true,
            studentId: student.id,
            name: student.name,
            type: 'activate'
        });
    };

    const executeAction = async () => {
        if (!confirmModal.studentId) return;

        try {
            if (confirmModal.type === 'ban') {
                await banStudent(confirmModal.studentId);
            } else {
                await activateStudent(confirmModal.studentId);
            }
            loadStudents();
            setConfirmModal({ ...confirmModal, show: false });
            showNotification(`Student ${confirmModal.type === 'ban' ? 'banned' : 'activated'} successfully`, 'success');
        } catch (error) {
            console.error('Action failed', error);
            showNotification('Action failed. Please try again.', 'error');
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading students...</div>;

    return (

        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-wrap items-center gap-5">
                <div className="flex-1 min-w-[300px] relative group">
                    <input
                        type="text"
                        placeholder="Search students by name or email..."
                        className="w-full py-4 px-6 pl-14 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#8b5cf6]/50 focus:bg-white/10 transition-all font-medium text-white placeholder-white/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#8b5cf6] transition-colors" size={20} />
                </div>
            </div>

            <div className="bg-white/2 backdrop-blur-xl border border-white/5 rounded-[32px] p-2 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5">UID</th>
                                <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5">Student</th>
                                <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5">Contact Info</th>
                                <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5">Academics</th>
                                <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5 text-center">Status</th>
                                <th className="py-6 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredStudents.map(student => (
                                <tr key={student.id} className={`group hover:bg-white/[0.03] transition-colors ${student.accountStatus === 'BANNED' ? 'bg-red-500/[0.02]' : ''}`}>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-2 text-white/20 font-mono text-xs font-bold">
                                            <Hash size={12} />
                                            {student.id}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-lg tracking-tight">{student.name}</div>
                                                <div className="text-xs text-white/40 flex items-center gap-1.5 mt-1">
                                                    <Mail size={10} />
                                                    {student.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-sm font-medium text-white/60">
                                                <Phone size={14} className="text-white/20" />
                                                {student.phone || 'N/A'}
                                            </div>
                                            {student.resumeUrl && (
                                                <a
                                                    href={student.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-[#8b5cf6] hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                                                >
                                                    <BookOpen size={12} /> View Resume
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-white/5 rounded-full text-[11px] font-bold text-white/60 border border-white/5">
                                                {student.branch || 'N/A'}
                                            </span>
                                            <span className="px-3 py-1 bg-[#8b5cf6]/10 rounded-full text-[11px] font-black text-[#8b5cf6] border border-[#8b5cf6]/20">
                                                GPA: {student.cgpa || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${student.accountStatus === 'ACTIVE'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {student.accountStatus === 'BANNED' && <AlertCircle size={10} />}
                                            {student.accountStatus}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        {student.accountStatus === 'ACTIVE' ? (
                                            <button
                                                onClick={() => handleBanClick(student)}
                                                className="w-10 h-10 rounded-xl bg-red-500/5 flex items-center justify-center text-red-400/50 hover:text-white hover:bg-red-500 border border-red-500/10 transition-all group/btn"
                                                title="Ban Student"
                                            >
                                                <UserX size={18} className="transition-transform group-hover/btn:scale-110" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleActivateClick(student)}
                                                className="w-10 h-10 rounded-xl bg-green-500/5 flex items-center justify-center text-green-400/50 hover:text-white hover:bg-green-500 border border-green-500/10 transition-all group/btn"
                                                title="Activate Student"
                                            >
                                                <UserCheck size={18} className="transition-transform group-hover/btn:scale-110" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredStudents.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center justify-center bg-white/[0.01]">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-4">
                            <Search size={32} />
                        </div>
                        <p className="text-white/40 font-medium italic">No students found matching your search criteria.</p>
                    </div>
                )}
            </div>

            {/* Custom Confirmation Modal */}
            <AnimatePresence>
                {confirmModal.show && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4 text-white">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#12121a] border border-white/10 rounded-[40px] p-10 w-full max-w-sm shadow-[0_0_50px_rgba(139,92,246,0.1)] text-center"
                        >
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border ${confirmModal.type === 'ban'
                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                : 'bg-green-500/10 text-green-500 border-green-500/20'
                                }`}>
                                {confirmModal.type === 'ban' ? <AlertTriangle size={40} /> : <UserCheck size={40} />}
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">
                                {confirmModal.type === 'ban' ? 'Ban Student?' : 'Activate Student?'}
                            </h3>
                            <p className="text-white/40 mb-8 text-sm font-medium leading-relaxed">
                                {confirmModal.type === 'ban'
                                    ? `Are you sure you want to ban ${confirmModal.name}? They will lose all access immediately.`
                                    : `Do you want to re-activate the account for ${confirmModal.name}?`
                                }
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                                    className="flex-1 py-4 bg-white/5 rounded-2xl font-bold hover:bg-white/10 border border-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={executeAction}
                                    className={`flex-1 py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-1 shadow-lg ${confirmModal.type === 'ban'
                                        ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-red-500/20'
                                        : 'bg-gradient-to-r from-green-500 to-blue-600 hover:shadow-green-500/20'
                                        }`}
                                >
                                    {confirmModal.type === 'ban' ? 'Confirm Ban' : 'Activate'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notifications */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 font-bold backdrop-blur-xl ${notification.type === 'success'
                            ? 'bg-green-500/10 border-green-500/20 text-green-400 shadow-green-500/10'
                            : 'bg-red-500/10 border-red-500/20 text-red-400 shadow-red-500/10'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${notification.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            {notification.type === 'success' ? <UserCheck size={18} /> : <AlertTriangle size={18} />}
                        </div>
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentManagement;
