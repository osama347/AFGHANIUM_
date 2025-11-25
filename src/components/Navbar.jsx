import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import CTAButton from './CTAButton';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES } from '../utils/constants';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
    const location = useLocation();
    const { t, currentLanguage, changeLanguage } = useLanguage();

    const navLinks = [
        { path: '/', label: t('nav.home') },
        { path: '/departments', label: t('nav.departments') },
        { path: '/track', label: t('nav.track') },
        { path: '/impact', label: t('nav.impact') },
        { path: '/about', label: t('nav.about') },
        { path: '/contact', label: t('nav.contact') },
        { path: '/faq', label: t('nav.faq') },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo - Left Side */}
                    <Link to="/" className="flex-shrink-0">
                        <img
                            src="/logo.jpg"
                            alt="AFGHANIUM"
                            className="h-10 w-auto md:h-12"
                        />
                    </Link>

                    {/* Desktop Navigation - Center */}
                    <div className="hidden lg:flex items-center space-x-8 flex-1 justify-end pr-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${isActive(link.path)
                                    ? 'text-primary border-b-2 border-primary pb-1'
                                    : 'text-gray-700 hover:text-primary'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                aria-label="Change language"
                            >
                                <Globe className="w-5 h-5" />
                                <span className="text-xs font-bold uppercase">{currentLanguage}</span>
                            </button>

                            {languageMenuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                changeLanguage(lang.code);
                                                setLanguageMenuOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-3 text-sm transition-colors ${currentLanguage === lang.code
                                                ? 'bg-primary text-white font-bold'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Donate Button - Desktop */}
                    <div className="hidden lg:block">
                        <CTAButton to="/donate" size="md" className="font-bold">
                            {t('nav.donate')}
                        </CTAButton>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay & Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <span className="font-bold text-lg text-gray-900">Menu</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto py-4">
                            <div className="px-4 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(link.path)
                                            ? 'bg-primary/10 text-primary font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-6 px-4">
                                <div className="h-px bg-gray-100 mb-6" />

                                {/* Language Selector */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
                                        {t('common.language')}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    changeLanguage(lang.code);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase border transition-all ${currentLanguage === lang.code
                                                    ? 'bg-primary text-white border-primary shadow-sm'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {lang.code}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <CTAButton
                                to="/donate"
                                fullWidth
                                onClick={() => setMobileMenuOpen(false)}
                                className="shadow-lg"
                            >
                                {t('nav.donate')}
                            </CTAButton>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
