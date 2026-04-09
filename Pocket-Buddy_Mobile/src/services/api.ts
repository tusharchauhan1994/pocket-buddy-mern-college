import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/src/config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000, // Handle timeout errors
});

// Add interceptor to include token in requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching token from AsyncStorage:", error);
    }
    // Log API requests for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        console.warn(`[API Info] 404 - ${error.config.url}:`, error.response.data);
      } else {
        console.error(`[API Error] ${error.response.status} - ${error.config.url}:`, error.response.data);
      }
    } else if (error.request) {
      console.error(`[API Network Error] No response received for ${error.config?.url}`);
    } else {
      console.error(`[API Setup Error]`, error.message);
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (data: { email: string; password: string }) =>
  api.post("/user/login", data);
export const signup = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
}) => api.post("/user", data);
export const forgotPassword = (email: string) =>
  api.post("/user/forgot-password", { email });
export const resetPassword = (data: { token: string; password: string }) =>
  api.post("/user/reset-password", data);

// Roles
export const getRoles = () => api.get("/roles");

// User
export const getUser = (id: string) => api.get(`/user/user/${id}`);
export const getAllUsers = () => api.get("/user/all");

// Offers
export const getOffers = () => api.get("/offer");
export const getOfferById = (id: string) => api.get(`/offer/${id}`);
export const getOffersByRestaurant = (restaurantId: string) =>
  api.get(`/offer/by-restaurant/${restaurantId}`);
export const addOffer = (formData: FormData) =>
  api.post("/offer/add", formData);
export const updateOffer = (id: string, data: object) =>
  api.put(`/offer/update/${id}`, data);
export const deleteOffer = (id: string) => api.delete(`/offer/delete/${id}`);

// Redeem
export const createRedeem = (data: { user_id: string; offer_id: string }) =>
  api.post("/redeem", data);
export const getRedeemsByUser = (userId: string) =>
  api.get(`/redeem/user/${userId}`);
export const getRedeemsByOwner = (ownerId: string) =>
  api.get(`/redeem/owner/${ownerId}`);
export const updateRedeemStatus = (requestId: string, status: string) =>
  api.put(`/redeem/update-status/${requestId}`, { status });

// Restaurants / Locations
export const getRestaurants = () => api.get("/admin/restaurants");
export const getRestaurantById = (id: string) =>
  api.get(`/location/getRestaurant/${id}`);
export const getRestaurantsByUserId = (userId: string) =>
  api.get(`/location/getLocationByUserId/${userId}`);
export const addRestaurant = (formData: FormData) =>
  api.post("/location/addWithFile", formData);
export const updateRestaurant = (id: string, data: object) =>
  api.put(`/location/updateRestaurant/${id}`, data);
export const deleteRestaurant = (id: string) =>
  api.delete(`/location/deleteRestaurant/${id}`);

// States, Cities, Areas
export const getStates = () => api.get("/state/getallstates");
export const getCitiesByState = (stateId: string) =>
  api.get(`/city/getcitybystate/${stateId}`);
export const getAreasByCity = (cityId: string) =>
  api.get(`/area/getareabycity/${cityId}`);
export const getFoodTypes = () => api.get("/foodType/getAllFoodType");

// Subscription
export const getSubscriptionByUser = (userId: string) =>
  api.get(`/subscription/user/${userId}`);
export const getAllSubscriptions = () => api.get("/subscription/all");
export const saveSubscription = (data: object) =>
  api.post("/subscription/save", data);
export const deleteSubscription = (id: string) =>
  api.delete(`/subscription/${id}`);

// Payment
export const createPaymentOrder = (planName: string) =>
  api.post("/payment/create-order", { planName });
export const verifyPaymentOrder = (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => api.post("/payment/verify-order", data);
