const mongoose =require ("mongoose");

const districtSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    division:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Division",
        required:true
    },
    slug:String
})

module.exports = mongoose.models.District || mongoose.model('District', districtSchema)