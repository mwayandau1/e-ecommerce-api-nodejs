const { StatusCodes } = require('http-status-codes')
const User = require('../models/UserModel')
const obtainTokenUser = require('../utils/tokenUser')
const checkPermissions = require('../utils/checkPermissions')

const { BadRequestError, NotFoundError, UnauthorizedError, UnauthenticatedError } = require('../errors')
const { attachCookiesToResponse } = require('../utils/jwt')

const getAllUsers = async(req, res)=>{
    const users = await User.find({role:"user"}).select('-password')
    res.status(StatusCodes.OK).json({users})
}

const getSingleUser = async(req, res)=>{
    const {id} = req.params
    const user = await User.findById({_id:id}).select('-password')
    if(!user){
        throw new NotFoundError(`Not user matches the requested ID-${id}`)
    }
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async(req, res)=>{
    res.status(StatusCodes.OK).json({user:req.user})
}

//UPDATE USER USING FINDONEANDUPDATE
// const updateUserFind = async(req, res)=>{
//     const {email, name} = req.body;
//     if(!email || !name){
//         throw new BadRequestError("Please provide all values")
//     }
//     const user = await User.findOneAndUpdate({_id:req.user.id},
//          {name, email}, {new:true, runValidators:true})
//     if(!user){
//         throw UnauthenticatedError("User not found ")
//     }
//     const tokenUser = obtainTokenUser(user)
//     attachCookiesToResponse({res, user:tokenUser})
//     res.status(StatusCodes.OK).json({user:tokenUser})
// }

const updateUser = async(req, res)=>{
    const {name, email}= req.body
    if(!name || !email){
        throw new BadRequestError("Please provide all values")
    }
    const user = await User.findOne({_id:req.user.id})
    user.name = name;
    user.email = email;
    await user.save()
    res.status(StatusCodes.OK).json({user})
}

const updateUserPassword = async(req, res)=>{
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new BadRequestError("Please provide both old and new passwords")
    }
    const user = await User.findOne({_id:req.user.id})
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if(!isPasswordCorrect){
        throw new UnauthorizedError("Password incorrect")
    }
    user.password = newPassword
    await user.save();
    res.status(StatusCodes.OK).json({msg:"Success! Password updated"})
}
module.exports = {getAllUsers, getSingleUser,
    showCurrentUser, updateUser,
     updateUserPassword}