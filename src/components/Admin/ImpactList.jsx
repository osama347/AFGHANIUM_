import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useImpact } from '../../hooks/useImpact';
import ImpactCard from '../ImpactCard';
import Loader from '../Loader';
import AddImpactForm from './AddImpactForm';
import { Heart } from 'lucide-react';

const ImpactList = () => {
    const { getAll, loading } = useImpact();
    const location = useLocation();
    const [impacts, setImpacts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchImpacts();

        // Check for query params to pre-fill form
        const searchParams = new URLSearchParams(location.search);
        const donationId = searchParams.get('donationId');

        if (donationId) {
            setInitialFormValues({
                donationId: donationId,
                department: searchParams.get('department') || '',
                // We can pre-fill title or description if needed, e.g.:
                title: `Impact for ${searchParams.get('donorName') || 'Donor'}`,
                description: `Impact proof for donation ${donationId} of amount $${searchParams.get('amount')}`,
            });
            setShowForm(true);
        }
    }, [location.search]);

    const fetchImpacts = async () => {
        const result = await getAll();
        if (result.success) {
            setImpacts(result.data);
        } else {
            setError(result.error);
        }
    };

    const handleImpactAdded = () => {
        setShowForm(false);
        setInitialFormValues(null);
        fetchImpacts();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Impact Proofs</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) setInitialFormValues(null);
                    }}
                    className="btn-primary"
                >
                    {showForm ? 'Cancel' : 'Add New Impact'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8">
                    <AddImpactForm
                        onSuccess={handleImpactAdded}
                        initialValues={initialFormValues}
                    />
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
                    Error loading impact stories: {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader size="lg" />
                </div>
            ) : impacts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No impact stories yet</h3>
                    <p className="text-gray-500 mt-1 mb-6">Share how donations are making a difference.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary"
                    >
                        Create First Impact Story
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {impacts.map((impact) => (
                        <ImpactCard key={impact.id} impact={impact} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImpactList;
