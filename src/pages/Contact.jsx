import React, { useState } from 'react';
import Hero from '../components/Hero';
import { createMessage } from '../supabase/messages';
import Loader from '../components/Loader';
import { useLanguage } from '../contexts/LanguageContext';

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
        <div>
            <Hero
                title={t('contact.title')}
                subtitle={t('contact.subtitle')}
                backgroundImage="/Contact.png"
            />

            <section className="section-padding bg-white">
                <div className="container-custom max-w-4xl">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">{t('contact.formTitle')}</h2>

                        {status.success && (
                            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                                {t('contact.messageSent')}
                            </div>
                        )}

                        {status.error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                                {t('common.error')}: {status.error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={t('contact.namePlaceholder')}
                                    className="input-field"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={t('contact.emailPlaceholder')}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder={t('contact.subjectPlaceholder')}
                                className="input-field"
                                required
                            />
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                placeholder={t('contact.messagePlaceholder')}
                                className="input-field resize-none"
                                required
                            />
                            <button
                                type="submit"
                                className="btn-primary w-full md:w-auto"
                                disabled={status.loading}
                            >
                                {status.loading ? <Loader size="sm" color="white" /> : t('contact.sendMessage')}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
