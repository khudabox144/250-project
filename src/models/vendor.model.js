const mongoose =require ("mongoose");

const VendorSchema=new mongoose.Schema({
    name:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    description:String,
    image:String,
    rating:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);