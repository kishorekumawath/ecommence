// services/locationService.js

/**
 * Validates Indian PIN code format
 * @param {string} pincode - The PIN code to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/; // Indian pincode format
  return pincodeRegex.test(pincode);
};

/**
 * Fetches city and state information based on Indian PIN code
 * @param {string} pincode - The PIN code to fetch location for
 * @returns {Promise<Object>} - Promise that resolves to location data or error
 */
export const fetchLocationByPincode = async (pincode) => {
  // Validate PIN code format first
  if (!validatePincode(pincode)) {
    throw new Error("Invalid PIN code format");
  }

  try {
    // Using the official India Post API
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if the API returned valid data
    if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
      const postOffice = data[0].PostOffice[0];

      return {
        success: true,
        data: {
          city: postOffice.District,
          state: postOffice.State,
          area: postOffice.Name,
          division: postOffice.Division,
          region: postOffice.Region,
          circle: postOffice.Circle,
        },
        message: `Location detected: ${postOffice.District}, ${postOffice.State}`,
      };
    } else {
      // If PIN code is not found
      return {
        success: false,
        error: "Invalid PIN code or location not found",
        data: null,
      };
    }
  } catch (error) {
    console.error("Error fetching location:", error);

    // Return structured error response
    return {
      success: false,
      error: "Unable to fetch location. Please enter manually.",
      data: null,
      originalError: error.message,
    };
  }
};

/**
 * Debounced version of fetchLocationByPincode for real-time input
 * @param {string} pincode - The PIN code to fetch location for
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 * @returns {Promise<Object>} - Promise that resolves to location data or error
 */
export const debouncedFetchLocation = (() => {
  let timeoutId;

  return (pincode, delay = 500) => {
    return new Promise((resolve) => {
      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set new timeout
      timeoutId = setTimeout(async () => {
        const result = await fetchLocationByPincode(pincode);
        resolve(result);
      }, delay);
    });
  };
})();

/**
 * Batch fetch locations for multiple PIN codes
 * @param {string[]} pincodes - Array of PIN codes
 * @returns {Promise<Object[]>} - Promise that resolves to array of location results
 */
export const fetchMultipleLocations = async (pincodes) => {
  try {
    const promises = pincodes.map((pincode) => fetchLocationByPincode(pincode));
    const results = await Promise.allSettled(promises);

    return results.map((result, index) => ({
      pincode: pincodes[index],
      ...result.value,
    }));
  } catch (error) {
    console.error("Error fetching multiple locations:", error);
    throw error;
  }
};

/**
 * Get all post offices for a PIN code (if multiple exist)
 * @param {string} pincode - The PIN code to fetch all post offices for
 * @returns {Promise<Object>} - Promise that resolves to all post office data
 */
export const fetchAllPostOfficesByPincode = async (pincode) => {
  if (!validatePincode(pincode)) {
    throw new Error("Invalid PIN code format");
  }

  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
      return {
        success: true,
        data: {
          postOffices: data[0].PostOffice,
          count: data[0].PostOffice.length,
          primaryLocation: {
            city: data[0].PostOffice[0].District,
            state: data[0].PostOffice[0].State,
          },
        },
        message: `Found ${data[0].PostOffice.length} post office(s) for PIN ${pincode}`,
      };
    } else {
      return {
        success: false,
        error: "Invalid PIN code or location not found",
        data: null,
      };
    }
  } catch (error) {
    console.error("Error fetching all post offices:", error);
    return {
      success: false,
      error: "Unable to fetch location data. Please try again.",
      data: null,
      originalError: error.message,
    };
  }
};
