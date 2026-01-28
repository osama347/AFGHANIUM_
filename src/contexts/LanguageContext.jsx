import React, { createContext, useState, useContext, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    // Get initial language from localStorage or default to 'en'
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('language') || 'en';
        }
        return 'en';
    });
    const [translations, setTranslations] = useState({});
    const [loading, setLoading] = useState(true); // Start with true to wait for initial load

    useEffect(() => {
        loadTranslations(currentLanguage);
    }, [currentLanguage]);

    const loadTranslations = async (lang) => {
        setLoading(true);
        try {
            const response = await fetch(`/locales/${lang}.json`);
            if (!response.ok) throw new Error('Failed to load translations');
            const data = await response.json();
            setTranslations(data);
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to English
            if (lang !== 'en') {
                try {
                    const response = await fetch('/locales/en.json');
                    const data = await response.json();
                    setTranslations(data);
                } catch (fallbackError) {
                    console.error('Error loading fallback translations:', fallbackError);
                    // Set empty translations to prevent crash
                    setTranslations({});
                }
            } else {
                setTranslations({});
            }
        }
        setLoading(false);
    };

    const changeLanguage = (lang) => {
        setCurrentLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (path) => {
        if (!path) return '';

        const keys = path.split('.');
        let value = translations;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                // Return the original path as fallback if key not found
                return path;
            }
        }

        // If value is not a string, return the path
        if (typeof value !== 'string') {
            return path;
        }

        return value || path;
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <LanguageContext.Provider
            value={{
                currentLanguage,
                changeLanguage,
                t,
                loading,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};
