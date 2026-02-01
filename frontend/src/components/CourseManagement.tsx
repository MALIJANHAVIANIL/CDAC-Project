import { useState, useEffect } from 'react';
import { getCourses, createCourse, assignCourse, getStudents, Course, Student } from '../services/tpoService';
import { Plus, Book, GraduationCap, X, Check, AlertTriangle, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CourseManagement = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState<number | null>(null); // courseId or null

    // New Course Form State
    const [newCourse, setNewCourse] = useState({ name: '', code: '', credits: 3, semester: 1 });
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [coursesData, studentsData] = await Promise.all([getCourses(), getStudents()]);
            setCourses(coursesData);
            setStudents(studentsData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCourse(newCourse);
            setShowAddModal(false);
            setNewCourse({ name: '', code: '', credits: 3, semester: 1 });
            loadData();
            showNotification('Course created successfully!', 'success');
        } catch (error) {
            showNotification('Failed to create course. Code might be duplicate.', 'error');
        }
    };

    const handleAssign = async (studentId: number) => {
        if (!showAssignModal) return;
        try {
            await assignCourse(showAssignModal, studentId);
            showNotification('Course assigned successfully!', 'success');
            setShowAssignModal(null);
        } catch (error) {
            showNotification('Failed to assign course', 'error');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Academic Courses</h3>
                    <p className="text-white/40 text-xs mt-1 font-medium">Create and assign training programs to students.</p>
                </div>
                <button
                    className="group flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-2xl font-bold text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus size={18} className="transition-transform group-hover:rotate-90" />
                    <span>New Course</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white/2 backdrop-blur-md border border-white/5 rounded-[32px] p-8 hover:bg-white/[0.05] transition-all group flex flex-col h-full shadow-lg hover:shadow-purple-500/[0.05]">
                        <div className="w-14 h-14 bg-[#8b5cf6]/10 rounded-2xl flex items-center justify-center text-[#8b5cf6] mb-6 group-hover:scale-110 transition-transform">
                            <Book size={28} />
                        </div>
                        <div className="mb-6">
                            <h4 className="text-xl font-bold text-white mb-2 tracking-tight">{course.name}</h4>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black font-mono text-white/40 border border-white/5 uppercase">
                                    {course.code}
                                </span>
                                <span className="px-3 py-1 bg-purple-500/10 rounded-full text-[10px] font-black font-mono text-purple-400/60 border border-purple-500/10 flex items-center gap-1">
                                    <Hash size={10} />
                                    {course.id}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-white/20 tracking-widest mb-1">Credits</span>
                                <span className="text-sm font-bold text-white/60">{course.credits} Units</span>
                            </div>
                            <div className="w-px h-8 bg-white/5 self-end mb-1"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-white/20 tracking-widest mb-1">Semester</span>
                                <span className="text-sm font-bold text-white/60">Term {course.semester}</span>
                            </div>
                        </div>
                        <button
                            className="w-full py-4 bg-white/5 hover:bg-[#8b5cf6] hover:text-white border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#8b5cf6] flex items-center justify-center gap-3 transition-all transform group-hover:translate-y-[-2px]"
                            onClick={() => setShowAssignModal(course.id)}
                        >
                            <GraduationCap size={16} />
                            Assign to students
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Course Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4 text-white">
                    <div className="bg-[#12121a] border border-white/10 rounded-[40px] p-10 w-full max-w-md shadow-[0_0_50px_rgba(139,92,246,0.15)] animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h4 className="text-2xl font-bold text-white tracking-tight">Create Course</h4>
                                <p className="text-white/40 text-sm mt-1">Add a new academic module for students.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCourse} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-white/30 ml-1">Course Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Advanced Java Frameworks"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#8b5cf6]/50 focus:bg-white/10 transition-all font-medium"
                                    value={newCourse.name}
                                    onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-white/30 ml-1">Unique Code</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="CS-401"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#8b5cf6]/50 focus:bg-white/10 transition-all font-medium font-mono"
                                    value={newCourse.code}
                                    onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-white/30 ml-1">Credits</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#8b5cf6]/50 focus:bg-white/10 transition-all font-medium"
                                        value={newCourse.credits}
                                        onChange={e => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-white/30 ml-1">Semester</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#8b5cf6]/50 focus:bg-white/10 transition-all font-medium"
                                        value={newCourse.semester}
                                        onChange={e => setNewCourse({ ...newCourse, semester: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-5 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-2xl font-bold text-white shadow-xl shadow-purple-500/20 mt-4 hover:opacity-90 transition-all transform hover:-translate-y-1"
                            >
                                Register Course
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Student Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4 text-white">
                    <div className="bg-[#12121a] border border-white/10 rounded-[40px] p-10 w-full max-w-lg shadow-[0_0_50px_rgba(139,92,246,0.15)] h-[650px] flex flex-col animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h4 className="text-2xl font-bold text-white tracking-tight">Assign Course</h4>
                                <p className="text-white/40 text-sm mt-1">Select a student from the directory below.</p>
                            </div>
                            <button onClick={() => setShowAssignModal(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="grid gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                            {students.map(student => (
                                <div
                                    key={student.id}
                                    className="flex items-center gap-5 p-5 bg-white/[0.03] border border-white/5 rounded-3xl hover:bg-[#8b5cf6]/10 hover:border-[#8b5cf6]/30 transition-all cursor-pointer group"
                                    onClick={() => handleAssign(student.id)}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#3b82f6] flex items-center justify-center font-bold text-white text-lg shadow-lg">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-white text-lg tracking-tight group-hover:text-[#8b5cf6] transition-colors">{student.name}</div>
                                        <div className="text-xs text-white/20 font-medium">{student.email}</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-[#8b5cf6] group-hover:text-white transition-all transform group-hover:rotate-12">
                                        <Plus size={18} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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
                            {notification.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
                        </div>
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseManagement;
