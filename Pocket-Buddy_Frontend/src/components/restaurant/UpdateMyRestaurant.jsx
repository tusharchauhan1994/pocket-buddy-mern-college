import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantSidebar from "./RestaurantSidebar";

export const UpdateMyRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    axios.get("/state/getallstates").then((res) => setStates(res.data.data));
    axios.get("/foodtype/getAllFoodType").then((res) => setFoodTypes(res.data.data));
  }, []);

  const getCityByStateId = async (stateId) => {
    try {
      const res = await axios.get(`/city/getcitybystate/${stateId}`);
      setCities(res.data.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const getAreaByCityId = async (cityId) => {
    try {
      const res = await axios.get(`/area/getareabycity/${cityId}`);
      setAreas(res.data.data);
    } catch (err) {
      console.error("Error fetching areas:", err);
    }
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`/location/getRestaurant/${id}`); // ✅ Fixed incorrect API endpoint
        const restaurantData = res.data.data;

        if (restaurantData) {
          Object.keys(restaurantData).forEach((key) => {
            setValue(key, restaurantData[key]);
          });

          if (restaurantData.stateId) getCityByStateId(restaurantData.stateId);
          if (restaurantData.cityId) getAreaByCityId(restaurantData.cityId);
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    if (id) fetchRestaurant();
  }, [id, setValue]);

  const submitHandler = async (data) => {
    try {
      data.userId = localStorage.getItem("id");
      delete data._id;

      console.log("Data being sent:", data);  

      const res = await axios.put(`/location/updateRestaurant/${id}`, data);
      console.log("Update response:", res.data);

      alert("Restaurant updated successfully");
      navigate("/restaurant/myRestaurant");
    } catch (error) {
      console.error("Error updating restaurant:", error);
      alert("Failed to update restaurant");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden lg:block w-1/4">
        <RestaurantSidebar />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-6">Update Restaurant</h1>
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            {[
              { label: "Restaurant Name", name: "title" },
              { label: "Category", name: "category" },
              { label: "Description", name: "description", type: "textarea" },
              { label: "Timings", name: "timings" },
              { label: "Contact Number", name: "contactNumber" },
              { label: "Address", name: "address", type: "textarea" },
              { label: "Latitude", name: "latitude" },
              { label: "Longitude", name: "longitude" },
            ].map(({ label, name, type }) => (
              <div key={name} className="flex flex-col">
                <label className="font-medium">{label}</label>
                {type === "textarea" ? (
                  <textarea {...register(name)} className="border border-gray-300 rounded-md p-3" required />
                ) : (
                  <input type="text" {...register(name)} className="border border-gray-300 rounded-md p-3" required />
                )}
              </div>
            ))}

            {[
              { label: "State", name: "stateId", options: states, onChange: getCityByStateId },
              { label: "City", name: "cityId", options: cities, onChange: getAreaByCityId },
              { label: "Area", name: "areaId", options: areas },
              { label: "Food Type", name: "foodTypeId", options: foodTypes },
            ].map(({ label, name, options, onChange }) => (
              <div key={name} className="flex flex-col">
                <label className="font-medium">{label}</label>
                <select
                  {...register(name)}
                  className="border border-gray-300 rounded-md p-3"
                  required
                  onChange={(e) => onChange && onChange(e.target.value)}
                >
                  <option value="">SELECT {label.toUpperCase()}</option>
                  {options.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name || option.foodTypeName}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
