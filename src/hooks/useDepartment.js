import { useState } from 'react';
import {
    getActiveDepartments,
    getAllDepartments,
    createDepartment,
    updateDepartment,
    toggleDepartmentStatus,
    deleteDepartment,
} from '../supabase/departments';

export const useDepartment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const run = async (operation) => {
        setLoading(true);
        setError(null);
        const result = await operation();
        setLoading(false);

        if (!result.success) {
            setError(result.error);
        }

        return result;
    };

    return {
        getActive: () => run(() => getActiveDepartments()),
        getAll: () => run(() => getAllDepartments()),
        create: (payload) => run(() => createDepartment(payload)),
        update: (id, payload) => run(() => updateDepartment(id, payload)),
        toggleStatus: (id, isActive) => run(() => toggleDepartmentStatus(id, isActive)),
        remove: (id) => run(() => deleteDepartment(id)),
        loading,
        error,
    };
};
