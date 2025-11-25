import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle, Clock, XCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { useDonation } from '../hooks/useDonation';
import { useImpact } from '../hooks/useImpact';
import { formatCurrency, formatDateTime, formatDonationId } from '../utils/formatters';
import { validateDonationId } from '../utils/validators';
import { PAYMENT_METHODS, CRYPTO_CURRENCIES } from '../utils/constants';
import Hero from '../components/Hero';
import Loader from '../components/Loader';
import ImpactCard from '../components/ImpactCard';

const TrackDonation = () => {
    const [searchParams] = useSearchParams();
    const { getById, getByName, loading: donationLoading } = useDonation();
    const { getByDonation, loading: impactLoading } = useImpact();

    const [searchType, setSearchType] = useState('id');
    const [searchValue, setSearchValue] = useState(searchParams.get('id') || '');
    const [donation, setDonation] = useState(null);
    const [impacts, setImpacts] = useState([]);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    // Auto-search if ID is present in URL
    React.useEffect(() => {
        const id = searchParams.get('id');
        if (id && !searched) {
            setSearchValue(id);
            handleSearch(id);
        }
    }, [searchParams]);

    const handleSearch = async (overrideValue) => {
        const valueToSearch = overrideValue || searchValue;
        setError('');
        setDonation(null);
        setImpacts([]);

        if (!valueToSearch.trim()) {
            setError('Please enter a search value');
            return;
        }

        setSearched(true);

        if (searchType === 'id' || overrideValue) { // Default to ID search if override provided (from URL)
            if (!validateDonationId(valueToSearch)) {
                setError('Invalid donation ID format. Should be like AFG-XXXXXX');
                return;
            }

            const result = await getById(valueToSearch);
            if (result.success) {
                setDonation(result.data);

                // Fetch related impacts
                const impactResult = await getByDonation(valueToSearch);
                if (impactResult.success) {
                    setImpacts(impactResult.data);
                }
            } else {
                setError('Donation not found');
            }
        } else {
            const result = await getByName(valueToSearch);
            if (result.success && result.data.length > 0) {
                const foundDonation = result.data[0]; // Show first match
                setDonation(foundDonation);

                // Fetch impact proofs for this donation
                const impactResult = await getByDonation(foundDonation.donation_id);
                if (impactResult.success) {
                    setImpacts(impactResult.data);
                }
            } else {
                setError('No donations found with this name');
            }
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            case 'pending':
                return <Clock className="w-6 h-6 text-yellow-500" />;
            case 'failed':
                return <XCircle className="w-6 h-6 text-red-500" />;
            case 'cancelled':
                return <AlertCircle className="w-6 h-6 text-gray-500" />;
            default:
                return <Clock className="w-6 h-6 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderPaymentInstructions = () => {
        if (!donation || donation.status !== 'pending') return null;

        switch (donation.payment_method) {
            case PAYMENT_METHODS.BANK_TRANSFER:
                return (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                        <h3 className="text-lg font-bold text-blue-900 mb-4">Complete Your Bank Transfer</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="block text-blue-600 font-medium">Bank Name</span>
                                <span className="block text-gray-900 font-semibold">{import.meta.env.VITE_BANK_NAME || 'Afghan National Bank'}</span>
                            </div>
                            <div>
                                <span className="block text-blue-600 font-medium">Account Name</span>
                                <span className="block text-gray-900 font-semibold">{import.meta.env.VITE_BANK_ACCOUNT_NAME || 'Afghanium Charity'}</span>
                            </div>
                            <div>
                                <span className="block text-blue-600 font-medium">IBAN</span>
                                <div className="flex items-center gap-2">
                                    <span className="block text-gray-900 font-semibold">{import.meta.env.VITE_BANK_IBAN || 'AF00 0000 0000 0000 0000 0000'}</span>
                                    <Copy className="w-4 h-4 text-blue-400 cursor-pointer hover:text-blue-600" />
                                </div>
                            </div>
                            <div>
                                <span className="block text-blue-600 font-medium">SWIFT Code</span>
                                <span className="block text-gray-900 font-semibold">{import.meta.env.VITE_BANK_SWIFT || 'AFG123'}</span>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-white rounded border border-blue-100">
                            <p className="text-blue-800 text-sm">
                                <strong>Reference:</strong> Please use <span className="font-mono font-bold">{donation.donation_id}</span> as your payment reference.
                            </p>
                        </div>
                    </div>
                );

            case PAYMENT_METHODS.CRYPTO:
                return (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-6">
                        <h3 className="text-lg font-bold text-purple-900 mb-4">Complete Your Crypto Transfer</h3>
                        <div className="space-y-4">
                            {CRYPTO_CURRENCIES.map((crypto) => (
                                <div key={crypto.code} className="flex items-center justify-between p-3 bg-white rounded border border-purple-100">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{crypto.icon}</span>
                                        <span className="font-medium text-gray-900">{crypto.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                            {import.meta.env[`VITE_CRYPTO_WALLET_${crypto.code}`] || `0x...${crypto.code}`}
                                        </code>
                                        <Copy className="w-4 h-4 text-purple-400 cursor-pointer hover:text-purple-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-purple-700 mt-4">
                            After sending, please email us your transaction hash with your Donation ID: <strong>{donation.donation_id}</strong>
                        </p>
                    </div>
                );

            case PAYMENT_METHODS.PAYPAL:
                return (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mt-6 text-center">
                        <h3 className="text-lg font-bold text-indigo-900 mb-2">Pay with PayPal</h3>
                        <p className="text-indigo-700 mb-4">Click the button below to complete your secure donation.</p>
                        <a
                            href="https://www.paypal.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0070BA] text-white font-bold rounded-full hover:bg-[#003087] transition-colors"
                        >
                            Pay with PayPal <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                );

            case PAYMENT_METHODS.STRIPE:
                return (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6 text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Pay with Card</h3>
                        <p className="text-gray-600 mb-4">Complete your secure credit/debit card payment.</p>
                        <button
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Proceed to Checkout <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div>
            <Hero
                title="Track Your Donation"
                subtitle="See the journey and impact of your contribution"
                backgroundImage="/Track.jpg"
            />

            <section className="section-padding bg-gray-50">
                <div className="container-custom">
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            {/* Search Type Selector */}
                            <div className="flex space-x-4 mb-6">
                                <button
                                    onClick={() => setSearchType('id')}
                                    className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${searchType === 'id'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Search by Donation ID
                                </button>
                                <button
                                    onClick={() => setSearchType('name')}
                                    className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${searchType === 'name'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Search by Name
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="input-field flex-1"
                                    placeholder={
                                        searchType === 'id'
                                            ? 'Enter Donation ID (e.g., AFG-123456)'
                                            : 'Enter Full Name'
                                    }
                                />
                                <button
                                    onClick={() => handleSearch()}
                                    disabled={donationLoading}
                                    className="btn-primary px-8 disabled:opacity-50"
                                >
                                    {donationLoading ? (
                                        <Loader size="sm" color="white" />
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {error && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Donation Details */}
                    {donation && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Main Details Card */}
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900">Donation Details</h2>
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(donation.status)}
                                        <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(donation.status)}`}>
                                            {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Donation ID</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {formatDonationId(donation.donation_id)}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Amount</div>
                                        <div className="text-lg font-semibold text-primary">
                                            {formatCurrency(donation.amount)}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Donor Name</div>
                                        <div className="text-lg font-semibold text-gray-900">{donation.full_name}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Email</div>
                                        <div className="text-lg font-semibold text-gray-900">{donation.email}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Department</div>
                                        <div className="text-lg font-semibold text-gray-900">{donation.department}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Payment Method</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {donation.payment_method.replace('_', ' ').toUpperCase()}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Date</div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {formatDateTime(donation.created_at)}
                                        </div>
                                    </div>

                                    {donation.message && (
                                        <div className="md:col-span-2">
                                            <div className="text-sm text-gray-500 mb-1">Message</div>
                                            <div className="text-gray-700 italic">"{donation.message}"</div>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Instructions */}
                                {renderPaymentInstructions()}
                            </div>

                            {/* Impact Proofs */}
                            {impacts.length > 0 && (
                                <div className="bg-white rounded-lg shadow-lg p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Impact</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {impacts.map((impact) => (
                                            <ImpactCard key={impact.id} impact={impact} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {impacts.length === 0 && donation.status === 'completed' && (
                                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                                    <p className="text-gray-600">
                                        Impact proofs will be added soon. Thank you for your patience!
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {searched && !donation && !donationLoading && !error && (
                        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-12 text-center">
                            <p className="text-gray-600 text-lg">No donation found. Please check your search criteria.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default TrackDonation;
