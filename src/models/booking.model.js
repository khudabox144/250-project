const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a user"],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: [true, "Booking must belong to a package"],
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Booking must belong to a vendor"],
    }, 
    bookingDate: {
      type: Date,
      required: [true, "Booking must have a date"],
    },
    participants: {
      type: Number,
      required: [true, "Booking must have a number of participants"],
      min: [1, "Booking must have at least 1 participant"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Booking must have a price"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    contactPhone: {
        type: String,
    },
    specialRequests: {
        type: String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
