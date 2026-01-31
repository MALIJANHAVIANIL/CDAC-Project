import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/layout/Sidebar';
import { fetchWithAuth } from '../services/api';

interface ChatPartner {
    id: number;
    name: string;
    email: string;
    role: string;
    lastMessage?: string;
}

interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    message: string;
    createdAt: string;
    sender: { id: number; name: string };
    receiver: { id: number; name: string };
}

const ChatPage: React.FC = () => {
    const { user } = useUser();
    const [searchParams] = useSearchParams();
    const [partners, setPartners] = useState<ChatPartner[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPartners();
    }, []);

    useEffect(() => {
        const partnerId = searchParams.get('partner');
        if (partnerId && partners.length > 0) {
            const partner = partners.find(p => p.id === parseInt(partnerId));
            if (partner) selectPartner(partner);
        }
    }, [searchParams, partners]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Polling for new messages
    useEffect(() => {
        if (!selectedPartner) return;

        const interval = setInterval(() => {
            fetchMessages(selectedPartner.id, true);
        }, 5000);

        return () => clearInterval(interval);
    }, [selectedPartner]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchPartners = async () => {
        try {
            // If student, show alumni list. If alumni, show recent chats
            const endpoint = user?.role === 'STUDENT' ? '/chat/alumni' : '/chat/recent';
            const res = await fetchWithAuth(endpoint);
            const data = await res.json();
            setPartners(data);
        } catch (err) {
            console.error('Error fetching chat partners', err);
        }
    };

    const selectPartner = async (partner: ChatPartner) => {
        setSelectedPartner(partner);
        await fetchMessages(partner.id);
    };

    const fetchMessages = async (partnerId: number, silent = false) => {
        try {
            if (!silent) setLoading(true);
            const res = await fetchWithAuth(`/chat/conversation/${partnerId}`);
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error('Error fetching messages', err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedPartner) return;

        try {
            await fetchWithAuth('/chat/send', {
                method: 'POST',
                body: JSON.stringify({
                    receiverId: selectedPartner.id,
                    message: newMessage
                })
            });
            setNewMessage('');
            fetchMessages(selectedPartner.id, true);
        } catch (err) {
            console.error('Error sending message', err);
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0f] text-white">
            <Sidebar />
            <main className="flex-1 ml-20 flex flex-col h-screen">
                <div className="flex flex-1 overflow-hidden">
                    {/* Partners List */}
                    <div className="w-80 bg-white/5 border-r border-white/10 flex flex-col">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-lg font-bold">
                                {user?.role === 'STUDENT' ? 'Connect with Alumni' : 'Student Messages'}
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {partners.length === 0 ? (
                                <div className="p-4 text-center text-white/50">
                                    <p className="text-4xl mb-2">👥</p>
                                    <p className="text-sm">No contacts available</p>
                                </div>
                            ) : (
                                partners.map((partner) => (
                                    <div
                                        key={partner.id}
                                        onClick={() => selectPartner(partner)}
                                        className={`p-4 cursor-pointer transition-all border-b border-white/5 ${selectedPartner?.id === partner.id
                                            ? 'bg-purple-500/20'
                                            : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center font-bold">
                                                {partner.name?.substring(0, 2)?.toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold">{partner.name}</div>
                                                <div className="text-xs text-white/50">
                                                    {partner.role === 'ALUMNI' ? '🎓 Alumni' : partner.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col">
                        {!selectedPartner ? (
                            <div className="flex-1 flex items-center justify-center text-white/50">
                                <div className="text-center">
                                    <p className="text-6xl mb-4">💬</p>
                                    <p className="text-xl">Select a contact to start chatting</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div className="h-16 bg-white/5 border-b border-white/10 flex items-center px-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center font-bold mr-3">
                                        {selectedPartner.name?.substring(0, 2)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{selectedPartner.name}</div>
                                        <div className="text-xs text-white/50">{selectedPartner.email}</div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {loading ? (
                                        <div className="text-center text-white/50">Loading messages...</div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center text-white/50 py-12">
                                            <p className="text-4xl mb-2">👋</p>
                                            <p>Start the conversation!</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            const isMe = msg.sender.id === parseInt(user?.id || '0');
                                            return (
                                                <motion.div
                                                    key={msg.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] p-4 rounded-2xl ${isMe
                                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 rounded-br-sm'
                                                            : 'bg-white/10 rounded-bl-sm'
                                                            }`}
                                                    >
                                                        <p className="text-sm">{msg.message}</p>
                                                        <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-white/40'}`}>
                                                            {formatTime(msg.createdAt)}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={sendMessage} className="p-4 bg-white/5 border-t border-white/10">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-purple-500 transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;
