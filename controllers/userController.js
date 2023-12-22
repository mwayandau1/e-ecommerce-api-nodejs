const { StatusCodes } = require('http-status-codes')
const User = require('../models/UserModel')
const { BadRequestError, NotFoundError } = require('../errors')

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
    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async(req, res)=>{
    const currentUser = await User.findOne({_id:req.params.id}).select('-password')
    res.status(StatusCodes.OK).json({currentUser})
}

const updateUser = async(req, res)=>{
    const {name, email, password, role}= req.body
    if(!name || !email){
        throw new BadRequestError("Please provide all values")
    }
    const user = await User.findOne({email})
    user.name = name;
    user.role = 'user'
    user.email = email;
    user.password = password;
    await user.save()

    res.status(StatusCodes.OK).json({email, role})
}

const updateUserPassword = async(req, res)=>{

}
module.exports = {getAllUsers, getSingleUser,
    showCurrentUser, updateUser, updateUserPassword}