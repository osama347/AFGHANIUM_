import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Download, FileText, FileUp, Sparkles, Send, ShieldCheck, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Loader from '../components/Loader';
import { useResearch } from '../hooks/useResearch';
import { useStorage } from '../hooks/useStorage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

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
        message: '',
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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowedTypes.includes(file.type)) {
            setSubmitStatus({
                success: false,
                error: true,
                message: 'Please upload a PDF or Word document (PDF, DOC, DOCX)',
            });
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setSubmitStatus({
                success: false,
                error: true,
                message: 'File size must be less than 10MB',
            });
            return;
        }

        setFormData((prev) => ({
            ...prev,
            file,
            fileName: file.name,
        }));
        setSubmitStatus({ success: false, error: false, message: '' });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            email: '',
            topic: '',
            abstract: '',
            file: null,
            fileName: '',
            keywords: '',
            message: '',
        });

        const fileInput = document.getElementById('research-file');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setSubmitStatus({ success: false, error: false, message: '' });

        if (!formData.title || !formData.author || !formData.email || !formData.abstract || !formData.file) {
            setSubmitStatus({
                success: false,
                error: true,
                message: 'Please fill in all required fields',
            });
            setSubmitLoading(false);
            return;
        }

        try {
            let filePath = null;

            if (formData.file) {
                const uploadResult = await upload(formData.file, 'research-files', 'submissions');
                if (uploadResult.success) {
                    filePath = uploadResult.data.path;
                } else {
                    throw new Error('Failed to upload file');
                }
            }

            const researchData = {
                title: formData.title,
                author: formData.author,
                email: formData.email,
                topic: formData.topic,
                abstract: formData.abstract,
                filePath,
                fileName: formData.fileName,
                keywords: formData.keywords,
                message: formData.message,
            };

            const result = await submit(researchData);

            if (result.success) {
                setSubmitStatus({
                    success: true,
                    error: false,
                    message: t('research.submitSection.form.success'),
                });
                resetForm();

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
                message: error.message || t('research.submitSection.form.error'),
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    const keyPrinciples = [
        {
            icon: ShieldCheck,
            title: 'Original work only',
            description: 'Submissions should be authored by you and free from plagiarism.',
        },
        {
            icon: BookOpen,
            title: 'Structured and credible',
            description: 'We prefer research supported by evidence, sources, and clear organization.',
        },
        {
            icon: Users,
            title: 'Practical impact',
            description: 'Work related to healthcare, women’s health, and development is especially welcome.',
        },
    ];

    const submissionCriteria = [0, 1, 2, 3, 4].map((index) => t(`research.submitSection.criteria.${index}`));

    return (
        <div className="bg-background text-foreground">
            <section className="section-padding bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/60">
                <div className="container-custom space-y-8">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            Research and publications
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            Evidence-based work
                        </Badge>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                        <div className="max-w-3xl">
                            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                Research that is useful, readable, and publishable.
                            </h1>
                            <p className="mt-5 text-lg leading-8 text-muted-foreground sm:text-xl">
                                Explore published work or submit your own research to help shape practical knowledge for Afghanistan’s future.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                {[
                                    { label: 'Published research', value: 'Free access' },
                                    { label: 'Submission review', value: 'Careful review' },
                                    { label: 'Focus areas', value: 'Health and development' },
                                ].map((item) => (
                                    <Card key={item.label} className="border-border/70 shadow-sm">
                                        <CardContent className="p-5">
                                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{item.label}</p>
                                            <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <Card className="rounded-[2rem] border-border/70 bg-card/95 shadow-xl backdrop-blur">
                            <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                    Submission standards
                                </CardDescription>
                                <CardTitle className="text-2xl">What good research looks like</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                {keyPrinciples.map((principle) => {
                                    const Icon = principle.icon;

                                    return (
                                        <div key={principle.title} className="flex gap-4 rounded-2xl border border-border bg-background p-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{principle.title}</p>
                                                <p className="mt-1 text-sm leading-6 text-muted-foreground">{principle.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-6 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Explore research</p>
                                <p className="mt-2 text-muted-foreground">Switch between published work and submission guidance.</p>
                            </div>

                            <div className="inline-flex rounded-2xl border border-border bg-muted/40 p-1 shadow-sm">
                                <button
                                    onClick={() => setActiveTab('published')}
                                    className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${activeTab === 'published'
                                        ? 'bg-background text-primary shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        {t('research.tabs.published')}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('submit')}
                                    className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${activeTab === 'submit'
                                        ? 'bg-background text-primary shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <Send className="h-4 w-4" />
                                        {t('research.tabs.submit')}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {activeTab === 'published' && (
                            <div className="space-y-8">
                                <div className="max-w-3xl">
                                    <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                                        {t('research.publishedSection.title')}
                                    </h2>
                                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                                        {t('research.publishedSection.subtitle')}
                                    </p>
                                </div>

                                {researchLoading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader />
                                    </div>
                                ) : publishedResearch && publishedResearch.length > 0 ? (
                                    <div className="grid gap-6 xl:grid-cols-2">
                                        {publishedResearch.map((research) => (
                                            <Card key={research.id} className="overflow-hidden border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                                <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <CardTitle className="text-2xl">{research.title}</CardTitle>
                                                            <CardDescription className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                                                                {research.author}
                                                            </CardDescription>
                                                        </div>

                                                        {research.file_path && (
                                                            <a
                                                                href={research.file_path}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                                PDF
                                                            </a>
                                                        )}
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="space-y-4 p-6">
                                                    <p className="line-clamp-4 text-sm leading-7 text-muted-foreground">
                                                        {research.abstract}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {research.topic && (
                                                            <Badge variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
                                                                {research.topic}
                                                            </Badge>
                                                        )}
                                                        {research.keywords && research.keywords.split(',').map((keyword, idx) => (
                                                            <Badge key={idx} variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
                                                                {keyword.trim()}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                                                        <span>Published</span>
                                                        <span>{new Date(research.published_date || research.submission_date).toLocaleDateString()}</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="border-dashed border-border/80 bg-muted/30">
                                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                <FileText className="h-8 w-8" />
                                            </div>
                                            <p className="text-lg font-semibold text-foreground">
                                                {t('research.publishedSection.noResearch')}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}

                        {activeTab === 'submit' && (
                            <div className="space-y-8">
                                <div className="max-w-3xl">
                                    <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
                                        {t('research.submitSection.title')}
                                    </h2>
                                    <p className="mt-4 text-lg leading-8 text-muted-foreground">
                                        {t('research.submitSection.subtitle')}
                                    </p>
                                </div>

                                <Card className="border-border/70 shadow-xl">
                                    <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                            Submission guidance
                                        </CardDescription>
                                        <CardTitle className="text-2xl">Before you submit</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-6">
                                        <div className="grid gap-4 md:grid-cols-3">
                                            {submissionCriteria.map((criterion, index) => (
                                                <div key={index} className="rounded-2xl border border-border bg-background p-4">
                                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                                        <CheckCircle className="h-5 w-5" />
                                                    </div>
                                                    <p className="text-sm leading-6 text-muted-foreground">{criterion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {submitStatus.success && (
                                    <Card className="border-green-200 bg-green-50">
                                        <CardContent className="flex items-start gap-3 p-6">
                                            <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-green-600" />
                                            <div>
                                                <h4 className="font-bold text-green-900">Success!</h4>
                                                <p className="mt-1 text-green-800">{submitStatus.message}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {submitStatus.error && (
                                    <Card className="border-red-200 bg-red-50">
                                        <CardContent className="flex items-start gap-3 p-6">
                                            <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
                                            <div>
                                                <h4 className="font-bold text-red-900">Error</h4>
                                                <p className="mt-1 text-red-800">{submitStatus.message}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <Card className="border-border/70 shadow-xl">
                                    <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                            Upload form
                                        </CardDescription>
                                        <CardTitle className="text-2xl">Submit your research</CardTitle>
                                    </CardHeader>

                                    <CardContent className="p-6 sm:p-8">
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {[
                                                    { label: t('research.submitSection.form.title'), name: 'title', placeholder: 'Research title...' },
                                                    { label: t('research.submitSection.form.author'), name: 'author', placeholder: 'Your name...' },
                                                    { label: t('research.submitSection.form.email'), name: 'email', placeholder: 'your@email.com', type: 'email' },
                                                    { label: t('research.submitSection.form.topic'), name: 'topic', placeholder: 'e.g., Women\'s Healthcare, Economic Development...' },
                                                    { label: t('research.submitSection.form.keywords'), name: 'keywords', placeholder: 'Separate with commas...' },
                                                ].map((field) => (
                                                    <div key={field.name}>
                                                        <label className="mb-2 block text-sm font-medium text-foreground">
                                                            {field.label} {field.name === 'title' || field.name === 'author' || field.name === 'email' ? '*' : ''}
                                                        </label>
                                                        <input
                                                            type={field.type || 'text'}
                                                            name={field.name}
                                                            value={formData[field.name]}
                                                            onChange={handleInputChange}
                                                            className="input-field h-12"
                                                            placeholder={field.placeholder}
                                                            required={field.name === 'title' || field.name === 'author' || field.name === 'email'}
                                                        />
                                                    </div>
                                                ))}

                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                                        {t('research.submitSection.form.file')} *
                                                    </label>
                                                    <label className="flex h-12 cursor-pointer items-center gap-3 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40">
                                                        <FileUp className="h-4 w-4 text-primary" />
                                                        <span className="truncate">{formData.fileName || 'Choose a file...'}</span>
                                                        <input
                                                            id="research-file"
                                                            type="file"
                                                            onChange={handleFileChange}
                                                            className="sr-only"
                                                            accept=".pdf,.doc,.docx"
                                                            required
                                                        />
                                                    </label>
                                                    <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, or DOCX (max 10MB)</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-foreground">
                                                    {t('research.submitSection.form.abstract')} *
                                                </label>
                                                <textarea
                                                    name="abstract"
                                                    value={formData.abstract}
                                                    onChange={handleInputChange}
                                                    className="input-field min-h-44 resize-none"
                                                    placeholder="Brief summary of your research (200-500 words)..."
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-foreground">
                                                    {t('research.submitSection.form.message')}
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    className="input-field min-h-28 resize-none"
                                                    placeholder="Any additional notes for the review team..."
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={submitLoading || fileUploading}
                                                className="h-12 w-full rounded-xl shadow-lg shadow-primary/20"
                                            >
                                                {submitLoading || fileUploading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Loader size="sm" color="white" />
                                                        {fileUploading ? 'Uploading file...' : t('research.submitSection.form.submitting')}
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Send className="h-4 w-4" />
                                                        {t('research.submitSection.form.submit')}
                                                    </span>
                                                )}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Research;