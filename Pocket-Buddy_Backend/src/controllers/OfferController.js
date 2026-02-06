const mongoose = require("mongoose");

const LocationModel = require("../models/LocationModel"); // ✅ Import the location model
const Offer = require("../models/OfferModel");
const RedeemOffer = require("../models/RedeemOfferModel");
const cloudinaryUtil = require("../utils/CloudanryUtil");
const multer = require("multer");


// Multer Setup
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }).single("image");

// 📌 Add Offer (With Image Upload)
const addOffer = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "File upload error", error: err.message });
    }

    try {
      console.log("Received offer data:", req.body);

      // ✅ Upload image to Cloudinary (Only if file exists)
      if (req.file) {
        const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
        req.body.imageURL = cloudinaryResponse.secure_url;
      } else {
        return res.status(400).json({ success: false, message: "Image file is required" });
      }

      // ✅ Ensure `restaurant_ids` is an array
      if (typeof req.body.restaurant_ids === "string") {
        req.body.restaurant_ids = req.body.restaurant_ids.split(","); // Convert CSV string to array
      }

      if (!Array.isArray(req.body.restaurant_ids) || req.body.restaurant_ids.length === 0) {
        return res.status(400).json({ success: false, message: "At least one restaurant must be selected" });
      }

      // ✅ Convert `restaurant_ids` to ObjectId
      req.body.restaurant_ids = req.body.restaurant_ids.map(id => new mongoose.Types.ObjectId(id));

      console.log("Final restaurant_ids:", req.body.restaurant_ids);

      // ✅ Create the offer in the database
      const newOffer = await Offer.create(req.body);
      console.log("Offer Successfully Added:", newOffer);

      return res.status(201).json({ success: true, message: "Offer added successfully!", offer: newOffer });

    } catch (error) {
      console.error("Error Adding Offer:", error);
      return res.status(500).json({ success: false, message: "Failed to add offer", error: error.message });
    }
  });
};

// 📌 Get Offer by ID
const getOfferById = async (req, res) => {
  try {
    console.log("🔍 Request received for Offer ID:", req.params.id);
    
    // ✅ Populate `restaurant_ids` correctly
    const offer = await Offer.findById(req.params.id).populate({
      path: "restaurant_ids",
      populate: { path: "cityId areaId stateId" }, // ✅ Ensure city, area, and state are included
    });

    if (!offer) {
      console.log("❌ Offer not found in database");
      return res.status(404).json({ message: "Offer not found" });
    }

    console.log("✅ Offer found:", offer);

    // ✅ Now, `restaurants` will have full data
    res.status(200).json({ data: offer });
  } catch (err) {
    console.error("❌ Error in getOfferById:", err.message);
    res.status(500).json({ message: "Error fetching offer", error: err.message });
  }
};


const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOffer = await Offer.findByIdAndDelete(id);

    if (!deletedOffer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    res.status(200).json({ success: true, message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ success: false, message: "Error deleting offer" });
  }
};

const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOffer = await Offer.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedOffer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    res.status(200).json({ success: true, message: "Offer updated successfully", offer: updatedOffer });
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ success: false, message: "Error updating offer" });
  }
};

// 📌 Get All Offers
const getAllOffers = async (req, res) => {
  try {
    const now = new Date();
    
    // Automatically update expired offers
    await Offer.updateMany(
      { valid_to: { $lt: now }, status: "Active" },
      { $set: { status: "Inactive" } }
    );

    // Return all offers (frontend will filter them)
    const offers = await Offer.find().populate("restaurant_ids", "name");
    
    res.status(200).json({ success: true, offers });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// 📌 Get Offers by Restaurant ID
const getOffersByRestaurant = async (req, res) => {
  try {
    const offers = await Offer.find({ restaurant_ids: req.params.restaurantId });
    res.status(200).json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 📌 Redeem Offer Request
const redeemOffer = async (req, res) => {
  try {
    const redeemRequest = await RedeemOffer.create(req.body);
    res.status(201).json({ success: true, message: "Offer redemption request sent!", redeemRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error requesting redemption", error: error.message });
  }
};

// 📌 Approve/Reject Offer Request
const updateRedeemStatus = async (req, res) => {
  try {
    const updatedRedeem = await RedeemOffer.findByIdAndUpdate(req.body.redeem_id, { status: req.body.status }, { new: true });

    if (!updatedRedeem) {
      return res.status(404).json({ success: false, message: "Redeem request not found" });
    }

    res.status(200).json({ success: true, message: `Offer ${req.body.status.toLowerCase()} successfully!`, updatedRedeem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating redeem request", error: error.message });
  }
};

// 📌 Get Redeemed Offers by User ID
const getUserRedeems = async (req, res) => {
  try {
    const userRedeems = await RedeemOffer.find({ user_id: req.params.user_id }).populate("offer_id");
    res.status(200).json({ success: true, userRedeems });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// 📌 Mark Offer as Used
const useOffer = async (req, res) => {
  try {
    const redeemRequest = await RedeemOffer.findById(req.body.redeem_id);
    if (!redeemRequest) {
      return res.status(404).json({ success: false, message: "Redeem request not found" });
    }

    if (redeemRequest.status === "Used") {
      return res.status(400).json({ success: false, message: "Offer has already been used!" });
    }

    redeemRequest.status = "Used";
    await redeemRequest.save();

    res.status(200).json({ success: true, message: "Offer marked as used!", updatedRedeem: redeemRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { addOffer, getAllOffers, getOffersByRestaurant, redeemOffer, updateRedeemStatus, getUserRedeems, useOffer,deleteOffer,updateOffer,getOfferById };
