import { useState, useEffect } from 'react';
import {
    adminLogin,
    checkAdminAuth,
    adminLogout,
    getCurrentAdmin,
    onAuthStateChange,
} from '../supabase/admin.js';

/**
 * Custom hook for admin authentication
 */
export const useAdminAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let mounted = true;

        // Check initial auth state
        checkInitialAuth();

        // Listen to auth changes
        const cleanupSubscription = onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user || null);
                setIsAuthenticated(!!session);

                // Keep initial loading controlled by checkInitialAuth to avoid
                // redirect races on INITIAL_SESSION during page refresh/navigation.
                if (_event !== 'INITIAL_SESSION') {
                    setLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            if (typeof cleanupSubscription === 'function') {
                cleanupSubscription();
            }
        };
    }, []);

    const checkInitialAuth = async () => {
        try {
            setLoading(true);
            const result = await checkAdminAuth();

            if (result.success) {
                setIsAuthenticated(result.isAuthenticated);
                setUser(result.user);
            } else {
                setIsAuthenticated(false);
                setUser(null);
                if (result.error) {
                    setError(result.error);
                }
            }
        } catch (err) {
            console.error('Check initial auth failed:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        const result = await adminLogin(email, password);

        if (result.success) {
            const authUser = result.data?.user || null;
            const hasSession = Boolean(result.data?.session);
            setUser(authUser);
            setIsAuthenticated(Boolean(authUser) || hasSession);
        } else {
            setError(result.error);
        }

        setLoading(false);
        return result;
    };

    const logout = async () => {
        setLoading(true);
        setError(null);

        const result = await adminLogout();

        if (result.success) {
            setUser(null);
            setIsAuthenticated(false);
        } else {
            setError(result.error);
        }

        setLoading(false);
        return result;
    };

    const refreshUser = async () => {
        const result = await getCurrentAdmin();

        if (result.success) {
            setUser(result.user);
        }

        return result;
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        refreshUser,
    };
};
