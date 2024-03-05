const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        require:[true, "Please provide product name"],
        maxlength:[100, "Please product name can not more than 100 characters"]
    },
    price:{
        type:Number,
        require:[true, "Please provide the product price"],
        default:0
    },
    description:{
        type:String,
        required:[true, "Please provide the product description"],
        maxlength:[1000, "Please description can not more than 1000 characters"]
    },
    image:{
        type:String,
        default:"/uploads/example.jpeg"
    },
    category:{
        type:String,
        required:[true, "Please provide category"],
        enum:["office", "kitchen", "bedroom"]
    },
    company:{
        type:String,
        required:[true, "Please provide company"],
        enum:{
            values:["ikea", "liddy", "marcos"],
            message:"{VALUE} not supported"
        }
    },
    colors:{
        type:[String],
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
    freeShipping:{
    type:Boolean,
    default:false
},
inventory:{
    type:Number,
    required:true,
    default:12
},
averageRating:{
    type:Number,
    default:0
},
numOfReviews:{
    type:Number,
    default:0
},
user:{
    type:mongoose.Types.ObjectId,
    ref:"User ",
    required:true
},

}, {timestamps:true, toJSON:{virtuals:true}, toObject:{virtuals:true}})

ProductSchema.virtual('reviews',{
    ref:"Review",
    localField:"_id",
    foreignField:"product",
    justOne:false
})
ProductSchema.pre('remove',async function(next){
    await this.model("Review").deleteMany({product:this._id})
    next
})
module.exports = mongoose.model("Product", ProductSchema)