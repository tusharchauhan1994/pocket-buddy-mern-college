import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";

export const UserOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [showExpired, setShowExpired] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/offer");

      let offersData = Array.isArray(response.data)
        ? response.data
        : response.data?.offers || [];

      const validOffers = offersData.filter(
        (offer) => offer._id && offer.title && offer.description
      );

      setOffers(validOffers);
      setFilteredOffers(
        validOffers.filter((offer) => offer.status === "Active")
      );
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch offers. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    fetchOffers();
    fetchSubscription();
  }, [fetchOffers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const baseOffers = showExpired
        ? offers.filter((o) => o.status === "Inactive")
        : offers.filter((o) => o.status === "Active");

      if (searchQuery.trim() === "") {
        setFilteredOffers(baseOffers);
      } else {
        const filtered = baseOffers.filter(
          (offer) =>
            offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            offer.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredOffers(filtered);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, offers, showExpired]);

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

  const handleSubscriptionRedirect = () => {
    navigate("/subscriptionPlans");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen mt-16">
        <UserNavbar setSearchQuery={setSearchQuery} />
        <section className="px-5 lg:px-32 py-10">
          <h2 className="text-3xl font-semibold mb-5">Exclusive Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="border rounded-lg shadow-lg overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <UserFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen mt-16">
        <UserNavbar setSearchQuery={setSearchQuery} />
        <section className="px-5 lg:px-32 py-10 text-center">
          <div className="max-w-md mx-auto p-6 bg-red-50 rounded-lg">
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Error Loading Offers
            </h3>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchOffers}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Retry
            </button>
          </div>
        </section>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen mt-16">
      <UserNavbar setSearchQuery={setSearchQuery} />
      <section className="px-5 lg:px-32 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-3xl font-semibold mb-3 md:mb-0">
            {showExpired ? "Expired Offers" : "Active Offers"}
          </h2>
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
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder={`Search ${
                  showExpired ? "expired" : "active"
                } offers...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <div
                key={offer._id}
                className={`border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                  offer.status === "Inactive" ? "opacity-70" : ""
                }`}
              >
                <Link to={`/offer/${offer._id}`} className="block">
                  <div className="relative w-full aspect-square overflow-hidden">
                    <img
                      src={offer.imageURL || "https://via.placeholder.com/300"}
                      alt={offer.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                    {offer.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {offer.description}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-red-500 font-bold">
                      {formatDiscountText(offer)}
                    </span>
                    <span
                      className={`text-sm ${
                        offer.status === "Inactive"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {offer.status === "Inactive"
                        ? "Expired"
                        : `Valid Until: ${new Date(
                            offer.valid_to
                          ).toLocaleDateString("en-GB")}`}
                    </span>
                  </div>
                  {offer.status === "Active" &&
                    ((subscription?.status || "").toLowerCase() === "active" ? (
                      <Link to={`/offer/${offer._id}`}>
                        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                          Claim Offer
                        </button>
                      </Link>
                    ) : (
                      <button
                        onClick={handleSubscriptionRedirect}
                        className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                      >
                        Subscribe to Claim
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="max-w-md mx-auto">
              <h3 className="mt-3 text-lg font-medium text-gray-700">
                No offers found
              </h3>
              <p className="mt-1 text-gray-500">
                {searchQuery
                  ? "No offers match your search criteria."
                  : `Currently there are no ${
                      showExpired ? "expired" : "active"
                    } offers.`}
              </p>
            </div>
          </div>
        )}
      </section>
      <UserFooter />
    </div>
  );
};

export default UserOffers;
