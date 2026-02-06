import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BiRestaurant,
  BiSolidOffer,
  BiUser,
  BiHomeAlt,
  BiFoodMenu,
  BiListPlus,
  BiStar,
  BiCog,
} from "react-icons/bi";
import {
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlinePlus,
  AiOutlineShop,
} from "react-icons/ai";
import { MdOutlineRateReview, MdOutlineRequestQuote } from "react-icons/md";
import axios from "axios";
import { Avatar, Tooltip } from "@mui/material";

export const RestaurantSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [restaurantUser, setRestaurantUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          throw new Error("User ID not found");
        }

        const response = await axios.get(`/user/user/${userId}`);
        setRestaurantUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to default values if API fails
        setRestaurantUser({
          name: "Restaurant User",
          email: "user@example.com",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen h-full fix">
      <aside
        className={`bg-gray-900 text-white transition-all fixed top-0 left-0 duration-300 overflow-y-auto ${
          isOpen ? "w-64" : "w-20"
        } min-h-screen overflow-y-auto relative z-50 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-5 text-xl font-bold border-b border-gray-700 flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-2">
              <BiRestaurant size={24} className="text-red-400" />
              <span>Pocket Buddy</span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-red-400 transition-colors"
          >
            {isOpen ? (
              <AiOutlineClose size={24} />
            ) : (
              <AiOutlineMenu size={24} />
            )}
          </button>
        </div>

        {/* User Profile Section */}
        {!loading && (
          <div
            className={`border-b border-gray-700 ${
              isOpen ? "p-4" : "p-2 flex justify-center"
            }`}
          >
            {isOpen ? (
              <div className="flex flex-col items-center gap-2">
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: "#ef4444",
                    fontSize: "1.5rem",
                    marginBottom: "8px",
                  }}
                >
                  {restaurantUser?.name?.charAt(0) || "U"}
                </Avatar>
                <div className="text-center w-full overflow-hidden">
                  <p className="font-semibold truncate">
                    {restaurantUser?.name || "Restaurant User"}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {restaurantUser?.email || "user@example.com"}
                  </p>
                </div>
              </div>
            ) : (
              <Tooltip
                title={restaurantUser?.name || "User"}
                placement="right"
                arrow
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#ef4444",
                    fontSize: "1rem",
                  }}
                >
                  {restaurantUser?.name?.charAt(0) || "U"}
                </Avatar>
              </Tooltip>
            )}
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav className="flex-1 flex flex-col justify-between mt-2 p-2">
          <div className="flex flex-col gap-1">
            <Tooltip
              title="Dashboard"
              placement="right"
              arrow
              disableHoverListener={isOpen}
            >
              <Link
                to="/restaurant/dashboard"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive("/restaurant/dashboard")
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <BiHomeAlt size={20} className="flex-shrink-0" />
                {isOpen && <span>Dashboard</span>}
              </Link>
            </Tooltip>

            <Tooltip
              title="Offer Requests"
              placement="right"
              arrow
              disableHoverListener={isOpen}
            >
              <Link
                to="/restaurant/ManageOfferRequests"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive("/restaurant/ManageOfferRequests")
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <MdOutlineRequestQuote size={20} className="flex-shrink-0" />
                {isOpen && <span>Offer Requests</span>}
              </Link>
            </Tooltip>

            <Tooltip
              title="Add Restaurant"
              placement="right"
              arrow
              disableHoverListener={isOpen}
            >
              <Link
                to="/restaurant/addRestaurant"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive("/restaurant/addRestaurant")
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <AiOutlinePlus size={20} className="flex-shrink-0" />
                {isOpen && <span>Add Restaurant</span>}
              </Link>
            </Tooltip>

            <Tooltip
              title="My Restaurants"
              placement="right"
              arrow
              disableHoverListener={isOpen}
            >
              <Link
                to="/restaurant/myRestaurant"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive("/restaurant/myRestaurant")
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <AiOutlineShop size={20} className="flex-shrink-0" />
                {isOpen && <span>My Restaurants</span>}
              </Link>
            </Tooltip>

            <Tooltip
              title="My Offers"
              placement="right"
              arrow
              disableHoverListener={isOpen}
            >
              <Link
                to="/restaurant/myOffers"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive("/restaurant/myOffers")
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <BiFoodMenu size={20} className="flex-shrink-0" />
                {isOpen && <span>My Offers</span>}
              </Link>
            </Tooltip>

            <Tooltip
              title="Add Offer"
              placement="right"
              arrow
              disableHoverListener={isOpen}
            >
              <Link
                to="/restaurant/addOffer"
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive("/restaurant/addOffer")
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <BiListPlus size={20} className="flex-shrink-0" />
                {isOpen && <span>Add Offer</span>}
              </Link>
            </Tooltip>
          </div>

          {/* Bottom Section - Logout */}
          <div className="mb-4">
            <Tooltip
              title="Logout"
              placement="right"
              arrow
              disableHoverListener={isOpen}
            >
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-gray-700 w-full transition-colors"
              >
                <AiOutlineLogout size={20} className="flex-shrink-0" />
                {isOpen && <span>Logout</span>}
              </button>
            </Tooltip>
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default RestaurantSidebar;
