const foodTypeModel = require("../models/FoodTypeModel");

const addFoodType = async (req,res) =>{
  try{
    const savedFoodType = await foodTypeModel.create(req.body);
    res.status(201).json({ message: "Food Type added successfully", data: savedFoodType });
  }catch(err){
    res.status(500).json({ message: err.message });
  }
};

const getFoodTypes = async (req, res) => {
  try{
    const foodTypes = await foodTypeModel.find();
    res.json({ message: "Food Types fetched successfully", data: foodTypes });
  }catch(err){
    res.status(500).json({ message: err.message });
  }
}


module.exports = { addFoodType, getFoodTypes };