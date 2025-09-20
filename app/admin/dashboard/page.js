'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, LogOut, Package, Users, DollarSign, TrendingUp } from 'lucide-react';
import { auth } from '../../lib/auth';
import { db } from '../../lib/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc } from 'firebase/firestore';

// Realtime data from Firestore

export default function AdminDashboard() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      if (auth.isAuthenticated()) {
        console.log('Authentication found, loading dashboard');
        // Subscribe to packages collection
        const q = query(collection(db, 'packages'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setPackages(items);
          setIsLoading(false);
        }, (error) => {
          console.error('Failed to load packages:', error);
          setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
      } else {
        console.log('No authentication found, redirecting to login');
        router.push('/admin/login');
      }
    };

    // Small delay to ensure localStorage is available
    const timer = setTimeout(() => {
      const maybeUnsub = checkAuth();
      // If checkAuth returned an unsubscribe, store it for cleanup
      if (typeof maybeUnsub === 'function') {
        cleanup = maybeUnsub;
      }
    }, 100);

    // keep a reference to unsubscribe if created
    let cleanup;
    return () => {
      clearTimeout(timer);
      if (cleanup) cleanup();
    };
  }, [router]);

  const handleLogout = () => {
    auth.logout();
    router.push('/admin/login');
  };

  const handleDeletePackage = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      await deleteDoc(doc(db, 'packages', id));
      // onSnapshot will update the UI automatically
    } catch (e) {
      console.error(e);
      alert('Failed to delete package');
    }
  };

  const handleEditPackage = (id) => {
    router.push(`/admin/packages/${id}/edit`);
  };

  const handleViewPackage = (id) => {
    router.push(`/packages/${id}`);
  };

  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                <p className="text-2xl font-semibold text-gray-900">{packages.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {packages.reduce((sum, pkg) => sum + pkg.bookings, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Packages</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {packages.filter(pkg => pkg.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft Packages</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {packages.filter(pkg => pkg.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Travel Packages</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push('/admin/packages/new')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Package</span>
                </button>
              
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pkg.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{pkg.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pkg.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        pkg.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pkg.bookings}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPackage(pkg.id)}
                          className="text-green-600 hover:text-green-900"
                          title="View Package"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditPackage(pkg.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Package"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Package"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

