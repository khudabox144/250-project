"use client";
import React, { useState, useEffect, useCallback } from "react";
import LoadingSpinner from "../common/LoadingSpinner"; // Reusing the spinner component

// --- Configuration ---
// Main API endpoint for posting a new tour place (using FormData for file upload)
const API_URL = "http://localhost:5000/api/tours"; 
// API endpoints for dependent resources
const DIVISION_API_URL = "http://localhost:5000/api/divisions"; 
const DISTRICT_API_URL = "http://localhost:5000/api/districts"; 

const AddTourPlace = () => {
    // Schema fields
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        images: null, // Holds FileList object
        division: "",
        district: "",
        location: {
            type: "Point",
            coordinates: [90.3994, 23.7778], // Default Longitude, Latitude
        },
        isApproved: false, 
        createdBy: "60c728b9c8d1f7001c8c4e99", // Mock User ID - this should ideally come from an authentication context
    });

    const [availableDivisions, setAvailableDivisions] = useState([]);
    const [allDistricts, setAllDistricts] = useState([]); // Store all districts fetched from the server
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null); // Success or Error message
    const [error, setError] = useState(null); // Dedicated error state for initial fetch

    // --- Fetch Division and District Data on Mount ---
    const fetchDependencies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Divisions
            const [divRes, distRes] = await Promise.all([
                fetch(DIVISION_API_URL),
                fetch(DISTRICT_API_URL),
            ]);

            if (!divRes.ok || !distRes.ok) {
                throw new Error("Failed to fetch location data from the server.");
            }

            const divisionData = await divRes.json();
            const districtData = await distRes.json();
            
            // Assuming your server returns data in the format: { success: true, data: [...] }
            setAvailableDivisions(divisionData.data || []);
            setAllDistricts(districtData.data || []);

        } catch (err) {
            console.error("Dependency Fetch Error:", err);
            setError(`Failed to load necessary location data. Please ensure the server is running at ${window.location.protocol}//${window.location.host} and the API endpoints are correct.`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDependencies();
    }, [fetchDependencies]);


    // --- Filter Districts when Division changes ---
    const filteredDistricts = allDistricts.filter(
        (dist) => dist.division === formData.division // Assuming dist object has a 'division' field referencing the division ID
    );

    useEffect(() => {
        // Reset district selection if the previous one is invalid for the new division
        if (formData.division && !filteredDistricts.some(d => d._id === formData.district)) {
            setFormData(prev => ({ ...prev, district: "" }));
        }
        if (!formData.division) {
            setFormData(prev => ({ ...prev, district: "" }));
        }
    }, [formData.division, formData.district, filteredDistricts]); 

    // --- Handlers ---

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
    
    // Optional: Get actual coordinates from the browser
    const getMyCoordinates = () => {
        setMessage({ type: 'info', text: 'Attempting to fetch location...' });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        location: {
                            ...prev.location,
                            // GeoJSON stores coordinates as [longitude, latitude]
                            coordinates: [position.coords.longitude, position.coords.latitude], 
                        }
                    }));
                    setMessage({ type: 'success', text: 'Coordinates set from current location!' });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setMessage({ type: 'error', text: 'Could not fetch location. Please enter manually.' });
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            setMessage({ type: 'error', text: 'Geolocation is not supported by your browser.' });
        }
    };

    // HANDLER UPDATED for file input
    const handleImageChange = (e) => {
        // Set the files property (FileList) directly
        setFormData(prev => ({ ...prev, images: e.target.files }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);
        
        // --- Create FormData for multipart/form-data submission (required for file uploads) ---
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('division', formData.division);
        data.append('district', formData.district);
        
        // GeoJSON object must be stringified before appending to FormData
        data.append('location', JSON.stringify(formData.location)); 
        
        // Append image files
        if (formData.images) {
            for (let i = 0; i < formData.images.length; i++) {
                // Key 'images' MUST match the server's uploadImages.array("images") field name
                data.append('images', formData.images[i]); 
            }
        }
        
        // Append other fields (these are typically ignored/overridden by the server)
        data.append('isApproved', formData.isApproved);
        data.append('createdBy', formData.createdBy);
        
        console.log("Submitting FormData to server:", data);

        // --- Actual POST Request Logic ---
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                // IMPORTANT: Do NOT set Content-Type header. The browser handles 
                // setting Content-Type: multipart/form-data with the correct boundary.
                body: data, 
            });

            if (!res.ok) {
                // If the server requires authentication, this is where you'd see a 401/403 error.
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to add tour place to server. (Check server logs, network, and auth token)");
            }

            // const result = await res.json(); // Uncomment to process server response
            
            setMessage({ type: 'success', text: 'Tour Place added successfully! It is now pending approval.' });
            
            // Reset form 
            setFormData({
                name: "",
                description: "",
                images: null,
                division: "",
                district: "",
                location: { type: "Point", coordinates: [90.3994, 23.7778] },
                isApproved: false, 
                createdBy: formData.createdBy, 
            });
            // HACK: To clear the file input field UI after submission
            e.target.reset(); 

        } catch (error) {
            console.error("Submission Error:", error);
            setMessage({ type: 'error', text: error.message || 'An unexpected error occurred during submission.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 p-8 rounded-xl shadow-lg">
                <LoadingSpinner size="xl" color="teal" />
                <p className="mt-4 text-lg font-medium text-gray-700">Loading location data from server...</p>
            </div>
        );
    }
    
    // Display fatal error if data fetch failed
    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-8 bg-red-50 border border-red-300 rounded-xl my-8 shadow-lg">
                <h2 className="text-2xl font-bold text-red-800 mb-4">Connection Error</h2>
                <p className="text-red-700">{error}</p>
                <button 
                    onClick={fetchDependencies} 
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                >
                    Try Reloading Data
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-white shadow-2xl rounded-3xl my-8 border-t-8 border-teal-500">
            <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
                ➕ Submit New Tour Place
            </h1>

            {/* Status Message Display */}
            {message && (
                <div 
                    className={`p-4 mb-6 rounded-xl font-medium ${
                        message.type === 'success' ? 'bg-green-100 text-green-700 border-green-300' : 
                        message.type === 'error' ? 'bg-red-100 text-red-700 border-red-300' : 
                        'bg-blue-100 text-blue-700 border-blue-300'
                    } border`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Name */}
                <div className="form-group">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Place Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Sundarbans Mangrove Forest"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-teal-500 transition"
                    />
                </div>

                {/* 2. Description */}
                <div className="form-group">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="A brief overview of the place, history, and major attractions."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-teal-500 transition resize-none"
                    />
                </div>

                {/* 3. Division & District (Dropdowns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Division */}
                    <div className="form-group">
                        <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">Division <span className="text-red-500">*</span></label>
                        <select
                            id="division"
                            name="division"
                            value={formData.division}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-teal-500 focus:ring-teal-500 transition"
                        >
                            <option value="" disabled>Select Division</option>
                            {availableDivisions.map(div => (
                                <option key={div._id} value={div._id}>{div.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* District */}
                    <div className="form-group">
                        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District <span className="text-red-500">*</span></label>
                        <select
                            id="district"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                            disabled={!formData.division || filteredDistricts.length === 0}
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:border-teal-500 focus:ring-teal-500 transition disabled:bg-gray-100 disabled:text-gray-500"
                        >
                            <option value="" disabled>Select District</option>
                            {filteredDistricts.map(dist => (
                                <option key={dist._id} value={dist._id}>{dist.name}</option>
                            ))}
                        </select>
                        {!formData.division && (
                            <p className="text-xs text-red-500 mt-1">Please select a Division first.</p>
                        )}
                    </div>
                </div>

                {/* 4. Location Coordinates (GeoJSON Point) */}
                <div className="form-group border-t pt-6">
                    <label className="block text-base font-semibold text-gray-800 mb-3">Location Coordinates (Longitude, Latitude) <span className="text-red-500">*</span></label>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Longitude */}
                        <input
                            type="number"
                            step="0.0001"
                            placeholder="Longitude (e.g., 90.3994)"
                            value={formData.location.coordinates[0]}
                            onChange={(e) => handleCoordinatesChange(0, e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-teal-500 transition"
                        />
                        {/* Latitude */}
                        <input
                            type="number"
                            step="0.0001"
                            placeholder="Latitude (e.g., 23.7778)"
                            value={formData.location.coordinates[1]}
                            onChange={(e) => handleCoordinatesChange(1, e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-teal-500 transition"
                        />
                    </div>
                    
                    <button
                        type="button"
                        onClick={getMyCoordinates}
                        className="mt-3 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-medium shadow-md flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>Use My Current Location</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                        Format: GeoJSON Point [Longitude, Latitude]. Default is Dhaka.
                    </p>
                </div>

                {/* 5. Images - UPDATED to handle file input */}
                <div className="form-group border-t pt-6">
                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Multiple Files) <span className="text-red-500">*</span></label>
                    <input
                        type="file"
                        id="images"
                        name="images"
                        onChange={handleImageChange}
                        required 
                        multiple 
                        accept="image/*"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-teal-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Select one or more image files for the tour place. (Required by server)
                    </p>
                </div>
                
                {/* 6. Submission Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl ${
                            isSubmitting 
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                                : 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-2xl transform hover:scale-[1.01]'
                        }`}
                    >
                        {isSubmitting && <LoadingSpinner size="sm" color="white" />}
                        <span className={isSubmitting ? 'ml-2' : ''}>
                            {isSubmitting ? "Submitting..." : "Add Tour Place"}
                        </span>
                    </button>
                    <p className="text-center text-sm text-gray-500 mt-3">
                        * Submission requires administrator approval (`isApproved: false`)
                    </p>
                </div>
            </form>
        </div>
    );
};

export default AddTourPlace;