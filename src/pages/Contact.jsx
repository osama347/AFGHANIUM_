import React, { useState } from 'react';
import { CheckCircle2, Clock3, Mail, MessageSquareText, Sparkles } from 'lucide-react';
import { createMessage } from '../supabase/messages';
import Loader from '../components/Loader';
import SectionTitle from '../components/SectionTitle';
import { useLanguage } from '../contexts/LanguageContext';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/FormElements';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ loading: false, error: null, success: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: false });

        const result = await createMessage(formData);

        if (result.success) {
            setStatus({ loading: false, error: null, success: true });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
            setStatus({ loading: false, error: result.error, success: false });
        }
    };

    return (
        <div className="bg-background text-foreground">
            <section className="section-padding bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/60">
                <div className="container-custom space-y-8">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            Contact
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            We reply with care
                        </Badge>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                        <div className="max-w-3xl space-y-5">
                            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                {t('contact.title')}
                            </h1>
                            <p className="text-lg leading-8 text-muted-foreground sm:text-xl">
                                {t('contact.subtitle')}
                            </p>

                            <div className="grid gap-4 sm:grid-cols-3">
                                {[
                                    {
                                        icon: Clock3,
                                        title: 'Quick response',
                                        description: 'We aim to reply as soon as possible.',
                                    },
                                    {
                                        icon: MessageSquareText,
                                        title: 'Clear questions',
                                        description: 'Use the form for support, partnerships, or general feedback.',
                                    },
                                    {
                                        icon: Sparkles,
                                        title: 'Purposeful contact',
                                        description: 'Every message is routed to the right team.',
                                    },
                                ].map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Card key={item.title} className="border-border/70 shadow-sm">
                                            <CardContent className="p-5">
                                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
                                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        <Card className="rounded-[2rem] border-border/70 shadow-xl">
                            <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                    {t('contact.formTitle')}
                                </CardDescription>
                                <CardTitle className="text-2xl">Send a direct message</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                                {status.success && (
                                    <Alert className="border-green-200 bg-green-50 text-green-800">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <AlertTitle>Success</AlertTitle>
                                        <AlertDescription>{t('contact.messageSent')}</AlertDescription>
                                    </Alert>
                                )}

                                {status.error && (
                                    <Alert className="border-red-200 bg-red-50 text-red-800">
                                        <Mail className="h-4 w-4" />
                                        <AlertTitle>{t('common.error')}</AlertTitle>
                                        <AlertDescription>{status.error}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground" htmlFor="name">
                                                {t('contact.namePlaceholder')}
                                            </label>
                                            <Input
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder={t('contact.namePlaceholder')}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground" htmlFor="email">
                                                {t('contact.emailPlaceholder')}
                                            </label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder={t('contact.emailPlaceholder')}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground" htmlFor="subject">
                                            {t('contact.subjectPlaceholder')}
                                        </label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder={t('contact.subjectPlaceholder')}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground" htmlFor="message">
                                            {t('contact.messagePlaceholder')}
                                        </label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={7}
                                            placeholder={t('contact.messagePlaceholder')}
                                            className="resize-none"
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full rounded-full shadow-lg shadow-primary/20"
                                        disabled={status.loading}
                                    >
                                        {status.loading ? <Loader size="sm" color="white" /> : t('contact.sendMessage')}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
