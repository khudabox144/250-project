const mongoose =require ("mongoose");


const divisionSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug:String,
})

module.exports = mongoose.models.Division || mongoose.model('Division', divisionSchema)