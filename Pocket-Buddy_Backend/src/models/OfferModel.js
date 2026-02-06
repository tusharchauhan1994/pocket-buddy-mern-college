const mongoose = require("mongoose");
const Restaurant = require("./LocationModel"); // Ensure the model is registered

const OfferSchema = new mongoose.Schema({
    title: String,
    description: String,
    offer_type: String,
    discount_value: Number,
    restaurant_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Location" }],
    valid_from: Date,
    valid_to: Date,
    requires_approval: Boolean,
    min_order_value: Number,
    max_redemptions: Number,
    imageURL: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    payment_required: { type: Boolean, default: false },
});

// Add this simple date checker
OfferSchema.pre('save', function(next) {
    const now = new Date();
    if (this.valid_to < now) {
        this.status = "Inactive";
    }
    next();
});


module.exports = mongoose.model("Offer", OfferSchema);
