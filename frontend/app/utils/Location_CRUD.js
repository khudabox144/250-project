import axiosClient from "./axiosClient";

// Fallback data in case API fails
const FALLBACK_DIVISIONS = [
  { _id: "1", name: "Dhaka" },
  { _id: "2", name: "Chittagong" },
  { _id: "3", name: "Khulna" },
  { _id: "4", name: "Rajshahi" },
  { _id: "5", name: "Barisal" },
  { _id: "6", name: "Sylhet" },
  { _id: "7", name: "Rangpur" },
  { _id: "8", name: "Mymensingh" },
];

const FALLBACK_DISTRICTS = [
  { _id: "d1", name: "Dhaka", division: "1" },
  { _id: "d2", name: "Gazipur", division: "1" },
  { _id: "d3", name: "Narayanganj", division: "1" },
  { _id: "d4", name: "Tangail", division: "1" },
  { _id: "d5", name: "Comilla", division: "2" },
  { _id: "d6", name: "Cox's Bazar", division: "2" },
  { _id: "d7", name: "Khulna", division: "3" },
  { _id: "d8", name: "Bagerhat", division: "3" },
];

// GET all divisions
export const getAllDivisions = async () => {
  try {
    const res = await axiosClient.get("/divisions");
    const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
    console.log("✅ Divisions from API:", data.length, data);
    return data;
  } catch (err) {
    console.warn("⚠️ Using fallback divisions:", err.message);
    return FALLBACK_DIVISIONS;
  }
};

// GET all districts
export const getAllDistricts = async () => {
  try {
    const res = await axiosClient.get("/districts");
    return res.data.data;
  } catch (err) {
    console.warn("⚠️ Using fallback districts:", err.message);
    return FALLBACK_DISTRICTS;
  }
};


// GET districts by division
export const getDistrictsByDivision = async (divisionId) => {
  try {
    const res = await axiosClient.get(`/districts/division/${divisionId}`);
    return res.data.data;
  } catch (err) {
    console.warn("⚠️ Using fallback districts by division:", err.message);
    return FALLBACK_DISTRICTS.filter(d => d.division === divisionId);
  }
};


// GET all divisions with their districts
export const getAllDivisionsWithDistricts = async () => {
  try {
    const res = await axiosClient.get("/divisions/with-districts");
    const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
    return data;
  } catch (err) {
    console.warn("⚠️ Using fallback divisions with districts:", err.message);
    return FALLBACK_DIVISIONS.map(div => ({
      ...div,
      districts: FALLBACK_DISTRICTS.filter(d => d.division === div._id),
    }));
  }
};