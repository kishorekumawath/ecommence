// services/sliderService.js
import axios from "axios";
import { BASE_URL } from "../server/server";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Slider service object
const sliderService = {
  // Get active sliders for public display
  getActiveSliders: async () => {
    try {
      const response = await api.get("/activeSliders");
      return response.data;
    } catch (error) {
      console.error("Error fetching active sliders:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch sliders"
      );
    }
  },

  // Admin: Get all sliders with pagination
  getAllSliders: async (page = 1, limit = 10, isActive = null) => {
    try {
      const params = { page, limit };
      if (isActive !== null) {
        params.isActive = isActive;
      }

      const response = await api.get("/sliders", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching all sliders:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch sliders"
      );
    }
  },

  // Admin: Get single slider
  getSlider: async (id) => {
    try {
      const response = await api.get(`/slider/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching slider:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch slider"
      );
    }
  },
  // Track slider impression
  trackImpression: async (sliderId) => {
    try {
      const response = await api.post(`/slider/${sliderId}/impression`);
      return response.data;
    } catch (error) {
      console.error("Error tracking impression:", error);
      // Don't throw error for tracking - fail silently
    }
  },

  // Track slider click
  trackClick: async (sliderId) => {
    try {
      const response = await api.post(`/slider/${sliderId}/click`);
      return response.data;
    } catch (error) {
      console.error("Error tracking click:", error);
      // Don't throw error for tracking - fail silently
    }
  },
};

export default sliderService;
