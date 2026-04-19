import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle, Clock, XCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { useDonation } from '../hooks/useDonation';
import { useImpact } from '../hooks/useImpact';
import { formatCurrency, formatDateTime, formatDonationId } from '../utils/formatters';
import { validateDonationId } from '../utils/validators';
import { PAYMENT_METHODS, CRYPTO_CURRENCIES } from '../utils/constants';
import Loader from '../components/Loader';
import ImpactCard from '../components/ImpactCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';

const TrackDonation = () => {
    const [searchParams] = useSearchParams();
    const { getById, getByName, loading: donationLoading } = useDonation();
    const { getByDonation } = useImpact();

    const [searchType, setSearchType] = useState('id');
    const [searchValue, setSearchValue] = useState(searchParams.get('id') || '');
    const [donation, setDonation] = useState(null);
    const [impacts, setImpacts] = useState([]);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    async function handleSearch(overrideValue) {
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
    }

    // Auto-search if ID is present in URL
    React.useEffect(() => {
        const id = searchParams.get('id');
        if (id && !searched) {
            setSearchValue(id);
            handleSearch(id);
        }
    }, [searchParams]);

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
        <div className="bg-background text-foreground">
            <section className="section-padding border-b border-border/60 bg-gradient-to-b from-background via-primary/5 to-background">
                <div className="container-custom">
                    <div className="mx-auto max-w-4xl text-center">
                        <Badge variant="secondary" className="mb-5 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.24em]">
                            Donation tracking
                        </Badge>
                        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Track your donation.
                            <span className="block text-primary">See the result clearly.</span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            Search by donation ID or donor name to view status, payment instructions, and published impact proofs connected to your contribution.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {[
                                'Fast lookup',
                                'Payment guidance',
                                'Impact proofs',
                            ].map((item) => (
                                <div key={item} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow-sm">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-muted/20">
                <div className="container-custom">
                    <div className="mx-auto max-w-3xl">
                        <Card className="overflow-hidden border-border/70 shadow-xl">
                            <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                    Search panel
                                </CardDescription>
                                <CardTitle className="text-2xl">Look up a donation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6 sm:p-8">
                                <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
                                    <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0">
                                        <TabsTrigger value="id" className="rounded-xl border border-border py-2 data-[state=active]:border-primary/40">
                                            Search by ID
                                        </TabsTrigger>
                                        <TabsTrigger value="name" className="rounded-xl border border-border py-2 data-[state=active]:border-primary/40">
                                            Search by name
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                        <div className="relative flex-1">
                                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={searchValue}
                                                onChange={(e) => setSearchValue(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                                className="input-field h-12 pl-10"
                                                placeholder={
                                                    searchType === 'id'
                                                        ? 'Enter Donation ID (e.g., AFG-123456)'
                                                        : 'Enter full name'
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => handleSearch()}
                                            disabled={donationLoading}
                                            className="h-12 rounded-xl px-6"
                                        >
                                            {donationLoading ? <Loader size="sm" color="white" /> : <Search className="h-4 w-4" />}
                                            Track
                                        </Button>
                                    </div>
                                </Tabs>

                                {error && (
                                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Donation Details */}
            {donation && (
                <section className="section-padding bg-background">
                    <div className="container-custom">
                        <div className="mx-auto max-w-5xl space-y-6">
                            <Card className="overflow-hidden border-border/70 shadow-xl">
                                <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                                Donation details
                                            </CardDescription>
                                            <CardTitle className="mt-2 text-3xl">{formatDonationId(donation.donation_id)}</CardTitle>
                                        </div>
                                        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-sm">
                                            {getStatusIcon(donation.status)}
                                            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(donation.status)}`}>
                                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6 p-6 sm:p-8">
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {[
                                            { label: 'Amount', value: formatCurrency(donation.amount) },
                                            { label: 'Donor name', value: donation.full_name },
                                            { label: 'Email', value: donation.email },
                                            { label: 'Payment method', value: donation.payment_method.replace('_', ' ').toUpperCase() },
                                            { label: 'Date', value: formatDateTime(donation.created_at) },
                                        ].map((item) => (
                                            <div key={item.label} className="rounded-2xl border border-border bg-muted/30 p-4">
                                                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{item.label}</div>
                                                <div className="mt-2 break-words text-base font-semibold text-foreground">{item.value}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {donation.message && (
                                        <div className="rounded-2xl border border-border bg-background p-5">
                                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Message</div>
                                            <div className="mt-2 text-base italic leading-7 text-foreground">"{donation.message}"</div>
                                        </div>
                                    )}

                                    {renderPaymentInstructions()}
                                </CardContent>
                            </Card>

                            {impacts.length > 0 && (
                                <Card className="border-border/70 shadow-xl">
                                    <CardHeader className="border-b border-border/60 bg-gradient-to-br from-primary/10 to-primary/5">
                                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                                            Impact proofs
                                        </CardDescription>
                                        <CardTitle className="text-2xl">Your impact</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 sm:p-8">
                                        <div className="grid gap-6 md:grid-cols-2">
                                            {impacts.map((impact) => (
                                                <ImpactCard key={impact.id} impact={impact} />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {impacts.length === 0 && donation.status === 'completed' && (
                                <Card className="border-border/70 shadow-xl">
                                    <CardContent className="p-8 text-center">
                                        <p className="text-muted-foreground">
                                            Impact proofs will be added soon. Thank you for your patience!
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {searched && !donation && !donationLoading && !error && (
                <section className="section-padding bg-background">
                    <div className="container-custom">
                        <Card className="mx-auto max-w-3xl border-border/70 shadow-xl">
                            <CardContent className="p-10 text-center">
                                <p className="text-lg text-muted-foreground">No donation found. Please check your search criteria.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            )}
        </div>
    );
};

export default TrackDonation;
