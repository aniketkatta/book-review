const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minLength: [2, "First Name must be atleast 2 characters long"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [2, "Last Name must be atleast 2 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: [8, "Email must be atleast 8 characters long"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  }
});


userSchema.methods.generateAuthToken=function(){
    if(!process.env.JWT_SECRET){
      throw new Error('JWT_SECRET is not defined in environment variables')
    }
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}

userSchema.methods.comparePassword=async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.statics.hashPassword=async function(password){
  return await bcrypt.hash(password,10);
}

const userModel=mongoose.model('User',userSchema);
module.exports=userModel;