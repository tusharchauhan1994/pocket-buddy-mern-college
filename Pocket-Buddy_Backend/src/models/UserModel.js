const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },  // ✅ Ensure first name is saved
  lastName: { type: String, required: true },   // ✅ Ensure last name is saved
  name: { type: String },  // ✅ Auto-filled full name
  age: { type: Number },
  status: { type: Boolean, default: true },
  roleId: { type: Schema.Types.ObjectId, ref: "roles" },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Auto-generate "name" from first and last name before saving
userSchema.pre("save", function (next) {
  this.name = `${this.firstName} ${this.lastName}`.trim();
  next();
});

module.exports = mongoose.model("users", userSchema);
  