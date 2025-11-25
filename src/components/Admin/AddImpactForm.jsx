import React, { useState } from 'react';
import { useImpact } from '../../hooks/useImpact';
import { useStorage } from '../../hooks/useStorage';
import { updateDonationStatus } from '../../supabase/donations';
import { DEPARTMENTS } from '../../utils/constants';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Loader from '../Loader';

const AddImpactForm = ({ onSuccess, initialValues }) => {
    const { create, loading: impactLoading } = useImpact();
    const { upload, uploading } = useStorage();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        cost: '',
        department: '',
        donationId: '',
        adminComment: '',
    });

    React.useEffect(() => {
        if (initialValues) {
            setFormData(prev => ({
                ...prev,
                ...initialValues
            }));
        }
    }, [initialValues]);

    const [mediaFiles, setMediaFiles] = useState([]);
    const [mediaPreviews, setMediaPreviews] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setMediaFiles(prev => [...prev, ...files]);

            const newPreviews = files.map(file => ({
                url: URL.createObjectURL(file),
                type: file.type,
                name: file.name
            }));
            setMediaPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeMedia = (index) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
        setMediaPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('📤 Starting impact creation process...');
        console.log('📁 Media files selected:', mediaFiles.length);

        const uploadedUrls = [];

        // Upload all media files
        if (mediaFiles.length > 0) {
            console.log('⬆️ Starting upload of', mediaFiles.length, 'files...');
            for (const file of mediaFiles) {
                console.log('📤 Uploading:', file.name, 'Type:', file.type);
                const uploadResult = await upload(file, 'impacts');
                if (uploadResult.success) {
                    console.log('✅ Upload successful:', uploadResult.data.publicUrl);
                    uploadedUrls.push(uploadResult.data.publicUrl);
                } else {
                    console.error('❌ Upload failed for file:', file.name, uploadResult.error);
                    alert(`Failed to upload ${file.name}: ${uploadResult.error}`);
                }
            }

            console.log('📊 Upload complete. Total URLs:', uploadedUrls.length);
            console.log('🔗 URLs:', uploadedUrls);

            if (uploadedUrls.length === 0) {
                alert('All file uploads failed. Please try again.');
                return;
            }
        } else {
            console.log('⚠️ No media files selected');
        }

        // Create impact
        const impactPayload = {
            title: formData.title,
            description: formData.description,
            cost: parseFloat(formData.cost),
            department: formData.department,
            imageUrl: uploadedUrls[0] || null, // Primary image for backward compatibility
            media: uploadedUrls, // All media
            donationId: formData.donationId || null,
            adminComment: formData.adminComment || null,
        };

        console.log('💾 Creating impact with payload:', impactPayload);
        const result = await create(impactPayload);

        if (result.success) {
            // Update donation status if linked
            if (formData.donationId) {
                await updateDonationStatus(formData.donationId, 'completed');
            }

            // Reset form
            setFormData({
                title: '',
                description: '',
                cost: '',
                department: '',
                donationId: '',
                adminComment: '',
            });
            setMediaFiles([]);
            setMediaPreviews([]);

            if (onSuccess) onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Add Impact Proof</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Cost *</label>
                    <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        className="input-field"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Donation ID (Optional)</label>
                    <input
                        type="text"
                        name="donationId"
                        value={formData.donationId}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., AFG-123456"
                    />
                    <p className="text-xs text-gray-500 mt-1">Linking a donation will mark it as "Completed".</p>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Department *</label>
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                    >
                        <option value="">Select department...</option>
                        {DEPARTMENTS.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.icon} {dept.name.en}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Description *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    rows="4"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Admin Comment</label>
                <textarea
                    name="adminComment"
                    value={formData.adminComment}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    rows="2"
                    placeholder="Optional comment about this impact..."
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Upload Media (Images/Videos)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <label className="cursor-pointer block">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <span className="text-gray-600 block mb-2">Click to upload multiple files</span>
                        <span className="text-xs text-gray-400 block">Supports Images and Videos</span>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleMediaChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Media Previews */}
                {mediaPreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mediaPreviews.map((preview, index) => (
                            <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                {preview.type.startsWith('video') ? (
                                    <video src={preview.url} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={preview.url} alt="Preview" className="w-full h-full object-cover" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeMedia(index)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={impactLoading || uploading}
                className="btn-primary w-full disabled:opacity-50"
            >
                {impactLoading || uploading ? (
                    <span className="flex items-center justify-center">
                        <Loader size="sm" color="white" />
                        <span className="ml-2">
                            {uploading ? `Uploading ${mediaFiles.length} files...` : 'Creating Impact...'}
                        </span>
                    </span>
                ) : (
                    'Add Impact Proof'
                )}
            </button>
        </form>
    );
};

export default AddImpactForm;
