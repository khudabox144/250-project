"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { createTourPlace } from "../utils/TourPlace_CRUD";
import { getAllDivisions, getAllDistricts } from "../utils/Location_CRUD";

const AddTourPlace = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: null,
    division: "",
    district: "",
    location: { type: "Point", coordinates: [90.3994, 23.7778] },
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
      // Fetch divisions and districts from database or fallback
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
    // Support multiple district shapes coming from API or fallback:
    // - { division: '<id>' }
    // - { division: { _id: '<id>' } }
    // - { divisionId: '<id>' } (legacy fallback)
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

  // Fixed useEffect - no infinite loop
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setMessage(null);

  //   // Validation
  //   if (!formData.images || formData.images.length === 0) {
  //     setMessage({ type: "error", text: "Please select at least one image" });
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   if (!formData.division || !formData.district) {
  //     setMessage({ type: "error", text: "Please select both division and district" });
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   try {
  //     // Call the createTourPlace function with formData
  //     const result = await createTourPlace(formData);
      
  //     if (result.status === "success" || result.data) {
  //       setMessage({ 
  //         type: "success", 
  //         text: "Tour place submitted successfully! It will be visible after admin approval." 
  //       });

  //       // Reset form
  //       setFormData({
  //         name: "",
  //         description: "",
  //         images: null,
  //         division: "",
  //         district: "",
  //         location: { type: "Point", coordinates: [90.3994, 23.7778] },
  //       });

  //       // Reset file input
  //       const fileInput = document.querySelector('input[type="file"]');
  //       if (fileInput) fileInput.value = "";
  //     } else {
  //       setMessage({ 
  //         type: "error", 
  //         text: result.message || "Submission failed. Please try again." 
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Submission error:", err);
  //     setMessage({ 
  //       type: "error", 
  //       text: err.response?.data?.message || err.message || "Submission failed. Please try again." 
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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

  try {
    // Use FormData to handle files and nested objects
    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("description", formData.description);
    dataToSend.append("division", formData.division);
    dataToSend.append("district", formData.district);

    // Stringify the location object
    dataToSend.append("location", JSON.stringify(formData.location));

    // Append images
    Array.from(formData.images).forEach((file) => {
      dataToSend.append("images", file);
    });

    const result = await createTourPlace(dataToSend, true); // pass a flag to indicate FormData

    if (result.status === "success" || result.data) {
      setMessage({
        type: "success",
        text: "Tour place submitted successfully! It will be visible after admin approval.",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        images: null,
        division: "",
        district: "",
        location: { type: "Point", coordinates: [90.3994, 23.7778] },
      });

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } else {
      setMessage({
        type: "error",
        text: result.message || "Submission failed. Please try again.",
      });
    }
  } catch (err) {
    console.error("Submission error:", err);
    setMessage({
      type: "error",
      text: err.response?.data?.message || err.message || "Submission failed. Please try again.",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-sky-50 to-blue-50 p-8">
        <LoadingSpinner size="xl" color="blue" />
        <p className="mt-4 text-blue-700 font-medium">Loading location data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-red-50 border border-red-200 rounded-2xl text-center shadow-lg mt-8">
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
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-black p-6 bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-3xl mt-8 border border-blue-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Add New Tour Place
        </h1>
        <p className="text-gray-600 mt-2">Share your favorite destination with the community</p>
      </div>

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
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Place Name *
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter the name of the tour place"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            placeholder="Describe this beautiful place... What makes it special?"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-vertical"
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
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
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

        {/* Coordinates */}
        <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
          <label className="block text-sm font-medium text-blue-800 mb-4">
            Location Coordinates *
          </label>
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
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={getMyCoordinates}
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Use My Current Location</span>
          </button>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images * (Max 5 images)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, WebP. Maximum 5 images.</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-4 rounded-xl font-bold text-white transition-all duration-200 ${
            isSubmitting 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="sm" color="white" />
              <span>Submitting...</span>
            </div>
          ) : (
            "Add Tour Place"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTourPlace;