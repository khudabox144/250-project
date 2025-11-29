"use client";
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { createTourPlace } from '../utils/TourPlace_CRUD';
import axiosClient from '../utils/axiosClient';

// Reuse patterns from AddTourPlace but for package
const AddTourPackage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: null,
    division: '',
    district: '',
    price: '',
  });
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const dres = await axiosClient.get('/divisions');
        const dires = await axiosClient.get('/districts');
        setDivisions(dres.data.data || dres.data || []);
        setDistricts(dires.data.data || dires.data || []);
      } catch (err) {
        console.error('Failed to load divisions/districts', err);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('division', formData.division);
      data.append('district', formData.district);
      data.append('price', formData.price);
      if (formData.images) Array.from(formData.images).forEach(file=>data.append('images', file));

      const res = await axiosClient.post('/packages', data);
      setMessage({ type: 'success', text: 'Package submitted' });
      setFormData({ title:'', description:'', images:null, division:'', district:'', price:'' });
    } catch (err) {
      console.error('Create package failed', err);
      setMessage({ type: 'error', text: err.message || 'Failed' });
    } finally { setIsSubmitting(false); }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Tour Package</h2>
      {message && <div className={`p-3 mb-4 rounded ${message.type==='success'?'bg-green-50':'bg-red-50'}`}>{message.text}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-3 border rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows={4} className="w-full p-3 border rounded" />
        <div className="grid grid-cols-2 gap-4">
          <select name="division" value={formData.division} onChange={handleChange} className="p-3 border rounded">
            <option value="">Select division</option>
            {divisions.map(d=> <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <select name="district" value={formData.district} onChange={handleChange} className="p-3 border rounded">
            <option value="">Select district</option>
            {districts.map(d=> <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>
        <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-3 border rounded" />
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
        <button disabled={isSubmitting} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{isSubmitting? 'Submitting...' : 'Create Package'}</button>
      </form>
    </div>
  );
};

export default AddTourPackage;
