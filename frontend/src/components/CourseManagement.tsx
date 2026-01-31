import React, { useState, useEffect } from 'react';
import { getCourses, createCourse, assignCourse, getStudents, Course, Student } from '../services/tpoService';
import { Plus, Book, GraduationCap, X } from 'lucide-react';

const CourseManagement = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState<number | null>(null); // courseId or null

    // New Course Form State
    const [newCourse, setNewCourse] = useState({ name: '', code: '', credits: 3, semester: 1 });

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
            loadData(); // Refresh list
        } catch (error) {
            alert('Failed to create course. Code might be duplicate.');
        }
    };

    const handleAssign = async (studentId: number) => {
        if (!showAssignModal) return;
        try {
            await assignCourse(showAssignModal, studentId);
            alert('Course assigned successfully!');
            setShowAssignModal(null);
        } catch (error) {
            alert('Failed to assign course');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Course Management</h3>
                <button
                    className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-xl font-bold text-white flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus size={16} /> Add New Course
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-[#8b5cf6] mb-4 group-hover:scale-110 transition-transform">
                            <Book size={24} />
                        </div>
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-white mb-1">{course.name}</h4>
                            <p className="text-xs text-white/50 tracking-wider font-mono">{course.code}</p>
                        </div>
                        <div className="flex gap-3 mb-6">
                            <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-semibold text-white/70">{course.credits} Credits</span>
                            <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-semibold text-white/70">Sem {course.semester}</span>
                        </div>
                        <button
                            className="w-full py-3 bg-white/5 hover:bg-[#8b5cf6] hover:text-white border border-white/10 rounded-xl text-sm font-bold text-white/70 flex items-center justify-center gap-2 transition-all"
                            onClick={() => setShowAssignModal(course.id)}
                        >
                            <GraduationCap size={16} /> Assign
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Course Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a24] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-white">Add New Course</h4>
                            <button onClick={() => setShowAddModal(false)} className="text-white/50 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCourse} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-white/40 mb-2">Course Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6]"
                                    value={newCourse.name}
                                    onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-white/40 mb-2">Course Code</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6]"
                                    value={newCourse.code}
                                    onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-white/40 mb-2">Credits</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6]"
                                        value={newCourse.credits}
                                        onChange={e => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-white/40 mb-2">Semester</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6]"
                                        value={newCourse.semester}
                                        onChange={e => setNewCourse({ ...newCourse, semester: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-xl font-bold text-white shadow-lg shadow-purple-500/30 mt-4 hover:opacity-90 transition-opacity"
                            >
                                Create Course
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Student Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a24] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-white">Assign Course to Student</h4>
                            <button onClick={() => setShowAssignModal(null)} className="text-white/50 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="grid gap-2 overflow-y-auto pr-2 custom-scrollbar">
                            {students.map(student => (
                                <div
                                    key={student.id}
                                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                                    onClick={() => handleAssign(student.id)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-bold text-white text-sm">
                                        {student.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-white">{student.name}</div>
                                        <div className="text-sm text-white/50">{student.email}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:bg-[#8b5cf6] group-hover:text-white transition-colors">
                                        <Plus size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;
