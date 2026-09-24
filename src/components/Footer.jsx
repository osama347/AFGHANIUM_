import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CONTACT_INFO, SOCIAL_LINKS } from '../utils/constants';

const Footer = () => {
    const { t } = useLanguage();
    const phoneHref = CONTACT_INFO.phone.startsWith('00')
        ? `+${CONTACT_INFO.phone.slice(2)}`
        : CONTACT_INFO.phone;

    const quickLinks = [
        { to: '/', label: t('nav.home') },
        { to: '/shop', label: t('nav.products') },
        { to: '/donate', label: t('nav.donate') },
        { to: '/track', label: t('nav.track') },
        { to: '/impact', label: t('nav.impact') },
        { to: '/about', label: t('nav.about') },
        { to: '/contact', label: t('nav.contact') },
        { to: '/faq', label: t('nav.faq') },
    ];

    const legalLinks = [
        { to: '/privacy', label: t('footer.privacy') },
        { to: '/terms', label: t('footer.terms') },
    ];

    const socialMediaLinks = [
        { icon: Facebook, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
        { icon: Twitter, href: SOCIAL_LINKS.twitter, label: 'Twitter' },
        { icon: Instagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
        { icon: Linkedin, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
    ];

    return (
        <footer className="mt-auto bg-primary-dark text-white">
            <div className="container-custom">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <img
                                src="/logo.jpg"
                                alt="Afghanium logo"
                                className="w-12 h-12 rounded-lg object-cover border border-white/15"
                            />
                            <span className="font-display text-xl font-bold uppercase tracking-[0.08em]">Afghanium</span>
                        </div>
                        <p className="text-white/70 mb-6 leading-relaxed">
                            Made in Afghanistan, Meant for the world.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-accent-gold">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-white/70 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-accent-gold">{t('footer.contact')}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-accent-gold mt-1 shrink-0" />
                                <a
                                    href={`mailto:${CONTACT_INFO.email}`}
                                    className="text-white/70 hover:text-white transition-colors"
                                >
                                    {CONTACT_INFO.email}
                                </a>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-accent-gold mt-1 shrink-0" />
                                <a
                                    href={`tel:${phoneHref}`}
                                    className="text-white/70 hover:text-white transition-colors"
                                >
                                    {CONTACT_INFO.phone}
                                </a>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-accent-gold mt-1 shrink-0" />
                                <span className="text-white/70">{CONTACT_INFO.address}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-accent-gold">{t('footer.followUs')}</h3>
                        <div className="flex space-x-3">
                            {socialMediaLinks.map(({ icon, href, label }) => {
                                const SocialIcon = icon;
                                return (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-10 h-10 bg-white/10 hover:bg-accent-gold hover:text-primary-dark rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <SocialIcon className="w-5 h-5" />
                                </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-white/60 text-sm">
                            {t('footer.copyright')}
                        </p>
                        <div className="flex space-x-6">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-white/60 hover:text-white text-sm transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
