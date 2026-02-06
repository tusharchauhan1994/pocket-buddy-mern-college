import React from "react";
import { BsFacebook, BsInstagram, BsLinkedin } from "react-icons/bs";
import { RiTwitterXFill } from "react-icons/ri";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/aboutUs" },
    { name: "Offers", path: "/offers" },
    { name: "Restaurants", path: "/restaurants" },
  ];

  const features = [
    // { name: "User Dashboard", path: "/dashboard" },
    // { name: "Restaurant Panel", path: "/restaurant-dashboard" },
    // { name: "Deals & Coupons", path: "/deals" },
  ];

  const socialMedia = [
    { icon: <BsFacebook size={20} />, url: "https://facebook.com/pocketbuddy" },
    {
      icon: <RiTwitterXFill size={20} />,
      url: "https://twitter.com/pocketbuddy",
    },
    {
      icon: <BsInstagram size={20} />,
      url: "https://instagram.com/pocketbuddy",
    },
    {
      icon: <BsLinkedin size={20} />,
      url: "https://linkedin.com/company/pocketbuddy",
    },
  ];

  return (
    <footer className="bg-black text-white rounded-t-3xl">
      <div className="container mx-auto px-5 py-8 md:px-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="font-semibold text-2xl">Pocket Buddy</h2>
            <p className="text-gray-300 text-sm">
              Discover exclusive restaurant deals and manage your favorite
              places, all in one app!
            </p>
            <div className="flex space-x-4 pt-2">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-brightColor transition-colors duration-300"
                  aria-label={social.url.split(".")[1]}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-medium text-xl">Quick Links</h3>
            <nav className="space-y-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.path}
                  className="block text-gray-300 hover:text-brightColor transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Features */}
          {/* <div className="space-y-4">
            <h3 className="font-medium text-xl">Features</h3>
            <nav className="space-y-2">
              {features.map((feature, index) => (
                <a
                  key={index}
                  href={feature.path}
                  className="block text-gray-300 hover:text-brightColor transition-colors duration-200"
                >
                  {feature.name}
                </a>
              ))}
            </nav>
          </div> */}

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-xl">Contact Us</h3>
            <address className="not-italic space-y-2">
              <a
                href="mailto:pocketbuddy.food.offers@gmail.com"
                className="block text-gray-300 hover:text-brightColor transition-colors duration-200"
              >
                pocketbuddy.food.offers@gmail.com
              </a>
              <a
                href="tel:+919999988888"
                className="block text-gray-300 hover:text-brightColor transition-colors duration-200"
              >
                +91 99999 88888
              </a>
              <p className="text-gray-300">123 Food Street, Tech City</p>
              <p className="text-gray-300">India - 560001</p>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Footer Bottom */}
        <div className="text-center text-gray-400 text-sm">
          <p>
            © {currentYear} Developed by{" "}
            <span className="text-brightColor font-medium">
              Pocket Buddy Team
            </span>{" "}
            | All rights reserved
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <a
              href="/privacy-policy"
              className="hover:text-brightColor transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-brightColor transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              className="hover:text-brightColor transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
