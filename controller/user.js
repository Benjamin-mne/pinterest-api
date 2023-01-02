import User from '../models/User.js'
import Pin from "../models/Pin.js";
import { createError } from '../helpers/error.js';


export const getUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    }catch(err){
        next(err)
    }
}

export const update = async (req, res, next) =>{
    if (req.params.id === req.user.id) {
        try {
          const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedUser);
        } catch (err) {
          next(err);
        }
      } else {
        return next(createError(403, "You can update only your account!"));
      }
}

export const deleteUser = async (req, res, next) =>{
    if (req.params.id === req.user.id) {
        try {
          await User.findByIdAndDelete(
            req.params.id
          );
          res.status(200).json('User has been deleted!');
        } catch (err) {
          next(err);
        }
      } else {
        return next(createError(403, "You can delete only your account!"));
      }
}

export const follow = async (req, res, next) =>{
    try {
        await User.findByIdAndUpdate(req.user.id, {
          $push: { followedUsers: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
          $inc: { followers: 1 },
        });
        res.status(200).json("Follow successfull!")
      } catch (err) {
        next(err);
      }
}

export const unfollow = async (req, res, next) =>{
    try {
        await User.findByIdAndUpdate(req.user.id, { $pull: { followedUsers: req.params.id }});
        await User.findByIdAndUpdate(req.params.id, { $inc: { followers: -1 }});
    
        res.status(200).json("Unfollow successfull!")
      } catch (err) {
        next(err);}
}

export const like = async (req, res, next) =>{
    const id = req.user.id;
    const pinId = req.params.pinId;
    try {
        await Pin.findByIdAndUpdate(pinId,{
        $addToSet:{likes:id},
        $pull:{dislikes:id}
        })
        res.status(200).json("The Pin has been liked!");
    }catch(err){
        return next(err)
    }
}

export const dislike = async (req, res, next) =>{
    const id = req.user.id;   
    const pinId = req.params.pinId;
    try{
        await Pin.findByIdAndUpdate(pinId,{
        $pull:{likes:id}
        });
        res.status(200).json('The Pin has been disliked!')
    }catch(err){
        return next(err)
    }
}



