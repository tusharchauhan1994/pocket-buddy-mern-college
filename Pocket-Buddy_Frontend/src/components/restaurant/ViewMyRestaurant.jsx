import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RestaurantSidebar from "./RestaurantSidebar";

export const ViewMyRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);

  const getAllMyRestaurants = async () => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const res = await axios.get(`/location/getLocationByUserId/${userId}`);
      console.log("Full API Response:", res.data); // Log full response

      if (res.data.success) {
        console.log("Fetched Restaurants:", res.data.data); // Log only data
        setRestaurants(res.data.data);
      } else {
        console.error("API Error: Response format incorrect", res.data);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?"))
      return;

    try {
      const res = await axios.delete(`/location/deleteRestaurant/${id}`);
      alert("Restaurant deleted successfully!");
      setRestaurants((prev) =>
        prev.filter((restaurant) => restaurant._id !== id)
      );
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("Failed to delete restaurant.");
    }
  };

  useEffect(() => {
    getAllMyRestaurants();
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0">
        <RestaurantSidebar />
      </div>
      <div className="flex-grow p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          My Restaurants
        </h2>
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto border border-gray-300 rounded-lg">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead className="bg-gray-800 text-white sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left w-12 sticky left-0 bg-gray-800">
                    #
                  </th>
                  <th className="p-3 text-left">Restaurant Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Timings</th>
                  {/* <th className="p-3 text-left">Active</th> */}{" "}
                  {/* ✅ Commented out */}
                  <th className="p-3 text-left">Contact Number</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.length > 0 ? (
                  restaurants.map((restaurant, index) => (
                    <tr
                      key={restaurant._id}
                      className="border-b hover:bg-gray-100 transition-colors"
                    >
                      <td className="p-3 text-gray-700 sticky left-0 bg-white font-semibold">
                        {index + 1}
                      </td>
                      <td className="p-3 text-gray-700">{restaurant?.title}</td>
                      <td className="p-3 text-gray-700">
                        {restaurant?.category}
                      </td>
                      <td className="p-3 text-gray-700">
                        {restaurant?.description}
                      </td>
                      <td className="p-3 text-gray-700">
                        {restaurant?.timings}
                      </td>
                      {/* <td className="p-3 text-gray-700">
                        {restaurant?.active ? "Yes" : "No"}
                      </td> */}{" "}
                      {/* ✅ Commented out */}
                      <td className="p-3 text-gray-700">
                        {restaurant?.contactNumber}
                      </td>
                      <td className="p-3 text-gray-700">
                        {restaurant?.address}
                      </td>
                      <td className="p-3">
                        <img
                          className="h-24 w-24 object-cover rounded-md shadow"
                          src={restaurant?.imageURL}
                          alt={restaurant?.title || "Restaurant"}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col items-center space-y-2">
                          <Link
                            to={`/restaurant/updateRestaurant/${restaurant._id}`}
                          >
                            <button className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-24">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(restaurant._id)}
                            className="px-4 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition w-24"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No restaurants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
