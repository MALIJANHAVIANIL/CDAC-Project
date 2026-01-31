import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import { fetchWithAuth } from '../services/api';

interface Question {
    id: number;
    company: string;
    role: string;
    question: string;
    answer: string;
    difficulty: string;
    category: string;
    helpfulCount: number;
    alumni: { name: string; email: string };
}

const InterviewQuestions: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [companies, setCompanies] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        company: '',
        difficulty: '',
        category: ''
    });
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

    useEffect(() => {
        fetchQuestions();
        fetchCompanies();
    }, [filters]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.company) params.append('company', filters.company);
            if (filters.difficulty) params.append('difficulty', filters.difficulty);
            if (filters.category) params.append('category', filters.category);

            const res = await fetchWithAuth(`/questions?${params}`);
            const data = await res.json();
            setQuestions(data);
        } catch (err) {
            console.error('Error fetching questions', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        try {
            const res = await fetchWithAuth('/questions/companies');
            const data = await res.json();
            setCompanies(data);
        } catch (err) {
            console.error('Error fetching companies', err);
        }
    };

    const handleMarkHelpful = async (id: number) => {
        try {
            await fetchWithAuth(`/questions/${id}/helpful`, { method: 'POST' });
            setQuestions(qs =>
                qs.map(q => q.id === id ? { ...q, helpfulCount: q.helpfulCount + 1 } : q)
            );
        } catch (err) {
            console.error('Error marking helpful', err);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />
            <main className="flex-1 ml-20 flex flex-col">
                {/* Header */}
                <header className="h-20 bg-white/5 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-[90]">
                    <div>
                        <h1 className="text-xl font-bold">Interview Questions Bank</h1>
                        <p className="text-sm text-white/50">Prepare with real questions from alumni</p>
                    </div>
                </header>

                <div className="p-8">
                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[20px] p-6 mb-8"
                    >
                        <h2 className="text-sm font-bold text-white/70 mb-4">FILTER QUESTIONS</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select
                                value={filters.company}
                                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                                className="p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500 text-white"
                            >
                                <option value="" className="bg-[#1a1a24]">All Companies</option>
                                {companies.map(c => (
                                    <option key={c} value={c} className="bg-[#1a1a24]">{c}</option>
                                ))}
                            </select>
                            <select
                                value={filters.difficulty}
                                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                                className="p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500 text-white"
                            >
                                <option value="" className="bg-[#1a1a24]">All Difficulties</option>
                                <option value="Easy" className="bg-[#1a1a24]">Easy</option>
                                <option value="Medium" className="bg-[#1a1a24]">Medium</option>
                                <option value="Hard" className="bg-[#1a1a24]">Hard</option>
                            </select>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500 text-white"
                            >
                                <option value="" className="bg-[#1a1a24]">All Categories</option>
                                <option value="Technical" className="bg-[#1a1a24]">Technical</option>
                                <option value="DSA" className="bg-[#1a1a24]">DSA</option>
                                <option value="System Design" className="bg-[#1a1a24]">System Design</option>
                                <option value="HR" className="bg-[#1a1a24]">HR</option>
                                <option value="Behavioral" className="bg-[#1a1a24]">Behavioral</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <div className="flex gap-4 mb-6">
                        <div className="px-4 py-2 bg-purple-500/20 rounded-xl text-sm">
                            <span className="font-bold">{questions.length}</span> Questions
                        </div>
                        <div className="px-4 py-2 bg-blue-500/20 rounded-xl text-sm">
                            <span className="font-bold">{companies.length}</span> Companies
                        </div>
                    </div>

                    {/* Questions */}
                    {loading ? (
                        <div className="text-center py-12 text-white/50">Loading questions...</div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-12 text-white/50">
                            <p className="text-5xl mb-4">📝</p>
                            <p className="text-lg">No questions found</p>
                            <p className="text-sm mt-2">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {questions.map((q, idx) => (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[20px] p-6 hover:border-purple-500/30 transition-all"
                                >
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-semibold">
                                            {q.company}
                                        </span>
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold">
                                            {q.role}
                                        </span>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${q.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                            q.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                            {q.difficulty}
                                        </span>
                                        {q.category && (
                                            <span className="px-3 py-1 bg-white/10 text-white/70 rounded-lg text-xs">
                                                {q.category}
                                            </span>
                                        )}
                                    </div>

                                    {/* Question */}
                                    <h3 className="text-lg font-semibold mb-3">{q.question}</h3>

                                    {/* Answer (expandable) */}
                                    {q.answer && (
                                        <div>
                                            <button
                                                onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                                                className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 mb-2"
                                            >
                                                {expandedQuestion === q.id ? '▼ Hide Answer' : '▶ Show Answer'}
                                            </button>
                                            {expandedQuestion === q.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="bg-white/5 rounded-xl p-4 text-sm text-white/80"
                                                >
                                                    {q.answer}
                                                </motion.div>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                                        <div className="text-sm text-white/50">
                                            Shared by <span className="text-white/70">{q.alumni?.name || 'Alumni'}</span>
                                        </div>
                                        <button
                                            onClick={() => handleMarkHelpful(q.id)}
                                            className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
                                        >
                                            👍 <span className="text-white/70">{q.helpfulCount}</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default InterviewQuestions;
