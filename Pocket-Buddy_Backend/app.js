
require("dotenv").config();


// for offer redeem
require("./src/models/UserModel"); // ✅ Ensure User model is loaded
require("./src/models/OfferModel"); // ✅ Ensure Offer model is loaded
require("./src/models/RedeemOfferModel"); // ✅ Ensure RedeemOffer model is loaded

// Import required modules
const express = require("express"); // Express framework for building APIs
const mongoose = require("mongoose"); // Mongoose for MongoDB connection and schema management
const cors = require("cors"); // CORS middleware to allow cross-origin requests

// Create an Express application
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests


const bodyParser = require("body-parser");
app.use(bodyParser.json()); // ✅ This ensures JSON is parsed
app.use(bodyParser.urlencoded({ extended: true })); // ✅ Handle URL-encoded data


// offer routes
const offerRoutes = require("./src/routes/OfferRoutes");
app.use("/offer", offerRoutes); // Mount offer-related routes

// Redeem Offer Routes
const RedeemOfferRoutes = require('./src/routes/RedeemOfferRoutes');
app.use('/redeem', RedeemOfferRoutes);


// role routes
const roleRoutes = require("./src/routes/RoleRoutes");
app.use(roleRoutes); // Mount role-related routes

// user routes
const userRoutes = require("./src/routes/UserRoutes");
app.use("/user",userRoutes); // Mount user-related routes

// state routes
const stateRoutes = require("./src/routes/StateRoutes");
app.use("/state",stateRoutes);

// city routes
const cityRoutes = require("./src/routes/CityRoutes");
app.use("/city",cityRoutes); //http://localhost:3000/city/addCity

// area routes
const areaRoutes = require("./src/routes/AreaRoutes");
app.use("/area",areaRoutes) //http://localhost:3000/area/add

// foodType routes
const foodTypeRoutes = require("./src/routes/FoodTypeRoutes");
app.use("/foodType",foodTypeRoutes);



// location routes
const locationRoutes = require("./src/routes/LocationRoutes");
app.use("/location",locationRoutes); //http://localhost:3000/location/add

const Location = require("./src/models/LocationModel"); 
console.log("📌 Checking Location Model:", Location);


const adminRoutes = require("./src/routes/AdminRoutes"); // ✅ Add admin routes
app.use("/admin", adminRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: err.message });
});
//Payment
const paymentRoutes = require("./src/routes/PaymentRoutes")
app.use("/payment", paymentRoutes)

//subscription details
const subscriptionRoutes = require("./src/routes/SubscriptionRoutes");
app.use("/subscription", subscriptionRoutes);


// Connect to MongoDB database
mongoose
  .connect("mongodb://127.0.0.1:27017/PB_Database")
  .then(() => {
    console.log("Database connected successfully...")
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Define the server port
const PORT = 3000;

// Start the Express server
app.listen(PORT, () => {
  console.log("Server started on port number", PORT);
});
