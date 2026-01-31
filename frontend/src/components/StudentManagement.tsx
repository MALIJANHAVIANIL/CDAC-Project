import React, { useState, useEffect } from 'react';
import { getStudents, banStudent, activateStudent, Student } from '../services/tpoService';
import { Search, UserX, UserCheck, Mail, Phone, BookOpen, AlertCircle } from 'lucide-react';

const StudentManagement = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleBan = async (id: number) => {
        if (confirm('Are you sure you want to BAN this student? They will lose access immediately.')) {
            try {
                await banStudent(id);
                loadStudents();
            } catch (error) {
                alert('Failed to ban student');
            }
        }
    };

    const handleActivate = async (id: number) => {
        if (confirm('Re-activate this student account?')) {
            try {
                await activateStudent(id);
                loadStudents();
            } catch (error) {
                alert('Failed to activate student');
            }
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading students...</div>;

    return (

        <div className="space-y-6">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 w-full max-w-md focus-within:border-[#8b5cf6] focus-within:bg-white/10 transition-all">
                <Search size={20} className="text-white/50 mr-3" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="bg-transparent border-none outline-none text-white w-full placeholder-white/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-white/50 uppercase tracking-wider">
                            <th className="p-4">Student</th>
                            <th className="p-4">Info</th>
                            <th className="p-4">Academics</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredStudents.map(student => (
                            <tr key={student.id} className={`hover:bg-white/5 transition-colors ${student.accountStatus === 'BANNED' ? 'bg-red-500/5' : ''}`}>
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="api-avatar w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{student.name}</div>
                                            <div className="text-sm text-white/50">{student.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-white/70">
                                    <div className="flex flex-col gap-1 text-sm text-white/70">
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-white/30" /> {student.phone || 'N/A'}
                                        </div>
                                        {student.resumeUrl && (
                                            <a
                                                href={student.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[#8b5cf6] hover:text-[#7c3aed] text-xs font-bold mt-1"
                                            >
                                                <BookOpen size={14} /> View Resume
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-white/60 border border-white/10">{student.branch || 'N/A'}</span>
                                        <span className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-white/60 border border-white/10">CGPA: {student.cgpa || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${student.accountStatus === 'ACTIVE'
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}>
                                        {student.accountStatus === 'BANNED' && <AlertCircle size={10} />}
                                        {student.accountStatus}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {student.accountStatus === 'ACTIVE' ? (
                                        <button
                                            onClick={() => handleBan(student.id)}
                                            className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                                        >
                                            <UserX size={12} /> Ban
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleActivate(student.id)}
                                            className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1"
                                        >
                                            <UserCheck size={12} /> Activate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredStudents.length === 0 && (
                    <div className="p-8 text-center text-white/30">
                        No students found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentManagement;
