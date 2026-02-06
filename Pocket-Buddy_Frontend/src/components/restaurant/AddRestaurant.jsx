import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RestaurantSidebar from "./RestaurantSidebar";
import { toast } from "react-toastify";
import { Loader } from "../common/Loader";

export const AddRestaurant = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get("/state/getallstates").then((res) => setStates(res.data.data));
    axios
      .get("/foodtype/getAllFoodType")
      .then((res) => setFoodTypes(res.data.data));
  }, []);

  const getCityByStateId = async (id) => {
    const res = await axios.get("/city/getcitybystate/" + id);
    setCities(res.data.data);
  };

  const getAreaByCityId = async (id) => {
    const res = await axios.get("/area/getareabycity/" + id);
    setAreas(res.data.data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
  });

  const navigate = useNavigate();

  const submitHandler = async (data) => {
    setIsLoading(true);
    const userId = localStorage.getItem("id");
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    formData.append("image", data.image[0]);
    formData.append("userId", userId);

    try {
      await axios.post("/location/addWithFile", formData);
      toast.success("Restaurant added successfully");
      navigate("/restaurant/myRestaurant");
    } catch (error) {
      toast.error("Failed to add restaurant");
      console.error("Error adding restaurant:", error);
    }
    setIsLoading(false);
  };

  // Watch state and city to trigger city/area updates
  const selectedState = watch("stateId");
  const selectedCity = watch("cityId");

  useEffect(() => {
    if (selectedState) {
      getCityByStateId(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity) {
      getAreaByCityId(selectedCity);
    }
  }, [selectedCity]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Visible on large screens */}
      <div className="hidden lg:block w-1/4">
        <RestaurantSidebar />
      </div>

      {/* Full-Screen Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-lg z-50">
          <Loader />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            Add Restaurant
          </h1>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-4"
            encType="multipart/form-data"
          >
            {/* First Row - Name and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-medium mb-1">Restaurant Name*</label>
                <input
                  type="text"
                  {...register("title", { required: "Name is required" })}
                  className={`border rounded-md p-2 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.title && (
                  <span className="text-red-500 text-sm">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1">Category*</label>
                <input
                  type="text"
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={`border rounded-md p-2 ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.category && (
                  <span className="text-red-500 text-sm">
                    {errors.category.message}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Description*</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 20,
                    message: "Description should be at least 20 characters",
                  },
                })}
                rows={1}
                className={`border rounded-md p-2 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500`}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Second Row - Timings and Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-medium mb-1">Timings*</label>
                <input
                  type="text"
                  {...register("timings", { required: "Timings are required" })}
                  placeholder="e.g. 10:00 AM - 10:00 PM"
                  className={`border rounded-md p-2 ${
                    errors.timings ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.timings && (
                  <span className="text-red-500 text-sm">
                    {errors.timings.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1">Contact Number*</label>
                <input
                  type="tel"
                  {...register("contactNumber", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Please enter a valid 10-digit phone number",
                    },
                  })}
                  className={`border rounded-md p-2 ${
                    errors.contactNumber ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.contactNumber && (
                  <span className="text-red-500 text-sm">
                    {errors.contactNumber.message}
                  </span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Address*</label>
              <textarea
                {...register("address", { required: "Address is required" })}
                rows={1}
                className={`border rounded-md p-2 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500`}
              />
              {errors.address && (
                <span className="text-red-500 text-sm">
                  {errors.address.message}
                </span>
              )}
            </div>

            {/* Third Row - Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-medium mb-1">Latitude*</label>
                <input
                  type="number"
                  step="any"
                  {...register("latitude", {
                    required: "Latitude is required",
                    min: { value: -90, message: "Minimum latitude is -90" },
                    max: { value: 90, message: "Maximum latitude is 90" },
                  })}
                  className={`border rounded-md p-2 ${
                    errors.latitude ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.latitude && (
                  <span className="text-red-500 text-sm">
                    {errors.latitude.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1">Longitude*</label>
                <input
                  type="number"
                  step="any"
                  {...register("longitude", {
                    required: "Longitude is required",
                    min: { value: -180, message: "Minimum longitude is -180" },
                    max: { value: 180, message: "Maximum longitude is 180" },
                  })}
                  className={`border rounded-md p-2 ${
                    errors.longitude ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                />
                {errors.longitude && (
                  <span className="text-red-500 text-sm">
                    {errors.longitude.message}
                  </span>
                )}
              </div>
            </div>

            {/* Location Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="font-medium mb-1">State*</label>
                <select
                  {...register("stateId", { required: "State is required" })}
                  className={`border rounded-md p-2 ${
                    errors.stateId ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">SELECT STATE</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.stateId && (
                  <span className="text-red-500 text-sm">
                    {errors.stateId.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1">City*</label>
                <select
                  {...register("cityId", {
                    required: "City is required",
                    disabled: !selectedState,
                  })}
                  className={`border rounded-md p-2 ${
                    errors.cityId ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">SELECT CITY</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.cityId && (
                  <span className="text-red-500 text-sm">
                    {errors.cityId.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-1">Area*</label>
                <select
                  {...register("areaId", {
                    required: "Area is required",
                    disabled: !selectedCity,
                  })}
                  className={`border rounded-md p-2 ${
                    errors.areaId ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">SELECT AREA</option>
                  {areas.map((area) => (
                    <option key={area._id} value={area._id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                {errors.areaId && (
                  <span className="text-red-500 text-sm">
                    {errors.areaId.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Food Type */}
              <div className="flex flex-col">
                <label className="font-medium mb-1">Food Type*</label>
                <select
                  {...register("foodTypeId", {
                    required: "Food type is required",
                  })}
                  className={`border rounded-md p-2 ${
                    errors.foodTypeId ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">SELECT FOOD TYPE</option>
                  {foodTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.foodTypeName}
                    </option>
                  ))}
                </select>
                {errors.foodTypeId && (
                  <span className="text-red-500 text-sm">
                    {errors.foodTypeId.message}
                  </span>
                )}
              </div>

              {/* Image Upload */}
              <div className="flex flex-col">
                <label className="font-medium mb-1">Restaurant Image*</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", {
                    required: "Image is required",
                    validate: {
                      lessThan10MB: (files) =>
                        files[0]?.size < 10000000 || "Maximum 10MB",
                      acceptedFormats: (files) =>
                        ["image/jpeg", "image/png", "image/jpg"].includes(
                          files[0]?.type
                        ) || "Only JPEG, JPG, PNG",
                    },
                  })}
                  className={`border rounded-md p-2 ${
                    errors.image ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.image && (
                  <span className="text-red-500 text-sm">
                    {errors.image.message}
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Add Restaurant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
