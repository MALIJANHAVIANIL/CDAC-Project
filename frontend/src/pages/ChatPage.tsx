import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/layout/Sidebar';
import { fetchWithAuth } from '../services/api';
import { Paperclip, X, Image as ImageIcon, Send } from 'lucide-react';

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
    mediaUrl?: string;
    mediaType?: string;
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

    // New Feature States
    const [unreadCounts, setUnreadCounts] = useState<{ [key: number]: number }>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchPartners();
        fetchUnreadCounts();

        // Poll for unread counts every 10s
        const interval = setInterval(fetchUnreadCounts, 10000);
        return () => clearInterval(interval);
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

    // Polling for new messages in active chat
    useEffect(() => {
        if (!selectedPartner) return;

        const interval = setInterval(() => {
            fetchMessages(selectedPartner.id, true);
        }, 3000); // Faster polling for active chat

        return () => clearInterval(interval);
    }, [selectedPartner]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchPartners = async () => {
        try {
            const endpoint = user?.role === 'STUDENT' ? '/chat/alumni' : '/chat/recent';
            const res = await fetchWithAuth(endpoint);
            const data = await res.json();
            setPartners(data);
        } catch (err) {
            console.error('Error fetching chat partners', err);
        }
    };

    const fetchUnreadCounts = async () => {
        try {
            const res = await fetchWithAuth('/chat/unread');
            const data = await res.json();
            setUnreadCounts(data);
        } catch (err) {
            console.error('Error fetching unread counts', err);
        }
    };

    const selectPartner = async (partner: ChatPartner) => {
        setSelectedPartner(partner);
        // Clear unread count for this partner locally immediately for better UI
        setUnreadCounts(prev => ({ ...prev, [partner.id]: 0 }));
        await fetchMessages(partner.id);
    };

    const fetchMessages = async (partnerId: number, silent = false) => {
        try {
            if (!silent) setLoading(true);
            const res = await fetchWithAuth(`/chat/conversation/${partnerId}`);
            const data = await res.json();
            setMessages(data);
            if (silent) {
                // If silent update (polling), and we are viewing this partner, logic suggests msg is read.
                // Backend marks read on 'getConversation', so next poll of UnreadCount will reflect 0.
            }
        } catch (err) {
            console.error('Error fetching messages', err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || !selectedPartner) return;

        try {
            let uploadedUrl = null;
            let uploadedType = null;

            if (selectedFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', selectedFile);

                const uploadRes = await fetchWithAuth('/chat/upload', {
                    method: 'POST',
                    body: formData
                });
                const uploadData = await uploadRes.json();
                uploadedUrl = uploadData.url;
                uploadedType = selectedFile.type;
                setUploading(false);
                setSelectedFile(null); // Clear file after upload
            }

            await fetchWithAuth('/chat/send', {
                method: 'POST',
                body: JSON.stringify({
                    receiverId: selectedPartner.id,
                    message: newMessage,
                    mediaUrl: uploadedUrl,
                    mediaType: uploadedType
                })
            });
            setNewMessage('');
            fetchMessages(selectedPartner.id, true);
        } catch (err) {
            console.error('Error sending message', err);
            setUploading(false);
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
                                        className={`p-4 cursor-pointer transition-all border-b border-white/5 relative ${selectedPartner?.id === partner.id
                                            ? 'bg-purple-500/20'
                                            : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center font-bold text-lg">
                                                {partner.name?.substring(0, 1)?.toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold truncate">{partner.name}</div>
                                                <div className="text-xs text-white/50 truncate">
                                                    {partner.role === 'ALUMNI' ? '🎓 Alumni' : partner.email}
                                                </div>
                                            </div>
                                            {unreadCounts[partner.id] > 0 && (
                                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold shadow-lg shadow-red-500/40 animate-pulse">
                                                    {unreadCounts[partner.id] > 9 ? '9+' : unreadCounts[partner.id]}
                                                </div>
                                            )}
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
                                    <p className="text-xl">Select a conversation</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div className="h-20 bg-white/5 border-b border-white/10 flex items-center px-6 shadow-sm backdrop-blur-md z-10">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center font-bold mr-3 text-lg">
                                        {selectedPartner.name?.substring(0, 1)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">{selectedPartner.name}</div>
                                        <div className="text-xs text-white/50">{selectedPartner.email}</div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20">
                                    {loading ? (
                                        <div className="text-center text-white/50">Loading messages...</div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center text-white/50 py-12">
                                            <p className="text-4xl mb-2">👋</p>
                                            <p>Start the conversation with {selectedPartner.name}!</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            const isMe = msg.sender.id === parseInt(user?.id || '0');
                                            return (
                                                <motion.div
                                                    key={msg.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] p-3 rounded-2xl shadow-lg border ${isMe
                                                            ? 'bg-gradient-to-br from-purple-600 to-blue-600 border-transparent rounded-br-sm'
                                                            : 'bg-[#1a1a24] border-white/10 rounded-bl-sm'
                                                            }`}
                                                    >
                                                        {msg.mediaUrl && (
                                                            <div className="mb-2 rounded-lg overflow-hidden border border-white/10">
                                                                <img
                                                                    src={msg.mediaUrl}
                                                                    alt="Shared media"
                                                                    className="max-w-full max-h-[300px] object-cover hover:scale-105 transition-transform cursor-pointer"
                                                                    onClick={() => window.open(msg.mediaUrl, '_blank')}
                                                                />
                                                            </div>
                                                        )}
                                                        {msg.message && <p className="text-sm leading-relaxed">{msg.message}</p>}
                                                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-white/30'}`}>
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
                                <div className="p-4 bg-white/5 border-t border-white/10">
                                    <AnimatePresence>
                                        {selectedFile && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="mb-3 p-2 bg-white/10 rounded-lg flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ImageIcon size={16} className="text-purple-400" />
                                                    <span className="text-xs truncate max-w-[200px]">{selectedFile.name}</span>
                                                    <span className="text-xs text-white/40">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                                                </div>
                                                <button onClick={() => setSelectedFile(null)} className="hover:text-red-400">
                                                    <X size={16} />
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <form onSubmit={sendMessage} className="flex gap-3 items-end">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*,application/pdf"
                                            onChange={handleFileSelect}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white/70 hover:text-white mb-[1px]"
                                            title="Attach File"
                                        >
                                            <Paperclip size={20} />
                                        </button>

                                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl focus-within:border-purple-500 transition-all flex items-center">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type a message..."
                                                className="flex-1 py-3 px-4 bg-transparent outline-none text-sm placeholder:text-white/30"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={(!newMessage.trim() && !selectedFile) || uploading}
                                            className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center min-w-[50px] mb-[1px]"
                                        >
                                            {uploading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <Send size={20} />
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;
