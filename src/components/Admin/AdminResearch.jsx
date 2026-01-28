import React, { useState, useEffect } from 'react';
import { useResearch } from '../../hooks/useResearch';
import { BookOpen, CheckCircle, XCircle, Eye, Download, Trash2, Loader as LoaderIcon, Search } from 'lucide-react';
import Loader from '../Loader';
import Toast from '../Toast';

const AdminResearch = () => {
    const { getAll, updateStatus, remove, getStats } = useResearch();
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, published: 0 });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending_review, approved, rejected
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedResearch, setSelectedResearch] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadResearchData();
    }, []);

    const loadResearchData = async () => {
        setLoading(true);
        try {
            const [submissionsResult, statsResult] = await Promise.all([
                getAll(),
                getStats()
            ]);

            if (submissionsResult.success) {
                setSubmissions(submissionsResult.data || []);
            }
            if (statsResult.success) {
                setStats(statsResult.data || stats);
            }
        } catch (error) {
            console.error('Error loading research:', error);
            setToast({ type: 'error', message: 'Failed to load research submissions' });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (research) => {
        if (!research.id) return;
        setProcessing(true);
        try {
            const result = await updateStatus(research.id, 'approved', adminNotes);
            if (result.success) {
                setToast({ type: 'success', message: 'Research approved successfully' });
                loadResearchData();
                setSelectedResearch(null);
                setAdminNotes('');
            } else {
                setToast({ type: 'error', message: result.error || 'Failed to approve research' });
            }
        } catch (error) {
            setToast({ type: 'error', message: error.message });
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async (research) => {
        if (!research.id || !adminNotes.trim()) {
            setToast({ type: 'error', message: 'Please provide a rejection reason' });
            return;
        }
        setProcessing(true);
        try {
            const result = await updateStatus(research.id, 'rejected', adminNotes);
            if (result.success) {
                setToast({ type: 'success', message: 'Research rejected' });
                loadResearchData();
                setSelectedResearch(null);
                setAdminNotes('');
            } else {
                setToast({ type: 'error', message: result.error || 'Failed to reject research' });
            }
        } catch (error) {
            setToast({ type: 'error', message: error.message });
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (researchId) => {
        if (!window.confirm('Are you sure you want to delete this submission?')) return;
        
        setProcessing(true);
        try {
            const result = await remove(researchId);
            if (result.success) {
                setToast({ type: 'success', message: 'Research deleted successfully' });
                loadResearchData();
            } else {
                setToast({ type: 'error', message: result.error || 'Failed to delete research' });
            }
        } catch (error) {
            setToast({ type: 'error', message: error.message });
        } finally {
            setProcessing(false);
        }
    };

    // Filter and search submissions
    const filteredSubmissions = submissions.filter(research => {
        if (filter !== 'all' && research.status !== filter) return false;
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            return (
                research.title?.toLowerCase().includes(search) ||
                research.author?.toLowerCase().includes(search) ||
                research.email?.toLowerCase().includes(search)
            );
        }
        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending_review':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending_review':
                return 'Pending Review';
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold text-gray-900">Research Management</h1>
                </div>
                <p className="text-gray-600">Review and manage research submissions</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="text-sm text-gray-600 font-medium">Total Submissions</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total || 0}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <div className="text-sm text-gray-600 font-medium">Pending Review</div>
                    <div className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending || 0}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <div className="text-sm text-gray-600 font-medium">Approved</div>
                    <div className="text-3xl font-bold text-green-600 mt-2">{stats.approved || 0}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                    <div className="text-sm text-gray-600 font-medium">Rejected</div>
                    <div className="text-3xl font-bold text-red-600 mt-2">{stats.rejected || 0}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                    <div className="text-sm text-gray-600 font-medium">Published</div>
                    <div className="text-3xl font-bold text-purple-600 mt-2">{stats.published || 0}</div>
                </div>
            </div>

            {/* Filter and Search */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title, author, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'pending_review', 'approved', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === status
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status === 'all' ? 'All' : getStatusLabel(status)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Research Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredSubmissions.length === 0 ? (
                    <div className="p-8 text-center">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No research submissions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Author</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Submitted</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSubmissions.map((research) => (
                                    <tr key={research.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{research.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{research.author}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(research.status)}`}>
                                                {getStatusLabel(research.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {research.submission_date ? new Date(research.submission_date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => setSelectedResearch(research)}
                                                className="inline-flex items-center space-x-1 px-3 py-2 text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedResearch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Research Details</h2>
                            <button
                                onClick={() => {
                                    setSelectedResearch(null);
                                    setAdminNotes('');
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedResearch.title}</h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Author:</span>
                                        <span className="ml-2 text-gray-600">{selectedResearch.author}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Email:</span>
                                        <span className="ml-2 text-gray-600">{selectedResearch.email}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Topic:</span>
                                        <span className="ml-2 text-gray-600">{selectedResearch.topic || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Status:</span>
                                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedResearch.status)}`}>
                                            {getStatusLabel(selectedResearch.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Abstract */}
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Abstract</h4>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{selectedResearch.abstract}</p>
                            </div>

                            {/* Keywords */}
                            {selectedResearch.keywords && (
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Keywords</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedResearch.keywords.split(',').map((keyword, idx) => (
                                            <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                                {keyword.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* File Download */}
                            {selectedResearch.file_path && (
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Attached File</h4>
                                    <a
                                        href={selectedResearch.file_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>{selectedResearch.file_name || 'Download File'}</span>
                                    </a>
                                </div>
                            )}

                            {/* Admin Notes */}
                            {selectedResearch.status === 'pending_review' ? (
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Admin Notes</h4>
                                    <textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add notes (required for rejection)..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                        rows="4"
                                    />
                                </div>
                            ) : selectedResearch.admin_notes ? (
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Admin Notes</h4>
                                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{selectedResearch.admin_notes}</p>
                                </div>
                            ) : null}
                        </div>

                        {/* Modal Footer */}
                        {selectedResearch.status === 'pending_review' && (
                            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
                                <button
                                    onClick={() => {
                                        setSelectedResearch(null);
                                        setAdminNotes('');
                                    }}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    disabled={processing}
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleReject(selectedResearch)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center space-x-2"
                                    disabled={processing}
                                >
                                    {processing ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    <span>Reject</span>
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedResearch)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center space-x-2"
                                    disabled={processing}
                                >
                                    {processing ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    <span>Approve</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default AdminResearch;
