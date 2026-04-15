import { useState } from 'react';
import {
    getActiveProducts,
    getAllProducts,
    createProduct,
    updateProduct,
    toggleProductStatus,
    deleteProduct,
} from '../supabase/products';

export const useProduct = () => {
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
        getActive: () => run(() => getActiveProducts()),
        getAll: () => run(() => getAllProducts()),
        create: (payload) => run(() => createProduct(payload)),
        update: (id, payload) => run(() => updateProduct(id, payload)),
        toggleStatus: (id, isActive) => run(() => toggleProductStatus(id, isActive)),
        remove: (id) => run(() => deleteProduct(id)),
        loading,
        error,
    };
};
