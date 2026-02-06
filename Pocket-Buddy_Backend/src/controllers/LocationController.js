// Add Restaurant Form Controller


const mongoose = require("mongoose");
const locationModel = require("../models/LocationModel");
const User = require("../models/UserModel"); // ✅ Import UserModel
const multer = require("multer");
const path = require("path");
const cloudinaryUtil = require("../utils/CloudanryUtil");

//storage engine
const storage = multer.diskStorage({
 // destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//multer object....

const upload = multer({
  storage: storage,
  //fileFilter:
}).single("image");

// All Restaurant Owners
const getAllRestaurantOwners = async (req, res) => {
  try {
    console.log("🔍 Fetching only users who own restaurants...");

    // Fetch only users who have at least one restaurant
    const ownersWithRestaurants = await locationModel.distinct("userId"); // ✅ Get unique user IDs from restaurants
    console.log("📌 Found Owners With Restaurants:", ownersWithRestaurants);

    const owners = await User.find({ _id: { $in: ownersWithRestaurants } }); // ✅ Fetch only those users
    //console.log("📌 Owners Fetched:", owners.length);

    //console.log("🔥 API Response:", res.data);

    if (!owners.length) {
      return res.status(404).json({ message: "No restaurant owners found" });
    }

    // Fetch each owner's restaurants
    const ownersWithRestaurantData = await Promise.all(
      owners.map(async (owner) => {
        const restaurants = await locationModel.find({ userId: owner._id });
        console.log(`📌 ${owner.firstName} has ${restaurants.length} restaurants`);
        return { ...owner.toObject(), restaurants };
      })
    );

    res.status(200).json({
      message: "Restaurant owners retrieved successfully",
      data: ownersWithRestaurantData,
    });
  } catch (error) {
    console.error("❌ Error fetching restaurant owners:", error);
    res.status(500).json({ message: "Failed to fetch restaurant owners." });
  }
};


const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await locationModel.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ data: restaurant });
  } catch (err) {
    res.status(500).json({ message: "Error fetching restaurant", err });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const deletedRestaurant = await locationModel.findByIdAndDelete(req.params.id);

    if (!deletedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      message: "Restaurant deleted successfully",
      data: deletedRestaurant,
    });
  } catch (err) {
    res.status(500).json({ message: "Error while deleting restaurant", err });
  }
};


const updateRestaurant = async (req, res) => {
  try {
    const updatedLocation = await locationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Restaurant updated successfully",
      data: updatedLocation,
    });
  } catch (err) {
    res.status(500).json({ message: "Error while updating restaurant", err: err });
  }
};

// const addLocationWithFile = async (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       res.status(500).json({
//         message: err.message,
//       });
//     } else {
//       // database data store
//       //cloundinary
//       console.log(req.body);
//       res.status(200).json({
//         message: "File uploaded successfully",
//         data: req.file,
//       });
//     }
//   });
// };


const addLocationWithFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }

    try {
      const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
      req.body.imageURL = cloudinaryResponse.secure_url;

      // Ensure the userId is saved correctly
      req.body.userId = new mongoose.Types.ObjectId(req.body.userId);

      const savedLocation = await locationModel.create(req.body);

      res.status(200).json({
        message: "Restaurant added successfully",
        data: savedLocation,
      });
    } catch (error) {
      console.error("Error adding restaurant:", error);
      res.status(500).json({ message: error.message });
    }
  });
};

const getLocationByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const locations = await locationModel.find({ userId: new mongoose.Types.ObjectId(userId) });

    if (!locations.length) {
      return res.status(404).json({ message: "No restaurants found" });
    }

    res.status(200).json({ success: true, data: locations });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addLocation = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    // Validate and convert to ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.body.cityId) ||
        !mongoose.Types.ObjectId.isValid(req.body.areaId) ||
        !mongoose.Types.ObjectId.isValid(req.body.foodTypeId)) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }

    req.body.cityId = new mongoose.Types.ObjectId(req.body.cityId);
    req.body.areaId = new mongoose.Types.ObjectId(req.body.areaId);
    req.body.foodTypeId = new mongoose.Types.ObjectId(req.body.foodTypeId);

    const savedLocation = await locationModel.create(req.body);

    res.status(201).json({
      message: "Restaurant(Location) added successfully",
      data: savedLocation,
    });
  } catch (err) {
    console.error("Error adding location:", err.message);
    res.status(500).json({ message: err.message });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await locationModel.find().populate("cityId areaId foodTypeId");

    if (!locations.length) {
      return res.status(404).json({ message: "No locations found" });
    }

    res.status(200).json({
      message: "Locations retrieved successfully",
      data: locations,
    });
  } catch (err) {
    console.error("Error fetching locations:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addLocation, getAllLocations, addLocationWithFile, getLocationByUserId, updateRestaurant, getRestaurantById, deleteRestaurant,getAllRestaurantOwners  };
