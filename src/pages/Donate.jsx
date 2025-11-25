import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DEPARTMENTS, PRESET_AMOUNTS, PAYMENT_METHODS, CRYPTO_CURRENCIES } from '../utils/constants';
import { validateDonationForm } from '../utils/validators';
import { useDonation } from '../hooks/useDonation';
import { useEmergencyCampaign } from '../hooks/useEmergencyCampaign';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../utils/formatters';
import Hero from '../components/Hero';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { CreditCard, Smartphone, Bitcoin, Building2, AlertTriangle } from 'lucide-react';

const Donate = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t, currentLanguage } = useLanguage();
    const { create, loading } = useDonation();
    const { getById } = useEmergencyCampaign();

    const emergencyId = searchParams.get('emergency');
    const [emergencyCampaign, setEmergencyCampaign] = useState(null);
    const [fetchingCampaign, setFetchingCampaign] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        amount: searchParams.get('amount') || '',
        department: searchParams.get('department') || emergencyId || '',
        paymentMethod: '',
        message: '',
    });

    const [errors, setErrors] = useState({});
    const [showCryptoModal, setShowCryptoModal] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);

    useEffect(() => {
        if (emergencyId) {
            fetchEmergencyCampaign();
        }
    }, [emergencyId]);

    const fetchEmergencyCampaign = async () => {
        setFetchingCampaign(true);
        const result = await getById(emergencyId);
        if (result.success) {
            setEmergencyCampaign(result.data);
            // Ensure department is set to campaign ID
            setFormData(prev => ({ ...prev, department: emergencyId }));
        }
        setFetchingCampaign(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handlePresetAmount = (amount) => {
        setFormData((prev) => ({ ...prev, amount: amount.toString() }));
        setErrors((prev) => ({ ...prev, amount: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validation = validateDonationForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Create donation in Supabase
        const result = await create({
            ...formData,
            amount: parseFloat(formData.amount),
        });

        if (result.success) {
            // Redirect to tracking page for all payment methods
            navigate(`/track?id=${result.donationId}`);
        }
    };

    const paymentMethodOptions = [
        {
            value: PAYMENT_METHODS.STRIPE,
            label: 'Credit/Debit Card',
            icon: CreditCard,
            description: 'Visa, Mastercard',
        },
        {
            value: PAYMENT_METHODS.PAYPAL,
            label: 'PayPal',
            icon: Smartphone,
            description: 'PayPal Checkout',
        },
        {
            value: PAYMENT_METHODS.CRYPTO,
            label: 'Cryptocurrency',
            icon: Bitcoin,
            description: 'BTC, ETH, USDT, USDC',
        },
        {
            value: PAYMENT_METHODS.BANK_TRANSFER,
            label: 'Bank Transfer',
            icon: Building2,
            description: 'Wire Transfer',
        },
    ];

    return (
        <div>
            <Hero
                title={emergencyCampaign ? (emergencyCampaign[`name_${currentLanguage}`] || emergencyCampaign.name_en) : t('donation.form.title')}
                subtitle={emergencyCampaign ? "You are donating to a specific emergency relief campaign." : "Your contribution makes a real difference in the lives of those who need it most"}
                backgroundImage="/Donation.png"
            />

            <section className="section-padding bg-gray-50">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        {fetchingCampaign ? (
                            <div className="flex justify-center py-12">
                                <Loader size="lg" />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
                                {/* Emergency Campaign Banner */}
                                {emergencyCampaign && (
                                    <div className="mb-8 bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
                                        <div className="flex items-start gap-4">
                                            <div className="text-4xl">{emergencyCampaign.icon}</div>
                                            <div>
                                                <h3 className="text-xl font-bold text-red-800 mb-2">
                                                    Donating to: {emergencyCampaign[`name_${currentLanguage}`] || emergencyCampaign.name_en}
                                                </h3>
                                                <p className="text-red-700">
                                                    {emergencyCampaign[`description_${currentLanguage}`] || emergencyCampaign.description_en}
                                                </p>
                                                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    100% of this donation goes directly to this emergency cause.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Personal Information */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                {t('donation.form.fullName')} *
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                                                placeholder={t('donation.form.fullName')}
                                            />
                                            {errors.fullName && (
                                                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">
                                                {t('donation.form.email')} *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                                                placeholder={t('donation.form.email')}
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Donation Details */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Donation Details</h3>

                                    {/* Preset Amounts */}
                                    <div className="mb-6">
                                        <label className="block text-gray-700 font-medium mb-3">
                                            Select Amount or Enter Custom
                                        </label>
                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                                            {(emergencyCampaign?.quick_amounts || PRESET_AMOUNTS).map((amount) => (
                                                <button
                                                    key={amount}
                                                    type="button"
                                                    onClick={() => handlePresetAmount(amount)}
                                                    className={`py-3 px-4 rounded-lg font-semibold transition-colors ${formData.amount === amount.toString()
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    ${amount}
                                                </button>
                                            ))}
                                        </div>

                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
                                            placeholder={t('donation.form.customAmount')}
                                            min="5"
                                            step="0.01"
                                        />
                                        {errors.amount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                                        )}
                                    </div>

                                    {/* Department Selection - HIDDEN IF EMERGENCY */}
                                    {!emergencyCampaign && (
                                        <div className="mb-6">
                                            <label className="block text-gray-700 font-medium mb-2">
                                                {t('donation.form.department')} *
                                            </label>
                                            <select
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                className={`input-field ${errors.department ? 'border-red-500' : ''}`}
                                            >
                                                <option value="">Select a department...</option>
                                                {DEPARTMENTS.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.icon} {dept.name[currentLanguage] || dept.name.en}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.department && (
                                                <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Optional Message */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            {t('donation.form.message')}
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="input-field resize-none"
                                            rows="4"
                                            placeholder="Leave an optional message..."
                                        />
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Method *</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {paymentMethodOptions.map(({ value, label, icon: Icon, description }) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => {
                                                    setFormData((prev) => ({ ...prev, paymentMethod: value }));
                                                    setErrors((prev) => ({ ...prev, paymentMethod: '' }));
                                                }}
                                                className={`p-4 border-2 rounded-lg text-left transition-all ${formData.paymentMethod === value
                                                    ? 'border-primary bg-secondary-light'
                                                    : 'border-gray-300 hover:border-primary'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <Icon className={`w-8 h-8 ${formData.paymentMethod === value ? 'text-primary' : 'text-gray-500'}`} />
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{label}</div>
                                                        <div className="text-sm text-gray-500">{description}</div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.paymentMethod && (
                                        <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <Loader size="sm" color="white" />
                                            <span className="ml-2">{t('donation.form.processing')}</span>
                                        </span>
                                    ) : (
                                        t('donation.form.submit')
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Donate;
