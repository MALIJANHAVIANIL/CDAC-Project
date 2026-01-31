import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
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
}

interface ChatPartner {
    id: number;
    name: string;
    email: string;
    lastMessage: string;
    lastMessageTime: string;
}

const AlumniDashboard: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [recentChats, setRecentChats] = useState<ChatPartner[]>([]);
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        company: '',
        role: '',
        question: '',
        answer: '',
        difficulty: 'Medium',
        category: 'Technical'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const questionsRes = await fetchWithAuth('/questions/my');
            const questionsData = await questionsRes.json();
            setQuestions(questionsData);

            const chatsRes = await fetchWithAuth('/chat/recent');
            const chatsData = await chatsRes.json();
            setRecentChats(chatsData);
        } catch (err) {
            console.error('Error fetching alumni data', err);
        }
    };

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchWithAuth('/questions', {
                method: 'POST',
                body: JSON.stringify(newQuestion)
            });
            setShowAddQuestion(false);
            setNewQuestion({ company: '', role: '', question: '', answer: '', difficulty: 'Medium', category: 'Technical' });
            fetchData();
        } catch (err) {
            console.error('Error adding question', err);
        }
    };

    const handleDeleteQuestion = async (id: number) => {
        try {
            await fetchWithAuth(`/questions/${id}`, { method: 'DELETE' });
            setQuestions(q => q.filter(question => question.id !== id));
        } catch (err) {
            console.error('Error deleting question', err);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />
            <main className="flex-1 ml-20 flex flex-col">
                {/* Header */}
                <header className="h-20 bg-white/5 backdrop-blur-[20px] border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-[90]">
                    <div>
                        <h1 className="text-xl font-bold">Alumni Dashboard</h1>
                        <p className="text-sm text-white/50">Help students with guidance & mentorship</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowAddQuestion(true)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                        >
                            + Add Question
                        </button>
                        <button
                            onClick={() => navigate('/chat')}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl font-semibold text-sm hover:bg-white/20 transition-all"
                        >
                            💬 Messages
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] rounded-xl flex items-center justify-center font-bold uppercase">
                            {user?.name?.substring(0, 2) || 'AL'}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard icon="📝" label="Questions Contributed" value={questions.length} />
                        <StatCard icon="👥" label="Students Helped" value={recentChats.length} />
                        <StatCard icon="⭐" label="Total Helpful Votes" value={questions.reduce((acc, q) => acc + q.helpfulCount, 0)} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* My Questions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2 bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-6"
                        >
                            <h2 className="text-lg font-bold mb-4">My Interview Questions</h2>
                            {questions.length === 0 ? (
                                <div className="text-center py-8 text-white/50">
                                    <p className="text-4xl mb-2">📝</p>
                                    <p>No questions added yet. Help students prepare!</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                                    {questions.map((q) => (
                                        <div key={q.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex gap-2">
                                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{q.company}</span>
                                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">{q.role}</span>
                                                    <span className={`px-2 py-1 rounded text-xs ${q.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                        q.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-red-500/20 text-red-400'
                                                        }`}>{q.difficulty}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteQuestion(q.id)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                            <p className="font-semibold mb-2">{q.question}</p>
                                            {q.answer && <p className="text-sm text-white/60">{q.answer}</p>}
                                            <div className="mt-2 text-xs text-white/40">👍 {q.helpfulCount} found helpful</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Recent Chats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-6"
                        >
                            <h2 className="text-lg font-bold mb-4">Recent Conversations</h2>
                            {recentChats.length === 0 ? (
                                <div className="text-center py-8 text-white/50">
                                    <p className="text-4xl mb-2">💬</p>
                                    <p>No messages yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentChats.map((chat) => (
                                        <div
                                            key={chat.id}
                                            onClick={() => navigate(`/chat?partner=${chat.id}`)}
                                            className="p-3 bg-white/5 rounded-xl hover:bg-white/10 cursor-pointer transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center font-bold">
                                                    {chat.name?.substring(0, 2)?.toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-sm">{chat.name}</div>
                                                    <div className="text-xs text-white/50 truncate">{chat.lastMessage}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Add Question Modal */}
                {showAddQuestion && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#1a1a24] border border-white/10 rounded-[24px] p-6 w-full max-w-lg"
                        >
                            <h2 className="text-xl font-bold mb-4">Add Interview Question</h2>
                            <form onSubmit={handleAddQuestion} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Company (e.g., Google)"
                                        value={newQuestion.company}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, company: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Role (e.g., SDE)"
                                        value={newQuestion.role}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, role: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500"
                                        required
                                    />
                                </div>
                                <textarea
                                    placeholder="Question..."
                                    value={newQuestion.question}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500 min-h-[80px]"
                                    required
                                />
                                <textarea
                                    placeholder="Answer (optional)..."
                                    value={newQuestion.answer}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500 min-h-[60px]"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={newQuestion.difficulty}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500 text-white"
                                    >
                                        <option value="Easy" className="bg-[#1a1a24]">Easy</option>
                                        <option value="Medium" className="bg-[#1a1a24]">Medium</option>
                                        <option value="Hard" className="bg-[#1a1a24]">Hard</option>
                                    </select>
                                    <select
                                        value={newQuestion.category}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500 text-white"
                                    >
                                        <option value="Technical" className="bg-[#1a1a24]">Technical</option>
                                        <option value="DSA" className="bg-[#1a1a24]">DSA</option>
                                        <option value="System Design" className="bg-[#1a1a24]">System Design</option>
                                        <option value="HR" className="bg-[#1a1a24]">HR</option>
                                        <option value="Behavioral" className="bg-[#1a1a24]">Behavioral</option>
                                    </select>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddQuestion(false)}
                                        className="flex-1 py-3 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        Add Question
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
                }
            </main >
        </div >
    );
};

const StatCard = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[20px] p-6 hover:border-purple-500/30 transition-all"
    >
        <div className="text-3xl mb-3">{icon}</div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-white/50">{label}</div>
    </motion.div>
);

export default AlumniDashboard;
