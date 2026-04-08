import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Building2, Eye, EyeOff } from 'lucide-react';
import Loader from '../Loader';
import { useDepartment } from '../../hooks/useDepartment';
import { useToast } from '../../contexts/ToastContext';

const getInitialForm = () => ({
    id: '',
    name_en: '',
    name_dari: '',
    name_pashto: '',
    description_en: '',
    description_dari: '',
    description_pashto: '',
    icon: '🏥',
    display_order: 1,
    is_active: true,
});

const slugify = (value) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const AdminDepartments = () => {
    const { getAll, create, update, remove, toggleStatus, loading } = useDepartment();
    const toast = useToast();

    const [departments, setDepartments] = useState([]);
    const [form, setForm] = useState(getInitialForm());
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [processingId, setProcessingId] = useState('');

    const nextDisplayOrder = useMemo(() => {
        if (departments.length === 0) return 1;
        return Math.max(...departments.map((d) => Number(d.display_order) || 1)) + 1;
    }, [departments]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        const result = await getAll();
        if (result.success) {
            setDepartments(result.data);
            return;
        }

        toast.error(`Failed to load departments: ${result.error}`);
    };

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

    const openEditForm = (department) => {
        setForm({
            id: department.id,
            name_en: department.name_en || '',
            name_dari: department.name_dari || '',
            name_pashto: department.name_pashto || '',
            description_en: department.description_en || '',
            description_dari: department.description_dari || '',
            description_pashto: department.description_pashto || '',
            icon: department.icon || '🏥',
            display_order: department.display_order || 1,
            is_active: Boolean(department.is_active),
        });
        setEditingId(department.id);
        setShowForm(true);
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (name === 'name_en' && !editingId && !form.id) {
            setForm((prev) => ({
                ...prev,
                id: slugify(value),
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.name_en.trim()) {
            toast.error('English name is required.');
            return;
        }

        const payload = {
            id: form.id.trim() || slugify(form.name_en),
            name_en: form.name_en.trim(),
            name_dari: form.name_dari.trim() || null,
            name_pashto: form.name_pashto.trim() || null,
            description_en: form.description_en.trim() || null,
            description_dari: form.description_dari.trim() || null,
            description_pashto: form.description_pashto.trim() || null,
            icon: form.icon.trim() || '🏥',
            display_order: Number(form.display_order) || 1,
            is_active: form.is_active,
        };

        setSubmitting(true);

        const result = editingId
            ? await update(editingId, {
                name_en: payload.name_en,
                name_dari: payload.name_dari,
                name_pashto: payload.name_pashto,
                description_en: payload.description_en,
                description_dari: payload.description_dari,
                description_pashto: payload.description_pashto,
                icon: payload.icon,
                display_order: payload.display_order,
                is_active: payload.is_active,
            })
            : await create(payload);

        setSubmitting(false);

        if (!result.success) {
            toast.error(result.error || 'Department save failed.');
            return;
        }

        toast.success(editingId ? 'Department updated.' : 'Department created.');
        resetForm();
        await fetchDepartments();
    };

    const handleToggleStatus = async (department) => {
        setProcessingId(department.id);
        const result = await toggleStatus(department.id, !department.is_active);
        setProcessingId('');

        if (!result.success) {
            toast.error(result.error || 'Failed to update status.');
            return;
        }

        toast.success(!department.is_active ? 'Department enabled.' : 'Department hidden.');
        await fetchDepartments();
    };

    const handleDelete = async (department) => {
        if (!window.confirm(`Delete department "${department.name_en}"?`)) {
            return;
        }

        setProcessingId(department.id);
        const result = await remove(department.id);
        setProcessingId('');

        if (!result.success) {
            toast.error(result.error || 'Failed to delete department.');
            return;
        }

        toast.success('Department deleted.');
        await fetchDepartments();
    };

    if (loading && departments.length === 0) {
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
                    <h2 className="text-3xl font-bold text-gray-900">Departments</h2>
                    <p className="text-gray-600 mt-1">Create and manage departments used in donations and impact proofs.</p>
                </div>
                <button onClick={openCreateForm} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Department
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {editingId ? 'Edit Department' : 'Create Department'}
                        </h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department ID *</label>
                                <input
                                    type="text"
                                    name="id"
                                    value={form.id}
                                    onChange={handleChange}
                                    disabled={Boolean(editingId)}
                                    className="input-field disabled:bg-gray-100"
                                    placeholder="womens-medical-fund"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Used in database references.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={form.icon}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="🏥"
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name (Dari)</label>
                                <input
                                    type="text"
                                    name="name_dari"
                                    value={form.name_dari}
                                    onChange={handleChange}
                                    className="input-field"
                                    dir="rtl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name (Pashto)</label>
                                <input
                                    type="text"
                                    name="name_pashto"
                                    value={form.name_pashto}
                                    onChange={handleChange}
                                    className="input-field"
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                                <textarea
                                    name="description_en"
                                    value={form.description_en}
                                    onChange={handleChange}
                                    className="input-field resize-none"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Dari)</label>
                                <textarea
                                    name="description_dari"
                                    value={form.description_dari}
                                    onChange={handleChange}
                                    className="input-field resize-none"
                                    rows="3"
                                    dir="rtl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Pashto)</label>
                                <textarea
                                    name="description_pashto"
                                    value={form.description_pashto}
                                    onChange={handleChange}
                                    className="input-field resize-none"
                                    rows="3"
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={form.is_active}
                                onChange={handleChange}
                                className="w-4 h-4"
                            />
                            Active and visible
                        </label>

                        <div>
                            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60 flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                {submitting ? 'Saving...' : editingId ? 'Update Department' : 'Create Department'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {departments.map((department) => (
                    <div key={department.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-secondary-light flex items-center justify-center text-2xl">
                                    {department.icon || <Building2 className="w-5 h-5 text-primary" />}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{department.name_en}</h4>
                                    <p className="text-xs text-gray-500">ID: {department.id}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${department.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {department.is_active ? 'Active' : 'Hidden'}
                            </span>
                        </div>

                        {department.description_en && (
                            <p className="text-sm text-gray-600 mt-4">{department.description_en}</p>
                        )}

                        <div className="text-xs text-gray-500 mt-3">Display order: {department.display_order || 1}</div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleToggleStatus(department)}
                                disabled={processingId === department.id}
                                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm flex items-center gap-1"
                            >
                                {department.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {department.is_active ? 'Hide' : 'Show'}
                            </button>
                            <button
                                onClick={() => openEditForm(department)}
                                className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm flex items-center gap-1"
                            >
                                <Pencil className="w-4 h-4" /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(department)}
                                disabled={processingId === department.id}
                                className="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm flex items-center gap-1"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {departments.length === 0 && (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center mt-4">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900">No departments yet</h3>
                    <p className="text-sm text-gray-600 mt-1 mb-5">Create your first department to use it in impact proofs.</p>
                    <button onClick={openCreateForm} className="btn-primary">Create Department</button>
                </div>
            )}
        </div>
    );
};

export default AdminDepartments;
