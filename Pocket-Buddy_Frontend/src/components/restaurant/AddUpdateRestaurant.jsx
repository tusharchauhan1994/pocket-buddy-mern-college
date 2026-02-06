import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import RestaurantSidebar from "./RestaurantSidebar";



export const AddUpdateRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const getAllMyRestaurants = async () => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const res = await axios.get(`/location/getLocationByUserId/${userId}`);
      if (res.data.success) {
        setRestaurants(res.data.data);
      } else {
        console.error("API Error: Response format incorrect", res.data);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;

    try {
      await axios.delete(`/location/deleteRestaurant/${id}`);
      toast.success("Restaurant deleted successfully!");
      setRestaurants((prev) => prev.filter((restaurant) => restaurant._id !== id));
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error("Failed to delete restaurant.");
    }
  };

  const handleEdit = (restaurant) => {
    setEditingId(restaurant._id);
    setEditData({ ...restaurant });
  };

  const handleChange = (e, field) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  const handleSave = async (id) => {
    if (!window.confirm("Are you sure you want to save these changes?")) return;
    try {
      await axios.put(`/location/updateRestaurant/${id}`, editData);
      setRestaurants((prev) => prev.map((restaurant) => (restaurant._id === id ? editData : restaurant)));
      setEditingId(null);
      toast.success("Restaurant updated successfully!");
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast.error("Failed to update restaurant.");
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">My Restaurants</h2>
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto border border-gray-300 rounded-lg">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead className="bg-gray-800 text-white sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left w-12">#</th>
                  <th className="p-3 text-left">Restaurant Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Timings</th>
                  <th className="p-3 text-left">Contact Number</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.length > 0 ? (
                  restaurants.map((restaurant, index) => (
                    <tr key={restaurant._id} className="border-b hover:bg-gray-100 transition-colors">
                      <td className="p-3 text-gray-700">{index + 1}</td>
                      <td className="p-3 text-gray-700">
                        {editingId === restaurant._id ? (
                          <input type="text" value={editData.title} onChange={(e) => handleChange(e, "title")} className="border p-1" />
                        ) : (
                          restaurant.title
                        )}
                      </td>
                      <td className="p-3 text-gray-700">
                        {editingId === restaurant._id ? (
                          <input type="text" value={editData.category} onChange={(e) => handleChange(e, "category")} className="border p-1" />
                        ) : (
                          restaurant.category
                        )}
                      </td>
                      <td className="p-3 text-gray-700">
                        {editingId === restaurant._id ? (
                          <input type="text" value={editData.description} onChange={(e) => handleChange(e, "description")} className="border p-1" />
                        ) : (
                          restaurant.description
                        )}
                      </td>
                      <td className="p-3 text-gray-700">
                        {editingId === restaurant._id ? (
                          <input type="text" value={editData.timings} onChange={(e) => handleChange(e, "timings")} className="border p-1" />
                        ) : (
                          restaurant.timings
                        )}
                      </td>
                      <td className="p-3 text-gray-700">
                        {editingId === restaurant._id ? (
                          <input type="text" value={editData.contactNumber} onChange={(e) => handleChange(e, "contactNumber")} className="border p-1" />
                        ) : (
                          restaurant.contactNumber
                        )}
                      </td>
                      <td className="p-3 text-gray-700">
                        {editingId === restaurant._id ? (
                          <input type="text" value={editData.address} onChange={(e) => handleChange(e, "address")} className="border p-1" />
                        ) : (
                          restaurant.address
                        )}
                      </td>
                      <td className="p-3">
                        <img className="h-24 w-24 object-cover rounded-md shadow" src={restaurant.imageURL} alt={restaurant.title || "Restaurant"} />
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col items-center space-y-2">
                          {editingId === restaurant._id ? (
                            <button onClick={() => handleSave(restaurant._id)} className="px-4 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition w-24">Save</button>
                          ) : (
                            <button onClick={() => handleEdit(restaurant)} className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-24">Edit</button>
                          )}
                          <button onClick={() => handleDelete(restaurant._id)} className="px-4 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition w-24">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (

                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">No restaurants found.</td>
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
