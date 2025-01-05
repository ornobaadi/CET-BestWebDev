'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

interface Agency {
  _id: string;
  name: string;
  category: string;
  location: string;
  teamSize: string;
  rate: string;
  rating: number;
  image?: string;
  description?: string;
}

const AdminDashboard = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgencyIds, setSelectedAgencyIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isAddCompanyModalOpen, setAddCompanyModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAgencyId, setEditingAgencyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newCompany, setNewCompany] = useState<Agency>({
    _id: '',
    name: '',
    location: '',
    category: '',
    teamSize: '',
    rate: '',
    rating: 0,
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    } else {
      fetchAgencies();
    }
  }, [isAuthenticated, router]);

  const fetchAgencies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/agencies`);
      if (!response.ok) throw new Error('Failed to fetch agencies');
      const data: Agency[] = await response.json();
      setAgencies(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch agencies');
      console.error('Error fetching agencies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAgencies = agencies.filter((agency) => {
    const query = searchQuery.toLowerCase();
    return (
      agency.name.toLowerCase().includes(query) ||
      agency.location.toLowerCase().includes(query) ||
      agency.category.toLowerCase().includes(query) ||
      agency.teamSize.toLowerCase().includes(query)
    );
  });

  // Rest of the functions remain the same
  const handleSelectAgency = (id: string) => {
    setSelectedAgencyIds((prev) =>
      prev.includes(id) ? prev.filter((agencyId) => agencyId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedAgencyIds(!selectAll ? agencies.map((agency) => agency._id) : []);
  };

  const handleBulkDelete = async () => {
    if (selectedAgencyIds.length === 0) {
      alert('Please select at least one agency to delete.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete the selected agencies?');
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      await Promise.all(
        selectedAgencyIds.map((id) =>
          fetch(`${BASE_URL}/api/agencies/${id}`, { method: 'DELETE' })
        )
      );
      setAgencies((prev) => prev.filter((agency) => !selectedAgencyIds.includes(agency._id)));
      setSelectedAgencyIds([]);
      setSelectAll(false);
      alert('Selected agencies have been deleted successfully.');
    } catch (error) {
      console.error('Error deleting agencies:', error);
      alert('An error occurred while deleting agencies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAgency = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this agency?');
    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/agencies/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete agency');
      setAgencies((prev) => prev.filter((agency) => agency._id !== id));
      alert('Agency deleted successfully.');
    } catch (error) {
      console.error('Error deleting agency:', error);
      alert('An error occurred while deleting the agency. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateCompanyData = () => {
    const errors: string[] = [];
    if (!newCompany.name) errors.push('Name is required');
    if (!newCompany.location) errors.push('Location is required');
    if (!newCompany.category) errors.push('Category is required');
    if (!newCompany.teamSize) errors.push('Team size is required');
    if (!newCompany.rate) errors.push('Rate is required');
    if (newCompany.rating < 1 || newCompany.rating > 5) errors.push('Rating must be between 1 and 5');
    
    return errors;
  };

  const handleAddOrEditCompany = async () => {
    const validationErrors = validateCompanyData();
    if (validationErrors.length > 0) {
      alert(`Please fix the following errors:\n${validationErrors.join('\n')}`);
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(newCompany).forEach(([key, value]) => {
        if (key !== '_id' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      if (imageFile) formData.append('image', imageFile);

      const url = isEditing
        ? `${BASE_URL}/api/agencies/${editingAgencyId}`
        : `${BASE_URL}/api/agencies`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} agency`);

      await fetchAgencies();
      setAddCompanyModalOpen(false);
      resetForm();
    } catch (error) {
      console.error(`Error ${isEditing ? 'editing' : 'adding'} company:`, error);
      alert(`An error occurred while ${isEditing ? 'editing' : 'adding'} the agency. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAgency = (agency: Agency) => {
    setNewCompany({ ...agency });
    setEditingAgencyId(agency._id);
    setImagePreview(agency.image ? `${BASE_URL}/uploads/${agency.image}` : null);
    setImageFile(null);
    setIsEditing(true);
    setAddCompanyModalOpen(true);
  };

  const resetForm = () => {
    setNewCompany({
      _id: '',
      name: '',
      location: '',
      category: '',
      teamSize: '',
      rate: '',
      rating: 0,
      description: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditingAgencyId(null);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-6">
        <h2 className="text-xl font-bold text-center mb-4">Best DevShop</h2>
        <ul className="space-y-4">
          {[
            { name: 'Dashboard', path: '/admin/dashboard' },
            // { name: 'Category', path: '/admin/dashboard/category' },
            // { name: 'Company', path: '/admin/dashboard/company' },
            { name: 'Quotes', path: '/admin/dashboard/quotes' },
            { name: 'User', path: '/admin/dashboard/user' },
            { name: 'Settings', path: '/admin/dashboard/settings' },
          ].map((section) => (
            <li 
              key={section.name} 
              className={`p-2 rounded-md cursor-pointer ${
                section.name === 'Dashboard' ? 'bg-slate-900 text-white' : 'text-gray-700 hover:bg-slate-100'
              }`}
            >
              <Link href={section.path}>{section.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-gray-50 p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBulkDelete} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              disabled={isLoading || selectedAgencyIds.length === 0}
            >
              Bulk Delete ({selectedAgencyIds.length})
            </button>
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button 
            onClick={() => setAddCompanyModalOpen(true)} 
            className="bg-slate-900 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={isLoading}
          >
            + Add Agency
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">
                    <input 
                      type="checkbox" 
                      checked={selectAll} 
                      onChange={handleSelectAll}
                      disabled={isLoading}
                    />
                  </th>
                  <th className="p-3 text-left">Logo</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Rating</th>
                  <th className="p-3 text-left">Hourly Rate</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgencies.map((agency) => (
                  <tr key={agency._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <input 
                        type="checkbox" 
                        checked={selectedAgencyIds.includes(agency._id)} 
                        onChange={() => handleSelectAgency(agency._id)}
                        disabled={isLoading}
                      />
                    </td>
                    <td className="p-3">
                      <Image 
                        src={agency.image ? `${BASE_URL}/${agency.image}` : '/placeholder-logo.png'} 
                        alt={`${agency.name} logo`}
                        width={40} 
                        height={40} 
                        className="object-cover rounded"
                      />
                    </td>
                    <td className="p-3">{agency.name}</td>
                    <td className="p-3">{agency.category}</td>
                    <td className="p-3">{agency.location}</td>
                    <td className="p-3">{agency.rating}</td>
                    <td className="p-3">{agency.rate}</td>
                    <td className="p-3">
                      <button 
                        className="mr-4" 
                        onClick={() => handleEditAgency(agency)}
                        disabled={isLoading}
                      >
                        <FaRegEdit size={20} />
                      </button>
                      <button 
                        className="" 
                        onClick={() => handleDeleteAgency(agency._id)}
                        disabled={isLoading}
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isAddCompanyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Agency' : 'Add New Agency'}
              </h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  name="name"
                  placeholder="Agency Name"
                  className="w-full p-2 border rounded"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  disabled={isLoading}
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  className="w-full p-2 border rounded"
                  value={newCompany.location}
                  onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                  disabled={isLoading}
                />
                <select
                  name="category"
                  className="w-full p-2 border rounded"
                  value={newCompany.category}
                  onChange={(e) => setNewCompany({ ...newCompany, category: e.target.value })}
                  disabled={isLoading}
                >
                  <option value="">Select Category</option>
                  <option value="Development">Development</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Business Services">Business Services</option>
                </select>
                <input
                  type="text"
                  name="teamSize"
                  placeholder="Team Size"
                  className="w-full p-2 border rounded"
                  value={newCompany.teamSize}
                  onChange={(e) => setNewCompany({ ...newCompany, teamSize: e.target.value })}
                  disabled={isLoading}
                />
                <input
                  type="text"
                  name="rate"
                  placeholder="Hourly Rate"
                  className="w-full p-2 border rounded"
                  value={newCompany.rate}
                  onChange={(e) => setNewCompany({ ...newCompany, rate: e.target.value })}
                  disabled={isLoading}
                />
                <input
                  type="number"
                  name="rating"
                  placeholder="Rating (1-5)"
                  className="w-full p-2 border rounded"
                  value={newCompany.rating}
                  min={1}
                  max={5}
                  onChange={(e) => setNewCompany({ ...newCompany, rating: parseFloat(e.target.value) })}
                  disabled={isLoading}
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                  disabled={isLoading}
                ></textarea>
                <div className="space-y-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full p-2" 
                    disabled={isLoading}
                  />
                  {imagePreview && (
                    <div className="relative w-32 h-32 mx-auto">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        disabled={isLoading}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <button 
                    type="submit"
                    onClick={handleAddOrEditCompany}
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-600 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin h-5 w-5 mr-2 border-b-2 border-white rounded-full"></span>
                        {isEditing ? 'Saving...' : 'Adding...'}
                      </span>
                    ) : (
                      isEditing ? 'Save Changes' : 'Add Agency'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddCompanyModalOpen(false);
                      resetForm();
                    }}
                    disabled={isLoading}
                    className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;