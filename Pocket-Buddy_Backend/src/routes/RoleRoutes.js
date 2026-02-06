const routes = require("express").Router();
const roleController = require("../controllers/RoleController");

// Role routes
routes.get("/roles", roleController.getAllRoles); // Get all roles
routes.post("/role", roleController.addRole); // Add a new role
routes.delete("/role/:id", roleController.deleteRole); // Delete role by ID
routes.get("/role/:id", roleController.getRoleById); // Get role by ID

module.exports = routes;
