import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";
import { FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

export const UserRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("id");
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await axios.get(
        `http://localhost:3000/redeem/user/${userId}`
      );
      
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid data format received");
      }

      setRequests(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.response?.data?.message || error.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [refreshTrigger]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedRequests = React.useMemo(() => {
    const sortableItems = [...requests];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        // Handle nested objects (like offer_id.title)
        const getValue = (obj, key) => {
          return key.split('.').reduce((o, k) => (o || {})[k], obj);
        };

        const aValue = getValue(a, sortConfig.key);
        const bValue = getValue(b, sortConfig.key);

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [requests, sortConfig]);

  const formatDateTime = (dateString) => {
    const options = {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-GB", options);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <FaCheckCircle className="text-green-500 inline mr-1" />;
      case "Declined":
        return <FaTimesCircle className="text-red-500 inline mr-1" />;
      default:
        return <FaHourglassHalf className="text-yellow-500 inline mr-1" />;
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-30" />;
    return sortConfig.direction === "asc" 
      ? <FaSortUp className="ml-1" /> 
      : <FaSortDown className="ml-1" />;
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => !prev);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <UserNavbar />
        <div className="px-5 lg:px-32 py-10 flex-1">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-3xl font-semibold">My Offer Requests</h2>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              disabled
            >
              Refreshing...
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border rounded-lg shadow-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <UserNavbar />
        <div className="px-5 lg:px-32 py-10 flex-1">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-3xl font-semibold">My Offer Requests</h2>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Retry
            </button>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-3" />
            <h3 className="text-xl font-medium text-red-600 mb-2">Error Loading Requests</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen mt-16">
      <UserNavbar />
      <div className="px-5 lg:px-32 py-10 flex-1">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-3xl font-semibold">My Offer Requests</h2>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" 
                clipRule="evenodd" 
              />
            </svg>
            Refresh
          </button>
        </div>

        {requests.length > 0 ? (
          <>
            <div className="mb-4 flex space-x-4 overflow-x-auto pb-2">
              <button
                onClick={() => handleSort("offer_id.title")}
                className={`px-3 py-1 rounded-full flex items-center ${
                  sortConfig.key === "offer_id.title" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Offer Title {getSortIcon("offer_id.title")}
              </button>
              <button
                onClick={() => handleSort("status")}
                className={`px-3 py-1 rounded-full flex items-center ${
                  sortConfig.key === "status" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Status {getSortIcon("status")}
              </button>
              <button
                onClick={() => handleSort("createdAt")}
                className={`px-3 py-1 rounded-full flex items-center ${
                  sortConfig.key === "createdAt" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Request Date {getSortIcon("createdAt")}
              </button>
              <button
                onClick={() => handleSort("updatedAt")}
                className={`px-3 py-1 rounded-full flex items-center ${
                  sortConfig.key === "updatedAt" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Update Date {getSortIcon("updatedAt")}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedRequests.map((req) => (
                <div 
                  key={req._id} 
                  className={`border rounded-lg shadow-lg p-4 transition-all hover:shadow-xl ${
                    req.status === "Approved" ? "border-green-200" :
                    req.status === "Declined" ? "border-red-200" : "border-yellow-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold truncate">
                      {req.offer_id?.title || "Offer Unavailable"}
                    </h3>
                    {getStatusIcon(req.status)}
                  </div>

                  <div className="flex items-center mb-3">
                    <span className="text-gray-600 mr-2">Status:</span>
                    <span className={`font-medium ${
                      req.status === "Pending" ? "text-yellow-600" :
                      req.status === "Approved" ? "text-green-600" : "text-red-600"
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaClock className="mr-1" />
                    <span>Requested: {formatDateTime(req.createdAt)}</span>
                  </div>

                  {req.status !== "Pending" && (
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <FaClock className="mr-1" />
                      <span>Updated: {formatDateTime(req.updatedAt)}</span>
                    </div>
                  )}

                  {req.status === "Approved" && (
                    <div className="bg-green-50 text-green-700 p-2 rounded text-sm mb-2">
                      <FaCheckCircle className="inline mr-1" />
                      You can now redeem this offer!
                    </div>
                  )}

                  {req.status === "Declined" && req.reason && (
                    <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
                      <FaTimesCircle className="inline mr-1" />
                      <strong>Reason:</strong> {req.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mt-3">No Requests Found</h3>
            <p className="text-gray-500 mt-1">You haven't made any offer requests yet.</p>
            <button
              onClick={() => window.location.href = "/offers"}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Browse Offers
            </button>
          </div>
        )}
      </div>
      <UserFooter />
    </div>
  );
};