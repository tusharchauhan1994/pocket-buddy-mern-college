const express = require("express");
const router = express.Router();
const { saveSubscription, getAllSubscribers, getSubscriptionByUser, getUserSubscription, deleteSubscriptionById } = require("../controllers/SubscriptionController");

router.post("/save", saveSubscription);
router.get("/all", getAllSubscribers);
router.get('/user/:userId', getSubscriptionByUser);
router.delete("/:id", deleteSubscriptionById);


module.exports = router;