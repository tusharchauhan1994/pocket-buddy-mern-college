import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RestaurantSidebar from "./RestaurantSidebar";
import { toast } from "react-toastify";
import { Loader } from "../common/Loader";
import { FiUpload, FiCalendar, FiDollarSign, FiPercent, FiCheck, FiPlus } from "react-icons/fi";
import { FaStore, FaImage } from "react-icons/fa";

const AddOffer = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [restaurants, setRestaurants] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [offerData, setOfferData] = useState({
    title: "",
    description: "",
    offer_type: "Flat Discount",
    discount_value: "",
    restaurant_ids: [],
    valid_from: "",
    valid_to: "",
    requires_approval: false,
    min_order_value: "",
    max_redemptions: "",
    status: "Active",
    image: null,
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!userId) {
        toast.error("User authentication error. Please log in again.");
        navigate("/login");
        return;
      }
      
      setIsLoading(true);
      try {
        const res = await axios.get("/admin/restaurants");
        const allRestaurants = res.data.data.flatMap(
          (owner) => owner.restaurants
        );
        const userRestaurants = allRestaurants.filter(
          (restaurant) => restaurant.userId === userId
        );
        setRestaurants(userRestaurants);
      } catch (error) {
        toast.error("Error fetching restaurants. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOfferData({ ...offerData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRestaurantChange = (e) => {
    const { value, checked } = e.target;
    setOfferData((prev) => ({
      ...prev,
      restaurant_ids: checked
        ? [...prev.restaurant_ids, value]
        : prev.restaurant_ids.filter((id) => id !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (offerData.restaurant_ids.length === 0) {
      toast.error("Please select at least one restaurant");
      return;
    }
    
    if (!offerData.image) {
      toast.error("Please upload an offer image");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(offerData).forEach((key) => {
        if (key === "restaurant_ids") {
          offerData[key].forEach((id) =>
            formData.append("restaurant_ids[]", id)
          );
        } else if (key === "image") {
          formData.append("image", offerData.image);
        } else {
          formData.append(key, offerData[key]);
        }
      });

      const res = await axios.post("/offer/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Offer added successfully!");
        navigate("/restaurant/myOffers");
      }
    } catch (error) {
      console.error("Error adding offer:", error);
      toast.error(error.response?.data?.message || "Failed to add offer");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block w-64 flex-shrink-0">
        <RestaurantSidebar />
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
          <Loader />
        </div>
      )}

      <div className="flex-grow p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Offer</h2>
            <button
              onClick={() => navigate("/restaurant/myOffers")}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to Offers
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                <FiPlus className="mr-2" /> Offer Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={offerData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Summer Special Discount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Type*
                  </label>
                  <select
                    name="offer_type"
                    value={offerData.offer_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Flat Discount">Flat Discount</option>
                    <option value="BOGO">Buy One Get One</option>
                    <option value="Limited-Time">Limited-Time Deal</option>
                    <option value="Percentage">Percentage Discount</option>
                    <option value="Unlimited">Unlimited</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={offerData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your offer in detail..."
                  />
                </div>
              </div>
            </div>

            {/* Restaurant Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                <FaStore className="mr-2" /> Available At
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                {restaurants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {restaurants.map((restaurant) => (
                      <div key={restaurant._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`restaurant-${restaurant._id}`}
                          value={restaurant._id}
                          onChange={handleRestaurantChange}
                          checked={offerData.restaurant_ids.includes(restaurant._id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`restaurant-${restaurant._id}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {restaurant.title}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No restaurants available. Please add restaurants first.
                  </p>
                )}
              </div>
            </div>

            {/* Offer Parameters */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                <FiDollarSign className="mr-2" /> Offer Parameters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {offerData.offer_type === "Percentage" ? "Discount Percentage*" : "Discount Value*"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {offerData.offer_type === "Percentage" ? (
                        <FiPercent className="text-gray-400" />
                      ) : (
                        <FiDollarSign className="text-gray-400" />
                      )}
                    </div>
                    <input
                      type="number"
                      name="discount_value"
                      value={offerData.discount_value}
                      onChange={handleChange}
                      required
                      min="0"
                      className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={offerData.offer_type === "Percentage" ? "10" : "100"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Value
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="min_order_value"
                      value={offerData.min_order_value}
                      onChange={handleChange}
                      min="0"
                      className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Redemptions
                  </label>
                  <input
                    type="number"
                    name="max_redemptions"
                    value={offerData.max_redemptions}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="requires_approval"
                    id="requires_approval"
                    checked={offerData.requires_approval}
                    onChange={(e) =>
                      setOfferData({
                        ...offerData,
                        requires_approval: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requires_approval" className="ml-2 block text-sm text-gray-700">
                    Requires Approval
                  </label>
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                <FiCalendar className="mr-2" /> Validity Period
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="valid_from"
                      value={formatDateForInput(offerData.valid_from)}
                      onChange={handleChange}
                      required
                      min={formatDateForInput(new Date())}
                      className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="valid_to"
                      value={formatDateForInput(offerData.valid_to)}
                      onChange={handleChange}
                      required
                      min={formatDateForInput(offerData.valid_from) || formatDateForInput(new Date())}
                      className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                <FaImage className="mr-2" /> Offer Image
              </h3>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image*
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        {previewImage ? "Change image" : "Click to upload"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                    />
                  </label>
                </div>

                {previewImage && (
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="h-64 border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={previewImage}
                        alt="Offer preview"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || restaurants.length === 0}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Offer...
                  </span>
                ) : (
                  "Create Offer"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOffer;