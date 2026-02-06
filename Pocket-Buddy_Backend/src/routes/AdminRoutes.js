const express = require("express");
const { getAllRestaurantOwners } = require("../controllers/LocationController");
const router = express.Router();

router.get("/restaurants", getAllRestaurantOwners); // ✅ API to fetch restaurant owners + locations

module.exports = router;
