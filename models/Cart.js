const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    _id : {

        required : true ,
        type : String
    },


    totalQuantity :{
        required : true ,
        type : Number ,
    },


    totalPrice : {
        required : true ,
        type :Number ,
    },

    selectProduct:{
        required : true ,
        type : Array 
    }
})

module.exports = mongoose.model('Cart' , cartSchema);