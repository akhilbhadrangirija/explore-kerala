'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { auth as simpleAuth } from '../../../../lib/auth';
import { FileInput } from '../../../../../components/ui/file-input';
import { uploadImageToCloudinary } from '../../../../lib/cloudinary';

export default function EditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params || {};

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    fullDescription: '',
    duration: '',
    location: '',
    price: '',
    category: '',
    difficulty: 'Easy',
    status: 'draft',
    highlights: [''],
    itinerary: [{ day: 1, title: '', activities: [''] }],
    includes: [''],
    excludes: [''],
    image: '',
    images: [],
  });

  useEffect(() => {
    if (!simpleAuth.isAuthenticated()) {
      router.replace('/admin/login');
      return;
    }

    const load = async () => {
      try {
        if (!id) return;
        const ref = doc(db, 'packages', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError('Package not found');
          setIsLoading(false);
          return;
        }
        const data = snap.data();
        setForm({
          title: data.title || '',
          description: data.description || '',
          fullDescription: data.fullDescription || '',
          duration: data.duration || '',
          location: data.location || '',
          price: data.price || '',
          category: data.category || '',
          difficulty: data.difficulty || 'Easy',
          status: data.status || 'draft',
          highlights: Array.isArray(data.highlights) && data.highlights.length ? data.highlights : [''],
          itinerary: Array.isArray(data.itinerary) && data.itinerary.length ? data.itinerary : [{ day: 1, title: '', activities: [''] }],
          includes: Array.isArray(data.includes) && data.includes.length ? data.includes : [''],
          excludes: Array.isArray(data.excludes) && data.excludes.length ? data.excludes : [''],
          image: data.image || '',
          images: Array.isArray(data.images) ? data.images : [],
        });
      } catch (e) {
        setError('Failed to load package');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addItineraryDay = () => {
    setForm((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', activities: [''] }],
    }));
  };

  const addItineraryActivity = (dayIndex) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => (i === dayIndex ? { ...day, activities: [...day.activities, ''] } : day)),
    }));
  };

  const handleItineraryChange = (dayIndex, field, value) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => (i === dayIndex ? { ...day, [field]: value } : day)),
    }));
  };

  const handleActivityChange = (dayIndex, activityIndex, value) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? { ...day, activities: day.activities.map((a, j) => (j === activityIndex ? value : a)) }
          : day
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const ref = doc(db, 'packages', id);
      await updateDoc(ref, {
        title: form.title,
        description: form.description,
        fullDescription: form.fullDescription,
        duration: form.duration,
        location: form.location,
        price: form.price,
        category: form.category,
        difficulty: form.difficulty,
        status: form.status,
        highlights: form.highlights,
        itinerary: form.itinerary,
        includes: form.includes,
        excludes: form.excludes,
        image: form.image,
        images: form.images,
        updatedAt: serverTimestamp(),
      });
      setSuccess('Package updated successfully');
    } catch (e) {
      setError('Failed to update package');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoverImageSelect = async (file) => {
    if (!file) {
      setForm((prev) => ({ ...prev, image: '' }));
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const result = await uploadImageToCloudinary(file, `packages/covers/${id}`);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setForm((prev) => ({ ...prev, image: result.url }));
        setSuccess('Image uploaded successfully to Cloudinary');
      } else {
        setError(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading package...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Package</h1>
          <Link href="/admin/packages" className="text-green-600 hover:text-green-700">Back to Packages</Link>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-50 text-green-700 border border-green-200">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Kerala Backwaters Experience"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                <input
                  type="text"
                  name="duration"
                  required
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 3 Days / 2 Nights"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={form.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Alleppey, Kerala"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="15999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Category</option>
                  <option value="backwaters">Backwaters</option>
                  <option value="hill-station">Hill Stations</option>
                  <option value="beach">Beaches</option>
                  <option value="wildlife">Wildlife</option>
                  <option value="cultural">Cultural</option>
                  <option value="wellness">Wellness</option>
                  <option value="adventure">Adventure</option>
                  <option value="complete-tour">Complete Tours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>
               <div className="md:col-span-2">
                 <FileInput
                   onFileSelect={handleCoverImageSelect}
                   value={form.image}
                   accept="image/*"
                   maxSize={5 * 1024 * 1024}
                   disabled={isUploading}
                   isUploading={isUploading}
                   uploadProgress={uploadProgress}
                 />
               </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Descriptions</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Brief description for package cards..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                <textarea
                  name="fullDescription"
                  rows={5}
                  value={form.fullDescription}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Detailed description for package detail page..."
                />
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Highlights</h2>
            <div className="space-y-3">
              {form.highlights.map((highlight, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleArrayInputChange('highlights', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter highlight..."
                  />
                  <button type="button" onClick={() => removeArrayItem('highlights', index)} className="px-3 py-2 text-red-600 hover:text-red-800">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('highlights')} className="text-green-600 hover:text-green-800 text-sm font-medium">+ Add Highlight</button>
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Itinerary</h2>
            <div className="space-y-6">
              {form.itinerary.map((day, dayIndex) => (
                <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day {day.day} Title</label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => handleItineraryChange(dayIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., Arrival & Houseboat Check-in"
                      />
                    </div>
                    <div className="flex items-end">
                      <button type="button" onClick={() => removeArrayItem('itinerary', dayIndex)} className="px-3 py-2 text-red-600 hover:text-red-800">Remove Day</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Activities</label>
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="flex space-x-2">
                        <input
                          type="text"
                          value={activity}
                          onChange={(e) => handleActivityChange(dayIndex, activityIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter activity..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newActivities = day.activities.filter((_, i) => i !== activityIndex);
                            handleItineraryChange(dayIndex, 'activities', newActivities);
                          }}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addItineraryActivity(dayIndex)} className="text-green-600 hover:text-green-800 text-sm font-medium">+ Add Activity</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addItineraryDay} className="text-green-600 hover:text-green-800 text-sm font-medium">+ Add Day</button>
            </div>
          </div>

          {/* Includes & Excludes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">What's Included</h2>
              <div className="space-y-3">
                {form.includes.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayInputChange('includes', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter included item..."
                    />
                    <button type="button" onClick={() => removeArrayItem('includes', index)} className="px-3 py-2 text-red-600 hover:text-red-800">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('includes')} className="text-green-600 hover:text-green-800 text-sm font-medium">+ Add Item</button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">What's Not Included</h2>
              <div className="space-y-3">
                {form.excludes.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayInputChange('excludes', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter excluded item..."
                    />
                    <button type="button" onClick={() => removeArrayItem('excludes', index)} className="px-3 py-2 text-red-600 hover:text-red-800">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem('excludes')} className="text-green-600 hover:text-green-800 text-sm font-medium">+ Add Item</button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={isSaving} className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-5 py-2 rounded font-semibold">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => router.back()} className="border border-gray-300 hover:bg-gray-50 px-5 py-2 rounded font-semibold">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


