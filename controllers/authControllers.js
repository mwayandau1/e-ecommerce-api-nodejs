const {StatusCodes} = require('http-status-codes')
const User = require('../models/UserModel')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const {createToken, attachCookiesToResponse} = require('../utils/jwt')
const register = async(req, res)=>{

    const {name, password, email} = req.body;
    if(!name || !password || !email){
        throw new BadRequestError("Please fill all values")
    }
    const userAlreadyExist = await User.findOne({email})
    if(userAlreadyExist){
        throw new BadRequestError("User with email already exist.")
    }
    const isFirstUser = (await User.countDocuments({}))==0
    const role = isFirstUser ? "admin" :"user"
    const user = await User.create({name, email, password, role})
    const tokenUser = {name:user.name, id:user._id, role:user.role}
    attachCookiesToResponse({res, user:tokenUser})
    res.status(StatusCodes.CREATED).json({user})
}
const login = async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError("Please provide all values")
    }
    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError("User with email does not exist")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid credentials")
    }
    const tokenUser = {name:user.name, id:user._id, role:user.role}
    attachCookiesToResponse({res, user:tokenUser })
    res.status(StatusCodes.OK).json({user})
}


const logout = async(req, res)=>{
    res.cookie('token', 'logout', {
        httpOnly:true,
        expires: new Date(Date.now() + 5 * 1000)
    })
    res.send("logout")
}


module.exports = {register, login, logout}