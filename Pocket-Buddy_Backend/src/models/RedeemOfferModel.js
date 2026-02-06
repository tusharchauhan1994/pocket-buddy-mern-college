const mongoose = require("mongoose");

const RedeemOfferSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"], // ✅ Ensure "Pending" is a valid value
    default: "Pending",
  },
  redeemTime: { type: Date }, 
}, { timestamps: true });

module.exports = mongoose.model("RedeemOffer", RedeemOfferSchema);
