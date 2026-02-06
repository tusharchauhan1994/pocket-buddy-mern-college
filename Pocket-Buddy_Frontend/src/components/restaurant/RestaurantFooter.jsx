import React from "react";

export const RestaurantFooter = () => {
  return (
    <footer className="w-full fixed bottom-0 left-0 bg-black text-white">

      <div className="flex flex-col md:flex-row justify-between items-start p-8 md:px-32 px-5">
        {/* Brand Section */}
        <div className="w-full md:w-1/4">
          <h1 className="font-semibold text-xl pb-4">Pocket Buddy</h1>
          <p className="text-sm">
            Helping restaurants manage and showcase their best offers & deals.
          </p>
        </div>

        {/* Links Section */}
        <div>
          <h1 className="font-medium text-xl pb-4">Quick Links</h1>
          <nav className="flex flex-col gap-2">
            <a className="hover:text-red-500 transition-all cursor-pointer" href="/">Dashboard</a>
            <a className="hover:text-red-500 transition-all cursor-pointer" href="/">Offers</a>
            <a className="hover:text-red-500 transition-all cursor-pointer" href="/">Deals</a>
            <a className="hover:text-red-500 transition-all cursor-pointer" href="/">Reviews</a>
          </nav>
        </div>

        {/* Contact Section */}
        <div>
          <h1 className="font-medium text-xl pb-4">Contact Us</h1>
          <nav className="flex flex-col gap-2">
            <a className="hover:text-red-500 transition-all cursor-pointer" href="/">support@pocketbuddy.com</a>
            <a className="hover:text-red-500 transition-all cursor-pointer" href="/">+91 98765 43210</a>
            <a className="hover:text-red-500 transition-all cursor-pointer" href="/">Follow us on Social Media</a>
          </nav>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-4 border-t border-gray-700">
        <p>
          © {new Date().getFullYear()} Pocket Buddy | All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default RestaurantFooter;
