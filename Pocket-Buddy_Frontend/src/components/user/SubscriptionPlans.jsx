import React, { useState } from "react";
import { UserNavbar } from "./UserNavbar";
import { UserFooter } from "./UserFooter";
import {
  FaCheck,
  FaRupeeSign,
  FaCrown,
  FaBolt,
  FaPercentage,
} from "react-icons/fa";
import axios from "axios";

const UserSubscriptionPlans = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: "monthly",
      name: "Monthly Pass",
      price: 200,
      duration: "per month",
      icon: <FaBolt className="text-blue-500" />,
      features: [
        "Unlimited offer claims",
        "Exclusive member-only deals",
        "5% extra savings on all offers",
        "Basic customer support",
        "Cancel anytime",
      ],
      savings: "",
      cta: "Start Saving",
    },
    {
      id: "yearly",
      name: "Yearly Saver",
      price: 1500,
      duration: "per year",
      icon: <FaCrown className="text-amber-400" />,
      features: [
        "All Monthly benefits",
        "15% extra savings on all offers",
        "Priority customer support",
        "Free surprise treats monthly",
        "First access to new restaurants",
        "₹900 savings vs monthly",
      ],
      savings: "37% cheaper than monthly",
      cta: "Recommended",
      popular: true,
    },
    {
      id: "halfyear",
      name: "Half-Year",
      price: 1000,
      duration: "for 6 months",
      icon: <FaPercentage className="text-green-500" />,
      features: [
        "All Monthly benefits",
        "10% extra savings on offers",
        "Faster customer support",
        "Early access to weekend deals",
        "₹200 savings vs monthly",
      ],
      savings: "17% savings",
      cta: "Popular Choice",
    },
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan) => {
    setLoading(true);
    setSelectedPlan(plan.id);
  
    try {
      // 1. Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }
  
      // 2. Create order on backend
      const { data: order } = await axios.post("http://localhost:3000/payment/create-order", {
        planName: plan.name,
      });
  
      // 3. Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Pocket Buddy",
        description: `${plan.name} Subscription`,
        image: "https://yourdomain.com/logo.png", // ✅ Replace with your deployed/public URL

        order_id: order.id,
        handler: async function (response) {
          const verification = await axios.post("http://localhost:3000/payment/verify-order", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        
          if (verification.data.status === "success") {
            try {
              const userId = localStorage.getItem("id");
              await axios.post("http://localhost:3000/subscription/save", {
                userId,
                planName: plan.name,
                price: plan.price,
                duration: plan.duration,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id
              });
              alert("✅ Payment Successful! Subscription saved.");
            } catch (saveError) {
              console.error("Subscription save failed:", saveError);
              alert("Payment succeeded but subscription save failed. Contact support.");
            }
          } else {
            alert("❌ Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "+919876543210",
        },
        theme: {
          color: "#F97316",
        },
      };
  
      console.log("🧾 Razorpay order response:", order);
      console.log("🪪 Order ID:", order.id);
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <UserNavbar />

      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white mt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-16 text-white text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Eat More, Pay Less
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Unlock exclusive food offers and maximum savings with Pocket Buddy
              Pro
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? "border-amber-400 shadow-md scale-[1.02]"
                    : "border-gray-200"
                } bg-white`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                    BEST VALUE
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{plan.icon}</span>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <FaRupeeSign className="text-gray-600 mr-1" size={16} />
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-gray-600">{plan.duration}</p>
                    {plan.savings && (
                      <p className="text-green-600 text-sm font-medium mt-1">
                        {plan.savings}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePayment(plan)}
                    disabled={loading && selectedPlan === plan.id}
                    className={`w-full py-3 px-6 rounded-lg font-medium ${
                      plan.popular
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    } ${
                      loading && selectedPlan === plan.id
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {loading && selectedPlan === plan.id
                      ? "Processing..."
                      : plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Breakdown */}
        <div className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-xl shadow-md p-6 border border-amber-100">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              <FaRupeeSign className="inline mr-2" />
              How Much You'll Save
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
              <div className="bg-gray-100 p-4 border rounded-lg">
                <p className="text-gray-600">Monthly</p>
                <p className="text-xl font-bold">₹200/mo</p>
                <p className="text-sm text-gray-500">₹2400/year</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-600">6-Month Plan</p>
                <p className="text-xl font-bold">₹167/mo</p>
                <p className="text-sm text-green-600">Save ₹200/year</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-amber-600">Yearly Plan</p>
                <p className="text-xl font-bold">₹125/mo</p>
                <p className="text-sm text-amber-600">Save ₹900/year</p>
              </div>
            </div>
            <div className="bg-amber-100 p-4 rounded-lg text-center">
              <p className="font-medium text-amber-800">
                ⭐ Yearly members save 37% and get extra dining perks!
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              What Our Foodies Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  quote:
                    "The yearly plan paid for itself in just 2 months! So many exclusive deals.",
                  name: "Priya K., Mumbai",
                },
                {
                  quote:
                    "I save ₹3000+ annually on my lunch breaks with Pocket Buddy Pro.",
                  name: "Rahul S., Delhi",
                },
              ].map((testimonial, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  <p className="mt-3 font-medium text-amber-600">
                    — {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Common Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: "Can I cancel anytime?",
                  answer:
                    "Yes! Cancel anytime and keep benefits until period ends.",
                },
                {
                  question: "Do offers work with existing discounts?",
                  answer:
                    "Yes! Pro discounts stack with restaurant promotions.",
                },
                {
                  question: "How do I claim my extra savings?",
                  answer:
                    "Discounts apply automatically at checkout in the app.",
                },
                {
                  question: "Is GST included?",
                  answer: "Yes, all prices include 18% GST.",
                },
              ].map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-4">
                  <h3 className="font-medium text-orange-600">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 mt-1">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <UserFooter />
    </>
  );
};

export default UserSubscriptionPlans;
