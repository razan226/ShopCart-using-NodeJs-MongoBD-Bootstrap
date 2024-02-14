const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

imagePath :{
    type : String ,
    requires : true ,
},

productName :{
    type :String ,
    required : true ,
},

information :{
    require : true ,
    type : {
        storageCapacity: Number ,
        numberOfSIM : String ,
        cameraResolution : Number ,
        displaySize : Number
    }
},

price :{
    type : Number,
    required: true ,
}



})

module.exports = mongoose.model('Product' , productSchema);