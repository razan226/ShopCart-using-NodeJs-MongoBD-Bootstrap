const mongoose = require('mongoose');
const bcrtpy = require('bcrypt');

const userSchema = mongoose.Schema({
    email : {
        type : String ,
        require :true
    },

    password : {
        type : String ,
        require :true
    }
});

const bcrypt = require('bcrypt');

userSchema.methods.hashPassword = function (password) {
  const salt = bcrypt.genSaltSync(10); // You can adjust the number of rounds as needed
  return bcrypt.hashSync(password, salt);
}

userSchema.methods.comparePassword = function(password){

    return bcrtpy.compareSync(password, this.password);
    // this.password the one that the usr entered and the password is the saved one
}


module.exports = mongoose.model('User' , userSchema);