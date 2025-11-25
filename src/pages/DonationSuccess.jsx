import React, { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { generateCertificate } from '../utils/certificateGenerator';
import { CheckCircle, Twitter, Facebook, Share2, ArrowRight, Download } from 'lucide-react';
import CTAButton from '../components/CTAButton';
import { useToast } from '../contexts/ToastContext';

const DonationSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const donationId = searchParams.get('id');
    const amount = searchParams.get('amount');
    const { toast } = useToast();

    useEffect(() => {
        // Trigger confetti animation
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            confetti({
                particleCount: 3,
                angle: randomInRange(55, 125),
                spread: randomInRange(50, 70),
                origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
                colors: ['#3A9D58', '#F4B223', '#1F5130'],
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const shareUrl = `${window.location.origin}/track?id=${donationId}`;
    const shareText = `I just donated ${amount ? `$${amount}` : ''} to AFGHANIUM! Help make a difference in Afghanistan.`;

    const handleShare = (platform) => {
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        };

        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
    };

    const handleDownloadCertificate = () => {
        generateCertificate({
            full_name: 'Valued Donor', // In a real app, fetch this or pass via state
            amount: parseFloat(amount),
            donation_id: donationId,
            created_at: new Date().toISOString(),
            department: 'Humanitarian Aid'
        });
        toast.success('Certificate downloaded!');
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
                    Thank You! 🎉
                </h1>

                <p className="text-xl text-gray-600 mb-8">
                    Your generous donation has been received successfully!
                </p>

                {/* Donation Details */}
                <div className="bg-green-50 rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
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
                    </div>
                </div>

                {/* Impact Message */}
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                    <p className="text-gray-700 leading-relaxed">
                        Your contribution will help provide essential support to vulnerable communities in Afghanistan.
                        We'll keep you updated on the impact of your donation through our tracking system.
                    </p>
                </div>

                {/* Social Sharing */}
                <div className="mb-8">
                    <p className="text-gray-600 mb-4">Share your contribution and inspire others:</p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => handleShare('twitter')}
                            className="bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-full transition-colors"
                            aria-label="Share on Twitter"
                        >
                            <Twitter className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => handleShare('facebook')}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
                            aria-label="Share on Facebook"
                        >
                            <Facebook className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
                            aria-label="Copy link"
                        >
                            <Share2 className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <CTAButton
                        onClick={handleDownloadCertificate}
                        variant="outline"
                        size="lg"
                        className="border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-white"
                    >
                        <Download className="w-5 h-5 mr-2 inline" /> Download Certificate
                    </CTAButton>

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
