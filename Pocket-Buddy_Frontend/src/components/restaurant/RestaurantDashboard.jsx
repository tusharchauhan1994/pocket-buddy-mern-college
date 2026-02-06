import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import RestaurantSidebar from "./RestaurantSidebar";
import axios from "axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

export const RestaurantDashboard = () => {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [allOffers, setAllOffers] = useState([]);
  const [requestStats, setRequestStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(
    localStorage.getItem("restaurantId") || ""
  );

  useEffect(() => {
    sessionStorage.setItem("lastValidPage", window.location.pathname);
    fetchDashboardData();
  }, [selectedRestaurantId]);

  const fetchDashboardData = async () => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) return navigate("/login");

      // Fetch restaurants
      const res = await axios.get(`/location/getLocationByUserId/${userId}`);
      const restaurantList = res.data.data || [];
      setRestaurants(restaurantList);

      // If no restaurant is selected but we have restaurants, select the first one
      if (!selectedRestaurantId && restaurantList.length > 0) {
        setSelectedRestaurantId(restaurantList[0]._id);
        localStorage.setItem("restaurantId", restaurantList[0]._id);
      }

      // Fetch offers only for the selected restaurant
      if (selectedRestaurantId) {
        const offersRes = await axios.get(
          `/offer/by-restaurant/${selectedRestaurantId}`
        );
        if (offersRes.data?.offers) {
          setAllOffers(offersRes.data.offers);
        }

        // Fetch all redemption requests for this owner/restaurant
        try {
          const ownerRequests = await axios.get(
            `http://localhost:3000/redeem/owner/${userId}`
          );
          console.log("Owner requests raw data:", ownerRequests.data);

          if (ownerRequests.data && Array.isArray(ownerRequests.data)) {
            // Get raw data first to analyze
            const allRequests = ownerRequests.data;

            // Log a single request to see the structure
            if (allRequests.length > 0) {
              console.log("Example request object:", allRequests[0]);
            }

            // Instead of filtering by location_id, try to count all statuses
            // This will give us a baseline to see what we have
            const allStatusCounts = {};
            allRequests.forEach((req) => {
              const status = req.status || "Unknown";
              allStatusCounts[status] = (allStatusCounts[status] || 0) + 1;
            });

            console.log("All status counts:", allStatusCounts);

            // Try different approaches to filter by restaurant
            // Approach 1: Check if there's a location_id property
            let filteredByLocationId = allRequests.filter(
              (req) => req.location_id === selectedRestaurantId
            );
            console.log("Filtered by location_id:", filteredByLocationId);

            // Approach 2: Check if there's a restaurant_id property
            let filteredByRestaurantId = allRequests.filter(
              (req) => req.restaurant_id === selectedRestaurantId
            );
            console.log("Filtered by restaurant_id:", filteredByRestaurantId);

            // Approach 3: Check if there's an offer_id object with restaurant_id
            let filteredByOfferRestaurantId = allRequests.filter(
              (req) =>
                req.offer_id &&
                req.offer_id.restaurant_id === selectedRestaurantId
            );
            console.log(
              "Filtered by offer_id.restaurant_id:",
              filteredByOfferRestaurantId
            );

            // Use whichever filter approach returned results
            let filteredRequests =
              filteredByLocationId.length > 0
                ? filteredByLocationId
                : filteredByRestaurantId.length > 0
                ? filteredByRestaurantId
                : filteredByOfferRestaurantId.length > 0
                ? filteredByOfferRestaurantId
                : allRequests; // Default to all if no filter worked

            console.log("Final filtered requests:", filteredRequests);

            // Analyze the statuses in the filtered data
            const statusCounts = {};
            filteredRequests.forEach((req) => {
              const status = req.status || "Unknown";
              statusCounts[status] = (statusCounts[status] || 0) + 1;
            });

            console.log("Filtered status counts:", statusCounts);
            setDebugInfo(statusCounts);

            // Create request stats based on the status counts
            const pending = statusCounts["Pending"] || 0;
            const approved = statusCounts["Approved"] || 0;
            const rejected =
              (statusCounts["Rejected"] || 0) + (statusCounts["Declined"] || 0);

            setRequestStats({ pending, approved, rejected });
          }
        } catch (error) {
          console.error("Error fetching request stats:", error);
          setRequestStats({ pending: 0, approved: 0, rejected: 0 });
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantChange = (e) => {
    const newRestaurantId = e.target.value;
    setSelectedRestaurantId(newRestaurantId);
    localStorage.setItem("restaurantId", newRestaurantId);
  };

  const activeOffers = allOffers.filter(
    (offer) => offer.status === "Active"
  ).length;
  const expiredOffers = allOffers.filter(
    (offer) => new Date(offer.valid_to) < new Date()
  ).length;

  const offerStatusData = [
    { name: "Active Offers", value: activeOffers },
    { name: "Expired Offers", value: expiredOffers },
  ];

  // Create chart data based on available statuses from debugInfo
  let requestStatusData = debugInfo
    ? Object.entries(debugInfo).map(([status, count]) => ({
        name: status,
        value: count,
      }))
    : [
        { name: "Pending", value: requestStats.pending || 0 },
        { name: "Approved", value: requestStats.approved || 0 },
        { name: "Rejected", value: requestStats.rejected || 0 },
      ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64">
        <RestaurantSidebar />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Restaurant Dashboard
          </h1>

          {/* Restaurant Selector */}
          <div className="w-64">
            <select
              value={selectedRestaurantId}
              onChange={handleRestaurantChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loading || restaurants.length === 0}
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
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Debug Info */}
            {/* {debugInfo && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-bold mb-2 text-yellow-800">Debug Info:</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )} */}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-blue-500 p-6 rounded-xl shadow-md text-white">
                <h2 className="text-lg">Total Restaurants</h2>
                <p className="text-3xl font-bold">{restaurants.length}</p>
              </div>
              <div className="bg-green-500 p-6 rounded-xl shadow-md text-white">
                <h2 className="text-lg">Active Offers</h2>
                <p className="text-3xl font-bold">{activeOffers}</p>
              </div>
              <div className="bg-red-500 p-6 rounded-xl shadow-md text-white">
                <h2 className="text-lg">Expired Offers</h2>
                <p className="text-3xl font-bold">{expiredOffers}</p>
              </div>
              <div className="bg-yellow-500 p-6 rounded-xl shadow-md text-white">
                <h2 className="text-lg">Total Offers</h2>
                <p className="text-3xl font-bold">{allOffers.length}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Offers Status Chart */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-700">
                  Offers Status
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={offerStatusData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="#8884d8"
                      barSize={50}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Request Status Chart */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-700">
                  Request Status
                </h3>
                {requestStatusData && requestStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={requestStatusData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#82ca9d"
                        barSize={50}
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    No request data available for this restaurant
                  </div>
                )}
              </div>
            </div>

            {/* Restaurant Details */}
            {selectedRestaurantId && (
              <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-700">
                  Restaurant Details
                </h3>
                {restaurants.find((r) => r._id === selectedRestaurantId) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">
                        Name:{" "}
                        <span className="text-gray-800 font-medium">
                          {
                            restaurants.find(
                              (r) => r._id === selectedRestaurantId
                            ).title
                          }
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Category:{" "}
                        <span className="text-gray-800 font-medium">
                          {
                            restaurants.find(
                              (r) => r._id === selectedRestaurantId
                            ).category
                          }
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Timings:{" "}
                        <span className="text-gray-800 font-medium">
                          {
                            restaurants.find(
                              (r) => r._id === selectedRestaurantId
                            ).timings
                          }
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        Contact:{" "}
                        <span className="text-gray-800 font-medium">
                          {
                            restaurants.find(
                              (r) => r._id === selectedRestaurantId
                            ).contactNumber
                          }
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Address:{" "}
                        <span className="text-gray-800 font-medium">
                          {
                            restaurants.find(
                              (r) => r._id === selectedRestaurantId
                            ).address
                          }
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No details available</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
