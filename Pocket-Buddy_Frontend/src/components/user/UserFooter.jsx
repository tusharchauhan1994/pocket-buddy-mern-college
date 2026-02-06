import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaHome,
  FaInfoCircle,
  FaTags,
  FaUtensils,
  FaUserCog,
  FaStore,
  FaEnvelope,
  FaPhone,
  FaShareAlt,
} from "react-icons/fa";

export const UserFooter = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <FaFacebook />,
      url: "https://facebook.com/pocketbuddy",
      label: "Facebook",
    },
    {
      icon: <FaTwitter />,
      url: "https://twitter.com/pocketbuddy",
      label: "Twitter",
    },
    {
      icon: <FaInstagram />,
      url: "https://instagram.com/pocketbuddy",
      label: "Instagram",
    },
    {
      icon: <FaLinkedin />,
      url: "https://linkedin.com/company/pocketbuddy",
      label: "LinkedIn",
    },
  ];

  const quickLinks = [
    { icon: <FaHome />, text: "Home", url: "/" },
    { icon: <FaInfoCircle />, text: "About Us", url: "/aboutUs" },
    { icon: <FaTags />, text: "Offers", url: "/offers" },
    { icon: <FaUtensils />, text: "Restaurants", url: "/restaurants" },
  ];

  const featureLinks = [
    { icon: <FaUserCog />, text: "User Dashboard", url: "/dashboard" },
    {
      icon: <FaStore />,
      text: "Restaurant Panel",
      url: "/restaurant-dashboard",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white rounded-t-3xl mt-20">
      <div className="container mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-brightColor">
              Pocket Buddy
            </h2>
            <p className="text-gray-300">
              Discover exclusive restaurant deals and manage your favorite
              places, all in one app!
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-gray-300 hover:text-brightColor transition-colors text-xl"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <nav className="space-y-3">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="flex items-center text-gray-300 hover:text-brightColor transition-colors"
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.text}
                </a>
              ))}
            </nav>
          </div>

          {/* Features */}
          {/* <div className="space-y-4">
            <h3 className="text-xl font-semibold">Features</h3>
            <nav className="space-y-3">
              {featureLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="flex items-center text-gray-300 hover:text-brightColor transition-colors"
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.text}
                </a>
              ))}
            </nav>
          </div> */}

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Us</h3>
            <address className="not-italic space-y-3">
              <a
                href="mailto:support@pocketbuddy.com"
                className="flex items-center text-gray-300 hover:text-brightColor transition-colors"
              >
                <FaEnvelope className="mr-2" />
                pocketbuddy.food.offers@gmail.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center text-gray-300 hover:text-brightColor transition-colors"
              >
                <FaPhone className="mr-2" />
                +91 99999 88888
              </a>
              <div className="flex items-center text-gray-300">
                <FaShareAlt className="mr-2" />
                <span>Follow us:</span>
                <div className="ml-2 flex space-x-2">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="hover:text-brightColor transition-colors"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Footer Bottom */}
        <div className="text-center text-gray-400">
          <p>
            © {currentYear} Developed by{" "}
            <span className="text-brightColor font-medium">
              Pocket Buddy Team
            </span>{" "}
            | All rights reserved
          </p>
          <div className="flex justify-center space-x-4 mt-2 text-sm">
            <a
              href="/privacy"
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
