import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserNavbar from "./Navbar";
import UserFooter from "./Footer";
import { 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress, 
  Alert, 
  Chip,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  Pagination,
  Button
} from "@mui/material";
import { 
  MdOutlineCategory, 
  MdPhone, 
  MdAccessTime, 
  MdLocationOn,
  MdSearch,
  MdStar,
  MdStarBorder,
  MdDirections,
  MdPerson
} from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { BiRestaurant } from "react-icons/bi";
import { toast } from "react-toastify";

export const GuestRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [offers, setOffers] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [offersLoading, setOffersLoading] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/admin/restaurants");
      console.log("Fetched Data:", res.data);

      if (res.data?.data?.length > 0) {
        const allRestaurants = res.data.data.reduce((acc, owner) => {
          if (owner.restaurants && owner.restaurants.length > 0) {
            const ownerRestaurants = owner.restaurants.map((restaurant) => ({
              ...restaurant,
              ownerName: owner.name,
              ownerEmail: owner.email,
              ownerContact: owner.contactNumber,
            }));
            return [...acc, ...ownerRestaurants];
          }
          return acc;
        }, []);

        console.log("Processed Restaurants:", allRestaurants);
        setRestaurants(allRestaurants);
      } else {
        setRestaurants([]);
        setError("No restaurants available.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch restaurants. Please try again later.");
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantOffers = async (restaurantId) => {
    try {
      setOffersLoading(true);
      const res = await axios.get(`http://localhost:3000/offer/by-restaurant/${restaurantId}`);
      if (res.data.success) {
        return res.data.offers;
      }
      toast.error("Failed to load offers");
      return [];
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to load offers");
      return [];
    } finally {
      setOffersLoading(false);
    }
  };

  const handleViewOffers = async (restaurant) => {
    const restaurantOffers = await fetchRestaurantOffers(restaurant._id);
    setSelectedRestaurant(restaurant);
    setOffers(restaurantOffers);
    setShowOffersModal(true);
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      restaurant.category?.toLowerCase().includes(categoryFilter.toLowerCase());

    const matchesActive =
      activeFilter === "all" ||
      (activeFilter === "active" && restaurant.active) ||
      (activeFilter === "inactive" && !restaurant.active);

    return matchesSearch && matchesCategory && matchesActive;
  });

  const paginatedRestaurants = filteredRestaurants.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const renderRatingStars = (rating) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<MdStar key={i} className="text-yellow-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<MdStar key={i} className="text-yellow-500" />);
      } else {
        stars.push(<MdStarBorder key={i} className="text-yellow-500" />);
      }
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const getCategories = () => {
    const categories = new Set();
    restaurants.forEach((restaurant) => {
      if (restaurant.category) {
        restaurant.category.split(",").forEach((cat) => {
          categories.add(cat.trim());
        });
      }
    });
    return Array.from(categories).sort();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UserNavbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-5 lg:px-32 text-center mt-10">
        <div className="max-w-4xl mx-auto">
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Discover Amazing Restaurants
          </Typography>
          <Typography variant="h6" component="p" className="mb-8">
            Find the best dining experiences in your city
          </Typography>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 lg:px-32 py-10 flex-grow">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdSearch />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <Select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <FaFilter className="mr-2" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {getCategories().map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <Select
                  value={activeFilter}
                  onChange={(e) => {
                    setActiveFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="active">Active Only</MenuItem>
                  <MenuItem value="inactive">Inactive Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center my-10">
            <CircularProgress size={50} />
          </div>
        )}

        {error && (
          <Alert
            severity="error"
            className="mb-6"
            action={
              <Button color="inherit" size="small" onClick={fetchRestaurants}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Restaurant Cards */}
        {!loading && (
          <>
            <Grid container spacing={4}>
              {paginatedRestaurants.length > 0 ? (
                paginatedRestaurants.map((restaurant) => (
                  <Grid item xs={12} sm={6} lg={4} key={restaurant._id}>
                    <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                      {/* Restaurant Image */}
                      <div className="relative">
                        <img
                          src={
                            restaurant.imageURL ||
                            "https://placehold.co/600x400"
                          }
                          alt={restaurant.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Chip
                            label={restaurant.active ? "Open" : "Closed"}
                            color={restaurant.active ? "success" : "error"}
                            size="small"
                          />
                        </div>
                      </div>

                      <CardContent className="flex-grow">
                        {/* Restaurant Title and Rating */}
                        <div className="flex justify-between items-start mb-2">
                          <Typography variant="h6" fontWeight="bold">
                            {restaurant.title}
                          </Typography>
                          {renderRatingStars(restaurant.rating)}
                        </div>

                        {/* Owner Information */}
                        <Typography
                          variant="body2"
                          className="flex items-center mb-2 text-gray-600"
                        >
                          <MdPerson className="mr-1" />
                          {restaurant.ownerName || "Owner not specified"}
                        </Typography>

                        {/* Category */}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className="flex items-center mb-2"
                        >
                          <MdOutlineCategory className="mr-1" />
                          {restaurant.category || "No category specified"}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          className="mb-3 line-clamp-2"
                        >
                          {restaurant.description || "No description available"}
                        </Typography>

                        {/* Contact and Location */}
                        <div className="space-y-1">
                          <Typography
                            variant="body2"
                            className="flex items-center"
                          >
                            <MdPhone className="mr-1" />
                            {restaurant.contactNumber ||
                              restaurant.ownerContact ||
                              "Contact not available"}
                          </Typography>
                          <Typography
                            variant="body2"
                            className="flex items-center"
                          >
                            <MdAccessTime className="mr-1" />
                            {restaurant.timings || "Timings not specified"}
                          </Typography>
                          <Typography
                            variant="body2"
                            className="flex items-center"
                          >
                            <MdLocationOn className="mr-1" />
                            {restaurant.address || "Address not available"}
                          </Typography>
                        </div>
                      </CardContent>

                      {/* Action Buttons */}
                      <div className="p-4 flex justify-between">
                        <button
                          onClick={() => handleViewOffers(restaurant)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center flex-1 mr-2"
                        >
                          View Offers
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${restaurant.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors flex items-center justify-center"
                        >
                          <MdDirections size={20} />
                        </a>
                      </div>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Card className="text-center p-6">
                    <BiRestaurant
                      size={60}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      No restaurants found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {searchTerm ||
                      categoryFilter !== "all" ||
                      activeFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "No restaurants available at the moment"}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      className="mt-4"
                      onClick={fetchRestaurants}
                    >
                      Refresh
                    </Button>
                  </Card>
                </Grid>
              )}
            </Grid>

            {/* Pagination */}
            {filteredRestaurants.length > itemsPerPage && (
              <div className="flex justify-center mt-8">
                <Pagination
                  count={Math.ceil(filteredRestaurants.length / itemsPerPage)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Offers Modal */}
      {showOffersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                Current Offers at {selectedRestaurant?.title}
              </h3>
              <button 
                onClick={() => setShowOffersModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            {offersLoading ? (
              <div className="flex justify-center py-8">
                <CircularProgress size={40} />
              </div>
            ) : offers.length > 0 ? (
              <div className="space-y-4">
                {offers.map(offer => (
                  <div key={offer._id} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{offer.title}</h4>
                        <p className="text-gray-600 mt-1">{offer.description}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {offer.offer_type === 'Percentage Discount' 
                          ? `${offer.discount_value}% OFF` 
                          : `₹${offer.discount_value} OFF`}
                      </span>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MdAccessTime className="mr-1" />
                        <span>
                          Valid until: {new Date(offer.valid_to).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      {offer.min_order_value && (
                        <div className="mt-1">
                          Minimum order: ₹{offer.min_order_value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No active offers available
              </div>
            )}
          </div>
        </div>
      )}

      <UserFooter />
    </div>
  );
};

export default GuestRestaurant;