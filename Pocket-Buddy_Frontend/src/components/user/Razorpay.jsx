import axios from "axios";
import React from "react";

// 🔹 Accepts planName as a prop
export const Razorpay = ({ planName }) => {
  const handleSubscription = async () => {
    try {
      // Step 1: Create order
      const orderRes = await axios.post(
        "http://localhost:3000/payment/create-order",
        {
          planName: planName,
        }
      );

      const order = orderRes.data;

      // Step 2: Load Razorpay script
      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!scriptLoaded) {
        alert("Failed to load Razorpay SDK. Check internet connection.");
        return;
      }
      console.log("🔐 Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);

      // Step 3: Show Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // test key from .env
        amount: order.amount,
        currency: order.currency,
        name: "Pocket Buddy Pro",
        description: `Subscription: ${planName}`,
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            "http://localhost:3000/payment/verify-order",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verifyRes.data.status === "success") {
            alert(`🎉 Payment successful for ${planName}!`);
            // You can now store this info in DB
          } else {
            alert("⚠️ Payment verification failed.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#f97316", // orange
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error starting Razorpay payment:", error);
      alert("Failed to start payment. Try again.");
    }
  };

  // Helper to load Razorpay script
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return (
    <button
      onClick={handleSubscription}
      className="w-full py-3 px-6 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium"
    >
      Subscribe to {planName}
    </button>
  );
};
