const express = require("express");
const router = express.Router();
const locationController = require("../controllers/LocationController");

router.post("/add", locationController.addLocation);
router.get("/all", locationController.getAllLocations);
router.post('/addWithFile', locationController.addLocationWithFile);
router.get('/getLocationByUserId/:userId', locationController.getLocationByUserId);
router.get("/getRestaurant/:id", locationController.getRestaurantById);
router.put("/updateRestaurant/:id", locationController.updateRestaurant);
router.delete("/deleteRestaurant/:id", locationController.deleteRestaurant);

module.exports = router;
