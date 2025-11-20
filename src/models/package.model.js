const mongoose =require ("mongoose");

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  images: [String],
  price: { type: Number, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  division: { type: mongoose.Schema.Types.ObjectId, ref: "Division" },
  district: { type: mongoose.Schema.Types.ObjectId, ref: "District" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

packageSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.Package || mongoose.model("Package", packageSchema);