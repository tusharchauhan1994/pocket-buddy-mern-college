const routes = require("express").Router();
const userController = require("../controllers/UserController");

// User routes
routes.post("/", userController.signup); // Register a new user
routes.get("/all", userController.getAllUsers); // Get all users
routes.get("/user/:id", userController.getUserById); // Get user by ID
routes.delete("/delete/:id", userController.deleteUserById); // Delete user by ID
routes.post("/login", userController.loginUser); // User login
routes.put("/update-status/:id", userController.updateUserStatus);
routes.post("/forgot-password",userController.forgotPassword);
routes.post("/reset-password", userController.resetpassword);


module.exports = routes;
