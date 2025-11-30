// utils/TourPackage_CRUD.js
import axiosClient from "./axiosClient";

// POST create new tour package
export const createTourPackage = async (packageData) => {
  try {
    console.log('📦 STARTING TOUR PACKAGE CREATION ===');
    console.log('Raw package data:', packageData);

    const formData = new FormData();

    // Process all fields
    Object.keys(packageData).forEach((key) => {
      if (key === "images" && packageData[key] && packageData[key].length > 0) {
        console.log('🖼️ Processing images...');
        
        if (typeof FileList !== 'undefined' && packageData[key] instanceof FileList) {
          console.log(`📸 Found ${packageData[key].length} images in FileList`);
          for (let i = 0; i < packageData[key].length; i++) {
            formData.append("images", packageData[key][i]);
            console.log(`✅ Added image ${i + 1}:`, packageData[key][i].name);
          }
        } else if (Array.isArray(packageData[key])) {
          console.log(`📸 Found ${packageData[key].length} images in array`);
          packageData[key].forEach((file, index) => {
            if (file instanceof File) {
              formData.append("images", file);
              console.log(`✅ Added image ${index + 1}:`, file.name);
            }
          });
        }
      } 
      else if (key === "itinerary" && packageData[key]) {
        const filteredItinerary = packageData[key].filter(item => item && item.trim() !== "");
        const itineraryJSON = JSON.stringify(filteredItinerary);
        formData.append(key, itineraryJSON);
        console.log('📅 Itinerary:', filteredItinerary);
      } 
      else if (key === "location" && packageData[key]) {
        const locationJSON = JSON.stringify(packageData[key]);
        formData.append(key, locationJSON);
        console.log('📍 Location:', packageData[key]);
      } 
      else if (key === "highlights" && packageData[key]) {
        const filteredHighlights = packageData[key].filter(item => item && item.trim() !== "");
        const highlightsJSON = JSON.stringify(filteredHighlights);
        formData.append(key, highlightsJSON);
        console.log('⭐ Highlights:', filteredHighlights);
      } 
      else if (key === "inclusions" && packageData[key]) {
        const filteredInclusions = packageData[key].filter(item => item && item.trim() !== "");
        const inclusionsJSON = JSON.stringify(filteredInclusions);
        formData.append(key, inclusionsJSON);
        console.log('✅ Inclusions:', filteredInclusions);
      } 
      else if (packageData[key] !== null && packageData[key] !== undefined && packageData[key] !== "") {
        formData.append(key, packageData[key]);
        console.log(`📝 ${key}:`, packageData[key]);
      }
    });

    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'days', 'nights', 'division', 'district'];
    const missingFields = requiredFields.filter(field => {
      const value = packageData[field];
      return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
    });
    
    if (missingFields.length > 0) {
      console.error('❌ MISSING REQUIRED FIELDS:', missingFields);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Debug: list all FormData entries
    console.log("🔍 FINAL FORMDATA ENTRIES:");
    for (const pair of formData.entries()) {
      const [k, v] = pair;
      if (v instanceof File) {
        console.log("  ", k, "=> File(name=", v.name, ", type=", v.type, ", size=", v.size, ")");
      } else {
        console.log("  ", k, "=>", typeof v === 'string' && v.length > 100 ? v.substring(0, 100) + '...' : v);
      }
    }

    console.log('🚀 SENDING REQUEST TO /api/packages...');
    const res = await axiosClient.post("/packages", formData);
    console.log('✅ SERVER RESPONSE:', res.data);
    
    return res.data;
    
  } catch (error) {
    console.error("❌ TOUR PACKAGE CREATION ERROR ===");
    
    if (error.response) {
      console.error('📡 RESPONSE ERROR DETAILS:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.response.config?.url
      });
      
      // Extract server error message
      const serverMessage = error.response.data?.message || error.response.data?.error || 'Unknown server error';
      console.error('💬 SERVER MESSAGE:', serverMessage);
      
      // Create enhanced error with server message
      const enhancedError = new Error(serverMessage);
      enhancedError.status = error.response.status;
      enhancedError.response = error.response;
      throw enhancedError;
      
    } else if (error.request) {
      console.error('🌐 NO RESPONSE RECEIVED:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      console.error('⚙️ REQUEST SETUP ERROR:', error.message);
      throw error;
    }
  }
};

// GET all tour packages
export const getAllTourPackages = async (filters = {}) => {
  try {
    const res = await axiosClient.get("/packages", { params: filters });
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching all tour packages:", error);
    throw error;
  }
};

// GET individual tour package by ID
export const getTourPackageById = async (id) => {
  try {
    const res = await axiosClient.get(`/packages/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching tour package:", error);
    throw error;
  }
};

// GET approved tour packages only
export const getApprovedTourPackages = async () => {
  try {
    const res = await axiosClient.get("/packages", {
      params: { isApproved: true }
    });
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching approved tour packages:", error);
    throw error;
  }
};

// GET packages by district
export const getTourPackagesByDistrict = async (districtId) => {
  try {
    const res = await axiosClient.get(`/packages/district/${districtId}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching district tour packages:", error);
    throw error;
  }
};

// GET packages by division
export const getTourPackagesByDivision = async (divisionId) => {
  try {
    const res = await axiosClient.get(`/packages/division/${divisionId}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching division tour packages:", error);
    throw error;
  }
};

// GET my packages (vendor)
export const getMyTourPackages = async () => {
  try {
    const res = await axiosClient.get("/packages/vendor/my-packages");
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching my tour packages:", error);
    throw error;
  }
};

// PUT update tour package
export const updateTourPackage = async (id, packageData) => {
  try {
    console.log('🔄 UPDATING TOUR PACKAGE:', id);
    
    const formData = new FormData();

    Object.keys(packageData).forEach((key) => {
      if (key === "images" && packageData[key] && packageData[key].length > 0) {
        if (typeof FileList !== 'undefined' && packageData[key] instanceof FileList) {
          for (let i = 0; i < packageData[key].length; i++) {
            formData.append("images", packageData[key][i]);
          }
        } else if (Array.isArray(packageData[key])) {
          packageData[key].forEach(file => {
            if (file instanceof File) {
              formData.append("images", file);
            }
          });
        }
      } else if (key === "itinerary" && packageData[key]) {
        formData.append(key, JSON.stringify(packageData[key]));
      } else if (key === "location" && packageData[key]) {
        formData.append(key, JSON.stringify(packageData[key]));
      } else if (key === "highlights" && packageData[key]) {
        formData.append(key, JSON.stringify(packageData[key]));
      } else if (key === "inclusions" && packageData[key]) {
        formData.append(key, JSON.stringify(packageData[key]));
      } else if (packageData[key] !== null && packageData[key] !== undefined && packageData[key] !== "") {
        formData.append(key, packageData[key]);
      }
    });

    const res = await axiosClient.put(`/packages/${id}`, formData);
    return res.data;
  } catch (error) {
    console.error("Error updating tour package:", error);
    throw error;
  }
};

// DELETE tour package
export const deleteTourPackage = async (id) => {
  try {
    const res = await axiosClient.delete(`/packages/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting tour package:", error);
    throw error;
  }
};

// Search tour packages
export const searchTourPackages = async (query, filters = {}) => {
  try {
    const res = await axiosClient.get("/packages", {
      params: { search: query, ...filters }
    });
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error searching tour packages:", error);
    throw error;
  }
};