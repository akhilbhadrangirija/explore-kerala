'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { storage, db, auth } from '../../../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

export default function NewPackagePage() {
  const [formData, setFormData] = useState({
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
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoverImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
    } catch (err) {
      console.error('Auth error before upload:', err);
      alert('Unable to initialize upload (auth failed). Please try again.');
      return;
    }
    const path = `packages/covers/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    const metadata = { contentType: file.type || 'application/octet-stream' };
    const task = uploadBytesResumable(storageRef, file, metadata);
    setIsUploading(true);
    setUploadProgress(0);
    task.on('state_changed', (snap) => {
      const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      setUploadProgress(pct);
    }, async (err) => {
      console.error('Resumable upload error:', err);
      if (err?.code === 'storage/retry-limit-exceeded') {
        try {
          // Fallback to non-resumable upload
          const snapshot = await uploadBytes(storageRef, file, metadata);
          const url = await getDownloadURL(snapshot.ref);
          setFormData(prev => ({ ...prev, image: url }));
          setIsUploading(false);
          return;
        } catch (fallbackErr) {
          console.error('Fallback upload error:', fallbackErr);
        }
      }
      setIsUploading(false);
      alert(`Failed to upload image${err?.code ? ` (${err.code})` : ''}`);
    }, async () => {
      const url = await getDownloadURL(task.snapshot.ref);
      setFormData(prev => ({ ...prev, image: url }));
      setIsUploading(false);
    });
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', activities: [''] }]
    }));
  };

  const addItineraryActivity = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => 
        i === dayIndex 
          ? { ...day, activities: [...day.activities, ''] }
          : day
      )
    }));
  };

  const handleItineraryChange = (dayIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => 
        i === dayIndex 
          ? { ...day, [field]: value }
          : day
      )
    }));
  };

  const handleActivityChange = (dayIndex, activityIndex, value) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => 
        i === dayIndex 
          ? { 
              ...day, 
              activities: day.activities.map((activity, j) => 
                j === activityIndex ? value : activity
              )
            }
          : day
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.title || !formData.duration || !formData.location || !formData.description) {
        alert('Please fill in all required fields.');
        setIsLoading(false);
        return;
      }

      // Normalize data
      const normalizedHighlights = (formData.highlights || []).map(h => (h || '').trim()).filter(Boolean);
      const normalizedIncludes = (formData.includes || []).map(i => (i || '').trim()).filter(Boolean);
      const normalizedExcludes = (formData.excludes || []).map(i => (i || '').trim()).filter(Boolean);
      const normalizedItinerary = (formData.itinerary || [])
        .filter(day => day && (day.title?.trim() || (Array.isArray(day.activities) && day.activities.some(a => (a || '').trim()))))
        .map((day, idx) => ({
          day: idx + 1,
          title: (day.title || '').trim(),
          activities: (day.activities || []).map(a => (a || '').trim()).filter(Boolean)
        }));

      const priceNumber = formData.price === '' || formData.price === null || formData.price === undefined
        ? null
        : Number(formData.price);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        fullDescription: (formData.fullDescription || '').trim(),
        duration: formData.duration.trim(),
        location: formData.location.trim(),
        price: Number.isFinite(priceNumber) ? priceNumber : null,
        category: (formData.category || '').trim(),
        difficulty: formData.difficulty || 'Easy',
        status: formData.status || 'draft',
        highlights: normalizedHighlights,
        itinerary: normalizedItinerary,
        includes: normalizedIncludes,
        excludes: normalizedExcludes,
        image: formData.image || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const colRef = collection(db, 'packages');
      const docRef = await addDoc(colRef, payload);
      console.log('Package created with ID:', docRef.id);
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Failed to save package:', err);
      alert('Failed to save package. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Create New Package</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Kerala Backwaters Experience"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  required
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 3 Days / 2 Nights"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Alleppey, Kerala"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="15999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageSelect}
                    className="block w-full text-sm text-gray-700"
                  />
                  {isUploading ? (
                    <span className="text-sm text-gray-600">Uploading {uploadProgress}%</span>
                  ) : null}
                </div>
                {formData.image ? (
                  <div className="mt-3">
                    <img src={formData.image} alt="Cover preview" className="h-40 w-full object-cover rounded" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Descriptions</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Brief description for package cards..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description
                </label>
                <textarea
                  name="fullDescription"
                  rows={5}
                  value={formData.fullDescription}
                  onChange={handleInputChange}
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
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleArrayInputChange('highlights', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter highlight..."
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('highlights', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('highlights')}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                + Add Highlight
              </button>
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Itinerary</h2>
            <div className="space-y-6">
              {formData.itinerary.map((day, dayIndex) => (
                <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Day {day.day} Title
                      </label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => handleItineraryChange(dayIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., Arrival & Houseboat Check-in"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeArrayItem('itinerary', dayIndex)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remove Day
                      </button>
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
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addItineraryActivity(dayIndex)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      + Add Activity
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addItineraryDay}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                + Add Day
              </button>
            </div>
          </div>

          {/* Includes & Excludes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">What's Included</h2>
              <div className="space-y-3">
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayInputChange('includes', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter included item..."
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('includes', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('includes')}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  + Add Item
                </button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">What's Not Included</h2>
              <div className="space-y-3">
                {formData.excludes.map((item, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayInputChange('excludes', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter excluded item..."
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('excludes', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('excludes')}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  + Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : 'Save Package'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

