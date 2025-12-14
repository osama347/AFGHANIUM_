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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-8">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 md:p-12 text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle className="w-16 h-16 text-white" />
                    </div>
                </div>

                {/* Thank You Message */}
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                    Donation Information Submitted! 📋
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                    Thank you for your generous donation. Please provide your transaction reference number below so we can verify your payment.
                </p>

                {/* Donation Details */}
                <div className="bg-green-50 rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                        {donationId && (
                            <div>
                                <p className="text-sm text-gray-600">Donation ID</p>
                                <p className="text-lg font-bold text-gray-900">{donationId}</p>
                            </div>
                        )}
                        {amount && (
                            <div>
                                <p className="text-sm text-gray-600">Amount</p>
                                <p className="text-lg font-bold text-primary">${amount}</p>
                            </div>
                        )}
                        {paymentMethod && (
                            <div>
                                <p className="text-sm text-gray-600">Payment Method</p>
                                <p className="text-lg font-bold text-gray-900 capitalize">{paymentMethod.replace('_', ' ')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Transaction Reference Form */}
                {!isSubmitted ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
                        <div className="flex items-start mb-4">
                            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-yellow-800 mb-2">Submit Transaction Reference</h3>
                                <p className="text-yellow-700 mb-4">
                                    After sending your donation via {paymentMethod?.replace('_', ' ')}, please enter the transaction reference number below.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitReference} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Transaction Reference Number *
                                </label>
                                <input
                                    type="text"
                                    value={transactionReference}
                                    onChange={(e) => setTransactionReference(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder={`Enter your ${paymentMethod?.replace('_', ' ')} reference number`}
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    This is usually found on your receipt or transaction confirmation
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Transaction Reference'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
                        <div className="flex items-center mb-2">
                            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                            <h3 className="text-xl font-bold text-green-800">Transaction Reference Submitted</h3>
                        </div>
                        <p className="text-green-700">
                            Thank you! Your transaction reference has been recorded. Our admin team will verify your donation and update the status within 1-3 business days.
                        </p>
                    </div>
                )}

                {/* Important Notes */}
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-bold text-blue-800 mb-3">Important Notes:</h3>
                    <ul className="text-blue-700 text-left space-y-2">
                        <li>• Submit your transaction reference number above for verification</li>
                        <li>• Your donation will be confirmed once verified by our admin team</li>
                        <li>• Processing may take 1-3 business days</li>
                        <li>• You'll receive email confirmation once approved</li>
                        <li>• Track your donation status using the button below</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <CTAButton
                        to={`/track?id=${donationId}`}
                        variant="primary"
                        size="lg"
                    >
                        Track Your Donation <ArrowRight className="w-5 h-5 ml-2 inline" />
                    </CTAButton>
                    <CTAButton
                        to="/"
                        variant="outline"
                        size="lg"
                    >
                        Return to Home
                    </CTAButton>
                </div>
            </div>
        </div>
    );
};

export default DonationSuccess;
