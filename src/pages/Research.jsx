import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Download, FileText, FileUp, Send, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Loader from '../components/Loader';
import { useResearch } from '../hooks/useResearch';
import { useStorage } from '../hooks/useStorage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';

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
            description: 'Submissions should be yours and free from plagiarism.',
        },
        {
            icon: BookOpen,
            title: 'Structured and credible',
            description: 'We prefer evidence-based research with clear sources.',
        },
        {
            icon: Users,
            title: 'Practical impact',
            description: 'Work tied to healthcare, women’s health, and development is welcome.',
        },
    ];

    const submissionCriteria = [0, 1, 2, 3, 4].map((index) => t(`research.submitSection.criteria.${index}`));

    return (
        <div className="bg-background text-foreground">
            <PageHero
                eyebrow="Research"
                title="Research that is useful. Readable. Publishable. Practical."
                subtitle="Explore published work or submit your own research to help shape practical knowledge for Afghanistan’s future."
            />

            <section className="section-padding">
                <div className="container-custom">
                    <SectionHeading index="01" title="What good research looks like" />

                    <div className="grid divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                        {keyPrinciples.map((principle) => (
                            <div key={principle.title} className="p-6">
                                <h3 className="font-semibold text-foreground">{principle.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{principle.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-padding border-t border-border bg-muted/30">
                <div className="container-custom">
                    <div className="mx-auto max-w-6xl">
                        <SectionHeading index="02" title="Switch between published work and submission guidance" />

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 md:w-fit md:grid-cols-2">
                                <TabsTrigger value="published" className="rounded-md border border-border bg-background py-2 data-[state=active]:border-primary/40">
                                    <span className="inline-flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        {t('research.tabs.published')}
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger value="submit" className="rounded-md border border-border bg-background py-2 data-[state=active]:border-primary/40">
                                    <span className="inline-flex items-center gap-2">
                                        <Send className="h-4 w-4" />
                                        {t('research.tabs.submit')}
                                    </span>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="published" className="mt-8">
                                <div className="mx-auto max-w-3xl text-center">
                                    <p className="text-lg leading-8 text-muted-foreground">{t('research.publishedSection.subtitle')}</p>
                                </div>

                                {researchLoading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader />
                                    </div>
                                ) : publishedResearch && publishedResearch.length > 0 ? (
                                    <div className="mt-8 grid gap-6 xl:grid-cols-2">
                                        {publishedResearch.map((research) => (
                                            <Card key={research.id} className="overflow-hidden card-hover">
                                                <CardHeader className="border-b border-border">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <CardTitle className="text-2xl">{research.title}</CardTitle>
                                                            <CardDescription className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                                                                {research.author}
                                                            </CardDescription>
                                                        </div>

                                                        {research.file_path && (
                                                            <Button asChild variant="outline">
                                                                <a href={research.file_path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                                                                    <Download className="h-4 w-4" />
                                                                    PDF
                                                                </a>
                                                            </Button>
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
                                                </CardContent>

                                                <CardFooter className="justify-between border-t border-border/60">
                                                    <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Published</span>
                                                    <span className="text-sm text-foreground">
                                                        {new Date(research.published_date || research.submission_date).toLocaleDateString()}
                                                    </span>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="mt-8 border-dashed border-border/80 bg-muted/30">
                                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                <FileText className="h-8 w-8" />
                                            </div>
                                            <p className="text-lg font-semibold text-foreground">
                                                {t('research.publishedSection.noResearch')}
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            <TabsContent value="submit" className="mt-8 space-y-8">
                                <div className="mx-auto max-w-3xl text-center">
                                    <p className="text-lg leading-8 text-muted-foreground">{t('research.submitSection.subtitle')}</p>
                                </div>

                                <Card>
                                    <CardHeader className="border-b border-border">
                                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                                            Submission guidance
                                        </CardDescription>
                                        <CardTitle className="text-2xl">Before you submit</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-6">
                                        <div className="grid gap-4 md:grid-cols-3">
                                            {submissionCriteria.map((criterion, index) => (
                                                <div key={index} className="rounded-md border border-border bg-background p-4">
                                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
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

                                <Card>
                                    <CardHeader className="border-b border-border">
                                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
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
                                                    { label: t('research.submitSection.form.topic'), name: 'topic', placeholder: "e.g., Women's Healthcare, Economic Development..." },
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
                                                className="h-12 w-full"
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
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Research;
