import React, { useEffect, useState } from 'react';
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../supabase/testimonials';
import { uploadSlideshowImage, deleteSlideshowImage } from '../../supabase/storage';
import { getSlideshowImages, updateSlideshowImages } from '../../supabase/content';
import { MessageSquare, Plus, Edit, Trash2, Upload, X, Save, Image, Settings } from 'lucide-react';
import Loader from '../Loader';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { supabase } from '../../supabase/client';

const AdminContent = () => {
    const { isAuthenticated, loading: authLoading } = useAdminAuth();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ error: null, success: false });
    const [showTestimonialForm, setShowTestimonialForm] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [testimonialForm, setTestimonialForm] = useState({
        name: '',
        location: '',
        message: '',
        amount: '',
        image: null,
        imagePreview: null,
        is_active: true
    });

    // Slideshow state
    const [slideshowImages, setSlideshowImages] = useState([]);
    const [showSlideshowManager, setShowSlideshowManager] = useState(false);

    useEffect(() => {
        console.log('AdminContent mounted, auth status:', { isAuthenticated, authLoading });
        if (!authLoading) {
            if (isAuthenticated) {
                fetchTestimonials();
                fetchSlideshowImages();
            } else {
                console.log('User not authenticated');
            }
        }
    }, [isAuthenticated, authLoading]);

    // Show loading while checking auth
    if (authLoading) {
        console.log('Auth loading...');
        return <Loader size="lg" />;
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
        console.log('User not authenticated, should redirect');
        return <div>Please log in to access this page.</div>;
    }

    const fetchTestimonials = async () => {
        setLoading(true);
        const result = await getAllTestimonials();
        if (result.success) {
            setTestimonials(result.data);
        } else {
            console.error('Failed to fetch testimonials:', result.error);
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTestimonialForm(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleTestimonialSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let imagePath = null;

            // Upload image if provided
            if (testimonialForm.image) {
                const uploadResult = await uploadTestimonialImage(testimonialForm.image);
                if (uploadResult.success) {
                    imagePath = uploadResult.data.path;
                } else {
                    throw new Error(uploadResult.error);
                }
            }

            const testimonialData = {
                name: testimonialForm.name,
                location: testimonialForm.location || null,
                message: testimonialForm.message,
                amount: testimonialForm.amount ? parseFloat(testimonialForm.amount) : null,
                image_url: imagePath,
                is_active: testimonialForm.is_active
            };

            let result;
            if (editingTestimonial) {
                result = await updateTestimonial(editingTestimonial.id, testimonialData);
            } else {
                result = await createTestimonial(testimonialData);
            }

            if (result.success) {
                await fetchTestimonials();
                resetTestimonialForm();
                setStatus({ error: null, success: true });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            setStatus({ error: error.message, success: false });
        }
        setSaving(false);
    };

    const handleEditTestimonial = (testimonial) => {
        setEditingTestimonial(testimonial);
        setTestimonialForm({
            name: testimonial.name,
            location: testimonial.location || '',
            message: testimonial.message,
            amount: testimonial.amount || '',
            image: null,
            imagePreview: testimonial.image_url ? getTestimonialImageUrl(testimonial.image_url) : null,
            is_active: testimonial.is_active
        });
        setShowTestimonialForm(true);
    };

    const handleDeleteTestimonial = async (id, imagePath) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        setSaving(true);
        try {
            // Delete image if exists
            if (imagePath) {
                await deleteTestimonialImage(imagePath);
            }

            const result = await deleteTestimonial(id);
            if (result.success) {
                await fetchTestimonials();
                setStatus({ error: null, success: true });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            setStatus({ error: error.message, success: false });
        }
        setSaving(false);
    };

    const resetTestimonialForm = () => {
        setTestimonialForm({
            name: '',
            location: '',
            message: '',
            amount: '',
            image: null,
            imagePreview: null,
            is_active: true
        });
        setEditingTestimonial(null);
        setShowTestimonialForm(false);
    };

    // Slideshow management functions
    const fetchSlideshowImages = async () => {
        const result = await getSlideshowImages();
        if (result.success) {
            setSlideshowImages(result.data);
        } else {
            console.error('Failed to fetch slideshow images:', result.error);
        }
    };

    const handleSlideshowImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log('Starting slideshow image upload...', { file: file.name, size: file.size });
        setSaving(true);

        try {
            console.log('Calling uploadSlideshowImage...');
            const uploadResult = await uploadSlideshowImage(file, 'hero');
            console.log('Upload result:', uploadResult);

            if (uploadResult.success) {
                console.log('Upload successful, refreshing slideshow images...');
                // Refresh the slideshow images from the bucket
                await fetchSlideshowImages();
                setStatus({ error: null, success: true });
                console.log('Slideshow images refreshed successfully');
            } else {
                console.error('Upload failed:', uploadResult.error);
                throw new Error(uploadResult.error);
            }
        } catch (error) {
            console.error('Error in slideshow image upload:', error);
            setStatus({ error: error.message, success: false });
        }
        setSaving(false);
    };

    const handleRemoveSlideshowImage = async (index) => {
        if (!confirm('Are you sure you want to remove this slideshow image?')) return;

        setSaving(true);
        try {
            const imageUrl = slideshowImages[index];

            // Extract path from URL (e.g., 'hero/filename.jpg' from full URL)
            const urlParts = imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const path = `hero/${fileName}`;

            console.log('Deleting image:', path);
            const deleteResult = await deleteSlideshowImage(path);

            if (deleteResult.success) {
                console.log('Image deleted successfully, refreshing slideshow...');
                // Refresh the slideshow images from the bucket
                await fetchSlideshowImages();
                setStatus({ error: null, success: true });
            } else {
                console.error('Delete failed:', deleteResult.error);
                throw new Error(deleteResult.error);
            }
        } catch (error) {
            console.error('Error removing slideshow image:', error);
            setStatus({ error: error.message, success: false });
        }
        setSaving(false);
    };

    const moveSlideshowImage = (fromIndex, toIndex) => {
        // Note: Since images are fetched from bucket by creation time,
        // reordering is not persistent. Images will be ordered by upload time.
        // This function is kept for UI consistency but doesn't actually reorder
        console.log('Note: Image reordering is not supported with bucket-based storage');
    };

    const handleSaveSlideshowOrder = async () => {
        // Since we fetch from bucket, order is automatic by creation time
        setStatus({ error: null, success: true });
        console.log('Order saved (bucket-based storage uses creation time ordering)');
    };

    if (loading) return <Loader size="lg" />;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Testimonials Management</h2>

            {/* Status Messages */}
            {status.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700">{status.error}</p>
                </div>
            )}
            {status.success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-700">Operation completed successfully!</p>
                </div>
            )}

            {/* Testimonials Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        Manage Testimonials
                    </h3>
                    <button
                        onClick={() => setShowTestimonialForm(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Testimonial
                    </button>
                </div>

                {/* Testimonials List */}
                <div className="space-y-4 mb-6">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        {testimonial.image_url && (
                                            <img
                                                src={getTestimonialImageUrl(testimonial.image_url)}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                            {testimonial.location && (
                                                <p className="text-sm text-gray-500">{testimonial.location}</p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-2 italic">"{testimonial.message}"</p>
                                    {testimonial.amount && (
                                        <p className="text-primary font-semibold mt-2">Donated ${testimonial.amount}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${testimonial.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {testimonial.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEditTestimonial(testimonial)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTestimonial(testimonial.id, testimonial.image_url)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {testimonials.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No testimonials yet. Add your first testimonial!</p>
                    )}
                </div>

                {/* Testimonial Form */}
                {showTestimonialForm && (
                    <div className="border-t pt-6">
                        <h4 className="text-lg font-semibold mb-4">
                            {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                        </h4>
                        <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Name *</label>
                                    <input
                                        type="text"
                                        value={testimonialForm.name}
                                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={testimonialForm.location}
                                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, location: e.target.value }))}
                                        className="input-field"
                                        placeholder="e.g., United States"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Message *</label>
                                <textarea
                                    value={testimonialForm.message}
                                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, message: e.target.value }))}
                                    className="input-field h-24"
                                    placeholder="Testimonial message..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Donation Amount</label>
                                    <input
                                        type="number"
                                        value={testimonialForm.amount}
                                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, amount: e.target.value }))}
                                        className="input-field"
                                        placeholder="Optional"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Profile Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="input-field"
                                    />
                                    {testimonialForm.imagePreview && (
                                        <div className="mt-2">
                                            <img
                                                src={testimonialForm.imagePreview}
                                                alt="Preview"
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={testimonialForm.is_active}
                                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, is_active: e.target.checked }))}
                                />
                                <label htmlFor="is_active" className="text-gray-700">Active (visible on website)</label>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn-primary"
                                >
                                    {saving ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader size="sm" color="white" /> Saving...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Save className="w-4 h-4" /> {editingTestimonial ? 'Update' : 'Add'} Testimonial
                                        </span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetTestimonialForm}
                                    className="btn-secondary"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Slideshow Management Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Image className="w-5 h-5 text-primary" />
                        Hero Slideshow Management
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSlideshowManager(!showSlideshowManager)}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            {showSlideshowManager ? 'Hide' : 'Manage'}
                        </button>
                        <label className="btn-primary flex items-center gap-2 cursor-pointer">
                            <Upload className="w-4 h-4" />
                            Add Image
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleSlideshowImageUpload}
                                className="hidden"
                                disabled={saving}
                            />
                        </label>
                    </div>
                </div>

                {showSlideshowManager && (
                    <>
                        {/* Current Slideshow Images */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-4">Current Slideshow Images ({slideshowImages.length})</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Images are automatically ordered by upload time (newest first).
                                Upload new images to add them to the slideshow.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {slideshowImages.map((image, index) => (
                                    <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={image}
                                            alt={`Slide ${index + 1}`}
                                            className="w-full h-32 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                                                <button
                                                    onClick={() => handleRemoveSlideshowImage(index)}
                                                    className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full"
                                                    title="Remove image"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                                            #{index + 1}
                                        </div>
                                    </div>
                                ))}
                                {slideshowImages.length === 0 && (
                                    <div className="col-span-full text-center py-8 text-gray-500">
                                        No slideshow images yet. Upload some images above to get started!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Note about bucket-based storage */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h5 className="font-semibold text-blue-800 mb-2">📁 Bucket-Based Storage</h5>
                            <p className="text-sm text-blue-700">
                                Images are stored directly in your Supabase bucket's "hero" folder.
                                They are automatically ordered by upload time (newest first).
                                No database storage or manual reordering needed!
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminContent;
