import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Globe, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CONTACT_INFO, SOCIAL_LINKS, LANGUAGES } from '../utils/constants';

const Footer = () => {
    const { t, currentLanguage, changeLanguage } = useLanguage();

    const quickLinks = [
        { to: '/', label: t('nav.home') },
        { to: '/departments', label: t('nav.departments') },
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
        <footer className="bg-primary-dark text-white mt-auto relative">
            {/* Afghan Pattern Background */}
            <div className="afghan-pattern-bg opacity-10 absolute w-full h-full" />

            <div className="container-custom relative">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-2xl font-bold">AFGHANIUM</span>
                        </div>
                        <p className="text-gray-300 mb-6">
                            {t('footer.tagline')}
                        </p>

                        {/* Language Switcher */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-300 mb-2">
                                <Globe className="w-5 h-5" />
                                <span className="font-semibold">Language:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${currentLanguage === lang.code
                                            ? 'bg-primary text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                            }`}
                                    >
                                        {lang.nativeName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-6">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-300 hover:text-white transition-colors hover:underline"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-xl font-bold mb-6">{t('footer.contact')}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-primary mt-1" />
                                <a
                                    href={`mailto:${CONTACT_INFO.email}`}
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    {CONTACT_INFO.email}
                                </a>
                            </li>
                            <li className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-primary mt-1" />
                                <span className="text-gray-300">{CONTACT_INFO.phone}</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-primary mt-1" />
                                <span className="text-gray-300">{CONTACT_INFO.address}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-xl font-bold mb-6">{t('footer.followUs')}</h3>
                        <div className="flex space-x-4">
                            {socialMediaLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-10 h-10 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-300 text-sm">
                            {t('footer.copyright')}
                        </p>
                        <div className="flex space-x-6">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-gray-300 hover:text-white text-sm transition-colors"
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
