const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    timings: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    stateId: { type: Schema.Types.ObjectId, ref:"State" },
    cityId: { type: Schema.Types.ObjectId, ref: "City", required: true },
    areaId: { type: Schema.Types.ObjectId, ref: "Area", required: true },
    foodTypeId: { type: Schema.Types.ObjectId, ref: "FoodType", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    imageURL:{type: String,required: true},
    userId:{type: Schema.Types.ObjectId, ref:"users"}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
