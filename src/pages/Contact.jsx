import React, { useState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import { createMessage } from '../supabase/messages';
import Loader from '../components/Loader';
import { useLanguage } from '../contexts/LanguageContext';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/FormElements';
import PageHero from '../components/PageHero';
import { CONTACT_INFO } from '../utils/constants';

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
            <PageHero eyebrow="Contact" title={t('contact.title')} subtitle={t('contact.subtitle')} />

            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid gap-10 border border-border lg:grid-cols-[1fr_1.5fr]">
                        <div className="border-b border-border p-8 lg:border-b-0 lg:border-r">
                            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                                Get in touch
                            </h2>
                            <ul className="mt-6 space-y-5">
                                <li>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Email</p>
                                    <a href={`mailto:${CONTACT_INFO.email}`} className="mt-1 block text-foreground hover:text-primary">
                                        {CONTACT_INFO.email}
                                    </a>
                                </li>
                                <li>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Phone</p>
                                    <p className="mt-1 text-foreground">{CONTACT_INFO.phone}</p>
                                </li>
                                <li>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Address</p>
                                    <p className="mt-1 text-foreground">{CONTACT_INFO.address}</p>
                                </li>
                            </ul>
                        </div>

                        <div className="p-8">
                            {status.success && (
                                <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>{t('contact.messageSent')}</AlertDescription>
                                </Alert>
                            )}

                            {status.error && (
                                <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
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

                                <Button type="submit" size="lg" disabled={status.loading}>
                                    {status.loading ? <Loader size="sm" color="white" /> : t('contact.sendMessage')}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
