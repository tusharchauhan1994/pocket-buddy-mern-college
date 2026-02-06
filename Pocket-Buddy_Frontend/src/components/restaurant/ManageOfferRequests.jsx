import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RestaurantSidebar from "./RestaurantSidebar";
import { FiSearch, FiFilter, FiClock, FiCheck, FiX } from "react-icons/fi";
import { BsSortDown, BsSortUp } from "react-icons/bs";

const ManageOfferRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setMessage("");

    const ownerId = localStorage.getItem("id");
    if (!ownerId) {
      toast.error("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/redeem/owner/${ownerId}`
      );

      if (!response.data.length) {
        setMessage("No redemption requests found.");
      } else {
        setRequests(response.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, status) => {
    try {
      await axios.put(
        `http://localhost:3000/redeem/update-status/${requestId}`,
        {
          status,
        }
      );
      toast.success(`Request ${status}!`);
      fetchRequests();
    } catch (error) {
      console.error(`Error updating request to ${status}:`, error);
      toast.error("Failed to update request. Try again.");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredRequests = requests
    .filter((req) => {
      const matchesFilter = req.status === filter;
      const matchesSearch =
        searchTerm === "" ||
        req.user_id?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        req.user_id?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        req.offer_id?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block w-auto">
        <RestaurantSidebar />
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Manage Offer Requests
        </h1>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or offer..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600 flex items-center">
              <FiFilter className="mr-1" /> Filter:
            </span>
            {["Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-md text-sm flex items-center ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {status === "Pending" && <FiClock className="mr-1" />}
                {status === "Approved" && <FiCheck className="mr-1" />}
                {status === "Rejected" && <FiX className="mr-1" />}
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="mb-4 flex space-x-4 text-sm">
          <button
            onClick={() => handleSort("createdAt")}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            {sortConfig.key === "createdAt" && (
              <span className="mr-1">
                {sortConfig.direction === "asc" ? <BsSortUp /> : <BsSortDown />}
              </span>
            )}
            Sort by Date
          </button>
          <button
            onClick={() => handleSort("user_id.firstName")}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            {sortConfig.key === "user_id.firstName" && (
              <span className="mr-1">
                {sortConfig.direction === "asc" ? <BsSortUp /> : <BsSortDown />}
              </span>
            )}
            Sort by Name
          </button>
        </div>

        {message && (
          <div className="p-4 mb-4 bg-blue-100 text-blue-800 rounded-lg">
            {message}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Requests List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAndFilteredRequests.length > 0
            ? sortedAndFilteredRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white p-4 shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {request.user_id?.firstName} {request.user_id?.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.user_id?.email || "No Email"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        request.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : request.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <h4 className="font-medium text-gray-700">
                      {request.offer_id?.title || "No Offer Title"}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {request.offer_id?.description || "No Description"}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {filter === "Pending" && (
                      <div className="mt-3 flex justify-end space-x-2">
                        <button
                          onClick={() => handleAction(request._id, "Approved")}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors flex items-center"
                        >
                          <FiCheck className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(request._id, "Rejected")}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors flex items-center"
                        >
                          <FiX className="mr-1" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            : !loading && (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No requests found matching your criteria
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default ManageOfferRequests;
