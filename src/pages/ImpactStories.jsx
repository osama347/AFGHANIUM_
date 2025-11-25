import React, { useEffect, useState } from 'react';
import { useImpact } from '../hooks/useImpact';
import { DEPARTMENTS } from '../utils/constants';
import Hero from '../components/Hero';
import ImpactCard from '../components/ImpactCard';
import Loader from '../components/Loader';
import SectionTitle from '../components/SectionTitle';

import { useLanguage } from '../contexts/LanguageContext';

const ImpactStories = () => {
    const { t } = useLanguage();
    const { getAll, loading } = useImpact();
    const [impacts, setImpacts] = useState([]);
    const [filteredImpacts, setFilteredImpacts] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    useEffect(() => {
        fetchImpacts();
    }, []);

    useEffect(() => {
        if (selectedDepartment === 'all') {
            setFilteredImpacts(impacts);
        } else {
            setFilteredImpacts(impacts.filter((impact) => impact.department === selectedDepartment));
        }
    }, [selectedDepartment, impacts]);

    const fetchImpacts = async () => {
        const result = await getAll();
        if (result.success) {
            setImpacts(result.data);
            setFilteredImpacts(result.data);
        }
    };

    return (
        <div>
            <Hero
                title={t('impact.title')}
                subtitle={t('impact.subtitle')}
                backgroundImage="/Impect-Stories.jpg"
            />

            <section className="section-padding bg-white">
                <div className="container-custom">
                    <SectionTitle
                        title="Transforming Lives, One Donation at a Time"
                        subtitle="Every contribution creates real, measurable impact"
                    />

                    {/* Department Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <button
                            onClick={() => setSelectedDepartment('all')}
                            className={`px-6 py-2 rounded-full font-medium transition-colors ${selectedDepartment === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Departments
                        </button>
                        {DEPARTMENTS.map((dept) => (
                            <button
                                key={dept.id}
                                onClick={() => setSelectedDepartment(dept.id)}
                                className={`px-6 py-2 rounded-full font-medium transition-colors ${selectedDepartment === dept.id
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {dept.icon} {dept.name.en}
                            </button>
                        ))}
                    </div>

                    {/* Impact Stories Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader size="lg" />
                        </div>
                    ) : filteredImpacts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredImpacts.map((impact) => (
                                <ImpactCard key={impact.id} impact={impact} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-lg">
                                {selectedDepartment === 'all'
                                    ? 'No impact stories available yet. Check back soon!'
                                    : 'No impact stories for this department yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ImpactStories;
