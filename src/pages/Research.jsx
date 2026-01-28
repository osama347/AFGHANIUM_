import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Send, CheckCircle, AlertCircle, Download } from 'lucide-react';
import Loader from '../components/Loader';
import { useResearch } from '../hooks/useResearch';
import { useStorage } from '../hooks/useStorage';

const Research = () => {
    const { t } = useLanguage();
    const { submit, getPublished, loading: researchLoading } = useResearch();
    const { upload, uploading: fileUploading } = useStorage();
    
    const [activeTab, setActiveTab] = useState('published');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [publishedResearch, setPublishedResearch] = useState([]);
    const [submitStatus, setSubmitStatus] = useState({ success: false, error: false, message: '' });
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        email: '',
        topic: '',
        abstract: '',
        file: null,
        fileName: '',
        keywords: '',
        message: ''
    });

    useEffect(() => {
        if (activeTab === 'published') {
            fetchPublishedResearch();
        }
    }, [activeTab]);

    const fetchPublishedResearch = async () => {
        const result = await getPublished();
        if (result.success) {
            setPublishedResearch(result.data || []);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setSubmitStatus({
                    success: false,
                    error: true,
                    message: 'Please upload a PDF or Word document (PDF, DOC, DOCX)'
                });
                return;
            }
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setSubmitStatus({
                    success: false,
                    error: true,
                    message: 'File size must be less than 10MB'
                });
                return;
            }
            setFormData(prev => ({
                ...prev,
                file: file,
                fileName: file.name
            }));
            setSubmitStatus({ success: false, error: false, message: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setSubmitStatus({ success: false, error: false, message: '' });

        // Form validation
        if (!formData.title || !formData.author || !formData.email || !formData.abstract || !formData.file) {
            setSubmitStatus({
                success: false,
                error: true,
                message: 'Please fill in all required fields'
            });
            setSubmitLoading(false);
            return;
        }

        try {
            // Upload file to Supabase Storage
            let filePath = null;
            if (formData.file) {
                const uploadResult = await upload(formData.file, 'research-files', 'submissions');
                if (uploadResult.success) {
                    filePath = uploadResult.data.path;
                } else {
                    throw new Error('Failed to upload file');
                }
            }

            // Submit research data to Supabase
            const researchData = {
                title: formData.title,
                author: formData.author,
                email: formData.email,
                topic: formData.topic,
                abstract: formData.abstract,
                filePath: filePath,
                fileName: formData.fileName,
                keywords: formData.keywords,
                message: formData.message
            };

            const result = await submit(researchData);

            if (result.success) {
                setSubmitStatus({
                    success: true,
                    error: false,
                    message: t('research.submitSection.form.success')
                });

                // Reset form
                setFormData({
                    title: '',
                    author: '',
                    email: '',
                    topic: '',
                    abstract: '',
                    file: null,
                    fileName: '',
                    keywords: '',
                    message: ''
                });

                // Reset file input
                const fileInput = document.getElementById('research-file');
                if (fileInput) fileInput.value = '';

                // Hide success message after 5 seconds
                setTimeout(() => {
                    setSubmitStatus({ success: false, error: false, message: '' });
                }, 5000);
            } else {
                throw new Error(result.error || 'Failed to submit research');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus({
                success: false,
                error: true,
                message: error.message || t('research.submitSection.form.error')
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div>
            <Hero
                title={t('research.title')}
                subtitle={t('research.subtitle')}
                backgroundImage="/About%20As.png"
            />

            <section className="section-padding bg-white">
                <div className="container-custom max-w-4xl mx-auto">
                    {/* Introduction */}
                    <div className="mb-12 text-center">
                        <p className="text-lg text-gray-700 leading-relaxed mb-8">
                            {t('research.description')}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-12 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('published')}
                            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                                activeTab === 'published'
                                    ? 'text-primary border-primary'
                                    : 'text-gray-600 border-transparent hover:text-gray-900'
                            }`}
                        >
                            <BookOpen className="w-5 h-5 inline mr-2" />
                            {t('research.tabs.published')}
                        </button>
                        <button
                            onClick={() => setActiveTab('submit')}
                            className={`px-6 py-4 font-semibold transition-colors border-b-2 ${
                                activeTab === 'submit'
                                    ? 'text-primary border-primary'
                                    : 'text-gray-600 border-transparent hover:text-gray-900'
                            }`}
                        >
                            <Send className="w-5 h-5 inline mr-2" />
                            {t('research.tabs.submit')}
                        </button>
                    </div>

                    {/* Published Research Tab */}
                    {activeTab === 'published' && (
                        <div className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                    {t('research.publishedSection.title')}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {t('research.publishedSection.subtitle')}
                                </p>
                            </div>

                            {researchLoading ? (
                                <div className="flex justify-center py-20">
                                    <Loader />
                                </div>
                            ) : publishedResearch && publishedResearch.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {publishedResearch.map((research) => (
                                        <div key={research.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                            <div className="flex justify-between items-start gap-4 mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{research.title}</h3>
                                                    <p className="text-primary font-semibold text-sm">{research.author}</p>
                                                </div>
                                                {research.file_path && (
                                                    <a
                                                        href={research.file_path}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        PDF
                                                    </a>
                                                )}
                                            </div>
                                            
                                            <p className="text-gray-700 text-sm mb-4 line-clamp-3">{research.abstract}</p>
                                            
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {research.topic && (
                                                    <span className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full font-medium">
                                                        {research.topic}
                                                    </span>
                                                )}
                                                {research.keywords && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {research.keywords.split(',').map((keyword, idx) => (
                                                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                                                {keyword.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <p className="text-xs text-gray-500">
                                                Published: {new Date(research.published_date || research.submission_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-12 text-center">
                                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 text-lg">
                                        {t('research.publishedSection.noResearch')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submit Research Tab */}
                    {activeTab === 'submit' && (
                        <div className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                    {t('research.submitSection.title')}
                                </h2>
                                <p className="text-gray-600 text-lg mb-8">
                                    {t('research.submitSection.subtitle')}
                                </p>

                                {/* Criteria Section */}
                                <div className="bg-primary-light/10 border border-primary-light rounded-lg p-8 text-left mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                                        {t('research.submitSection.instructions')}
                                    </h3>
                                    <ul className="space-y-3">
                                        {Array.isArray(t('research.submitSection.criteria', { returnObjects: true }))
                                            ? t('research.submitSection.criteria', { returnObjects: true }).map((criterion, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                    <span className="text-gray-700">{criterion}</span>
                                                </li>
                                            ))
                                            : null}
                                    </ul>
                                </div>
                            </div>

                            {/* Status Messages */}
                            {submitStatus.success && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-green-900 mb-1">Success!</h4>
                                        <p className="text-green-800">{submitStatus.message}</p>
                                    </div>
                                </div>
                            )}

                            {submitStatus.error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
                                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-red-900 mb-1">Error</h4>
                                        <p className="text-red-800">{submitStatus.message}</p>
                                    </div>
                                </div>
                            )}

                            {/* Submission Form */}
                            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            {t('research.submitSection.form.title')} *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="Research title..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            {t('research.submitSection.form.author')} *
                                        </label>
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="Your name..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            {t('research.submitSection.form.email')} *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            {t('research.submitSection.form.topic')}
                                        </label>
                                        <input
                                            type="text"
                                            name="topic"
                                            value={formData.topic}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="e.g., Women's Healthcare, Economic Development..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            {t('research.submitSection.form.keywords')}
                                        </label>
                                        <input
                                            type="text"
                                            name="keywords"
                                            value={formData.keywords}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="Separate with commas..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            {t('research.submitSection.form.file')} *
                                        </label>
                                        <input
                                            id="research-file"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="input-field"
                                            accept=".pdf,.doc,.docx"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (max 10MB)</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        {t('research.submitSection.form.abstract')} *
                                    </label>
                                    <textarea
                                        name="abstract"
                                        value={formData.abstract}
                                        onChange={handleInputChange}
                                        className="input-field h-40 resize-none"
                                        placeholder="Brief summary of your research (200-500 words)..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        {t('research.submitSection.form.message')}
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="input-field h-24 resize-none"
                                        placeholder="Any additional notes for the review team..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitLoading || fileUploading}
                                    className="btn-primary w-full"
                                >
                                    {submitLoading || fileUploading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader size="sm" color="white" />
                                            {fileUploading ? 'Uploading file...' : t('research.submitSection.form.submitting')}
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Send className="w-4 h-4" />
                                            {t('research.submitSection.form.submit')}
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Research;
