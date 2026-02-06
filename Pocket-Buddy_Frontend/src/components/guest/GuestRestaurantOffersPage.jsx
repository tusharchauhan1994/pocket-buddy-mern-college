// RestaurantOffersPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdArrowBack } from "react-icons/md";

export const GuestRestaurantOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const restaurantId = location.state?.restaurantId;

  useEffect(() => {
    if (!restaurantId) {
      toast.error("No restaurant selected");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch restaurant details
        const restaurantRes = await axios.get(`/restaurant/${restaurantId}`);
        setRestaurant(restaurantRes.data.data);
        
        // Fetch active offers
        const offersRes = await axios.get(`/offer/by-restaurant/${restaurantId}?status=Active`);
        setOffers(offersRes.data.offers || []);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId, navigate]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!restaurant) {
    return <div className="text-center py-8">Restaurant not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 mb-6"
      >
        <MdArrowBack className="mr-1" /> Back to Restaurants
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <img 
            src={restaurant.imageURL} 
            alt={restaurant.title} 
            className="w-20 h-20 object-cover rounded-lg mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold">{restaurant.title}</h1>
            <p className="text-gray-600">{restaurant.address}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Current Offers</h2>
        
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer._id} className="border rounded-lg overflow-hidden shadow-sm">
                {offer.imageURL && (
                  <img 
                    src={offer.imageURL} 
                    alt={offer.title} 
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-3">{offer.description}</p>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {offer.offer_type === 'Percentage Discount' 
                        ? `${offer.discount_value}% OFF` 
                        : `₹${offer.discount_value} OFF`}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      offer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {offer.status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-500">
                    <p>Valid: {new Date(offer.valid_from).toLocaleDateString('en-GB')} - {new Date(offer.valid_to).toLocaleDateString('en-GB')}</p>
                    {offer.min_order_value && (
                      <p>Min. order: ₹{offer.min_order_value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No active offers available at this time
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestRestaurantOffersPage;