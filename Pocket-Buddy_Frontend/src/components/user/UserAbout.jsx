import React from "react";
import aboutImage from "../../assets/img/about.png"; // Consider replacing with food/restaurant-themed image
import Button from "../../layouts/Button";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";

const UserAbout = () => {
  return (
    <>
      <UserNavbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 py-16 mt-16">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About Pocket Buddy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bridging the gap between hungry food lovers and amazing restaurant deals
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen container mx-auto flex flex-col lg:flex-row items-center justify-between px-5 lg:px-32 py-12 gap-12">
        
        {/* Image Section - Add animation on hover */}
        <div className="flex-1 transform hover:scale-105 transition duration-300">
          <img 
            src={aboutImage} 
            alt="Pocket Buddy app in action showing food offers" 
            className="rounded-xl shadow-lg w-full max-w-md mx-auto border-4 border-white"
          />
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Why Restaurants & Food Lovers Love Us
          </h2>
          
          <div className="space-y-4 text-gray-700">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-orange-600 text-lg">For Restaurants</h3>
              <p>
                Easily create, manage, and track your food offers in real-time. Reduce waste, attract new customers, 
                and fill your tables during slow hours with our powerful promotion tools.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-orange-600 text-lg">For Users</h3>
              <p>
                Discover amazing deals near you, claim exclusive offers, and save money on your favorite foods. 
                Never miss out on limited-time promotions again!
              </p>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Real-time offer management",
                "Location-based deals",
                "Easy redemption process",
                "Performance analytics",
                "Customer engagement tools",
                "No hidden fees"
              ].map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button title="How It Works" className="bg-orange-500 hover:bg-orange-600" />
            <Button title="Join Today" outline className="border-orange-500 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
          {[
            { number: "500+", label: "Partner Restaurants" },
            { number: "50K+", label: "Happy Users" },
            { number: "90%", label: "Offer Redemption Rate" },
            { number: "24/7", label: "Support Available" }
          ].map((stat, index) => (
            <div key={index} className="p-4">
              <p className="text-3xl font-bold text-orange-600">{stat.number}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <UserFooter />
    </>
  );
};

export default UserAbout;