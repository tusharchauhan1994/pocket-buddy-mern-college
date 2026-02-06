const express = require("express");
const router = express.Router();
const offerController = require("../controllers/OfferController");

// Get All Offers (Corrected)
router.get("/", offerController.getAllOffers); 

// Add Offer
router.post("/add", offerController.addOffer); 

// Get Offer by ID
router.get("/:id", offerController.getOfferById); 

// Get Offers by Restaurant
router.get("/by-restaurant/:restaurantId", offerController.getOffersByRestaurant); 

// Redeem Offer Request
router.post("/redeem", offerController.redeemOffer); 

// Approve/Reject Offer
router.post("/redeem/update-status", offerController.updateRedeemStatus); 

// Get User Redeemed Offers
router.get("/redeem/user/:user_id", offerController.getUserRedeems); 

// Use Offer
router.post("/redeem/use", offerController.useOffer); 

// Delete Offer
router.delete("/delete/:id", offerController.deleteOffer);

// Update Offer
router.put("/update/:id", offerController.updateOffer);

module.exports = router;
