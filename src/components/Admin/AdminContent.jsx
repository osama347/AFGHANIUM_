import React, { useEffect, useState } from 'react';
import { getContent, updateContent } from '../../supabase/content';
import { FileText, Save } from 'lucide-react';
import Loader from '../Loader';

const AdminContent = () => {
    const [aboutText, setAboutText] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ error: null, success: false });

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        const result = await getContent('about_us');
        if (result.success) {
            setAboutText(result.data || '');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus({ error: null, success: false });

        const result = await updateContent('about_us', aboutText);

        if (result.success) {
            setStatus({ error: null, success: true });
        } else {
            setStatus({ error: result.error, success: false });
        }
        setSaving(false);
    };

    if (loading) return <Loader size="lg" />;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Content Management</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Edit "About Us" Page
                </h3>

                {status.success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                        Content updated successfully!
                    </div>
                )}

                {status.error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                        Error: {status.error}
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">About Us Description</label>
                        <textarea
                            value={aboutText}
                            onChange={(e) => setAboutText(e.target.value)}
                            className="input-field h-64 font-mono text-sm"
                            placeholder="Enter the content for the About Us page..."
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            This text will appear on the public About Us page.
                        </p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-primary"
                    >
                        {saving ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader size="sm" color="white" /> Saving...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> Save Content
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminContent;
