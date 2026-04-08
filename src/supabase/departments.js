import { supabase, TABLES } from './client';

/**
 * Get active departments for public forms and impact creation.
 */
export const getActiveDepartments = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLES.DEPARTMENTS)
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: true });

        if (error) throw error;

        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Error fetching active departments:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all departments for admin management.
 */
export const getAllDepartments = async () => {
    try {
        const { data, error } = await supabase
            .from(TABLES.DEPARTMENTS)
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: true });

        if (error) throw error;

        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Error fetching all departments:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create a department.
 */
export const createDepartment = async (departmentData) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.DEPARTMENTS)
            .insert([departmentData])
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error creating department:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update department by ID.
 */
export const updateDepartment = async (id, updates) => {
    try {
        const { data, error } = await supabase
            .from(TABLES.DEPARTMENTS)
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error updating department:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Toggle whether a department is available.
 */
export const toggleDepartmentStatus = async (id, isActive) => {
    return updateDepartment(id, { is_active: isActive });
};

/**
 * Delete a department.
 */
export const deleteDepartment = async (id) => {
    try {
        const { error } = await supabase
            .from(TABLES.DEPARTMENTS)
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error('Error deleting department:', error);
        return { success: false, error: error.message };
    }
};
