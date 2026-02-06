import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiStar, FiClock, FiCheckCircle, FiXCircle, FiLogOut } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [declinedCount, setDeclinedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setSubscriptionError(null);
        
        const userId = localStorage.getItem('id');
        if (!userId) {
          throw new Error("User ID is missing from localStorage");
        }

        // Fetch user and requests data in parallel
        const [userRes, requestsRes] = await Promise.all([
          axios.get(`/user/user/${userId}`),
          axios.get(`http://localhost:3000/redeem/user/${userId}`)
        ]);

        // Set user data
        const userData = userRes.data.data;
        setUser(userData);

        // Calculate request counts
        const requests = requestsRes.data;
        setApprovedCount(requests.filter(r => r.status === "Approved").length);
        setPendingCount(requests.filter(r => r.status === "Pending").length);
        setDeclinedCount(requests.filter(r => r.status === "Rejected").length);

        // Try to fetch subscription data separately
        try {
          const subRes = await axios.get(`/subscription/user/${userId}`);
          const subscriptionData = subRes.data.data || subRes.data;
          setSubscription(subscriptionData);
        } catch (subError) {
          console.log("No subscription found for user");
          setSubscription(null);
          setSubscriptionError("No active subscription found");
        }

      } catch (err) {
        console.error("Error loading profile data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.clear();
    // Redirect to login page
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  const getSubscriptionStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <UserNavbar />
        <div className="px-5 lg:px-32 py-10 flex-1">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-3xl font-semibold">User Profile</h2>
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
            <h2 className="text-3xl font-semibold">User Profile</h2>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Retry
            </button>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <FiXCircle className="text-red-500 text-4xl mx-auto mb-3" />
            <h3 className="text-xl font-medium text-red-600 mb-2">Error Loading Profile</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
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
    <div className="flex flex-col min-h-screen">
      <UserNavbar />
      <div className="px-5 lg:px-32 py-10 flex-1">
        <div className="flex justify-between items-center mb-8 mt-16">
          <h2 className="text-3xl font-semibold">User Profile</h2>
          <div className="flex items-center space-x-4">
            {subscription?.status === 'Active' && (
              <span className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                <FaCrown className="mr-1" /> Premium Member
              </span>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-full text-sm font-medium transition-colors"
            >
              <FiLogOut className="mr-1" /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User Info Card - Always shown */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FiUser className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <FiUser className="text-gray-500 mr-2" />
                <span className="text-gray-700"><strong>Name:</strong> {user?.name}</span>
              </div>
              <div className="flex items-center">
                <FiMail className="text-gray-500 mr-2" />
                <span className="text-gray-700"><strong>Email:</strong> {user?.email}</span>
              </div>
              <div className="flex items-center">
                <FiStar className="text-gray-500 mr-2" />
                <span className="text-gray-700"><strong>Role:</strong> {user?.roleId?.name || 'User'}</span>
              </div>
            </div>
          </div>

          {/* Subscription Info Card - Conditionally shown */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FaCrown className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Subscription</h3>
            </div>
            {subscription ? (
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Plan:</span>
                  <p className="font-medium text-gray-800">{subscription.planName || subscription.plan?.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <p className="font-medium text-gray-800">₹{subscription.amount || subscription.plan?.amount || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSubscriptionStatusColor(subscription.status)}`}>
                    {subscription.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-600">Start:</span>
                    <p className="font-medium text-gray-800">{formatDate(subscription.startDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">End:</span>
                    <p className="font-medium text-gray-800">{formatDate(subscription.endDate)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 italic">{subscriptionError || 'No active subscription'}</p>
                <button 
                  onClick={() => navigate('/subscriptionPlans')}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Request Stats Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Your Offer Requests</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 p-5 rounded-lg border border-green-100 text-center hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-2">
                <FiCheckCircle className="text-green-500 text-3xl" />
              </div>
              <p className="text-sm text-green-600 font-medium">Approved</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{approvedCount}</p>
            </div>
            <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-100 text-center hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-2">
                <FiClock className="text-yellow-500 text-3xl" />
              </div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-700 mt-2">{pendingCount}</p>
            </div>
            <div className="bg-red-50 p-5 rounded-lg border border-red-100 text-center hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-2">
                <FiXCircle className="text-red-500 text-3xl" />
              </div>
              <p className="text-sm text-red-600 font-medium">Rejected</p>
              <p className="text-3xl font-bold text-red-700 mt-2">{declinedCount}</p>
            </div>
          </div>
        </div>
      </div>
      <UserFooter />
    </div>
  );
};

export default UserProfilePage;