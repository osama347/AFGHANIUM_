import React from 'react';
import Departments from '../components/Departments';
import SectionTitle from '../components/SectionTitle';
import Hero from '../components/Hero';
import { useLanguage } from '../contexts/LanguageContext';

const DepartmentsPage = () => {
    const { t } = useLanguage();

    return (
        <div>
            <Hero
                title={t('departments.title')}
                subtitle={t('departments.subtitle')}
                backgroundImage="/Deparments.jpg"
            />

            <section className="section-padding bg-white">
                <div className="container-custom">
                    <Departments showCTA={true} />
                </div>
            </section>
        </div>
    );
};

export default DepartmentsPage;
