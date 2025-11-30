"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { createTourPackage } from "../utils/TourPackage_CRUD";
import { getAllDivisions, getAllDistricts } from "../utils/Location_CRUD";

const AddTourPackage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    days: "",
    nights: "",
    images: null,
    division: "",
    district: "",
    location: { 
      type: "Point", 
      coordinates: [90.3994, 23.7778],
      address: ""
    },
    itinerary: [""],
    highlights: [""],
    inclusions: [""]
  });

  const [availableDivisions, setAvailableDivisions] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchDependencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const divisionsData = await getAllDivisions();
      const districtsData = await getAllDistricts();

      setAvailableDivisions(divisionsData || []);
      setAllDistricts(districtsData || []);

      console.log("✅ Divisions loaded:", divisionsData?.length);
      console.log("✅ Districts loaded:", districtsData?.length);
    } catch (err) {
      console.error("Error loading location data:", err);
      setError("Failed to load location data. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  // Memoized filtered districts
  const filteredDistricts = useMemo(() => {
    if (!formData.division) return [];
    
    console.log("🔍 Filtering with division:", formData.division);
    console.log("📊 All districts:", allDistricts);
    const filtered = allDistricts.filter((dist) => {
      const divisionField = dist.divisionId || dist.division;
      let divId = divisionField;
      if (divisionField && typeof divisionField === 'object') {
        divId = divisionField._id || divisionField.toString();
      }
      const match = String(divId) === String(formData.division);
      console.log(`District: ${dist.name}, divisionField: ${JSON.stringify(divisionField)}, match: ${match}`);
      return match;
    });

    console.log("✅ Filtered districts:", filtered.length, filtered);
    return filtered;
  }, [allDistricts, formData.division]);

  // Reset district when division changes
  useEffect(() => {
    if (formData.division && !filteredDistricts.some(d => d._id === formData.district)) {
      setFormData(prev => ({ ...prev, district: "" }));
    }
    if (!formData.division) {
      setFormData(prev => ({ ...prev, district: "" }));
    }
  }, [formData.division, formData.district, filteredDistricts]);

  // Input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoordinatesChange = (index, value) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      const newCoordinates = [...formData.location.coordinates];
      newCoordinates[index] = numericValue;
      setFormData(prev => ({ 
        ...prev, 
        location: { ...prev.location, coordinates: newCoordinates } 
      }));
    }
  };

  const handleAddressChange = (value) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, address: value }
    }));
  };

  // Array field handlers
  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayField = (field, index) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const getMyCoordinates = () => {
    setMessage({ type: "info", text: "Fetching current location..." });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: [position.coords.longitude, position.coords.latitude],
            }
          }));
          setMessage({ type: "success", text: "Coordinates set from current location!" });
        },
        (err) => {
          const errorMessage = 
            err.code === 1 ? "Location access denied. Please allow location access." :
            err.code === 2 ? "Location unavailable. Please try again." :
            "Could not fetch location. Please try again.";
          setMessage({ type: "error", text: errorMessage });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setMessage({ type: "error", text: "Geolocation not supported by your browser." });
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 5) {
      setMessage({ type: "error", text: "Maximum 5 images allowed" });
      return;
    }
    setFormData(prev => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Validation
    if (!formData.images || formData.images.length === 0) {
      setMessage({ type: "error", text: "Please select at least one image" });
      setIsSubmitting(false);
      return;
    }

    if (!formData.division || !formData.district) {
      setMessage({ type: "error", text: "Please select both division and district" });
      setIsSubmitting(false);
      return;
    }

    if (!formData.location.address.trim()) {
      setMessage({ type: "error", text: "Please provide a detailed address" });
      setIsSubmitting(false);
      return;
    }

    // Filter out empty array items
    const filteredItinerary = formData.itinerary.filter(item => item.trim() !== "");
    const filteredHighlights = formData.highlights.filter(item => item.trim() !== "");
    const filteredInclusions = formData.inclusions.filter(item => item.trim() !== "");

    if (filteredItinerary.length === 0) {
      setMessage({ type: "error", text: "Please provide at least one itinerary item" });
      setIsSubmitting(false);
      return;
    }

    if (filteredHighlights.length === 0) {
      setMessage({ type: "error", text: "Please provide at least one highlight" });
      setIsSubmitting(false);
      return;
    }

    if (filteredInclusions.length === 0) {
      setMessage({ type: "error", text: "Please provide at least one inclusion" });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('🚀 Submitting tour package data:', {
        ...formData,
        itinerary: filteredItinerary,
        highlights: filteredHighlights,
        inclusions: filteredInclusions
      });
      
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
        days: parseInt(formData.days),
        nights: parseInt(formData.nights),
        itinerary: filteredItinerary,
        highlights: filteredHighlights,
        inclusions: filteredInclusions
      };

      const result = await createTourPackage(submissionData);
      
      if (result.status === "success" || result.data) {
        setMessage({ 
          type: "success", 
          text: "Tour package submitted successfully! It will be visible after admin approval." 
        });

        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          days: "",
          nights: "",
          images: null,
          division: "",
          district: "",
          location: { 
            type: "Point", 
            coordinates: [90.3994, 23.7778],
            address: ""
          },
          itinerary: [""],
          highlights: [""],
          inclusions: [""]
        });

        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      } else {
        setMessage({ 
          type: "error", 
          text: result.message || "Submission failed. Please try again." 
        });
      }
    } catch (err) {
      console.error("❌ Submission error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Submission failed. Please try again.";
      setMessage({ 
        type: "error", 
        text: errorMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="xl" color="blue" />
            <p className="mt-4 text-blue-700 font-medium">Loading location data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Connection Error</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={fetchDependencies}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-transparent"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-300/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-20 right-10 w-16 h-16 bg-purple-300/20 rounded-full blur-xl animate-pulse delay-75"></div>
      <div className="absolute bottom-10 left-20 w-24 h-24 bg-cyan-300/20 rounded-full blur-xl animate-pulse delay-150"></div>
      <div className="absolute bottom-20 right-20 w-12 h-12 bg-teal-300/20 rounded-full blur-xl animate-pulse delay-300"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-4 border border-white/50">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Create Tour Package
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Design an amazing tour package with detailed itinerary, highlights, and inclusions
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-white/50">
            {/* Message Alert */}
            {message && (
              <div className={`p-4 mb-6 rounded-xl border-2 font-medium flex items-start space-x-3 ${
                message.type === "success" ? "bg-green-50 border-green-200 text-green-800" :
                message.type === "error" ? "bg-red-50 border-red-200 text-red-800" :
                "bg-blue-50 border-blue-200 text-blue-800"
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === "success" ? "bg-green-100 text-green-600" :
                  message.type === "error" ? "bg-red-100 text-red-600" :
                  "bg-blue-100 text-blue-600"
                }`}>
                  {message.type === "success" && "✓"}
                  {message.type === "error" && "!"}
                  {message.type === "info" && "i"}
                </div>
                <p className="flex-1">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g., Sundarbans Adventure Tour"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (BDT) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter package price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days *
                  </label>
                  <input
                    type="number"
                    name="days"
                    placeholder="Number of days"
                    value={formData.days}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nights *
                  </label>
                  <input
                    type="number"
                    name="nights"
                    placeholder="Number of nights"
                    value={formData.nights}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your tour package in detail. What makes it special? What experiences will travelers have?"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-vertical bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Location Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Division *
                  </label>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">Select Division</option>
                    {availableDivisions.map(div => (
                      <option key={div._id} value={div._id}>{div.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    disabled={!formData.division || filteredDistricts.length === 0}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select District</option>
                    {filteredDistricts.map(dist => (
                      <option key={dist._id} value={dist._id}>{dist.name}</option>
                    ))}
                  </select>
                  {!formData.division && (
                    <p className="text-sm text-gray-500 mt-1">Please select a division first</p>
                  )}
                </div>
              </div>

              {/* Location Details */}
              <div className="bg-blue-50/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-100">
                <label className="block text-sm font-medium text-blue-800 mb-4">
                  📍 Location Details *
                </label>
                
                {/* Address */}
                <div className="mb-4">
                  <label className="block text-xs text-blue-700 mb-2">Detailed Address</label>
                  <input
                    type="text"
                    placeholder="Full address including street, area, landmarks"
                    value={formData.location.address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    required
                    className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/50"
                  />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-blue-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="Longitude"
                      value={formData.location.coordinates[0]}
                      onChange={(e) => handleCoordinatesChange(0, e.target.value)}
                      required
                      className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      placeholder="Latitude"
                      value={formData.location.coordinates[1]}
                      onChange={(e) => handleCoordinatesChange(1, e.target.value)}
                      required
                      className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/50"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={getMyCoordinates}
                  className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Use My Current Location</span>
                </button>
              </div>

              {/* Itinerary */}
              <div className="bg-green-50/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-green-100">
                <label className="block text-sm font-medium text-green-800 mb-4">
                  📅 Daily Itinerary *
                </label>
                {formData.itinerary.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder={`Day ${index + 1}: Describe activities, meals, accommodations`}
                      value={item}
                      onChange={(e) => handleArrayFieldChange('itinerary', index, e.target.value)}
                      className="flex-1 p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white/50"
                    />
                    {formData.itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('itinerary', index)}
                        className="px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('itinerary')}
                  className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Another Day</span>
                </button>
              </div>

              {/* Highlights */}
              <div className="bg-yellow-50/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-100">
                <label className="block text-sm font-medium text-yellow-800 mb-4">
                  ⭐ Package Highlights *
                </label>
                {formData.highlights.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="e.g., Wildlife Safari, Luxury Accommodation, Guided Tours"
                      value={item}
                      onChange={(e) => handleArrayFieldChange('highlights', index, e.target.value)}
                      className="flex-1 p-3 border-2 border-yellow-200 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 bg-white/50"
                    />
                    {formData.highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('highlights', index)}
                        className="px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('highlights')}
                  className="w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Highlight</span>
                </button>
              </div>

              {/* Inclusions */}
              <div className="bg-purple-50/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-purple-100">
                <label className="block text-sm font-medium text-purple-800 mb-4">
                  ✅ What's Included *
                </label>
                {formData.inclusions.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="e.g., All meals, Accommodation, Transportation, Guide"
                      value={item}
                      onChange={(e) => handleArrayFieldChange('inclusions', index, e.target.value)}
                      className="flex-1 p-3 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white/50"
                    />
                    {formData.inclusions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('inclusions', index)}
                        className="px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('inclusions')}
                  className="w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Inclusion</span>
                </button>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🖼️ Upload Package Images * (Max 5 images)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 bg-white/50 backdrop-blur-sm"
                />
                <p className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, WebP. Maximum 5 images.</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-4 rounded-xl font-bold text-white transition-all duration-200 shadow-2xl ${
                  isSubmitting 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner size="sm" color="white" />
                    <span>Creating Package...</span>
                  </div>
                ) : (
                  "🚀 Create Tour Package"
                )}
              </button>
            </form>
          </div>

          {/* Help Text */}
          <div className="text-center mt-8 text-gray-600">
            <p className="text-sm">
              Your tour package will be reviewed by our team before being published.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTourPackage;