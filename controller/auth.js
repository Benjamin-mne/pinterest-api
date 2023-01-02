import User from "../models/User.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createError } from "../helpers/error.js";

export const signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });
    
        await newUser.save();
        res.status(200).send("User has been created!");
      } catch (err) {
        next(err);
      }
};

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, "User not found!"));
    
        const isCorrect = bcrypt.compare(req.body.password, user.password);
    
        if (!isCorrect) return next(createError(400, "Wrong Credentials!"));
    
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...userData } = user._doc;
    
        res
          .status(200)
          .json({userData, token});
        
      } catch (err) {
        next(err);
      }
};

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({email:req.body.email});
        
        if(user){
          const token = jwt.sign({ id: user._id }, process.env.JWT);
          res
          .status(200)
          .json({...user._doc, token: token})
          ;
        }

        else{
          const newUser = new User({
            ...req.body,
            fromGoogle: true
          })
          const savedUser = await newUser.save();
          const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
          res
          .status(200)
          .json({savedUser: savedUser._doc, token: token})
        }
      } catch (error) {
        next(error);
      }
}