const routes = require('express').Router();
const foodTypeController = require('../controllers/FoodTypeController');

routes.post('/add', foodTypeController.addFoodType);
routes.get('/getAllFoodType', foodTypeController.getFoodTypes);

module.exports = routes;