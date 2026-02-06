import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";
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
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from "@mui/material";
import { 
  MdOutlineCategory, 
  MdPhone, 
  MdAccessTime, 
  MdLocationOn,
  MdSearch,
  MdStar,
  MdStarBorder,
  MdPerson,
  MdRestaurant,
  MdLocalOffer,
  MdClose,
  MdDirections
} from "react-icons/md";
import { toast } from "react-toastify";

export const UserRestaurant = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [offers, setOffers] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [offersLoading, setOffersLoading] = useState(false);

  useEffect(() => {
    fetchRestaurantOwners();
  }, []);

  const fetchRestaurantOwners = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/admin/restaurants");
      
      if (res.data?.data && Array.isArray(res.data.data)) {
        setOwners(res.data.data);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.response?.data?.message || "Failed to fetch data. Please try again.");
      toast.error("Failed to load restaurant data");
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

  const handleOpenMap = (address) => {
    if (!address) {
      toast.warning("No address available for this restaurant");
      return;
    }
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  const filteredOwners = owners.filter(owner => {
    const matchesOwner = 
      owner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRestaurant = owner.restaurants?.some(restaurant => 
      restaurant.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchesOwner || matchesRestaurant;
  });

  const paginatedOwners = filteredOwners.slice(
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 mt-16">
      <UserNavbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-5 lg:px-32 text-center">
        <div className="max-w-4xl mx-auto">
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Restaurant Owners Directory
          </Typography>
          <Typography variant="h6" component="p">
            Manage and view all restaurant owners and their establishments
          </Typography>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 lg:px-32 py-10 flex-grow">
        {/* Search Section */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search owners or restaurants..."
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
            <Grid item xs={12} md={6} className="flex justify-end">
              <Button
                variant="contained"
                color="primary"
                onClick={fetchRestaurantOwners}
                className="h-full"
              >
                Refresh Data
              </Button>
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
              <Button color="inherit" size="small" onClick={fetchRestaurantOwners}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Owner Cards */}
        {!loading && (
          <>
            <Grid container spacing={4}>
              {paginatedOwners.length > 0 ? (
                paginatedOwners.map((owner) => (
                  <Grid item xs={12} key={owner._id}>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent>
                        {/* Owner Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <Typography variant="h5" fontWeight="bold">
                              {owner.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className="flex items-center mt-1">
                              <MdPerson className="mr-1" />
                              {owner.email} | {owner.contactNumber || "No contact"}
                            </Typography>
                          </div>
                          <Chip
                            label={`${owner.restaurants?.length || 0} Restaurants`}
                            color="primary"
                            className="mt-2 md:mt-0"
                          />
                        </div>

                        {/* Restaurants List */}
                        <div className="space-y-4">
                          {owner.restaurants && owner.restaurants.length > 0 ? (
                            owner.restaurants.map((restaurant) => (
                              <Card 
                                key={restaurant._id} 
                                className="border-0 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <CardContent>
                                  <Grid container spacing={2}>
                                    {/* Restaurant Image */}
                                    <Grid item xs={12} md={3}>
                                      <div className="relative h-full">
                                        <img
                                          src={restaurant.imageURL || "https://placehold.co/600x400"}
                                          alt={restaurant.title}
                                          className="w-full h-48 object-cover rounded-md"
                                        />
                                        <div className="absolute top-2 right-2">
                                          <Chip
                                            label={restaurant.active ? "Open" : "Closed"}
                                            color={restaurant.active ? "success" : "error"}
                                            size="small"
                                          />
                                        </div>
                                      </div>
                                    </Grid>

                                    {/* Restaurant Details */}
                                    <Grid item xs={12} md={6}>
                                      <div className="flex justify-between items-start">
                                        <Typography variant="h6" fontWeight="bold">
                                          {restaurant.title}
                                        </Typography>
                                        {restaurant.rating && renderRatingStars(restaurant.rating)}
                                      </div>

                                      <Typography variant="body2" className="flex items-center mt-1">
                                        <MdOutlineCategory className="mr-1" />
                                        {restaurant.category || "No category specified"}
                                      </Typography>

                                      <Typography variant="body2" className="mt-2 line-clamp-2">
                                        {restaurant.description || "No description available"}
                                      </Typography>

                                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <Typography variant="body2" className="flex items-center">
                                          <MdPhone className="mr-1" />
                                          {restaurant.contactNumber || "Contact not available"}
                                        </Typography>
                                        <Typography variant="body2" className="flex items-center">
                                          <MdAccessTime className="mr-1" />
                                          {restaurant.timings || "Timings not specified"}
                                        </Typography>
                                        <Typography variant="body2" className="flex items-center sm:col-span-2">
                                          <MdLocationOn className="mr-1" />
                                          {restaurant.address || "Address not available"}
                                        </Typography>
                                      </div>
                                    </Grid>

                                    {/* Action Buttons */}
                                    <Grid item xs={12} md={3} className=" flex-col justify-center space-y-2">
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<MdLocalOffer />}
                                        onClick={() => handleViewOffers(restaurant)}
                                        className="w-full"
                                        size="small"
                                      >
                                        View Offers
                                      </Button>
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<MdDirections />}
                                        onClick={() => handleOpenMap(restaurant.address)}
                                        className="w-full"
                                        size="small"
                                        disabled={!restaurant.address}
                                      >
                                        Directions
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <Card className="text-center p-6">
                              <MdRestaurant size={40} className="mx-auto text-gray-400" />
                              <Typography variant="body1" color="textSecondary" className="mt-2">
                                No restaurants registered
                              </Typography>
                            </Card>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Card className="text-center p-6">
                    <MdRestaurant size={60} className="mx-auto text-gray-400 mb-4" />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      No owners found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {searchTerm
                        ? "Try adjusting your search"
                        : "No owners available at the moment"}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      className="mt-4"
                      onClick={fetchRestaurantOwners}
                    >
                      Refresh
                    </Button>
                  </Card>
                </Grid>
              )}
            </Grid>

            {/* Pagination */}
            {filteredOwners.length > itemsPerPage && (
              <div className="flex justify-center mt-8">
                <Pagination
                  count={Math.ceil(filteredOwners.length / itemsPerPage)}
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
      <Dialog
        open={showOffersModal}
        onClose={() => setShowOffersModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center bg-gray-50">
          <div className="flex items-center">
            <MdLocalOffer className="mr-2 text-blue-500" />
            <span>
              Current Offers at <strong>{selectedRestaurant?.title}</strong>
            </span>
          </div>
          <IconButton 
            onClick={() => setShowOffersModal(false)}
            color="inherit"
          >
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className="bg-white">
          {offersLoading ? (
            <div className="flex justify-center py-8">
              <CircularProgress size={40} />
            </div>
          ) : offers.length > 0 ? (
            <div className="space-y-4">
              {offers.map(offer => (
                <Card key={offer._id} className="hover:shadow-md transition-shadow">
                  <CardContent>
                    <div className="flex justify-between items-start">
                      <div>
                        <Typography variant="h6" fontWeight="bold">
                          {offer.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="mt-1">
                          {offer.description}
                        </Typography>
                      </div>
                      <Chip
                        label={
                          offer.offer_type === 'Percentage Discount' 
                            ? `${offer.discount_value}% OFF` 
                            : `₹${offer.discount_value} OFF`
                        }
                        color="primary"
                        className="ml-2"
                      />
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Typography variant="body2" className="flex items-center">
                        <MdAccessTime className="mr-1" />
                        Valid until: {formatDate(offer.valid_to)}
                      </Typography>
                      {offer.min_order_value && (
                        <Typography variant="body2">
                          Min. order: ₹{offer.min_order_value}
                        </Typography>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MdLocalOffer size={60} className="mx-auto text-gray-400 mb-4" />
              <Typography variant="h6" color="textSecondary">
                No active offers available
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mt-2">
                This restaurant currently has no offers
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-50">
          <Button 
            onClick={() => setShowOffersModal(false)}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <UserFooter />
    </div>
  );
};

export default UserRestaurant;