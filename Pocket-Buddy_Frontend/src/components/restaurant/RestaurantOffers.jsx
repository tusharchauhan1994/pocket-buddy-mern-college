import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import RestaurantSidebar from "./RestaurantSidebar";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiSave, FiX, FiPlus } from "react-icons/fi";
import { BsFilter, BsSearch } from "react-icons/bs";
import { FaPercentage, FaRupeeSign } from "react-icons/fa";

export const RestaurantOffers = () => {
  const [offers, setOffers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(
    localStorage.getItem("restaurantId") || ""
  );
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // Edit handlers
  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setEditData({
      title: offer.title || "",
      description: offer.description || "",
      offer_type: offer.offer_type || "Flat Discount",
      discount_value: offer.discount_value || "",
      valid_from: offer.valid_from?.split("T")[0] || "",
      valid_to: offer.valid_to?.split("T")[0] || "",
      requires_approval: offer.requires_approval || false,
      min_order_value: offer.min_order_value || "",
      max_redemptions: offer.max_redemptions || "",
      status: offer.status || "Active",
    });
  };

  const handleChange = (e, field) => {
    const value =
      field === "requires_approval" ? e.target.checked : e.target.value;
    setEditData({ ...editData, [field]: value });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    setLoading(true);
    try {
      const res = await axios.put(`/offer/update/${id}`, editData);
      if (res.data.success) {
        setOffers((prev) =>
          prev.map((offer) =>
            offer._id === id ? { ...offer, ...editData } : offer
          )
        );
        setEditingId(null);
        toast.success("Offer updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update offer.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    setLoading(true);
    try {
      const res = await axios.delete(`/offer/delete/${id}`);
      if (res.data.success) {
        setOffers((prev) => prev.filter((offer) => offer._id !== id));
        toast.success("Offer deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete offer.");
    } finally {
      setLoading(false);
    }
  };

  // Data fetching
  const userId = localStorage.getItem("id");
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("/admin/restaurants");
        const userRestaurants =
          res.data.data
            ?.flatMap((owner) => owner.restaurants)
            ?.filter((restaurant) => restaurant.userId === userId) || [];

        setRestaurants(userRestaurants);
        if (!selectedRestaurantId && userRestaurants.length > 0) {
          setSelectedRestaurantId(userRestaurants[0]._id);
          localStorage.setItem("restaurantId", userRestaurants[0]._id);
        }
      } catch (error) {
        toast.error("Error fetching restaurants.");
      }
    };
    fetchRestaurants();
  }, [userId]);

  useEffect(() => {
    if (!selectedRestaurantId) return;

    const fetchOffers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/offer/by-restaurant/${selectedRestaurantId}`
        );
        if (res.data?.success) {
          setOffers(res.data.offers);
        }
      } catch (error) {
        toast.error("Error fetching offers.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [selectedRestaurantId]);

  const handleRestaurantChange = (e) => {
    const newRestaurantId = e.target.value;
    setSelectedRestaurantId(newRestaurantId);
    localStorage.setItem("restaurantId", newRestaurantId);
  };

  // Filter and search
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      searchTerm === "" ||
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || offer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <RestaurantSidebar />

      <div className="flex-grow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Manage Offers</h2>
          <div className="flex gap-3">
            <Link to="/restaurant/addOffer" className="btn-primary">
              <FiPlus className="mr-1" /> Add New Offer
            </Link>
          </div>
        </div>

        {/* Filters and Restaurant Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Restaurant
            </label>
            <select
              value={selectedRestaurantId}
              onChange={handleRestaurantChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>
                    {restaurant.title}
                  </option>
                ))
              ) : (
                <option disabled>No restaurants available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Offers
            </label>
            <div className="relative">
              <BsSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Offers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredOffers.length > 0 ? (
                  filteredOffers.map((offer) => (
                    <tr key={offer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded"
                              src={offer.imageURL}
                              alt={offer.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {editingId === offer._id ? (
                                <input
                                  type="text"
                                  value={editData.title}
                                  onChange={(e) => handleChange(e, "title")}
                                  className="border p-1 rounded w-full"
                                />
                              ) : (
                                offer.title
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {editingId === offer._id ? (
                                <textarea
                                  value={editData.description}
                                  onChange={(e) =>
                                    handleChange(e, "description")
                                  }
                                  className="border p-1 rounded w-full"
                                  rows="2"
                                />
                              ) : (
                                offer.description
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === offer._id ? (
                          <select
                            value={editData.offer_type}
                            onChange={(e) => handleChange(e, "offer_type")}
                            className="border p-1 rounded"
                          >
                            <option value="Flat Discount">Flat Discount</option>
                            <option value="Percentage Discount">
                              Percentage
                            </option>
                          </select>
                        ) : (
                          offer.offer_type
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === offer._id ? (
                          <div className="flex items-center">
                            <input
                              type="number"
                              value={editData.discount_value}
                              onChange={(e) =>
                                handleChange(e, "discount_value")
                              }
                              className="border p-1 rounded w-20"
                            />
                            <span className="ml-1">
                              {editData.offer_type === "Percentage Discount" ? (
                                <FaPercentage className="text-gray-500" />
                              ) : (
                                <FaRupeeSign className="text-gray-500" />
                              )}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {offer.discount_value}
                            {offer.offer_type === "Percentage Discount" ? (
                              <FaPercentage className="ml-1 text-gray-500" />
                            ) : (
                              <FaRupeeSign className="ml-1 text-gray-500" />
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === offer._id ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="date"
                              value={editData.valid_from}
                              onChange={(e) => handleChange(e, "valid_from")}
                              className="border p-1 rounded"
                            />
                            <span className="text-center">to</span>
                            <input
                              type="date"
                              value={editData.valid_to}
                              onChange={(e) => handleChange(e, "valid_to")}
                              className="border p-1 rounded"
                            />
                          </div>
                        ) : (
                          <div className="text-sm text-gray-900">
                            {formatDate(offer.valid_from)} to{" "}
                            {formatDate(offer.valid_to)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === offer._id ? (
                          <select
                            value={editData.status}
                            onChange={(e) => handleChange(e, "status")}
                            className="border p-1 rounded"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              offer.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {offer.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingId === offer._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(offer._id)}
                              className="text-green-600 hover:text-green-900 flex items-center"
                              disabled={loading}
                            >
                              <FiSave className="mr-1" /> Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-gray-600 hover:text-gray-900 flex items-center"
                            >
                              <FiX className="mr-1" /> Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(offer)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <FiEdit2 className="mr-1" /> Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(offer._id)}
                          className="text-red-600 hover:text-red-900 flex items-center mt-1"
                        >
                          <FiTrash2 className="mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No offers found
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

export default RestaurantOffers;
