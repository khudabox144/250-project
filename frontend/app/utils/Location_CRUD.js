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
  { _id: "d1", name: "Dhaka", divisionId: "1" },
  { _id: "d2", name: "Gazipur", divisionId: "1" },
  { _id: "d3", name: "Narayanganj", divisionId: "1" },
  { _id: "d4", name: "Tangail", divisionId: "1" },
  { _id: "d5", name: "Comilla", divisionId: "2" },
  { _id: "d6", name: "Cox's Bazar", divisionId: "2" },
  { _id: "d7", name: "Khulna", divisionId: "3" },
  { _id: "d8", name: "Bagerhat", divisionId: "3" },
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
    // Handle different response structures
    const districts = res.data.data || res.data || [];
    console.log("✅ Districts from API:", districts.length, districts);
    return districts.map(district => ({
      ...district,
      division: district.division || district.divisionId // Map divisionId to division
    }));
  } catch (err) {
    console.warn("⚠️ Using fallback districts:", err.message);
    return FALLBACK_DISTRICTS.map(district => ({
      ...district,
      division: district.divisionId // Map divisionId to division
    }));
  }
};

// GET districts by division
export const getDistrictsByDivision = async (divisionId) => {
  try {
    const res = await axiosClient.get(`/districts/division/${divisionId}`);
    const districts = res.data.data || res.data || [];
    console.log(`✅ Districts for division ${divisionId}:`, districts.length, districts);
    // Map divisionId to division for consistency
    return districts.map(district => ({
      ...district,
      division: district.division || district.divisionId
    }));
  } catch (err) {
    console.warn("⚠️ Using fallback districts by division:", err.message);
    return FALLBACK_DISTRICTS
      .filter(d => d.divisionId === divisionId)
      .map(district => ({
        ...district,
        division: district.divisionId // Map divisionId to division
      }));
  }
};

// GET all divisions with their districts
export const getAllDivisionsWithDistricts = async () => {
  try {
    console.log("📡 Starting to fetch divisions with districts...");
    
    // Fetch divisions and districts separately
    const [divisionsData, allDistricts] = await Promise.all([
      getAllDivisions(),
      getAllDistricts()
    ]);

    console.log("🔍 Raw divisions data:", divisionsData);
    console.log("🔍 Raw all districts:", allDistricts);

    // Combine divisions with their districts
    const divisionsWithDistricts = divisionsData.map(division => {
      // Filter districts that belong to this division
      const divisionDistricts = allDistricts.filter(district => 
        district.division === division._id || district.divisionId === division._id
      );

      console.log(`🏛️ ${division.name} has ${divisionDistricts.length} districts`);

      return {
        ...division,
        districts: divisionDistricts
      };
    });

    console.log("✅ Combined divisions with districts:", divisionsWithDistricts);
    
    return divisionsWithDistricts;
  } catch (err) {
    console.warn("⚠️ Using fallback divisions with districts:", err.message);
    // Return fallback data with combined districts
    return FALLBACK_DIVISIONS.map(div => ({
      ...div,
      districts: FALLBACK_DISTRICTS
        .filter(d => d.divisionId === div._id)
        .map(district => ({
          ...district,
          division: district.divisionId // Map divisionId to division
        }))
    }));
  }
};

// GET single division by ID with districts
export const getDivisionByIdWithDistricts = async (divisionId) => {
  try {
    console.log(`📡 Fetching division ${divisionId} with districts...`);
    
    // First get the division
    const divisions = await getAllDivisions();
    const division = divisions.find(div => div._id === divisionId);
    
    if (!division) {
      throw new Error(`Division with ID ${divisionId} not found`);
    }

    // Then get districts for this division
    const districts = await getDistrictsByDivision(divisionId);
    
    return {
      ...division,
      districts: districts
    };
  } catch (err) {
    console.warn("⚠️ Using fallback division with districts:", err.message);
    const fallbackDivision = FALLBACK_DIVISIONS.find(div => div._id === divisionId);
    if (!fallbackDivision) {
      throw new Error(`Division with ID ${divisionId} not found`);
    }
    
    return {
      ...fallbackDivision,
      districts: FALLBACK_DISTRICTS
        .filter(d => d.divisionId === divisionId)
        .map(district => ({
          ...district,
          division: district.divisionId
        }))
    };
  }
};

// GET single district by ID
export const getDistrictById = async (districtId) => {
  try {
    // Since you don't have a direct endpoint for single district,
    // we'll fetch all districts and find the matching one
    const allDistricts = await getAllDistricts();
    const district = allDistricts.find(d => d._id === districtId);
    
    if (!district) {
      throw new Error(`District with ID ${districtId} not found`);
    }
    
    return district;
  } catch (err) {
    console.warn("⚠️ Using fallback district:", err.message);
    const fallbackDistrict = FALLBACK_DISTRICTS.find(d => d._id === districtId);
    if (!fallbackDistrict) {
      throw new Error(`District with ID ${districtId} not found`);
    }
    
    return {
      ...fallbackDistrict,
      division: fallbackDistrict.divisionId
    };
  }
};

// Test function to debug API response
export const testDivisionAPI = async () => {
  try {
    console.log("🧪 Testing division API endpoints...");
    
    // Test divisions endpoint
    const divisionsRes = await axiosClient.get("/divisions");
    console.log("🧪 Divisions endpoint response:", divisionsRes.data);
    
    // Test districts endpoint
    const districtsRes = await axiosClient.get("/districts");
    console.log("🧪 Districts endpoint response:", districtsRes.data);
    
    let districtsByDivisionRes = null;
    
    // Test districts by division endpoint (using first division ID)
    if (divisionsRes.data && (Array.isArray(divisionsRes.data) || Array.isArray(divisionsRes.data?.data))) {
      const divisionsArray = Array.isArray(divisionsRes.data) ? divisionsRes.data : divisionsRes.data.data;
      
      if (divisionsArray.length > 0) {
        const firstDivisionId = divisionsArray[0]._id;
        console.log("🧪 Testing with division ID:", firstDivisionId);
        
        districtsByDivisionRes = await axiosClient.get(`/districts/division/${firstDivisionId}`);
        console.log("🧪 Districts by division endpoint response:", districtsByDivisionRes.data);
      }
    }
    
    return {
      divisions: divisionsRes.data,
      districts: districtsRes.data,
      districtsByDivision: districtsByDivisionRes?.data
    };
  } catch (error) {
    console.error("🧪 TEST - API Error:", error);
    return null;
  }
};