// services/tourPlace.service.js
import axiosClient from "./axiosClient"; // your helper file

// GET all tour places
export const getAllTourPlaces = async () => {
  try {
    const res = await axiosClient.get("/tours");
    return res.data;
  } catch (error) {
    console.error("Error fetching all tour places:", error);
    throw error;
  }
};

// GET individual tour place by ID
export const getTourPlaceById = async (id) => {
  try {
    const res = await axiosClient.get(`/tours/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching tour place:", error);
    throw error;
  }
};

// GET district-wise tour places
export const getTourPlacesByDistrict = async (district) => {
  try {
    const res = await axiosClient.get("/tours", {
      params: { district }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching district tour places:", error);
    throw error;
  }
};

// POST create new tour place
export const createTourPlace = async (tourData) => {
  try {
    let formData;
    // If caller already passed a FormData (e.g., AddTourPlace), use it directly
    if (typeof FormData !== 'undefined' && tourData instanceof FormData) {
      formData = tourData;
    } else {
      formData = new FormData();

      // Handle each field appropriately
      Object.keys(tourData).forEach((key) => {
        if (key === "images" && tourData[key]) {
          // Handle images array
          if (typeof FileList !== 'undefined' && tourData[key] instanceof FileList) {
            for (let i = 0; i < tourData[key].length; i++) {
              formData.append("images", tourData[key][i]);
            }
          } else if (Array.isArray(tourData[key])) {
            tourData[key].forEach(file => formData.append("images", file));
          }
        } else if (key === "location" && tourData[key]) {
          // Convert location object to JSON string
          formData.append(key, JSON.stringify(tourData[key]));
        } else if (tourData[key] !== null && tourData[key] !== undefined && tourData[key] !== "") {
          formData.append(key, tourData[key]);
        }
      });
    }

    // Debug: list FormData entries so we can see what's being sent
    try {
      // create a shallow map of entries (files will show as File objects)
      for (const pair of formData.entries()) {
        // avoid logging entire File binary; show name/type for files
        const [k, v] = pair;
        if (v instanceof File) {
          console.log("FormData entry:", k, "=> File(name=", v.name, ", type=", v.type, ")");
        } else {
          console.log("FormData entry:", k, "=>", v);
        }
      }
    } catch (logErr) {
      console.warn("Could not enumerate FormData entries:", logErr);
    }

    try {
      // Let the browser/axios set the Content-Type with proper boundary for multipart
      const res = await axiosClient.post("/tours", formData);
      return res.data;
    } catch (err) {
      // Attach backend response message if available for easier debugging
      console.error("createTourPlace request error:", err.response?.status, err.response?.data || err.message);
      const backendMessage = err.response?.data?.message || err.response?.data || err.message;
      const newErr = new Error(backendMessage);
      newErr.original = err;
      throw newErr;
    }
  } catch (error) {
    console.error("Error preparing/creating tour place:", error);
    throw error;
  }
};


// PUT update tour place
export const updateTourPlace = async (id, tourData) => {
  try {
    const formData = new FormData();
    Object.keys(tourData).forEach((key) => {
      if (Array.isArray(tourData[key])) {
        tourData[key].forEach(file => formData.append(key, file));
      } else {
        formData.append(key, tourData[key]);
      }
    });

    // Let axios set multipart headers automatically
    const res = await axiosClient.put(`/tours/${id}`, formData);
    return res.data;
  } catch (error) {
    console.error("Error updating tour place:", error);
    throw error;
  }
};

// DELETE tour place
export const deleteTourPlace = async (id) => {
  try {
    const res = await axiosClient.delete(`/tours/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting tour place:", error);
    throw error;
  }
};

