import React, { useEffect, useState } from 'react';
import { getMessages, markMessageAsRead, deleteMessage } from '../../supabase/messages';
import { Mail, Trash2, CheckCircle, Clock, Reply } from 'lucide-react';
import Loader from '../Loader';
import { formatDateTime } from '../../utils/formatters';

const AdminInbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const result = await getMessages();
        if (result.success) {
            setMessages(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleMarkAsRead = async (id) => {
        const result = await markMessageAsRead(id);
        if (result.success) {
            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, read: true } : msg
            ));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            const result = await deleteMessage(id);
            if (result.success) {
                setMessages(messages.filter(msg => msg.id !== id));
            }
        }
    };

    if (loading) return <Loader size="lg" />;

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                Error loading messages: {error}
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Inbox</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <Mail className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No messages</h3>
                        <p className="text-gray-500 mt-1">New messages from the contact form will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`p-6 hover:bg-gray-50 transition-colors ${!msg.read ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`text-lg font-semibold ${!msg.read ? 'text-primary' : 'text-gray-900'}`}>
                                            {msg.subject}
                                        </h3>
                                        {!msg.read && (
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        {formatDateTime(msg.created_at)}
                                    </div>
                                </div>

                                <div className="flex justify-between items-start">
                                    <div className="mb-4">
                                        <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                                        <div className="text-sm text-gray-500">{msg.email}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Reply"
                                        >
                                            <Reply className="w-5 h-5" />
                                        </a>
                                        {!msg.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(msg.id)}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                title="Mark as Read"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminInbox;
