// // services/tourPackage.service.js
// import axiosClient from "./axiosClient"; // your helper file

// // GET all tour packages
// export const getAllTourPackages = async () => {
//   try {
//     const res = await axiosClient.get("/packages");
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching all tour packages:", error);
//     throw error;
//   }
// };

// // GET individual tour package by ID
// export const getTourPackageById = async (id) => {
//   try {
//     const res = await axiosClient.get(`/packages/${id}`);
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching tour package:", error);
//     throw error;
//   }
// };

// // GET approved tour packages only
// export const getApprovedTourPackages = async () => {
//   try {
//     const res = await axiosClient.get("/packages", {
//       params: { isApproved: true }
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching approved tour packages:", error);
//     throw error;
//   }
// };

// // GET district-wise tour packages
// export const getTourPackagesByDistrict = async (district) => {
//   try {
//     const res = await axiosClient.get("/packages", {
//       params: { district }
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching district tour packages:", error);
//     throw error;
//   }
// };

// // POST create new tour package
// export const createTourPackage = async (packageData) => {
//   try {
//     const formData = new FormData();
//     Object.keys(packageData).forEach((key) => {
//       if (Array.isArray(packageData[key])) {
//         packageData[key].forEach(file => formData.append(key, file));
//       } else {
//         formData.append(key, packageData[key]);
//       }
//     });

//     const res = await axiosClient.post("/packages", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Error creating tour package:", error);
//     throw error;
//   }
// };

// // PUT update tour package
// export const updateTourPackage = async (id, packageData) => {
//   try {
//     const formData = new FormData();
//     Object.keys(packageData).forEach((key) => {
//       if (Array.isArray(packageData[key])) {
//         packageData[key].forEach(file => formData.append(key, file));
//       } else {
//         formData.append(key, packageData[key]);
//       }
//     });

//     const res = await axiosClient.put(`/packages/${id}`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return res.data;
//   } catch (error) {
//     console.error("Error updating tour package:", error);
//     throw error;
//   }
// };

// // DELETE tour package
// export const deleteTourPackage = async (id) => {
//   try {
//     const res = await axiosClient.delete(`/packages/${id}`);
//     return res.data;
//   } catch (error) {
//     console.error("Error deleting tour package:", error);
//     throw error;
//   }
// };


// services/tourPackage.service.js
import axiosClient from "./axiosClient";

// GET all tour packages
export const getAllTourPackages = async () => {
  try {
    const res = await axiosClient.get("/packages");
    return res.data.data || res.data; // Extract data from wrapper
  } catch (error) {
    console.error("Error fetching all tour packages:", error);
    throw error;
  }
};

// GET individual tour package by ID
export const getTourPackageById = async (id) => {
  try {
    const res = await axiosClient.get(`/packages/${id}`);
    return res.data.data || res.data; // Extract data from wrapper
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
    return res.data.data || res.data; // Extract data from wrapper
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
    return res.data.data || res.data; // Extract data from wrapper
  } catch (error) {
    console.error("Error fetching district tour packages:", error);
    throw error;
  }
};

// POST create new tour package
export const createTourPackage = async (packageData) => {
  try {
    let formData;

    // If caller already passed a FormData, use it directly
    if (typeof FormData !== 'undefined' && packageData instanceof FormData) {
      formData = packageData;
    } else {
      formData = new FormData();

      // Handle each field appropriately
      Object.keys(packageData).forEach((key) => {
        if (key === "images" && packageData[key]) {
          // Handle images array
          if (typeof FileList !== 'undefined' && packageData[key] instanceof FileList) {
            for (let i = 0; i < packageData[key].length; i++) {
              formData.append("images", packageData[key][i]);
            }
          } else if (Array.isArray(packageData[key])) {
            packageData[key].forEach(file => formData.append("images", file));
          }
        } else if (key === "itinerary" && packageData[key]) {
          // Convert itinerary array to JSON string
          formData.append(key, JSON.stringify(packageData[key]));
        } else if (key === "location" && packageData[key]) {
          // Convert location object to JSON string
          formData.append(key, JSON.stringify(packageData[key]));
        } else if (key === "highlights" && packageData[key]) {
          // Convert highlights array to JSON string
          formData.append(key, JSON.stringify(packageData[key]));
        } else if (key === "inclusions" && packageData[key]) {
          // Convert inclusions array to JSON string
          formData.append(key, JSON.stringify(packageData[key]));
        } else if (packageData[key] !== null && packageData[key] !== undefined && packageData[key] !== "") {
          formData.append(key, packageData[key]);
        }
      });
    }

    // Debug: list FormData entries
    console.log("🔍 Tour Package FormData entries:");
    for (const pair of formData.entries()) {
      const [k, v] = pair;
      if (v instanceof File) {
        console.log("  ", k, "=> File(name=", v.name, ", type=", v.type, ")");
      } else {
        console.log("  ", k, "=>", v);
      }
    }

    // Let axios set the Content-Type automatically with proper boundary
    const res = await axiosClient.post("/packages", formData);
    return res.data;
  } catch (error) {
    console.error("Error creating tour package:", error);
    throw error;
  }
};

// PUT update tour package
export const updateTourPackage = async (id, packageData) => {
  try {
    let formData;

    // If caller already passed a FormData, use it directly
    if (typeof FormData !== 'undefined' && packageData instanceof FormData) {
      formData = packageData;
    } else {
      formData = new FormData();

      // Handle each field appropriately
      Object.keys(packageData).forEach((key) => {
        if (key === "images" && packageData[key]) {
          // Handle images array
          if (typeof FileList !== 'undefined' && packageData[key] instanceof FileList) {
            for (let i = 0; i < packageData[key].length; i++) {
              formData.append("images", packageData[key][i]);
            }
          } else if (Array.isArray(packageData[key])) {
            packageData[key].forEach(file => formData.append("images", file));
          }
        } else if (key === "itinerary" && packageData[key]) {
          // Convert itinerary array to JSON string
          formData.append(key, JSON.stringify(packageData[key]));
        } else if (key === "location" && packageData[key]) {
          // Convert location object to JSON string
          formData.append(key, JSON.stringify(packageData[key]));
        } else if (key === "highlights" && packageData[key]) {
          // Convert highlights array to JSON string
          formData.append(key, JSON.stringify(packageData[key]));
        } else if (key === "inclusions" && packageData[key]) {
          // Convert inclusions array to JSON string
          formData.append(key, JSON.stringify(packageData[key]));
        } else if (packageData[key] !== null && packageData[key] !== undefined && packageData[key] !== "") {
          formData.append(key, packageData[key]);
        }
      });
    }

    // Let axios set the Content-Type automatically with proper boundary
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
