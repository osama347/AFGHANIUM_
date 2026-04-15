import { supabase, TABLES } from './client';

export const getActiveProducts = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLES.PRODUCTS)
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Error fetching active products:', error);
        return { success: false, error: error.message };
    }
};

export const getAllProducts = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLES.PRODUCTS)
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Error fetching all products:', error);
        return { success: false, error: error.message };
    }
};

export const createProduct = async (payload) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.PRODUCTS)
            .insert([payload])
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: error.message };
    }
};

export const updateProduct = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.PRODUCTS)
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: error.message };
    }
};

export const toggleProductStatus = async (id, isActive) => {
    return updateProduct(id, { is_active: isActive });
};

export const deleteProduct = async (id) => {
    try {
        const { error } = await supabase
            .from(TABLES.PRODUCTS)
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: error.message };
    }
};
