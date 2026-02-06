const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodTypeSchema = new Schema ({
  foodTypeName:{
    type: String,
    require: true
  }
});


module.exports = mongoose.model('FoodType',foodTypeSchema);