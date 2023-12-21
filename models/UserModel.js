const mongoose = require('mongoose')
const validator = require('validator')
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your first name"],
        maxlength:100
    },

    email:{
        type:String,
        required:[true, "Please enter your email address"],
        maxlength:100,
        validate:{
            validator:validator.isEmail,
            message:"Please provide a valid email address"
        }
    },

    password:{
        type:String,
        required:[true, "Please enter your password"],
        minlength:6
    },
    roles:{
        type:String,
        enum:['admin', 'user'],
        default:'user'
    }
})

module.exports = mongoose.model('User', UserSchema)