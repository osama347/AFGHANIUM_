import React from 'react';
import Hero from '../components/Hero';

const Privacy = () => {
    return (
        <div>
            <Hero title="Privacy Policy" subtitle="How we protect your data" />

            <section className="section-padding bg-white">
                <div className="container-custom max-w-4xl prose prose-lg">
                    <h2>Privacy Policy</h2>
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>At AFGHANIUM, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>

                    <h3>Information We Collect</h3>
                    <p>We collect information you provide when making donations, including name, email, and payment details.</p>

                    <h3>How We Use Your Information</h3>
                    <p>Your information is used solely to process donations and provide you with updates on the impact of your contributions.</p>

                    <h3>Data Security</h3>
                    <p>We employ industry-standard security measures to protect your personal information.</p>
                </div>
            </section>
        </div>
    );
};

export default Privacy;
