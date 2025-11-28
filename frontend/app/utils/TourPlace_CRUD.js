// services/tourPlace.service.js
import axiosClient from "./axiosClient"; // your helper file

// GET all tour places
export const getAllTourPlaces = async () => {
  try {
    const res = await axiosClient.get("/api/tours");
    return res.data;
  } catch (error) {
    console.error("Error fetching all tour places:", error);
    throw error;
  }
};

// GET individual tour place by ID
export const getTourPlaceById = async (id) => {
  try {
    const res = await axiosClient.get(`/api/tours/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching tour place:", error);
    throw error;
  }
};

// GET district-wise tour places
export const getTourPlacesByDistrict = async (district) => {
  try {
    const res = await axiosClient.get("/api/tours", {
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
    const formData = new FormData();
    Object.keys(tourData).forEach((key) => {
      if (Array.isArray(tourData[key])) {
        tourData[key].forEach(file => formData.append(key, file));
      } else {
        formData.append(key, tourData[key]);
      }
    });

    const res = await axiosClient.post("/api/tours", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
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

    const res = await axiosClient.put(`/api/tours/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating tour place:", error);
    throw error;
  }
};

// DELETE tour place
export const deleteTourPlace = async (id) => {
  try {
    const res = await axiosClient.delete(`/api/tours/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting tour place:", error);
    throw error;
  }
};
