// services/tourPackage.service.js
import axiosClient from "./axiosClient"; // your helper file

// GET all tour packages
export const getAllTourPackages = async () => {
  try {
    const res = await axiosClient.get("/packages");
    return res.data;
  } catch (error) {
    console.error("Error fetching all tour packages:", error);
    throw error;
  }
};

// GET individual tour package by ID
export const getTourPackageById = async (id) => {
  try {
    const res = await axiosClient.get(`/packages/${id}`);
    return res.data;
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
    return res.data;
  } catch (error) {
    console.error("Error fetching approved tour packages:", error);
    throw error;
  }
};

// GET district-wise tour packages
export const getTourPackagesByDistrict = async (district) => {
  try {
    const res = await axiosClient.get("/packages", {
      params: { district }
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching district tour packages:", error);
    throw error;
  }
};

// POST create new tour package
export const createTourPackage = async (packageData) => {
  try {
    const formData = new FormData();
    Object.keys(packageData).forEach((key) => {
      if (Array.isArray(packageData[key])) {
        packageData[key].forEach(file => formData.append(key, file));
      } else {
        formData.append(key, packageData[key]);
      }
    });

    const res = await axiosClient.post("/packages", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating tour package:", error);
    throw error;
  }
};

// PUT update tour package
export const updateTourPackage = async (id, packageData) => {
  try {
    const formData = new FormData();
    Object.keys(packageData).forEach((key) => {
      if (Array.isArray(packageData[key])) {
        packageData[key].forEach(file => formData.append(key, file));
      } else {
        formData.append(key, packageData[key]);
      }
    });

    const res = await axiosClient.put(`/packages/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
