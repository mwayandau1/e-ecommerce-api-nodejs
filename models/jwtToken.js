const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tokenSchema = new Schema({
    token: String,
    expiresIn: Date,
    isValid: {
        type:Boolean,
        default: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model("Token", tokenSchema)