import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS } from '../utils/constants';
import { useLanguage } from '../contexts/LanguageContext';
import CTAButton from './CTAButton';
import ProgressBar from './ProgressBar';
import { supabase } from '../supabase/client';

const Departments = ({ limit = null, showCTA = true }) => {
    const { currentLanguage } = useLanguage();
    const [deptStats, setDeptStats] = useState({});

    const departments = limit ? DEPARTMENTS.slice(0, limit) : DEPARTMENTS;

    // Hardcoded goals for demo purposes
    const goals = {
        'education-aid': 10000,
        'healthcare-support': 15000,
        'emergency-relief': 20000,
        'orphan-care': 12000,
        'food-assistance': 8000,
        'clean-water': 5000,
        'widows-support': 7000,
        'infrastructure': 25000
    };

    useEffect(() => {
        fetchDepartmentStats();
    }, []);

    const fetchDepartmentStats = async () => {
        const { data, error } = await supabase
            .from('donations')
            .select('department, amount')
            .neq('status', 'failed')
            .neq('status', 'cancelled');

        if (data) {
            const stats = data.reduce((acc, curr) => {
                const dept = curr.department;
                if (!acc[dept]) acc[dept] = 0;
                acc[dept] += curr.amount;
                return acc;
            }, {});
            setDeptStats(stats);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => {
                const currentAmount = deptStats[dept.id] || 0;
                const goalAmount = goals[dept.id] || 10000;

                return (
                    <div
                        key={dept.id}
                        className="bg-white rounded-lg p-6 shadow-md card-hover border-t-4 border-primary flex flex-col h-full"
                    >
                        {/* Icon */}
                        <div className="text-5xl mb-4">{dept.icon}</div>

                        {/* Department Name */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {dept.name[currentLanguage] || dept.name.en}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 flex-grow">
                            {dept.description[currentLanguage] || dept.description.en}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <ProgressBar
                                current={currentAmount}
                                goal={goalAmount}
                                label="Raised"
                            />
                        </div>

                        {/* CTA */}
                        {showCTA && (
                            <CTAButton
                                to={`/donate?department=${dept.id}`}
                                variant="outline"
                                size="sm"
                                fullWidth
                            >
                                Donate Now
                            </CTAButton>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Departments;
