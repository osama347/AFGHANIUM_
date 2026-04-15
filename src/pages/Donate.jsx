import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PRESET_AMOUNTS, PAYMENT_METHODS, RECEIVER_INFO } from '../utils/constants';
import { validateDonationForm } from '../utils/validators';
import { useDonation } from '../hooks/useDonation';
import { useEmergencyCampaign } from '../hooks/useEmergencyCampaign';
import { useLanguage } from '../contexts/LanguageContext';
import Loader from '../components/Loader';
import { AlertTriangle, Building2, CheckCircle2, Landmark, Smartphone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/FormElements';

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
        paymentMethod: '',
        message: '',
    });

    const [errors, setErrors] = useState({});

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
            // Redirect to success page with donation details
            navigate(`/donation-success?id=${result.donationId}&amount=${formData.amount}&method=${formData.paymentMethod}`);
        } else {
            // Show error to user
            setErrors({ submit: result.error || 'Failed to submit donation. Please try again.' });
        }
    };

    const campaignName = emergencyCampaign
        ? (emergencyCampaign[`name_${currentLanguage}`] || emergencyCampaign.name_en)
        : t('donation.form.title');

    const campaignSubtitle = emergencyCampaign
        ? 'You are donating to a specific emergency relief campaign.'
        : 'Your contribution makes a real difference in the lives of those who need it most.';

    const paymentMethodOptions = [
        {
            value: PAYMENT_METHODS.HAWALA,
            label: 'Hawala Transfer',
            icon: Building2,
            description: 'Traditional money transfer',
        },
        {
            value: PAYMENT_METHODS.WESTERN_UNION,
            label: 'Western Union',
            icon: Smartphone,
            description: 'Global money transfer',
        },
        {
            value: PAYMENT_METHODS.BANK_TRANSFER,
            label: 'Bank Transfer',
            icon: Landmark,
            description: 'Wire Transfer',
        },
        {
            value: PAYMENT_METHODS.MONEYGRAM,
            label: 'MoneyGram',
            icon: Smartphone,
            description: 'International transfer',
        },
    ];

    const receiverInfo = formData.paymentMethod ? RECEIVER_INFO[formData.paymentMethod] : null;

    const quickAmounts = emergencyCampaign?.quick_amounts || PRESET_AMOUNTS;

    return (
        <div className="bg-background text-foreground">
            <section className="section-padding bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/60">
                <div className="container-custom space-y-8">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            Donate
                        </Badge>
                        <Badge variant="outline" className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            Direct and traceable impact
                        </Badge>
                    </div>

                    <div className="max-w-4xl space-y-4">
                        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            {campaignName}
                        </h1>
                        <p className="text-lg leading-8 text-muted-foreground sm:text-xl">
                            {campaignSubtitle}
                        </p>
                    </div>

                    {fetchingCampaign ? (
                        <Card className="rounded-[2rem] border-border/70 shadow-sm">
                            <CardContent className="flex justify-center py-14">
                                <Loader size="lg" />
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="rounded-[2rem] border-border/70 shadow-xl">
                            <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                    {t('donation.form.title')}
                                </CardDescription>
                                <CardTitle className="text-2xl sm:text-3xl">Secure donation details</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-8 p-6 sm:p-8">
                                {emergencyCampaign && (
                                    <Alert className="border-red-200 bg-red-50 text-red-800">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle className="flex items-center gap-2">
                                            <span className="text-xl leading-none">{emergencyCampaign.icon}</span>
                                            <span>
                                                Donating to {emergencyCampaign[`name_${currentLanguage}`] || emergencyCampaign.name_en}
                                            </span>
                                        </AlertTitle>
                                        <AlertDescription>
                                            <p className="mb-2">
                                                {emergencyCampaign[`description_${currentLanguage}`] || emergencyCampaign.description_en}
                                            </p>
                                            <p className="font-semibold">100% of this donation goes directly to this emergency cause.</p>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {errors.submit && (
                                    <Alert className="border-red-200 bg-red-50 text-red-800">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>{t('common.error')}</AlertTitle>
                                        <AlertDescription>{errors.submit}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold text-foreground">Personal information</h2>
                                        <div className="grid gap-5 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                                                    {t('donation.form.fullName')} *
                                                </label>
                                                <Input
                                                    id="fullName"
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder={t('donation.form.fullName')}
                                                    className={errors.fullName ? 'border-red-500' : ''}
                                                />
                                                {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                                    {t('donation.form.email')} *
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder={t('donation.form.email')}
                                                    className={errors.email ? 'border-red-500' : ''}
                                                />
                                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold text-foreground">Donation details</h2>

                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-foreground">
                                                Select amount or enter custom
                                            </label>
                                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                                                {quickAmounts.map((amount) => (
                                                    <Button
                                                        key={amount}
                                                        type="button"
                                                        variant={formData.amount === amount.toString() ? 'default' : 'outline'}
                                                        onClick={() => handlePresetAmount(amount)}
                                                        className="rounded-xl"
                                                    >
                                                        ${amount}
                                                    </Button>
                                                ))}
                                            </div>
                                            <Input
                                                type="number"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                placeholder={t('donation.form.customAmount')}
                                                className={errors.amount ? 'border-red-500' : ''}
                                                min="5"
                                                step="0.01"
                                            />
                                            {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-foreground">
                                                {t('donation.form.message')}
                                            </label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                className="resize-none"
                                                rows={4}
                                                placeholder="Leave an optional message..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold text-foreground">Payment method *</h2>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {paymentMethodOptions.map(({ value, label, icon: Icon, description }) => {
                                                const isSelected = formData.paymentMethod === value;
                                                return (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData((prev) => ({ ...prev, paymentMethod: value }));
                                                            setErrors((prev) => ({ ...prev, paymentMethod: '' }));
                                                        }}
                                                        className={`rounded-2xl border p-4 text-left transition-all ${isSelected
                                                            ? 'border-primary bg-primary/5 shadow-md'
                                                            : 'border-border bg-card hover:border-primary/60'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                                                                <Icon className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-foreground">{label}</p>
                                                                <p className="text-sm text-muted-foreground">{description}</p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.paymentMethod && <p className="text-sm text-red-600">{errors.paymentMethod}</p>}
                                    </div>

                                    {receiverInfo && (
                                        <Card className="border-blue-200 bg-blue-50/80">
                                            <CardHeader>
                                                <CardTitle className="text-xl text-blue-900">Receiver information</CardTitle>
                                                <CardDescription className="text-blue-700">
                                                    Use these exact details for the selected transfer method.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid gap-3 text-sm text-blue-900 sm:grid-cols-2">
                                                {Object.entries(receiverInfo).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className="font-semibold capitalize text-blue-800">
                                                            {key.replace(/_/g, ' ')}:
                                                        </span>
                                                        <span className="ml-2 break-all">{value}</span>
                                                    </div>
                                                ))}
                                                <div className="sm:col-span-2 rounded-xl border border-blue-200 bg-blue-100/80 p-3">
                                                    <p>
                                                        <strong>Important:</strong> Include your donation ID once generated on the success page so we can match your transfer quickly.
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        size="lg"
                                        className="w-full rounded-full text-base shadow-lg shadow-primary/20"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader size="sm" color="white" />
                                                <span>{t('donation.form.processing')}</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <CheckCircle2 className="h-5 w-5" />
                                                {t('donation.form.submit')}
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Donate;
