const mongoose = require("mongoose");
const RedeemOffer = require("../models/RedeemOfferModel");
const Offer = require("../models/OfferModel");
const Location = require("../models/LocationModel");
const User = mongoose.model("users");

// ✅ Create a new redemption request
exports.createRedemption = async (req, res) => {
  try {
    const { user_id, offer_id } = req.body;

    if (!user_id || !offer_id) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // 🔍 Check if a pending or approved redemption request already exists
    const existingRequest = await RedeemOffer.findOne({
      user_id,
      offer_id,
      status: { $in: ["Pending", "Approved"] }, // Prevent duplicate pending/approved requests
    });

    if (existingRequest) {
      return res.status(400).json({ message: "You have already requested this offer. Please wait for approval." });
    }

    // 🔍 Find the offer
    const offer = await Offer.findById(offer_id);
    if (!offer || !offer.restaurant_ids || offer.restaurant_ids.length === 0) {
      return res.status(404).json({ message: "Offer or associated restaurant not found." });
    }

    console.log("✅ Offer found:", offer);

    // 🔍 Get the first restaurant linked to this offer
    const restaurant = await Location.findById(offer.restaurant_ids[0]);
    if (!restaurant || !restaurant.userId) {
      console.log("🚨 No owner found for restaurant:", restaurant);
      return res.status(404).json({ message: "Restaurant owner not found." });
    }

    const owner_id = restaurant.userId;
    console.log("✅ Owner ID:", owner_id); // Debugging log

    // 🚀 Save to MongoDB
    const newRedemption = new RedeemOffer({
      user_id,
      offer_id,
      restaurant_id: offer.restaurant_ids[0],
      owner_id,
      status: "Pending",
    });

    await newRedemption.save();

    return res.status(201).json({ message: "Redemption request created successfully!" });
  } catch (error) {
    console.error("Error creating redemption:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

// ✅ Approve or decline a redemption request
exports.updateRedemptionStatus = async (req, res) => {
  try {
    console.log("🔹 Incoming Request:", req.params, req.body); // ✅ Log request data

    const { request_id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      console.log("❌ Invalid status:", status);
      return res.status(400).json({ message: "Invalid status" });
    }

    if (!mongoose.Types.ObjectId.isValid(request_id)) {
      console.log("❌ Invalid ObjectId:", request_id);
      return res.status(400).json({ message: "Invalid request ID format" });
    }

    const request = await RedeemOffer.findById(request_id);
    if (!request) {
      console.log("❌ Request not found:", request_id);
      return res.status(404).json({ message: "Redemption request not found" });
    }

    request.status = status;
    await request.save();

    console.log(`✅ Request ${request_id} updated to ${status}`);
    res.status(200).json({ message: `Request ${status} successfully`, request });
  } catch (error) {
    console.error("🚨 Error updating redemption status:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ Get redemption requests for a user
exports.getUserRedemptions = async (req, res) => {
  try {
    const redemptions = await RedeemOffer.find({ user_id: req.params.userId })
      .populate("offer_id"); // ✅ Fixed populate field name

    res.json(redemptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get ALL redemption requests for an owner (Pending, Approved, Rejected)
exports.getOwnerRedemptions = async (req, res) => {
  try {
    const redemptions = await RedeemOffer.find({ owner_id: req.params.ownerId }) // ❌ Removed status filter
      .populate("offer_id")
      .populate({ path: "user_id", model: "users" });

    res.json(redemptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get redemption request by ID
exports.getRedemptionRequestById = async (req, res) => {
  try {
    const request = await RedeemOffer.findById(req.params.id)
      .populate("offer_id")
      .populate({ path: "user_id", model: "users" })  // Match the correct model name // ✅ Fixed populate field name
      .populate("restaurant_id")
      .populate("owner_id");

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all redemption requests for an owner (Updated)
exports.getRequestsForRestaurant = async (req, res) => {
  try {
    console.log("Query Params:", req.query); // 🔍 Debugging step

    const restaurant_id = req.query.restaurant_id; // ✅ Ensure correct extraction

    // ✅ Validate restaurant_id
    if (!restaurant_id || !mongoose.Types.ObjectId.isValid(restaurant_id)) {
      return res.status(400).json({ error: "Invalid or missing restaurant ID" });
    }

    // ✅ Fetch redemption requests linked to this restaurant
    const requests = await RedeemOffer.find({ restaurant_id: new mongoose.Types.ObjectId(restaurant_id) })
      .populate("offer_id")
      .populate({ path: "user_id", model: "users" })  // Match the correct model name // ✅ Fixed populate field name
      .populate("owner_id");

    res.json(requests);
  } catch (error) {
    console.error("Error in getRequestsForRestaurant:", error);
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
};

// ✅ Check if a pending request exists for the user & offer
exports.checkPendingRequest = async (req, res) => {
  try {
    const { user_id, offer_id } = req.query;

    const existingRequest = await RedeemOffer.findOne({
      user_id,
      offer_id,
      status: "Pending", // Ensure only "Pending" blocks a new request
    });

    res.status(200).json({ exists: !!existingRequest });
  } catch (error) {
    console.error("Error checking pending request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get redemption requests for a restaurant owner
exports.getRequestsForOwner = async (req, res) => {
  try {
    const { owner_id } = req.params;

    const requests = await RedeemOffer.find({ owner_id })
      .populate("user_id", "firstName lastName email")
      .populate("offer_id", "title description discount_value")
      .populate("restaurant_id", "name");

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching redemption requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update redemption request status (Approve/Reject)
exports.updateRedemptionStatus = async (req, res) => {
  try {
    const { request_id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await RedeemOffer.findById(request_id);
    if (!request) {
      return res.status(404).json({ message: "Redemption request not found" });
    }

    request.status = status;
    await request.save();

    res.status(200).json({ message: `Request ${status} successfully`, request });
  } catch (error) {
    console.error("Error updating redemption status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};