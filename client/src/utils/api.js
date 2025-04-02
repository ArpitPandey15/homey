import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  // timeout: 10 * 1000, // Global timeout
});

// Property Endpoints
export const getAllProperties = async () => {
  try {
    const response = await api.get("/residency/allresd");
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch properties");
    throw error;
  }
};

export const getProperty = async (id) => {
  try {
    const response = await api.get(`/residency/${id}`);
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch property details");
    throw error;
  }
};

export const createResidency = async (data) => {
  try {
    const response = await api.post("/residency/create", { data });
    return response.data;
  } catch (error) {
    toast.error("Failed to create property listing");
    throw error;
  }
};

// User Endpoints
export const createUser = async (email) => {
  try {
    const response = await api.post("/user/register", { email });
    return response.data;
  } catch (error) {
    toast.error("Registration failed");
    throw error;
  }
};

// Booking Endpoints
export const bookVisit = async (date, propertyId, email) => {
  try {
    await api.post(`/user/bookVisit/${propertyId}`, {
      email,
      id: propertyId,
      date: dayjs(date).format("DD/MM/YYYY"),
    });
    toast.success("Visit booked successfully!");
  } catch (error) {
    toast.error("Failed to book visit");
    throw error;
  }
};

export const removeBooking = async (id, email) => {
  try {
    await api.post(`/user/removeBooking/${id}`, { email });
    toast.success("Booking cancelled successfully!");
  } catch (error) {
    toast.error("Failed to cancel booking");
    throw error;
  }
};

export const getAllBookings = async (email) => {
  try {
    const response = await api.post("/user/allBookings", { email });
    return response.data?.bookedVisits || [];
  } catch (error) {
    toast.error("Failed to fetch bookings");
    return [];
  }
};

// Favorite Endpoints
export const toFav = async (id, email) => {
  try {
    await api.post(`/user/toFav/${id}`, { email });
  } catch (error) {
    toast.error("Failed to update favorites");
    throw error;
  }
};

export const getAllFav = async (email) => {
  try {
    const response = await api.post("/user/allFav", { email });
    return response.data?.favResidenciesID || [];
  } catch (error) {
    toast.error("Failed to fetch favorites");
    return [];
  }
};

// Utility function for error handling
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    toast.error(error.response.data.message || "Request failed");
  } else if (error.request) {
    // No response received
    toast.error("No response from server");
  } else {
    // Other errors
    toast.error("Request failed to send");
  }
  throw error;
};

// Add global error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);