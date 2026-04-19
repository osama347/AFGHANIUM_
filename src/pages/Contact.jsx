import React, { useState } from 'react';
import { CheckCircle2, Clock3, Mail, MessageSquareText, Sparkles } from 'lucide-react';
import { createMessage } from '../supabase/messages';
import Loader from '../components/Loader';
import { useLanguage } from '../contexts/LanguageContext';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/FormElements';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
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
            <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-primary/5 to-background">
                <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                <div className="container-custom relative z-10 py-16 md:py-22 lg:py-28">
                    <div className="mx-auto max-w-4xl text-center">
                        <Badge variant="secondary" className="mb-5 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em]">
                            Contact
                        </Badge>

                        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            {t('contact.title')}
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            {t('contact.subtitle')}
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {['Fast response', 'Clear communication', 'Dedicated support'].map((item) => (
                                <div key={item} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.1fr]">
                        

                        <Card className="overflow-hidden border-border/70 shadow-xl">
                            <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                    {t('contact.formTitle')}
                                </CardDescription>
                                <CardTitle className="text-2xl">Send a direct message</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 sm:p-8">
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
                                            <Label htmlFor="name">{t('contact.namePlaceholder')}</Label>
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
                                            <Label htmlFor="email">{t('contact.emailPlaceholder')}</Label>
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
                                        <Label htmlFor="subject">{t('contact.subjectPlaceholder')}</Label>
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
                                        <Label htmlFor="message">{t('contact.messagePlaceholder')}</Label>
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
