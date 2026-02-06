import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Button from "../../layouts/Button";
import axios from "axios";
import heroImage from "../../assets/img/hero.jpg";
import {
  FaSearch,
  FaRegClock,
  FaTag,
  FaInfoCircle,
  FaFire,
  FaStar,
} from "react-icons/fa";
import { ImSad } from "react-icons/im";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      offer.offer_type?.toLowerCase().includes(filterType.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.valid_to) - new Date(a.valid_to);
    } else if (sortBy === "highest-discount") {
      return (b.discount_value || 0) - (a.discount_value || 0);
    } else if (sortBy === "expiring-soon") {
      return new Date(a.valid_to) - new Date(b.valid_to);
    } else if (sortBy === "featured") {
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
    return 0;
  });

  const renderOfferCards = () => {
    if (loading) {
      return Array(6)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="border rounded-lg shadow-lg overflow-hidden"
          >
            <Skeleton height={180} />
            <div className="p-4">
              <Skeleton count={3} />
              <Skeleton width={100} height={30} className="mt-3" />
            </div>
          </div>
        ));
    }

    if (error) {
      return (
        <div className="col-span-3 flex flex-col items-center justify-center py-10 text-center">
          <h3 className="text-xl font-medium text-red-600 mb-2">
            Error Loading Offers
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      );
    }

    if (sortedOffers.length === 0) {
      return (
        <div className="col-span-3 flex flex-col items-center justify-center py-10 text-center">
          <ImSad className="text-4xl text-gray-400 mb-3" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {searchQuery || filterType !== "all"
              ? "No offers match your criteria"
              : "No offers available"}
          </h3>
          <p className="text-gray-500 max-w-md">
            {searchQuery || filterType !== "all"
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Check back later for new offers!"}
          </p>
          {(searchQuery || filterType !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      );
    }

    return sortedOffers.map((offer) => {
      const isExpiringSoon = () => {
        const validTo = new Date(offer.valid_to);
        const today = new Date();
        const diffTime = validTo - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
      };

      return (
        <div
          key={offer._id}
          className="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
        >
          {offer.isFeatured && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs flex items-center z-10">
              <FaStar className="mr-1" /> Featured
            </div>
          )}

          {isExpiringSoon() && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <FaFire className="mr-1" /> Expiring Soon!
            </div>
          )}

          <Link to={`/offer/${offer._id}`} className="block">
            <div className="relative w-full aspect-video overflow-hidden">
              <img
                src={offer.imageURL || "https://via.placeholder.com/300"}
                alt={offer.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300";
                }}
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                {offer.offer_type}
              </div>
            </div>
          </Link>

          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 line-clamp-1">
              {offer.title}
            </h3>
            <p className="text-gray-600 mb-3 line-clamp-2">
              {offer.description}
            </p>

            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-red-500">
                {offer.offer_type === "Flat Discount"
                  ? `₹${offer.discount_value} OFF`
                  : offer.offer_type === "Percentage"
                  ? `${offer.discount_value}% OFF`
                  : offer.offer_type}
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
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 transition-all flex-1 text-center"
              >
                Sign Up to Claim
              </Link>
              <Link
                to={`/offer/${offer._id}`}
                className="ml-2 p-2 text-blue-500 hover:text-blue-700 transition-colors"
                title="More details"
              >
                <FaInfoCircle size={20} />
              </Link>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 mt-11 ml-0">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative min-h-screen flex flex-col justify-center items-center lg:px-32 px-5 bg-cover bg-no-repeat bg-center mt-5"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative w-full lg:w-2/3 space-y-5 text-center lg:text-left">
          <h1 className="text-white font-bold text-4xl sm:text-5xl md:text-6xl">
            Discover Amazing Deals & Offers!
          </h1>
          <p className="text-white text-lg sm:text-xl">
            Get access to exclusive discounts at top restaurants near you.
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link to="/offers">
              <Button
                title="Explore Now"
                className="px-8 py-3 text-lg hover:scale-105 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Offers Section */}
      <section id="offers-section" className="px-5 lg:px-32 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Exclusive Offers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Limited-time deals waiting for you
          </p>
        </div>

        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-2xl">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers by title or description..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center">
                <label
                  htmlFor="filter"
                  className="mr-2 text-gray-600 whitespace-nowrap"
                >
                  <FaTag className="inline mr-1" />
                  Filter:
                </label>
                <select
                  id="filter"
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="flat">Flat Discount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="sort"
                  className="mr-2 text-gray-600 whitespace-nowrap"
                >
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="highest-discount">Highest Discount</option>
                  <option value="expiring-soon">Expiring Soon</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderOfferCards()}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
