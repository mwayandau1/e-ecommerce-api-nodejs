const {StatusCodes} = require('http-status-codes')
const User = require('../models/UserModel')
const {BadRequestError} = require('../errors')
const register = async(req, res)=>{
    console.log(req.body)

    const {name, password, email} = req.body;
    if(!name || !password || !email){
        throw new BadRequestError("Please fill all values")
    }
    const user = await User.create({...req.body})

    res.status(StatusCodes.OK).json({user})
}
const login = async(req, res)=>{
    res.send("Login")
}
const logout = async(req, res)=>{
    res.send("logout")
}


module.exports = {register, login, logout}