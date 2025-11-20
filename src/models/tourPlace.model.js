const mongoose =require ("mongoose");

const tourPlacesSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:String,
    images:[String],
    division:{type:mongoose.Schema.Types.ObjectId , ref:'Division' , required:true },
    district:{type:mongoose.Schema.Types.ObjectId , ref:'District' , required:true },
    location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  createdAt:{
    type:Date,
    default:Date.now
  }

});

tourPlacesSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.TourPlace || mongoose.model('TourPlace', tourPlacesSchema);