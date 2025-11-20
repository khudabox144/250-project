const mongoose =require ("mongoose");

const tourRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["tourPlace", "package"], required: true },
  name: String,
  description: String,
  images: [String],
  division: { type: mongoose.Schema.Types.ObjectId, ref: "Division" },
  district: { type: mongoose.Schema.Types.ObjectId, ref: "District" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }
  },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

tourRequestSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.TourRequest || mongoose.model("TourRequest", tourRequestSchema);
