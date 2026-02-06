const Razorpay = require("razorpay");
const crypto = require("crypto");


require('dotenv').config(); // Load ENV before anything else

console.log("✅ Razorpay Keys Loaded:", {
  key: process.env.RAZORPAY_KEY_ID,
  secret: process.env.RAZORPAY_KEY_SECRET?.slice(0, 5) + '...' 
});

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Plan pricing map
const subscriptionPlans = {
  "Monthly Pass": { amount: 200, duration: "1 month" },
  "Half-Year": { amount: 1000, duration: "6 months" },
  "Yearly Saver": { amount: 1500, duration: "12 months" },
};

// Create order API
const create_order = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // Log incoming data

    const { planName } = req.body;
    
    if (!planName) {
      console.error("Plan name missing in request");
      return res.status(400).json({ message: "Plan name is required" });
    }

    // Verify environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay keys not loaded from .env");
      throw new Error("Server configuration error");
    }

    const plans = {
      "Monthly Pass": 20000,
      "Half-Year": 100000,
      "Yearly Saver": 150000
    };

    const amount = plans[planName];
    if (!amount) {
      console.error("Invalid plan selected:", planName);
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    console.log("Creating order for:", { planName, amount });

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { planName }
    };

    const order = await razorpay.orders.create(options);
    console.log("Order created successfully:", order.id);
    res.status(200).json(order);

  } catch (error) {
    console.error("Order creation failed:", {
      error: error.message,
      stack: error.stack,
      razorpayError: error.error // Razorpay-specific error
    });
    res.status(500).json({ 
      message: "Order creation failed",
      error: error.message,
      details: error.error?.description || "No additional details"
    });
  }
};

// Verify order API
const verify_order = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 1. Input validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification parameters" });
    }

    // 2. Prepare the signature body (EXACT format)
    const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;

    // 3. Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(signatureBody)
      .digest('hex');

    // 4. Debug logs (remove in production)
    console.log('Verification Debug:', {
      signatureBody,
      secret: process.env.RAZORPAY_KEY_SECRET,
      generated: expectedSignature,
      received: razorpay_signature
    });

    // 5. Secure comparison
    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        status: "failure",
        message: "Payment verification failed",
        debug: {
          reason: "Signature mismatch",
          signatureBody,
          generatedSignature: expectedSignature,
          receivedSignature: razorpay_signature
        }
      });
    }

    // 6. Success
    return res.status(200).json({
      status: "success",
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error during verification"
    });
  }
};

console.log("🔑 Razorpay ENV:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET);


module.exports = {
  create_order,
  verify_order,
};
