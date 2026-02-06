const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planName: String,
  amount: Number,
  duration: String,
  paymentId: String,
  orderId: String,
  startDate: { type: Date, default: Date.now },
  endDate: { 
    type: Date,
    default: function() {
      const duration = this.duration.includes('year') ? 365 : 
                     this.duration.includes('month') ? 30 : 180;
      return new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    }
  },
  status: { type: String, default: "active" },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);