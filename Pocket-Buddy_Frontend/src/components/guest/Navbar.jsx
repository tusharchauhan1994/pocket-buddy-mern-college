import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BiRestaurant, BiChevronDown, BiUserCircle } from "react-icons/bi";
import { AiOutlineMenuUnfold, AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const handleChange = () => setMenu(!menu);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenu(false);
  }, [location]);

  // Check auth status (mock implementation)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      // In a real app, you would fetch user data here
      setUserProfile({
        name: "John Doe",
        email: "john@example.com"
      });
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserProfile(null);
    navigate("/");
  };

  return (
    <header className="fixed w-full bg-white shadow-md z-50 top-0">
      <div className="flex justify-between items-center p-4 md:px-8 lg:px-16 xl:px-32">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <BiRestaurant size={32} className="text-red-500" />
          <h1 className="text-xl font-bold text-red-500">Pocket-Buddy</h1>
        </Link>

        {/* Search Bar - Desktop */}
        {/* <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 mx-8 max-w-xl"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search restaurants or dishes..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchRef}
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </form> */}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-base font-medium">
          <Link 
            to="/" 
            className={`hover:text-red-500 transition-colors ${location.pathname === "/" ? "text-red-500 font-semibold" : "text-gray-700"}`}
          >
            Home
          </Link>

          <Link 
            to="/offers" 
            className={`hover:text-red-500 transition-colors ${location.pathname === "/offers" ? "text-red-500 font-semibold" : "text-gray-700"}`}
          >
            Offers
          </Link>

          <Link 
            to="/restaurants" 
            className={`hover:text-red-500 transition-colors ${location.pathname === "/restaurants" ? "text-red-500 font-semibold" : "text-gray-700"}`}
          >
            Restaurants
          </Link>

          <Link 
            to="/review" 
            className={`hover:text-red-500 transition-colors ${location.pathname === "/review" ? "text-red-500 font-semibold" : "text-gray-700"}`}
          >
            Reviews
          </Link>

          {/* <Link to="/cart" className="relative hover:text-red-500 transition-colors">
            <AiOutlineShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Link> */}

          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
                onClick={() => setDropdown(!dropdown)}
              >
                <BiUserCircle size={24} />
                <span className="hidden lg:inline">{userProfile?.name || "Account"}</span>
                <BiChevronDown size={20} className={`transition-transform ${dropdown ? "rotate-180" : ""}`} />
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            className="text-gray-700 focus:outline-none"
            onClick={() => searchRef.current?.focus()}
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>
          <button
            className="text-gray-700 focus:outline-none"
            onClick={handleChange}
            aria-label="Toggle Menu"
          >
            {menu ? (
              <AiOutlineClose size={25} />
            ) : (
              <AiOutlineMenuUnfold size={25} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - Only shown when menu is open */}
      {menu && (
        <form onSubmit={handleSearch} className="md:hidden p-4 bg-gray-100">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search restaurants or dishes..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </form>
      )}

      {/* Mobile Menu */}
      {menu && (
        <div className="md:hidden fixed top-[72px] left-0 w-full bg-white shadow-lg flex flex-col items-start gap-0 py-2 border-t border-gray-200">
          <Link 
            to="/" 
            className={`w-full px-6 py-3 text-left ${location.pathname === "/" ? "text-red-500 font-medium bg-red-50" : "text-gray-700"}`}
          >
            Home
          </Link>
          <Link
            to="/offers"
            className={`w-full px-6 py-3 text-left ${location.pathname === "/offers" ? "text-red-500 font-medium bg-red-50" : "text-gray-700"}`}
          >
            Offers
          </Link>
          <Link
            to="/restaurants"
            className={`w-full px-6 py-3 text-left ${location.pathname === "/restaurants" ? "text-red-500 font-medium bg-red-50" : "text-gray-700"}`}
          >
            Restaurants
          </Link>
          <Link
            to="/review"
            className={`w-full px-6 py-3 text-left ${location.pathname === "/review" ? "text-red-500 font-medium bg-red-50" : "text-gray-700"}`}
          >
            Reviews
          </Link>
          <Link
            to="/cart"
            className={`w-full px-6 py-3 text-left flex items-center gap-2 ${location.pathname === "/cart" ? "text-red-500 font-medium bg-red-50" : "text-gray-700"}`}
          >
            <AiOutlineShoppingCart size={20} />
            Cart (3)
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className={`w-full px-6 py-3 text-left ${location.pathname === "/profile" ? "text-red-500 font-medium bg-red-50" : "text-gray-700"}`}
              >
                My Profile
              </Link>
              <Link
                to="/orders"
                className={`w-full px-6 py-3 text-left ${location.pathname === "/orders" ? "text-red-500 font-medium bg-red-50" : "text-gray-700"}`}
              >
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 text-left text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="w-full px-6 py-4 flex gap-3 border-t border-gray-200">
              <button
                className="flex-1 px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => {
                  navigate("/login");
                  setMenu(false);
                }}
              >
                Login
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                onClick={() => {
                  navigate("/signup");
                  setMenu(false);
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;