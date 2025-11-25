import React, { useState } from 'react';
import { supabase } from '../../supabase/client';
import { Lock, Mail, Save } from 'lucide-react';
import Loader from '../Loader';

const AdminSettings = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ loading: false, error: null, success: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: false });

        if (formData.password !== formData.confirmPassword) {
            setStatus({ loading: false, error: "Passwords don't match", success: false });
            return;
        }

        if (formData.password.length < 6) {
            setStatus({ loading: false, error: "Password must be at least 6 characters", success: false });
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: formData.password
            });

            if (error) throw error;

            setStatus({ loading: false, error: null, success: true });
            setFormData({ password: '', confirmPassword: '' });
        } catch (error) {
            setStatus({ loading: false, error: error.message, success: false });
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Settings</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Change Password
                </h3>

                {status.success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                        Password updated successfully!
                    </div>
                )}

                {status.error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                        Error: {status.error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
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
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input-field"
                            required
                            minLength="6"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status.loading}
                        className="btn-primary"
                    >
                        {status.loading ? (
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
        </div>
    );
};

export default AdminSettings;
