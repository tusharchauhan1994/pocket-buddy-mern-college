import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";
import Button from "../../layouts/Button";
import axios from "axios";
import {
  FaSearch,
  FaRegClock,
  FaTag,
  FaInfoCircle,
  FaFire,
  FaFilter,
  FaSort,
} from "react-icons/fa";
import { ImSad } from "react-icons/im";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { debounce } from "lodash";

export const UserDashboard = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const userId = localStorage.getItem("id");

  // Save last valid page and check user role
  useEffect(() => {
    sessionStorage.setItem("lastValidPage", window.location.pathname);

    const role = localStorage.getItem("role");
    if (role !== "User") {
      alert("Access Denied! Only Users can access this page.");
      navigate("/unauthorized");
    }
  }, [navigate]);

  // Fetch offers data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resOffers = await axios.get("http://localhost:3000/offer");

        // Handle different response formats
        const fetchedOffers = Array.isArray(resOffers.data)
          ? resOffers.data
          : resOffers.data?.offers || [];

        setOffers(fetchedOffers);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load offers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `http://localhost:3000/subscription/user/${userId}`
        );
        setSubscription(res.data?.data || res.data);
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      }
    };
    fetchSubscription();
  }, [userId]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  // Filter and sort offers
  const filteredOffers = useCallback(() => {
    return offers.filter((offer) => {
      const matchesSearch =
        offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterType === "all" ||
        offer.offer_type?.toLowerCase().includes(filterType.toLowerCase());

      const matchesStatus = showExpired
        ? offer.status === "Inactive"
        : offer.status === "Active";

      return matchesSearch && matchesFilter && matchesStatus;
    });
  }, [offers, searchQuery, filterType, showExpired]);

  const sortedOffers = useCallback(() => {
    const filtered = filteredOffers();
    return [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.valid_to) - new Date(a.valid_to);
      } else if (sortBy === "highest-discount") {
        return (b.discount_value || 0) - (a.discount_value || 0);
      } else if (sortBy === "expiring-soon") {
        return new Date(a.valid_to) - new Date(b.valid_to);
      }
      return 0;
    });
  }, [filteredOffers, sortBy]);

  // Check if offer is expiring soon
  const isExpiringSoon = useCallback((validTo) => {
    const validDate = new Date(validTo);
    const today = new Date();
    const diffTime = validDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  }, []);

  const handleSubscriptionRedirect = () => {
    navigate("/subscriptionPlans");
  };

  const formatDiscountText = (offer) => {
    switch (offer.offer_type) {
      case "Flat Discount":
        return `₹${offer.discount_value} OFF`;
      case "Percentage":
        return `${offer.discount_value}% OFF`;
      case "Free Item":
        return `FREE ${offer.free_item || "ITEM"}`;
      default:
        return offer.offer_type;
    }
  };

  // Render offer cards
  const renderOfferCards = useCallback(() => {
    if (loading) {
      return Array(6)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="border rounded-lg shadow-lg overflow-hidden animate-pulse"
          >
            <div className="bg-gray-200 h-48 w-full"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-1 w-2/3"></div>
              <div className="h-10 bg-gray-200 rounded mt-3 w-1/2"></div>
            </div>
          </div>
        ));
    }

    if (error) {
      return (
        <div className="col-span-3 flex flex-col items-center justify-center py-10 text-center">
          <ImSad className="text-4xl text-red-500 mb-3" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Error Loading Offers
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
          >
            Retry
          </button>
        </div>
      );
    }

    const currentOffers = sortedOffers();
    if (currentOffers.length === 0) {
      return (
        <div className="col-span-3 flex flex-col items-center justify-center py-10 text-center">
          <ImSad className="text-4xl text-gray-400 mb-3" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {searchQuery || filterType !== "all" || showExpired
              ? "No offers match your criteria"
              : showExpired
              ? "No expired offers available"
              : "No active offers available"}
          </h3>
          <p className="text-gray-500 max-w-md">
            {searchQuery || filterType !== "all" || showExpired
              ? "Try adjusting your search or filter to find what you're looking for."
              : "There are currently no offers to display."}
          </p>
          {(searchQuery || filterType !== "all" || showExpired) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
                setShowExpired(false);
              }}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              Reset Filters
            </button>
          )}
        </div>
      );
    }

    return currentOffers.map((offer) => (
      <div
        key={offer._id}
        className={`border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative bg-white ${
          offer.status === "Inactive" ? "opacity-70" : ""
        }`}
      >
        {offer.status === "Active" && isExpiringSoon(offer.valid_to) && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs flex items-center shadow-md z-10">
            <FaFire className="mr-1" /> Expiring Soon!
          </div>
        )}

        {offer.status === "Inactive" && (
          <div className="absolute top-2 right-2 bg-gray-500 text-white px-3 py-1 rounded-full text-xs flex items-center shadow-md z-10">
            Expired
          </div>
        )}

        <Link to={`/offer/${offer._id}`} className="block">
          <div className="relative w-full aspect-square overflow-hidden">
            <img
              src={offer.imageURL || "https://via.placeholder.com/300"}
              alt={offer.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300";
                e.target.className = "w-full h-full object-cover";
              }}
              loading="lazy"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <FaTag className="mr-1" /> {offer.offer_type}
            </div>
          </div>
        </Link>

        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">
            {offer.title}
          </h3>
          <p className="text-gray-600 mb-3 line-clamp-2">{offer.description}</p>

          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
              {formatDiscountText(offer)}
            </span>

            <div className="flex items-center text-gray-500 text-sm">
              <FaRegClock className="mr-1" />
              <span>
                {new Date(offer.valid_to).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            {offer.status === "Active" ? (
              (subscription?.status || "").toLowerCase() === "active" ? (
                <Link
                  to={`/offer/${offer._id}`}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex-1 text-center"
                >
                  Claim Offer
                </Link>
              ) : (
                <button
                  onClick={handleSubscriptionRedirect}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md flex-1 text-center"
                >
                  Subscribe to Claim
                </button>
              )
            ) : (
              <div className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg flex-1 text-center cursor-not-allowed">
                Offer Expired
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  }, [
    loading,
    error,
    sortedOffers,
    searchQuery,
    filterType,
    showExpired,
    isExpiringSoon,
    subscription,
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UserNavbar setSearchQuery={setSearchQuery} />

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col justify-center items-center lg:px-32 px-5 bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat bg-center bg-fixed">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative w-full lg:w-2/3 space-y-5 text-center lg:text-left">
          <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl leading-tight">
            Discover Exclusive <span className="text-red-400">Offers!</span>
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl">
            Get the best deals on your favorite meals and restaurants. Save more
            with Pocket-Buddy!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/user/offers">
              <Button title="Explore Offers" className="px-8 py-3 text-lg" />
            </Link>
            <Link to="/user/restaurants">
              <Button
                title="View Restaurants"
                className="px-8 py-3 text-lg bg-transparent border-2 border-white hover:bg-white hover:text-gray-900"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <section id="offers-section" className="px-5 lg:px-32 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Exclusive Offers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Unlock these amazing deals available just for you
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-2xl">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers by title or description..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                defaultValue={searchQuery}
                onChange={(e) => debouncedSearch(e.target.value)}
                aria-label="Search offers"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowExpired(!showExpired)}
                className={`px-4 py-2 rounded-lg ${
                  showExpired
                    ? "bg-gray-200 text-gray-800"
                    : "bg-blue-500 text-white"
                }`}
              >
                {showExpired ? "Show Active" : "Show Expired"}
              </button>

              {/* Desktop Filters */}
              <div className="hidden md:flex gap-4">
                <div className="flex items-center">
                  <label
                    htmlFor="filter"
                    className="mr-2 text-gray-600 whitespace-nowrap"
                  >
                    <FaFilter className="inline mr-1" />
                    Filter:
                  </label>
                  <select
                    id="filter"
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    aria-label="Filter offers by type"
                  >
                    <option value="all">All Types</option>
                    <option value="flat">Flat Discount</option>
                    <option value="percentage">Percentage</option>
                    <option value="bogo">Buy One Get One</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label
                    htmlFor="sort"
                    className="mr-2 text-gray-600 whitespace-nowrap"
                  >
                    <FaSort className="inline mr-1" />
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort offers"
                  >
                    <option value="newest">Newest</option>
                    <option value="highest-discount">Highest Discount</option>
                    <option value="expiring-soon">Expiring Soon</option>
                  </select>
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                className="md:hidden flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                aria-label="Toggle filters"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {isMobileFilterOpen && (
            <div className="md:hidden mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="mobile-filter"
                    className="block text-gray-600 mb-1"
                  >
                    <FaFilter className="inline mr-1" />
                    Filter by Type:
                  </label>
                  <select
                    id="mobile-filter"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="flat">Flat Discount</option>
                    <option value="percentage">Percentage</option>
                    <option value="bogo">Buy One Get One</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="mobile-sort"
                    className="block text-gray-600 mb-1"
                  >
                    <FaSort className="inline mr-1" />
                    Sort by:
                  </label>
                  <select
                    id="mobile-sort"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="highest-discount">Highest Discount</option>
                    <option value="expiring-soon">Expiring Soon</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderOfferCards()}
        </div>
      </section>

      <UserFooter />
    </div>
  );
};
