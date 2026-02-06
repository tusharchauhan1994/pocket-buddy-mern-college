const express = require("express");
const router = express.Router();
const { create_order, verify_order } = require("../controllers/RazorPayController");

// Create Razorpay order
router.post("/create-order", create_order);

// Verify Razorpay payment signature
router.post("/verify-order", verify_order);

module.exports = router;
