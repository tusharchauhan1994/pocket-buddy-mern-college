import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BiRestaurant,
  BiChevronDown,
  BiUserCircle,
  BiHeart,
  BiLogOut,
  BiHomeAlt,
  BiGift,
  BiListCheck,
  BiStar,
} from "react-icons/bi";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { debounce } from "lodash";

export const UserNavbar = ({ setSearchQuery }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Debounced search
  const debouncedSearch = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleLogout = () => {
    localStorage.clear(); // This removes all key-value pairs
    navigate("/login", { replace: true });
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { path: "/user/dashboard", label: "Home", icon: <BiHomeAlt /> },
    { path: "/user/offers", label: "Offers", icon: <BiGift /> },
    { path: "/user/MyRequests", label: "Requests", icon: <BiListCheck /> },
    { path: "/user/restaurants", label: "Restaurants", icon: <BiRestaurant /> },
    {
      path: "/subscriptionPlans",
      label: "SubscriptionPlans",
      icon: <BiRestaurant />,
    },
    { path: "/user/review", label: "Reviews", icon: <BiStar /> },
  ];

  const profileLinks = [
    // {
    //   path: "/user/favorites/offers",
    //   label: "Saved Offers",
    //   icon: <BiHeart className="text-red-500" />,
    // },
    {
      path: "/user/profile",
      label: "Profile",
      icon: <BiUserCircle className="text-blue-500" />,
    },
    {
      action: handleLogout,
      label: "Logout",
      icon: <BiLogOut className="text-gray-500" />,
    },
  ];

  return (
    <header
      className={`fixed top-0 w-full bg-white z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/user/dashboard"
            className="flex items-center gap-2 cursor-pointer"
            aria-label="Home"
          >
            <BiRestaurant size={28} className="text-red-500" />
            <h1 className="text-xl font-bold text-red-500">Pocket-Buddy</h1>
          </Link>

          {/* Search Bar - Desktop */}
          {/* <div className="hidden md:flex items-center w-[30%] max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search offers..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={searchValue}
                onChange={handleSearchChange}
                aria-label="Search offers"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </div> */}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "text-red-500 bg-red-50"
                    : "text-gray-700 hover:text-red-500 hover:bg-red-50"
                }`}
              >
                <span className="hidden lg:inline">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Cart Icon
            <Link 
              to="/user/cart" 
              className="p-2 relative hover:text-red-500 transition-colors"
            >
              <AiOutlineShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link> */}

            {/* Profile Dropdown */}
            <div className="relative ml-2" ref={profileRef}>
              <button
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="Profile menu"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200">
                  <BiUserCircle size={20} />
                </div>
                <BiChevronDown
                  size={18}
                  className={`transition-transform ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {profileLinks.map((item, index) =>
                    item.path ? (
                      <Link
                        key={index}
                        to={item.path}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              className="p-2 text-gray-700 hover:text-red-500 focus:outline-none"
              aria-label="Search"
              onClick={() =>
                document.querySelector(".mobile-search-input")?.focus()
              }
            >
              <FiSearch size={20} />
            </button>
            <button
              className="p-2 rounded-md text-gray-700 hover:text-red-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <AiOutlineMenu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-xl">
          {/* Mobile Search */}
          <div className="px-4 pt-3 pb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search offers..."
                className="mobile-search-input w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchValue}
                onChange={handleSearchChange}
                aria-label="Search offers"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="px-2 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-red-500 bg-red-50"
                    : "text-gray-700 hover:text-red-500 hover:bg-red-50"
                }`}
                onClick={toggleMenu}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}

            {/* Mobile Cart Link */}
            <Link
              to="/user/cart"
              className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
                location.pathname === "/user/cart"
                  ? "text-red-500 bg-red-50"
                  : "text-gray-700 hover:text-red-500 hover:bg-red-50"
              }`}
              onClick={toggleMenu}
            >
              <span className="mr-3">
                <AiOutlineShoppingCart size={20} />
              </span>
              Cart (0)
            </Link>

            {/* Mobile Profile Links */}
            <div className="border-t border-gray-200 mt-2 pt-2">
              {profileLinks.map((item, index) =>
                item.path ? (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors"
                    onClick={toggleMenu}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      toggleMenu();
                    }}
                    className="w-full text-left flex items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                )
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
