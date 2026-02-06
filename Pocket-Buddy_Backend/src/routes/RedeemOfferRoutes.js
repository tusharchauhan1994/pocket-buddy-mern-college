const express = require('express');
const router = express.Router();
//const User = require("../models/UserModel");
const RedeemOfferController = require('../controllers/RedeemOfferController');

// ✅ Create a redemption request
router.post("/", RedeemOfferController.createRedemption);

// ✅ Check if a user has a pending request
router.get("/check", RedeemOfferController.checkPendingRequest);

// ✅ Get redemption requests for an owner (instead of a restaurant)
router.get("/owner/redeem-requests", RedeemOfferController.getRequestsForRestaurant);

// ✅ Get pending redemption requests for a specific owner
router.get("/owner/:ownerId", RedeemOfferController.getOwnerRedemptions);

// ✅ Update redemption status (Approve/Reject)
router.put("/:id", RedeemOfferController.updateRedemptionStatus);

// ✅ Get redemption requests of a user
router.get("/user/:userId", RedeemOfferController.getUserRedemptions);

// ✅ Get redemption request by ID
router.get("/:id", RedeemOfferController.getRedemptionRequestById);

// 📌 Route to get redemption requests for a restaurant owner
router.get("/owner/:owner_id", RedeemOfferController.getRequestsForOwner);

// 📌 Route to update the status of a redemption request
router.put("/update-status/:request_id", RedeemOfferController.updateRedemptionStatus);


module.exports = router;
