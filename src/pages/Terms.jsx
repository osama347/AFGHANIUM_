import React from 'react';
import Hero from '../components/Hero';

const Terms = () => {
    return (
        <div>
            <Hero title="Terms & Conditions" subtitle="Please read these terms carefully" />

            <section className="section-padding bg-white">
                <div className="container-custom max-w-4xl prose prose-lg">
                    <h2>Terms and Conditions</h2>
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    <p>By using AFGHANIUM's services, you agree to these terms and conditions.</p>

                    <h3>Donations</h3>
                    <p>All donations are final and non-refundable unless required by law.</p>

                    <h3>Use of Funds</h3>
                    <p>We commit to using donations transparently and in accordance with our stated mission.</p>

                    <h3>Liability</h3>
                    <p>AFGHANIUM is not liable for any indirect or consequential damages arising from the use of our services.</p>
                </div>
            </section>
        </div>
    );
};

export default Terms;
