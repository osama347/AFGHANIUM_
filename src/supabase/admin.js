import { supabase } from './client';

/**
 * Admin login with email and password
 */
export const adminLogin = async (email, password) => {
    try {
        if (!supabase) {
            return {
                success: false,
                error: 'Supabase not configured. Please add credentials to .env file.',
            };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        return {
            success: true,
            data: data.user,
        };
    } catch (error) {
        console.error('Admin login error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Check if admin is authenticated
 */
export const checkAdminAuth = async () => {
    try {
        if (!supabase) {
            return {
                success: false,
                isAuthenticated: false,
                user: null,
            };
        }

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        return {
            success: true,
            isAuthenticated: !!session,
            user: session?.user || null,
        };
    } catch (error) {
        console.error('Check admin auth error:', error);
        return {
            success: false,
            isAuthenticated: false,
            user: null,
        };
    }
};

/**
 * Admin logout
 */
export const adminLogout = async () => {
    try {
        if (!supabase) {
            return { success: true };
        }

        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Admin logout error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Get current admin user
 */
export const getCurrentAdmin = async () => {
    try {
        if (!supabase) {
            return {
                success: false,
                user: null,
            };
        }

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) throw error;

        return {
            success: true,
            user,
        };
    } catch (error) {
        console.error('Get current admin error:', error);
        return {
            success: false,
            user: null,
        };
    }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
    if (!supabase) {
        console.warn('Supabase not configured. Auth state changes will not be tracked.');
        return () => { }; // Return empty cleanup function
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
            callback(event, session);
        }
    );

    return () => subscription.unsubscribe();
};
