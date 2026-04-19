import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, Upload, Package } from 'lucide-react';
import Loader from '../Loader';
import { useProduct } from '../../hooks/useProduct';
import { useToast } from '../../contexts/ToastContext';
import { uploadImage } from '../../supabase/storage';

const getInitialForm = () => ({
    name_en: '',
    category: '',
    origin_region: 'Afghanistan',
    description_en: '',
    image_url: '',
    inquiry_email: '',
    display_order: 1,
    is_active: true,
});

const AdminProducts = () => {
    const { getAll, create, update, remove, toggleStatus, loading } = useProduct();
    const toast = useToast();

    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(getInitialForm());
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [processingId, setProcessingId] = useState('');
    const [uploading, setUploading] = useState(false);

    const nextDisplayOrder = useMemo(() => {
        if (products.length === 0) return 1;
        return Math.max(...products.map((item) => Number(item.display_order) || 1)) + 1;
    }, [products]);

    async function fetchProducts() {
        const result = await getAll();
        if (result.success) {
            setProducts(result.data || []);
            return;
        }
        toast.error(`Failed to load products: ${result.error}`);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const resetForm = () => {
        setForm({ ...getInitialForm(), display_order: nextDisplayOrder });
        setEditingId(null);
        setShowForm(false);
    };

    const openCreateForm = () => {
        setForm({ ...getInitialForm(), display_order: nextDisplayOrder });
        setEditingId(null);
        setShowForm(true);
    };

    const openEditForm = (product) => {
        setForm({
            name_en: product.name_en || '',
            category: product.category || '',
            origin_region: product.origin_region || 'Afghanistan',
            description_en: product.description_en || '',
            image_url: product.image_url || '',
            inquiry_email: product.inquiry_email || '',
            display_order: product.display_order || 1,
            is_active: Boolean(product.is_active),
        });
        setEditingId(product.id);
        setShowForm(true);
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const result = await uploadImage(file, 'products');
        setUploading(false);

        if (!result.success) {
            toast.error(result.error || 'Image upload failed');
            return;
        }

        setForm((prev) => ({ ...prev, image_url: result.data.publicUrl }));
        toast.success('Image uploaded successfully.');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.name_en.trim()) {
            toast.error('Product name is required.');
            return;
        }

        const payload = {
            name_en: form.name_en.trim(),
            category: form.category.trim() || null,
            origin_region: form.origin_region.trim() || 'Afghanistan',
            description_en: form.description_en.trim() || null,
            image_url: form.image_url.trim() || null,
            inquiry_email: form.inquiry_email.trim() || null,
            display_order: Number(form.display_order) || 1,
            is_active: form.is_active,
        };

        setSubmitting(true);

        const result = editingId
            ? await update(editingId, payload)
            : await create(payload);

        setSubmitting(false);

        if (!result.success) {
            toast.error(result.error || 'Product save failed.');
            return;
        }

        toast.success(editingId ? 'Product updated.' : 'Product created.');
        resetForm();
        await fetchProducts();
    };

    const handleToggleStatus = async (product) => {
        setProcessingId(product.id);
        const result = await toggleStatus(product.id, !product.is_active);
        setProcessingId('');

        if (!result.success) {
            toast.error(result.error || 'Failed to update product status.');
            return;
        }

        toast.success(!product.is_active ? 'Product enabled.' : 'Product hidden.');
        await fetchProducts();
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Delete product "${product.name_en}"?`)) {
            return;
        }

        setProcessingId(product.id);
        const result = await remove(product.id);
        setProcessingId('');

        if (!result.success) {
            toast.error(result.error || 'Failed to delete product.');
            return;
        }

        toast.success('Product deleted.');
        await fetchProducts();
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center py-12">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Products</h2>
                    <p className="text-gray-600 mt-1">Manage products shown to international buyers on the Products page.</p>
                </div>
                <button onClick={openCreateForm} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{editingId ? 'Edit Product' : 'Create Product'}</h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    name="name_en"
                                    value={form.name_en}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Saffron, Rug, Leather"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Origin Region</label>
                                <input
                                    type="text"
                                    name="origin_region"
                                    value={form.origin_region}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Herat, Kabul, Mazar"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description_en"
                                value={form.description_en}
                                onChange={handleChange}
                                className="input-field resize-none"
                                rows="4"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={form.image_url}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="block w-full text-sm text-gray-700"
                                    />
                                    {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Email</label>
                                <input
                                    type="email"
                                    name="inquiry_email"
                                    value={form.inquiry_email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="sales@afghanium.org"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                                <input
                                    type="number"
                                    name="display_order"
                                    value={form.display_order}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="1"
                                />
                            </div>
                            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 mt-7">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={form.is_active}
                                    onChange={handleChange}
                                    className="w-4 h-4"
                                />
                                Active and visible
                            </label>
                        </div>

                        <div>
                            <button type="submit" disabled={submitting || uploading} className="btn-primary disabled:opacity-60 flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name_en} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{product.name_en}</h4>
                                    <p className="text-xs text-gray-500">{product.category || 'Uncategorized'}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {product.is_active ? 'Active' : 'Hidden'}
                            </span>
                        </div>

                        {product.description_en && (
                            <p className="text-sm text-gray-600 mt-4">{product.description_en}</p>
                        )}

                        <div className="text-xs text-gray-500 mt-3">Origin: {product.origin_region || 'Afghanistan'}</div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleToggleStatus(product)}
                                disabled={processingId === product.id}
                                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm flex items-center gap-1"
                            >
                                {product.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {product.is_active ? 'Hide' : 'Show'}
                            </button>
                            <button
                                onClick={() => openEditForm(product)}
                                className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm flex items-center gap-1"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(product)}
                                disabled={processingId === product.id}
                                className="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm flex items-center gap-1"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProducts;
