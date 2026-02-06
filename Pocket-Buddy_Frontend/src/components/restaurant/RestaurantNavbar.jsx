import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";

const RestaurantNavbar = () => {
  return (
    <nav className="fixed top-0 left-64 w-[calc(100%-16rem)] bg-white shadow-md flex items-center justify-between px-6 py-4 z-50">
      {/* Search Bar */}
      <div className="relative w-1/3 md:w-1/2">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <AiOutlineSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={20} />
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium hidden md:block">John Doe</span>
        <BiUserCircle size={32} className="text-gray-700" />
      </div>
    </nav>
  );
};

export default RestaurantNavbar;
