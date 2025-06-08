const userModel=require('../models/userModel');
const {validationResult}=require('express-validator')
const userService=require('../services/userService');

module.exports.registerUser=async (req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {fullName,email,password}=req.body;

    const isUserAlreadyExist=await userModel.findOne({email});
    if(isUserAlreadyExist){
        return res.status(400).json({message:'User Already Exist'})
    }

    const hashPassword=await userModel.hashPassword(password);
    const user=await userService.createUser({
        firstName:fullName.firstName,
        lastName:fullName.lastName,
        email,
        password:hashPassword
    });

    const token=user.generateAuthToken();
    res.status(201).json({token,user});
}

module.exports.loginUser=async (req,res,next)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {email,password}=req.body;

    const user=await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({message:'Invalid Email or Password'})
    }

    const isMatch=await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({message:'Invalid Email or Password'})
    }

    const token=await user.generateAuthToken();
    res.cookie('token',token,{httpOnly:true});
    res.status(200).json({token,user})
}