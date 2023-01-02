import { createError } from "../helpers/error.js";
import Pin from "../models/Pin.js";
import User from "../models/User.js";


export const getPin = async (req, res, next) => {
        try{
            const pin = await Pin.findById(req.params.id);
            res.status(200).json(pin);
        }
        catch(err){
            next(err)
        }
}

export const random = async (req, res, next) => {
        try{
            const pins = await Pin.aggregate([{$sample:{size: 40}}])
            res.status(200).json(pins);
        }
        catch(err){
            next(err)
        }
}

export const getByTag = async (req, res, next) => {
        const tags = req.query.tags.split(",");
        try {
            const pins = await Pin.find({ tags: { $in: tags } }).limit(20);
            res.status(200).json(pins);
        } 
        catch (err) {
            next(err);
        }
}

export const search = async (req, res, next) => {
        const query = req.query.q
        try{
            const pins = await Pin.find({title: {$regex: query, $options:'i'}}).limit(40);
            res.status(200).json(pins)
        }
        catch(err){
            next(err)
        }
}

export const trend = async (req, res, next) => {
        try {
            const pins = await Pin.find().sort({ views: -1 });
            res.status(200).json(pins);
        } 
        catch (err) {
            next(err);
        }
}

export const addView = async (req, res, next) => {
        try{
            await Pin.findByIdAndUpdate(req.params.id,{
                $inc:{views: 1}
            });
            res.status(200).json('The view has been increasted!');
        }
        catch(err){
            next(err)
        }
}

// ===== REQUIES USER ===== 

export const addPin = async (req, res, next) => {
        const newPin = new Pin({ userId: req.user.id, ...req.body });
         try {
                 const savedPin = await newPin.save();
                 res.status(200).json(savedPin);
         } catch (err) {
                 next(err);
         }
}
 
export const deletePin = async (req, res, next) => {
    try {
        const pin = await Pin.findById(req.params.id);
        if (!pin) return next(createError(404, 'Pin not found!'));

        if (req.user.id === pin.userId){
            await Pin.findByIdAndDelete(req.params.id,{
                $set:req.body});
            res.status(200).json('The pin has been deleted!')
        }
        else{
            return next(createError(403, 'You can delete only your video!'));
        }    
    } 
    catch (err) {
        next(err)
    }
}

export const updatePin = async (req, res, next) => {
    try{
        const pin = await Pin.findById(req.params.id);

        if (!pin) return next(createError(404, 'Pin not found!'));

        if (req.user.id === pin.userId){
            const updatedPin = await Pin.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{
                new:true
            });
            res.status(200).json(updatedPin)
        } 
        else {
            return next(createError(403, 'You can update only your Pin!'));
        }
    }
    catch(err){
        next(err)
    }
}

export const profile = async (req, res, next) => {
    try {
        const id = req.params.id;
        const pins = await Pin.find({userId: id});
        res.status(200).json(pins.flat().sort((a, b) => b.createdAt - a.createdAt));

    } catch (err) {
        next(err);
    }
}

export const liked = async (req, res, next) => {
    try {
        const id = req.params.id;
        const pins = await Pin.find({likes: {$in: id}});
        res.status(200).json(pins.flat().sort((a, b) => b.createdAt - a.createdAt));

    } catch (err) {
        next(err);
    }
}

export const follow = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const followedUsers = user.followedUsers;
    
        const list = await Promise.all(
            followedUsers.map(async (profileId) => {
            return await Pin.find({ userId: profileId });
        })
        );
    
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
        next(err);
    }
}