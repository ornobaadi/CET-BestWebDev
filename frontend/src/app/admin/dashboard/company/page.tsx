// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import Link from 'next/link';
// import Image from 'next/image';
// import { MdDelete } from "react-icons/md";
// import { FaRegEdit } from "react-icons/fa";
// import { IoSearch } from "react-icons/io5";

// interface Agency {
//   _id: string;
//   name: string;
//   category: string;
//   location: string;
//   teamSize: string;
//   rate: string;
//   rating: number;
//   image?: string;
//   description?: string;
//   founded?: string;
// }

// const AdminCompanyDashboard = () => {
//   const { isAuthenticated } = useAuth();
//   const router = useRouter();
//   const API_URL = 'http://localhost:5000';

//   const [searchQuery, setSearchQuery] = useState('');
//   const [agencies, setAgencies] = useState<Agency[]>([]);
//   const [selectedAgencyIds, setSelectedAgencyIds] = useState<string[]>([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [isAddCompanyModalOpen, setAddCompanyModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingAgencyId, setEditingAgencyId] = useState<string | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10;

//   const [newCompany, setNewCompany] = useState<Agency>({
//     _id: '',
//     name: '',
//     location: '',
//     category: '',
//     teamSize: '',
//     rate: '',
//     rating: 0,
//     description: '',
//   });

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push('/admin');
//     } else {
//       fetchAgencies();
//     }
//   }, [isAuthenticated, router]);

//   const fetchAgencies = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/agencies`);
//       const data: Agency[] = await response.json();
//       setAgencies(data);
//     } catch (error) {
//       console.error('Error fetching agencies:', error);
//     }
//   };

//   const filteredAgencies = agencies.filter((agency) => {
//     const query = searchQuery.toLowerCase();
//     return (
//       agency.name.toLowerCase().includes(query) ||
//       agency.location.toLowerCase().includes(query) ||
//       agency.category.toLowerCase().includes(query) ||
//       agency.teamSize.toLowerCase().includes(query)
//     );
//   });

//   const handleSelectAgency = (id: string) => {
//     setSelectedAgencyIds((prev) =>
//       prev.includes(id) ? prev.filter((agencyId) => agencyId !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAll = () => {
//     setSelectedAgencyIds(selectAll ? [] : agencies.map((agency) => agency._id));
//     setSelectAll(!selectAll);
//   };

//   const handleBulkDelete = async () => {
//     if (selectedAgencyIds.length === 0) {
//       alert('Please select at least one agency to delete.');
//       return;
//     }

//     const confirmDelete = window.confirm('Are you sure you want to delete the selected agencies?');
//     if (!confirmDelete) return;

//     try {
//       await Promise.all(
//         selectedAgencyIds.map((id) =>
//           fetch(`${API_URL}/api/agencies/${id}`, { method: 'DELETE' })
//         )
//       );
//       setAgencies((prev) => prev.filter((agency) => !selectedAgencyIds.includes(agency._id)));
//       setSelectedAgencyIds([]);
//       setSelectAll(false);
//       alert('Selected agencies have been deleted successfully.');
//     } catch (error) {
//       console.error('Error deleting agencies:', error);
//       alert('An error occurred. Please try again.');
//     }
//   };

//   const handleAddOrEditCompany = async () => {
//     if (!newCompany.name || !newCompany.location || !newCompany.category || !newCompany.teamSize || !newCompany.rate || newCompany.rating < 1 || newCompany.rating > 5) {
//       alert('Please fill in all fields and ensure rating is between 1 and 5.');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('name', newCompany.name);
//       formData.append('location', newCompany.location);
//       formData.append('category', newCompany.category);
//       formData.append('teamSize', newCompany.teamSize);
//       formData.append('rate', newCompany.rate);
//       formData.append('rating', newCompany.rating.toString());
//       formData.append('description', newCompany.description || '');
//       if (imageFile) formData.append('image', imageFile);

//       const url = isEditing
//         ? `${API_URL}/api/agencies/${editingAgencyId}`
//         : `${API_URL}/api/agencies`;

//       const method = isEditing ? 'PUT' : 'POST';

//       const response = await fetch(url, { method, body: formData });

//       if (response.ok) {
//         fetchAgencies();
//         setAddCompanyModalOpen(false);
//         resetForm();
//         alert(`Agency ${isEditing ? 'updated' : 'added'} successfully.`);
//       } else {
//         alert(`Failed to ${isEditing ? 'edit' : 'add'} company.`);
//       }
//     } catch (error) {
//       console.error(`Error ${isEditing ? 'editing' : 'adding'} company:`, error);
//       alert('An error occurred. Please try again.');
//     }
//   };

//   const handleEditAgency = (agency: Agency) => {
//     setNewCompany({ ...agency });
//     setEditingAgencyId(agency._id);
//     setImagePreview(agency.image ? `${API_URL}/uploads/${agency.image}` : null);
//     setImageFile(null);
//     setIsEditing(true);
//     setAddCompanyModalOpen(true);
//   };

//   const resetForm = () => {
//     setNewCompany({
//       _id: '',
//       name: '',
//       location: '',
//       category: '',
//       teamSize: '',
//       rate: '',
//       rating: 0,
//       description: '',
//     });
//     setImageFile(null);
//     setImagePreview(null);
//     setIsEditing(false);
//     setEditingAgencyId(null);
//   };

//   const handlePagination = (direction: 'prev' | 'next') => {
//     if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
//     if (direction === 'next' && currentPage < Math.ceil(filteredAgencies.length / rowsPerPage))
//       setCurrentPage(currentPage + 1);
//   };

//   if (!isAuthenticated) return null;

//   const paginatedData = filteredAgencies.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   return (
//     <div className="flex min-h-screen">
//       <div className="w-1/4 bg-gray-100 p-6">
//         <h2 className="text-xl font-bold text-center mb-4">Best DevShop</h2>
//         <ul className="space-y-4">
//           {[
//             { name: 'Dashboard', path: '/admin/dashboard' },
//             // { name: 'Category', path: '/admin/dashboard/category' },
//             { name: 'Company', path: '/admin/dashboard/company' },
//             { name: 'Quotes', path: '/admin/dashboard/quotes' },
//             { name: 'User', path: '/admin/dashboard/user' },
//             { name: 'Settings', path: '/admin/dashboard/settings' },
//           ].map((section) => (
//             <li key={section.name} className={`p-2 rounded-md cursor-pointer ${section.name === 'Company' ? 'bg-slate-900 text-white' : 'text-gray-700 hover:bg-slate-100'}`}>
//               <Link href={section.path}>{section.name}</Link>
//             </li>
//           ))}
//         </ul>
//       </div>
      
//       <div className="w-3/4 bg-gray-50 p-6">
//         <div className="mb-6">
//           <div className="flex justify-between items-center"> 
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={handleBulkDelete}
//                 disabled={selectedAgencyIds.length === 0}
//                 className={`px-4 py-2 rounded ${selectedAgencyIds.length === 0
//                     ? 'bg-gray-300 cursor-not-allowed'
//                     : 'bg-red-500 text-white hover:bg-red-600'
//                   }`}
//               >
//                 Bulk Delete ({selectedAgencyIds.length})
//               </button>
//               <div className="relative">
//                 <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search companies..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 resetForm();
//                 setAddCompanyModalOpen(true);
//               }}
//               className="px-4 py-2 bg-slate-900 text-white rounded"
//             >
//               Add Company
//             </button>
//           </div>
//         </div>

//         <table className="min-w-full bg-white rounded-lg overflow-hidden">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="p-4">
//                 <input
//                   type="checkbox"
//                   checked={selectAll}
//                   onChange={handleSelectAll}
//                 />
//               </th>
//               <th className="p-4">Name</th>
//               <th className="p-4">Location</th>
//               <th className="p-4">Category</th>
//               <th className="p-4">Team Size</th>
//               <th className="p-4">Rating</th>
//               <th className="p-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.map((agency) => (
//               <tr key={agency._id} className="border-t">
//                 <td className="p-4">
//                   <input
//                     type="checkbox"
//                     checked={selectedAgencyIds.includes(agency._id)}
//                     onChange={() => handleSelectAgency(agency._id)}
//                   />
//                 </td>
//                 <td className="p-4">{agency.name}</td>
//                 <td className="p-4">{agency.location}</td>
//                 <td className="p-4">{agency.category}</td>
//                 <td className="p-4">{agency.teamSize}</td>
//                 <td className="p-4">{agency.rating}</td>
//                 <td className="p-4">
//                   <button
//                     onClick={() => handleEditAgency(agency)}
//                     className="px-2 py-1 text-sm text-black rounded"
//                   >
//                     <FaRegEdit size={20} />
//                   </button>
//                   <button
//                     onClick={handleBulkDelete}
//                     className="px-2 py-1 text-sm text-black rounded ml-2"
//                   >
//                     <MdDelete size={20} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => handlePagination('prev')}
//             disabled={currentPage === 1}
//             className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-slate-900 text-white hover:bg-slate-600'}`}
//           >
//             Previous
//           </button>
//           <p>
//             Page {currentPage} of {Math.ceil(filteredAgencies.length / rowsPerPage)}
//           </p>
//           <button
//             onClick={() => handlePagination('next')}
//             disabled={currentPage === Math.ceil(filteredAgencies.length / rowsPerPage)}
//             className={`px-4 py-2 rounded ${currentPage === Math.ceil(filteredAgencies.length / rowsPerPage) ? 'bg-gray-300' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {isAddCompanyModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg w-1/2">
//             <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Company' : 'Add Company'}</h2>
//             <form>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   value={newCompany.name}
//                   onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Location</label>
//                 <input
//                   type="text"
//                   value={newCompany.location}
//                   onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Category</label>
//                 <input
//                   type="text"
//                   value={newCompany.category}
//                   onChange={(e) => setNewCompany({ ...newCompany, category: e.target.value })}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Team Size</label>
//                 <input
//                   type="text"
//                   value={newCompany.teamSize}
//                   onChange={(e) => setNewCompany({ ...newCompany, teamSize: e.target.value })}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Rate</label>
//                 <input
//                   type="text"
//                   value={newCompany.rate}
//                   onChange={(e) => setNewCompany({ ...newCompany, rate: e.target.value })}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Rating</label>
//                 <input
//                   type="number"
//                   value={newCompany.rating}min="1"
//                   max="5"
//                   onChange={(e) => setNewCompany({ ...newCompany, rating: +e.target.value })}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Image</label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (file) {
//                       setImageFile(file);
//                       setImagePreview(URL.createObjectURL(file));
//                     }
//                   }}
//                   className="w-full"
//                 />
//                 {imagePreview && (
//                   <Image
//                     src={imagePreview}
//                     alt="Preview"
//                     width={100}
//                     height={100}
//                     className="mt-2"
//                   />
//                 )}
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setAddCompanyModalOpen(false);
//                     resetForm();
//                   }}
//                   className="px-4 py-2 bg-gray-300 rounded mr-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleAddOrEditCompany}
//                   className="px-4 py-2 bg-slate-900 text-white rounded"
//                 >
//                   {isEditing ? 'Save Changes' : 'Add Company'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminCompanyDashboard;