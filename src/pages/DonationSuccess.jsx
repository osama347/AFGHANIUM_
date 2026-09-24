import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import CTAButton from '../components/CTAButton';
import { updateDonationTransactionReference } from '../supabase/donations';
import { useToast } from '../contexts/ToastContext';

const DonationSuccess = () => {
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const donationId = searchParams.get('id');
    const amount = searchParams.get('amount');
    const paymentMethod = searchParams.get('method');

    const [transactionReference, setTransactionReference] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmitReference = async (e) => {
        e.preventDefault();
        if (!transactionReference.trim()) {
            toast.error('Please enter your transaction reference number');
            return;
        }

        setIsSubmitting(true);
        const result = await updateDonationTransactionReference(donationId, transactionReference.trim());
        setIsSubmitting(false);

        if (result.success) {
            setIsSubmitted(true);
            toast.success('Transaction reference submitted successfully! Your donation will be verified by our admin team.');
        } else {
            toast.error('Failed to submit transaction reference. Please try again.');
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-2xl border border-border p-6 md:p-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CheckCircle className="h-7 w-7" />
                </div>

                <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Donation information submitted
                </h1>

                <p className="mt-3 text-lg text-muted-foreground">
                    Thank you for your generous donation. Please provide your transaction reference number below so we can verify your payment.
                </p>

                {/* Donation Details */}
                <div className="mt-8 grid grid-cols-1 divide-y divide-border border border-border text-left sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                    {donationId && (
                        <div className="p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Donation ID</p>
                            <p className="mt-1 text-lg font-semibold text-foreground">{donationId}</p>
                        </div>
                    )}
                    {amount && (
                        <div className="p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Amount</p>
                            <p className="mt-1 text-lg font-semibold text-primary">${amount}</p>
                        </div>
                    )}
                    {paymentMethod && (
                        <div className="p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Payment method</p>
                            <p className="mt-1 text-lg font-semibold capitalize text-foreground">{paymentMethod.replace('_', ' ')}</p>
                        </div>
                    )}
                </div>

                {/* Transaction Reference Form */}
                {!isSubmitted ? (
                    <div className="mt-8 border-l-2 border-amber-400 bg-amber-50 p-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                            <div>
                                <h3 className="font-semibold text-amber-900">Submit transaction reference</h3>
                                <p className="mt-1 text-sm text-amber-800">
                                    After sending your donation via {paymentMethod?.replace('_', ' ')}, please enter the transaction reference number below.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitReference} className="mt-5 space-y-3 text-left">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Transaction reference number *
                                </label>
                                <input
                                    type="text"
                                    value={transactionReference}
                                    onChange={(e) => setTransactionReference(e.target.value)}
                                    className="input-field"
                                    placeholder={`Enter your ${paymentMethod?.replace('_', ' ')} reference number`}
                                    required
                                />
                                <p className="mt-1 text-xs text-muted-foreground">
                                    This is usually found on your receipt or transaction confirmation
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit transaction reference'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="mt-8 border-l-2 border-primary bg-primary/5 p-6 text-left">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-foreground">Transaction reference submitted</h3>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Thank you! Your transaction reference has been recorded. Our admin team will verify your donation and update the status within 1-3 business days.
                        </p>
                    </div>
                )}

                {/* Important Notes */}
                <div className="mt-8 border border-border p-6 text-left">
                    <h3 className="font-semibold text-foreground">Important notes</h3>
                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                        <li>Submit your transaction reference number above for verification</li>
                        <li>Your donation will be confirmed once verified by our admin team</li>
                        <li>Processing may take 1-3 business days</li>
                        <li>You'll receive email confirmation once approved</li>
                        <li>Track your donation status using the button below</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <CTAButton
                        to={`/track?id=${donationId}`}
                        variant="primary"
                        size="lg"
                        fullWidth
                    >
                        Track your donation <ArrowRight className="ml-2 inline h-4 w-4" />
                    </CTAButton>
                    <CTAButton
                        to="/"
                        variant="outline"
                        size="lg"
                        fullWidth
                    >
                        Return to home
                    </CTAButton>
                </div>
            </div>
        </div>
    );
};

export default DonationSuccess;
