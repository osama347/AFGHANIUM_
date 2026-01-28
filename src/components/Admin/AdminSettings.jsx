import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { Lock, Mail, Save, UserPlus, Users, BookOpen } from 'lucide-react';
import Loader from '../Loader';
import { getContent, updateContent } from '../../supabase/content';

const AdminSettings = () => {
    const [passwordForm, setPasswordForm] = useState({
        password: '',
        confirmPassword: ''
    });
    const [adminForm, setAdminForm] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [aboutUsForm, setAboutUsForm] = useState({
        longVersion: '',
        shortVersion: ''
    });
    const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: null, success: false });
    const [adminStatus, setAdminStatus] = useState({ loading: false, error: null, success: false });
    const [aboutUsStatus, setAboutUsStatus] = useState({ loading: false, error: null, success: false });
    const [loadingAboutUs, setLoadingAboutUs] = useState(true);

    useEffect(() => {
        fetchAboutUsContent();
    }, []);

    const fetchAboutUsContent = async () => {
        setLoadingAboutUs(true);
        try {
            const longResult = await getContent('about_us_long');
            const shortResult = await getContent('about_us_short');
            
            setAboutUsForm({
                longVersion: longResult.data || '',
                shortVersion: shortResult.data || ''
            });
        } catch (error) {
            console.error('Error fetching About Us content:', error);
        } finally {
            setLoadingAboutUs(false);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleAdminChange = (e) => {
        setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordStatus({ loading: true, error: null, success: false });

        if (passwordForm.password !== passwordForm.confirmPassword) {
            setPasswordStatus({ loading: false, error: "Passwords don't match", success: false });
            return;
        }

        if (passwordForm.password.length < 6) {
            setPasswordStatus({ loading: false, error: "Password must be at least 6 characters", success: false });
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordForm.password
            });

            if (error) throw error;

            setPasswordStatus({ loading: false, error: null, success: true });
            setPasswordForm({ password: '', confirmPassword: '' });
        } catch (error) {
            setPasswordStatus({ loading: false, error: error.message, success: false });
        }
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        setAdminStatus({ loading: true, error: null, success: false });

        if (adminForm.password !== adminForm.confirmPassword) {
            setAdminStatus({ loading: false, error: "Passwords don't match", success: false });
            return;
        }

        if (adminForm.password.length < 6) {
            setAdminStatus({ loading: false, error: "Password must be at least 6 characters", success: false });
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: adminForm.email,
                password: adminForm.password,
            });

            if (error) throw error;

            setAdminStatus({ loading: false, error: null, success: true });
            setAdminForm({ email: '', password: '', confirmPassword: '' });
        } catch (error) {
            setAdminStatus({ loading: false, error: error.message, success: false });
        }
    };

    const handleAboutUsChange = (e) => {
        const { name, value } = e.target;
        setAboutUsForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAboutUsSubmit = async (e) => {
        e.preventDefault();
        setAboutUsStatus({ loading: true, error: null, success: false });

        try {
            const longResult = await updateContent('about_us_long', aboutUsForm.longVersion);
            const shortResult = await updateContent('about_us_short', aboutUsForm.shortVersion);

            if (!longResult.success || !shortResult.success) {
                throw new Error('Failed to update About Us content');
            }

            setAboutUsStatus({ loading: false, error: null, success: true });
            setTimeout(() => {
                setAboutUsStatus({ loading: false, error: null, success: false });
            }, 3000);
        } catch (error) {
            setAboutUsStatus({ loading: false, error: error.message, success: false });
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Settings</h2>

            <div className="space-y-8">
                {/* About Us Content Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        About Us Content
                    </h3>

                    {loadingAboutUs ? (
                        <div className="flex justify-center py-8">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            {aboutUsStatus.success && (
                                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                                    About Us content updated successfully!
                                </div>
                            )}

                            {aboutUsStatus.error && (
                                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                                    Error: {aboutUsStatus.error}
                                </div>
                            )}

                            <form onSubmit={handleAboutUsSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Long Version (About Page)
                                    </label>
                                    <textarea
                                        name="longVersion"
                                        value={aboutUsForm.longVersion}
                                        onChange={handleAboutUsChange}
                                        className="input-field h-64 resize-none"
                                        placeholder="Enter the full About Us text for the About page..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This content appears on the full About Us page
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Short Version (Homepage)
                                    </label>
                                    <textarea
                                        name="shortVersion"
                                        value={aboutUsForm.shortVersion}
                                        onChange={handleAboutUsChange}
                                        className="input-field h-40 resize-none"
                                        placeholder="Enter the short About Us text for the homepage..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This content appears on the homepage
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={aboutUsStatus.loading}
                                    className="btn-primary"
                                >
                                    {aboutUsStatus.loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader size="sm" color="white" /> Saving...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Save className="w-4 h-4" /> Save About Us Content
                                        </span>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {/* Change Password Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        Change Password
                    </h3>

                    {passwordStatus.success && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                            Password updated successfully!
                        </div>
                    )}

                    {passwordStatus.error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                            Error: {passwordStatus.error}
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">New Password</label>
                            <input
                                type="password"
                                name="password"
                                value={passwordForm.password}
                                onChange={handlePasswordChange}
                                className="input-field"
                                required
                                minLength="6"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                className="input-field"
                                required
                                minLength="6"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={passwordStatus.loading}
                            className="btn-primary"
                        >
                            {passwordStatus.loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader size="sm" color="white" /> Updating...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Save className="w-4 h-4" /> Update Password
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Add New Admin Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Add New Admin
                    </h3>

                    <p className="text-gray-600 mb-6">
                        Create a new admin account. The new admin will receive an email to confirm their account.
                    </p>

                    {adminStatus.success && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                            Admin account created successfully! They will receive a confirmation email.
                        </div>
                    )}

                    {adminStatus.error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                            Error: {adminStatus.error}
                        </div>
                    )}

                    <form onSubmit={handleAdminSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={adminForm.email}
                                    onChange={handleAdminChange}
                                    className="input-field pl-10"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={adminForm.password}
                                    onChange={handleAdminChange}
                                    className="input-field pl-10"
                                    required
                                    minLength="6"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={adminForm.confirmPassword}
                                    onChange={handleAdminChange}
                                    className="input-field pl-10"
                                    required
                                    minLength="6"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={adminStatus.loading}
                            className="btn-primary"
                        >
                            {adminStatus.loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader size="sm" color="white" /> Creating Admin...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <UserPlus className="w-4 h-4" /> Create Admin Account
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
