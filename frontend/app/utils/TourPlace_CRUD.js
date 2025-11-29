// services/tourPlace.service.js
import axiosClient from "./axiosClient";

// GET individual tour place by ID
export const getTourPlaceById = async (id) => {
  try {
    const res = await axiosClient.get(`/tours/${id}`);
    
    // Your API returns { status: "success", data: {...} }
    // So we need to return res.data.data
    return res.data.data;
  } catch (error) {
    console.error("Error fetching tour place:", error);
    throw error;
  }
};

// GET all tour places
export const getAllTourPlaces = async () => {
  try {
    const res = await axiosClient.get("/tours");
    return res.data.data;
  } catch (error) {
    console.error("Error fetching all tour places:", error);
    throw error;
  }
};

// GET district-wise tour places
export const getTourPlacesByDistrict = async (district) => {
  try {
    const res = await axiosClient.get("/tours", {
      params: { district }
    });
    return res.data.data;
  } catch (error) {
    console.error("Error fetching district tour places:", error);
    throw error;
  }
};

// POST create new tour place
export const createTourPlace = async (tourData) => {
  try {
    const formData = new FormData();

    Object.keys(tourData).forEach((key) => {
      if (key === "images" && tourData[key]) {
        if (typeof FileList !== 'undefined' && tourData[key] instanceof FileList) {
          for (let i = 0; i < tourData[key].length; i++) {
            formData.append("images", tourData[key][i]);
          }
        } else if (Array.isArray(tourData[key])) {
          tourData[key].forEach(file => formData.append("images", file));
        }
      } else if (key === "location" && tourData[key]) {
        formData.append(key, JSON.stringify(tourData[key]));
      } else if (tourData[key] !== null && tourData[key] !== undefined && tourData[key] !== "") {
        formData.append(key, tourData[key]);
      }
    });

    const res = await axiosClient.post("/tours", formData);
    return res.data.data;
  } catch (error) {
    console.error("Error creating tour place:", error);
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

    const res = await axiosClient.put(`/tours/${id}`, formData);
    return res.data.data;
  } catch (error) {
    console.error("Error updating tour place:", error);
    throw error;
  }
};

// DELETE tour place
export const deleteTourPlace = async (id) => {
  try {
    const res = await axiosClient.delete(`/tours/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Error deleting tour place:", error);
    throw error;
  }
};