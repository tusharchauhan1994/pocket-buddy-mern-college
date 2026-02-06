import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";
import { toast } from "react-toastify";
import axios from "axios";
import {
  MdAccessTime,
  MdLocalOffer,
  MdLocationOn,
  MdPhone,
  MdRestaurant,
  MdDirections,
  MdInfo,
  MdArrowBack
} from "react-icons/md";
import { FaRegClock, FaRegMoneyBillAlt } from "react-icons/fa";
import { Chip } from "@mui/material";

export const UserOfferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hoveredRestaurant, setHoveredRestaurant] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/offer/${id}`);
        if (res.data?.data) {
          setOffer(res.data.data);
        } else {
          throw new Error("Invalid offer data received");
        }
      } catch (error) {
        console.error("Error fetching offer details:", error);
        toast.error("Failed to load offer details");
        navigate("/offers");
      } finally {
        setLoading(false);
      }
    };
    fetchOfferDetails();
  }, [id, navigate]);

  const handleRedeemOffer = async () => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      toast.error("Please login to redeem this offer");
      navigate("/login");
      return;
    }

    if (!offer || !offer.restaurant_ids || offer.restaurant_ids.length === 0) {
      toast.warning("No restaurant available for this offer");
      return;
    }

    if (!selectedRestaurant && offer.restaurant_ids.length > 1) {
      toast.info("Please select a restaurant first");
      return;
    }

    const restaurantId = selectedRestaurant?._id || offer.restaurant_ids[0]?._id;

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:3000/redeem", {
        user_id: userId,
        offer_id: offer._id,
        restaurant_id: restaurantId
      });

      toast.success(response.data.message || "Offer redeemed successfully!");
      setMessage(response.data.message || "Your request has been submitted!");
    } catch (error) {
      console.error("Error redeeming offer:", error);
      const errorMsg = error.response?.data?.message || 
                      "Failed to redeem offer. Please try again.";
      toast.error(errorMsg);
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const handleOpenMap = (address) => {
    if (!address) {
      toast.warning("No address available for this restaurant");
      return;
    }
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, "_blank");
  };

  if (!offer) {
    return (
      <div className="flex flex-col min-h-screen">
        <UserNavbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading offer details...</p>
          </div>
        </div>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="flex-grow px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <MdArrowBack className="mr-1" /> Back to Offers
        </button>

        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-100">
              <img
                src={offer.imageURL || "https://placehold.co/600x400?text=No+Image"}
                alt={offer.title}
                className="w-full h-auto max-h-96 object-contain rounded-lg"
              />
            </div>

            <div className="md:w-1/2 p-8 space-y-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900">{offer.title}</h1>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {offer.offer_type === "Flat Discount"
                    ? `₹${offer.discount_value} OFF`
                    : offer.offer_type === "Percentage"
                    ? `${offer.discount_value}% OFF`
                    : offer.offer_type}
                </span>
              </div>

              <p className="text-gray-600 text-lg">{offer.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-700">
                  <FaRegClock className="mr-2 text-blue-500" />
                  <span>Valid: {formatDate(offer.valid_from)} - {formatDate(offer.valid_to)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaRegMoneyBillAlt className="mr-2 text-blue-500" />
                  <span>Min Order: ₹{offer.min_order_value || 0}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <MdInfo className="mr-2 text-blue-500" />
                  Terms & Conditions
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Valid only during the specified period</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Cannot be combined with other offers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Minimum order value applies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Limited to {offer.max_redemptions || "unlimited"} redemptions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <MdRestaurant className="mr-2 text-blue-500" />
              Available Locations
            </h2>

            {offer.restaurant_ids && offer.restaurant_ids.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offer.restaurant_ids.map((restaurant) => (
                  <div
                    key={restaurant._id}
                    className={`border rounded-lg p-4 transition-all ${
                      selectedRestaurant?._id === restaurant._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{restaurant.title}</h3>
                      <Chip
                        label={restaurant.active ? "Open" : "Closed"}
                        color={restaurant.active ? "success" : "error"}
                        size="small"
                      />
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MdLocationOn className="mr-1" />
                        <span className="truncate">{restaurant.address || "Address not available"}</span>
                      </div>
                      <div className="flex items-center">
                        <MdPhone className="mr-1" />
                        <span>{restaurant.contactNumber || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <MdAccessTime className="mr-1" />
                        <span>{restaurant.timings || "Timings not specified"}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMap(restaurant.address);
                      }}
                      className="mt-3 w-full flex items-center justify-center px-3 py-1.5 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition"
                      disabled={!restaurant.address}
                    >
                      <MdDirections className="mr-1" />
                      Get Directions
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-white rounded-lg border border-dashed border-gray-300">
                <MdRestaurant size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No locations available for this offer</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 text-center">
            <button
              onClick={handleRedeemOffer}
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <MdLocalOffer className="mr-2" />
                  Redeem Now
                </span>
              )}
            </button>
            {message && (
              <p className={`mt-4 text-lg font-medium ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      <UserFooter />
    </div>
  );
};

export default UserOfferDetail;