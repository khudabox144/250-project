const mongoose =require ("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetType: { type: String, enum: ["tourPlace", "package", "vendor"], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);
